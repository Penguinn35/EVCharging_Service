package com.dacn.backend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class StationImageRequestDTO {
    private MultipartFile imageFile;
    private String key;
}
