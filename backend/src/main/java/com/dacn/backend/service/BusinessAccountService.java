package com.dacn.backend.service;

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

        CPO newCPO = new CPO();
        newCPO.setEnterpriseId(user.getCompanyId());
        newCPO.setCompanyName(user.getCompanyName());
        newCPO.setAddress(user.getCompanyAddress());
        newCPO.setTaxCode(user.getTaxCode());
        newCPO.setLogoUrl(user.getLogoUrl());
        newCPO.setManager(savedUser);

        cpoRepo.save(newCPO);
    }
}
