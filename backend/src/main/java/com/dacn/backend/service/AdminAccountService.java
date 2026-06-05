package com.dacn.backend.service;

import com.dacn.backend.dto.AdminRegisterDTO;
import com.dacn.backend.dto.UserRegisterDTO;
import com.dacn.backend.model.EVUser;
import com.dacn.backend.repository.EVUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Service
public class AdminAccountService {
    @Autowired
    private EVUserRepo evUserRepo;

    public void saveAdminUser(@NonNull AdminRegisterDTO user) {
        EVUser newUser = new EVUser();
        newUser.setRole("ADMIN");

        newUser.setUsername(user.getUsername());
        newUser.setPassword(user.getPassword());
        newUser.setEmail(user.getEmail());

        evUserRepo.save(newUser);
    }
}
