package com.dacn.backend.service;

import com.dacn.backend.dto.BusinessProfileDTO;
import com.dacn.backend.dto.BusinessUpdateProfileDTO;
import com.dacn.backend.dto.CPORegisterDTO;
import com.dacn.backend.model.CPO;
import com.dacn.backend.model.EVUser;
import com.dacn.backend.repository.CPORepo;
import com.dacn.backend.repository.EVUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

@Service
public class BusinessAccountService {
    @Autowired
    private EVUserRepo eVUserRepo;
    @Autowired
    private CPORepo cpoRepo;
    @Autowired
    private S3Client s3Client;
    @Value("${aws.bucket.name}")
    private String bucketName;

    public void saveBusinessAccount(CPORegisterDTO user) {
        EVUser newUser = new EVUser();
        newUser.setEmail(user.getEmail());
        newUser.setFullName(user.getFullName());
        newUser.setRole("BUSINESS");

        newUser.setUsername(user.getUsername());
        newUser.setPassword(user.getPassword());
        newUser.setAddress(user.getAddress());

        EVUser savedUser = eVUserRepo.save(newUser);

        if (cpoRepo.existsById(user.getCompanyId())) {
            throw new IllegalArgumentException("The company id has already existed");
        }
        CPO newCPO = new CPO();
        newCPO.setEnterpriseId(user.getCompanyId());
        newCPO.setCompanyName(user.getCompanyName());
        newCPO.setAddress(user.getCompanyAddress());
        newCPO.setTaxCode(user.getTaxCode());
        newCPO.setLogoUrl(user.getLogoUrl());
        newCPO.setManager(savedUser);

        cpoRepo.save(newCPO);
    }

    public BusinessProfileDTO getBusinessProfile(String companyId) {
        CPO company = cpoRepo.findById(companyId).orElse(null);
        if (company == null) {
            return null;
        }
        BusinessProfileDTO response = new BusinessProfileDTO();
        response.setCompanyName(company.getCompanyName());
        response.setCompanyAddress(company.getAddress());
        response.setLogoUrl(company.getLogoUrl());
        response.setTaxCode(company.getTaxCode());
        response.setServerUrl(company.getServerUrl());
        response.setToken(company.getToken());
        response.setIsVerified(company.getIsVerified());

        EVUser manager = company.getManager();
        response.setManagerFullName(manager.getFullName());
        response.setManagerAddress(manager.getAddress());
        response.setManagerEmail(manager.getEmail());
        return response;
    }

    public BusinessUpdateProfileDTO updateBusinessProfile(BusinessUpdateProfileDTO businessProfileDTO, String companyId) {
        CPO company = cpoRepo.findById(companyId).orElse(null);
        if (company == null) {
            return null;
        }
        if (businessProfileDTO.getCompanyName() != null) company.setCompanyName(businessProfileDTO.getCompanyName());
        if (businessProfileDTO.getCompanyAddress() != null) company.setAddress(businessProfileDTO.getCompanyAddress());
        if (businessProfileDTO.getTaxCode() != null) company.setTaxCode(businessProfileDTO.getTaxCode());
        if (businessProfileDTO.getServerUrl() != null) company.setServerUrl(businessProfileDTO.getServerUrl());
        if (businessProfileDTO.getToken() != null) company.setToken(businessProfileDTO.getToken());
        EVUser manager = company.getManager();
        if (businessProfileDTO.getManagerFullName() != null) manager.setFullName(businessProfileDTO.getManagerFullName());
        if (businessProfileDTO.getManagerEmail() != null) manager.setEmail(businessProfileDTO.getManagerEmail());
        if (businessProfileDTO.getManagerAddress() != null) manager.setAddress(businessProfileDTO.getManagerAddress());

        company.setManager(manager);
        cpoRepo.save(company);

        return businessProfileDTO;
    }

    public boolean saveLogo(MultipartFile newImage, String companyId) throws IOException {
        if (!isValidImageFormat(newImage)) {
            return false;
        }

        CPO cpo = cpoRepo.findById(companyId).orElse(null);
        if (cpo == null) {
            return false;
        }

        String oldLogoUrl = cpo.getLogoUrl();

        // 1. Tạo key mới hoàn toàn bằng cách gắn thêm Timestamp để tránh lỗi Cache
        String newLogoKey = companyId + "-logo-" + System.currentTimeMillis();

        try {
            // 2. Upload file mới lên S3 (Dùng InputStream tối ưu RAM)
            String newUrl = uploadToS3(newImage, newLogoKey);

            // 3. Update Database
            cpo.setLogoUrl(newUrl);
            cpoRepo.save(cpo);

            // 4. (Tùy chọn) Xóa logo cũ ĐỂ TIẾT KIỆM DUNG LƯỢNG S3 sau khi mọi thứ đã thành công
            if (oldLogoUrl != null) {
                String oldKey = extractKeyFromUrl(oldLogoUrl); // Cần viết hàm trích xuất key từ URL
                if (oldKey != null) {
                    deleteFromS3(oldKey);
                }
            }

            return true;
        } catch (Exception e) {
            // Log lỗi ở đây: log.error("Failed to upload logo", e);
            return false;
        }
    }

    private String uploadToS3(MultipartFile file, String key) throws IOException {
        s3Client.putObject(PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(file.getContentType()) // Nên set ContentType để trình duyệt render ảnh đúng
                        .build(),
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return s3Client.utilities().getUrl(GetUrlRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build()).toExternalForm();
    }

    private String extractKeyFromUrl(String url) {
        try {
            // Cắt chuỗi lấy phần sau tên bucket. Phụ thuộc vào cấu trúc URL thực tế của bạn.
            return url.substring(url.lastIndexOf("/") + 1);
        } catch (Exception e) {
            return null;
        }
    }

    private void deleteFromS3(String key) {
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build());
    }

    private boolean isValidImageFormat(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (
                contentType.contains("png") || contentType.contains("jpeg") || contentType.contains("jpg")
        );
    }
}
