package com.dacn.backend.service;

import java.util.*;
import java.util.function.Function;

// import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import com.dacn.backend.dto.SavedStationDTO;
import com.dacn.backend.dto.UserDetailDTO;
import com.dacn.backend.dto.UserResponseDTO;
import com.dacn.backend.repository.UserSavesStationRepo;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.dacn.backend.dto.UserRegisterDTO;
import com.dacn.backend.model.EVUser;
import com.dacn.backend.repository.EVUserRepo;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Service
public class UserAccountService {
    @Autowired
    private EVUserRepo eVUserRepo;
    @Autowired
    private UserSavesStationRepo userSavesStationRepo;

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    private SecretKey generateSecretKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            System.err.println("Error " + e.getClass().getName());
            System.err.println("Error message " + e.getMessage());
            throw e;
        }
    }

    public void saveUser(@NonNull UserRegisterDTO user) {
        EVUser newUser = new EVUser();
        newUser.setEmail(user.getEmail());
        newUser.setFullName(user.getFullName());
        newUser.setRole("CLIENT");

        newUser.setUsername(user.getUsername());
        newUser.setPassword(user.getPassword());
        newUser.setAddress(user.getAddress());

        eVUserRepo.save(newUser);
    }

    public String generateToken(String username) {
        // TODO Auto-generated method stub
        Map<String, Object> map = new HashMap<>();

        return Jwts.builder()
                .claims(map)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000*60*60*24))
                .signWith(generateSecretKey())
                .compact();

    }

    public String extractUsername(String token) {
        // TODO Auto-generated method stub
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolvers) {
        final Claims claims = Jwts.parser()
                                .verifyWith(generateSecretKey())
                                .build()
                                .parseSignedClaims(token).getPayload();
        return claimResolvers.apply(claims);
    }


    public boolean validateToken(String token, UserDetails userDetails) {
        // TODO Auto-generated method stub
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        // TODO Auto-generated method stub
        return extractClaim(token, Claims::getExpiration).before(new Date()); // get expiration claim from the token
    }


//    public UserResponseDTO getUserId(String username) {
//        UserResponseDTO user;
//        user = eVUserRepo.findIdByUsername(username);
//        return user;
//    }

    public UserDetailDTO getUserDetail(String userId) throws RuntimeException {
        EVUser user = eVUserRepo.findById(userId).orElseThrow();
        UserDetailDTO userDetail = new UserDetailDTO();
        userDetail.setFullName(user.getFullName());
        userDetail.setAddress(user.getAddress());
        userDetail.setEmail(user.getEmail());

//        List<UserSavesStation> userSavesStation = user.getSavedStations();

//        List<SavedStationDTO> returnedSavedStations = getSavedStations(userSavesStation);

//        userDetail.setSavedStationList(returnedSavedStations);

        List<SavedStationDTO> returnedSavedStation = userSavesStationRepo.getSavedStationOfUser(userId);
        userDetail.setSavedStationList(returnedSavedStation);

        return userDetail;
    }

//    private List<SavedStationDTO> getSavedStations(List<UserSavesStation> userSavesStation) {
//        List<SavedStationDTO> returnedSavedStations = new LinkedList<>();
//        for (UserSavesStation userStation : userSavesStation) {
//            ChargingStation station = userStation.getStation();
//            SavedStationDTO savedStation = new SavedStationDTO();
//            savedStation.setId(station.getId());
//            savedStation.setName(station.getName());
//            savedStation.setPosition(station.getPosition());
//            savedStation.setAddress(station.getAddress());
//
//            returnedSavedStations.add(savedStation);
//        }
//        return returnedSavedStations;
//    }

    public UserResponseDTO getUserLoginInfo(String userId) {
        EVUser user = eVUserRepo.findById(userId).orElseThrow();
        UserResponseDTO userDetail = new UserResponseDTO();
        userDetail.setUsername(user.getUsername());
        userDetail.setFullName(user.getFullName());
        userDetail.setAddress(user.getAddress());
        userDetail.setEmail(user.getEmail());
        userDetail.setRole(user.getRole());

        return userDetail;
    }
}
