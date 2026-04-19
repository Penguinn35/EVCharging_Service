package com.dacn.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserDetailDTO {
    private String fullName;
    private String email;
    private String address;

    private List<SavedStationDTO> savedStationList;
}
