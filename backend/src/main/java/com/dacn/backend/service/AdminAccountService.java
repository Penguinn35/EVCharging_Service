package com.dacn.backend.service;

import com.dacn.backend.dto.AdminRegisterDTO;
import com.dacn.backend.dto.CPOResponseDTO;
import com.dacn.backend.dto.UserRegisterDTO;
import com.dacn.backend.model.CPO;
import com.dacn.backend.model.EVUser;
import com.dacn.backend.repository.CPORepo;
import com.dacn.backend.repository.EVUserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminAccountService {
    @Autowired
    private EVUserRepo evUserRepo;
    @Autowired
    private CPORepo cpoRepo;

    public void saveAdminUser(@NonNull AdminRegisterDTO user) {
        EVUser newUser = new EVUser();
        newUser.setRole("ADMIN");

        newUser.setUsername(user.getUsername());
        newUser.setPassword(user.getPassword());
        newUser.setEmail(user.getEmail());

        evUserRepo.save(newUser);
    }

    public List<CPOResponseDTO> getAllCpoList() {
        List<CPO> cpoList = cpoRepo.findAll();
        return cpoList.stream().map(cpo -> {
            CPOResponseDTO cpoResponse = new CPOResponseDTO();
            cpoResponse.setCompanyId(cpo.getEnterpriseId());
            cpoResponse.setCompanyName(cpo.getCompanyName());
            cpoResponse.setCompanyAddress(cpo.getAddress());
            cpoResponse.setLogoUrl(cpo.getLogoUrl());
            cpoResponse.setTaxCode(cpo.getTaxCode());
            cpoResponse.setIsVerified(cpo.getIsVerified());

            EVUser manager = cpo.getManager();
            if (manager != null) {
                cpoResponse.setManagerEmail(manager.getEmail());
                cpoResponse.setManagerFullName(manager.getFullName());
                cpoResponse.setManagerAddress(manager.getAddress());
            }
            return cpoResponse;
        }).toList();
    }

    @Transactional
    public boolean verifyCPOProfile(String enterpriseId) {
        return cpoRepo.verifyCPO(enterpriseId) > 0;
    }

    @Transactional
    public boolean disableCPOProfile(String enterpriseId) {
        return cpoRepo.disableCPO(enterpriseId) > 0;
    }
}
