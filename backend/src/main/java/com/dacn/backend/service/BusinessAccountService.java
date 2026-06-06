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
        String logoKey = companyId + "-logo";
        if (cpo.getLogoUrl() != null) {
            deleteFromS3(logoKey);
        }
        String url = uploadToS3(newImage, logoKey);
        cpo.setLogoUrl(url);
        cpoRepo.save(cpo);
        return true;
    }

    private String uploadToS3(MultipartFile file, String key) throws IOException {
        s3Client.putObject(PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build(), RequestBody.fromBytes(file.getBytes()));

        return s3Client.utilities().getUrl(GetUrlRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build()).toExternalForm();
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
