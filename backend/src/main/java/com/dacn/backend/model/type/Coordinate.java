package com.dacn.backend.model.type;

import java.io.Serializable;

import jakarta.persistence.Embeddable;

@Embeddable
public class Coordinate implements Serializable {
    Double longitude;
    Double latitude;
}
