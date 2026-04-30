package com.dacn.backend.service;

import com.dacn.backend.dto.BusinessProfileDTO;
import com.dacn.backend.dto.CPORegisterDTO;
import com.dacn.backend.model.CPO;
import com.dacn.backend.model.EVUser;
import com.dacn.backend.repository.CPORepo;
import com.dacn.backend.repository.EVUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BusinessAccountService {
    @Autowired
    private EVUserRepo eVUserRepo;
    @Autowired
    private CPORepo cpoRepo;

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
        BusinessProfileDTO response = new BusinessProfileDTO();
        response.setCompanyName(company.getCompanyName());
        response.setCompanyAddress(company.getAddress());
        response.setTaxCode(company.getTaxCode());

        EVUser manager = company.getManager();
        response.setManagerFullName(manager.getFullName());
        response.setManagerAddress(manager.getAddress());
        response.setManagerEmail(manager.getEmail());
        return response;
    }
}
