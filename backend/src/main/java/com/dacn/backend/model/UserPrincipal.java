package com.dacn.backend.model;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import io.micrometer.common.lang.Nullable;

public class UserPrincipal implements UserDetails {
    private EVUser user;

    public UserPrincipal(EVUser user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // TODO Auto-generated method stub
        return Collections.singleton(new SimpleGrantedAuthority(user.getRole()));
        /*
        Phân quyền:
        - CLIENT: dành cho khách
        - BUSINESS: dành cho doanh nghiệp (CPO)
        - ADMIN: dành cho admin
        */
    }

    @Override
    public @Nullable String getPassword() {
        // TODO Auto-generated method stub
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        // TODO Auto-generated method stub
        return user.getUsername();
    }

}
