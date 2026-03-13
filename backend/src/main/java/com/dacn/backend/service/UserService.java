package com.dacn.backend.service;

// import java.security.Key;
// import java.security.NoSuchAlgorithmException;
// import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

// import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import com.dacn.backend.dto.UserResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.dacn.backend.dto.UserRegisterDTO;
import com.dacn.backend.model.EVUser;
import com.dacn.backend.repository.EVUserRepo;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.io.Decoders;
// import io.jsonwebtoken.security.Keys;

@Service
public class UserService {
    @Autowired
    private EVUserRepo eVUserRepo;

    private SecretKey secretKey;

    private SecretKey generateSecretKey() {
        secretKey = Jwts.SIG.HS256.key().build();
        return secretKey;
    }

    public void saveUser(@NonNull UserRegisterDTO user) {
        EVUser newUser = new EVUser();
        newUser.setEmail(user.getEmail());
        newUser.setFullName(user.getFullName());
        newUser.setRole("CLIENT");

        newUser.setUsername(user.getUsername());
        newUser.setPassword(user.getPassword());

        eVUserRepo.save(newUser);
    }

    public String generateToken(String username) {
        // TODO Auto-generated method stub
        Map<String, Object> map = new HashMap<>();

        return Jwts.builder()
                .claims(map)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000*60*30))
                .signWith(generateSecretKey())
                .compact();

    }

    public String extractUsername(String token) {
        // TODO Auto-generated method stub
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolvers) {
        final Claims claims = Jwts.parser()
                                .verifyWith(secretKey)
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


    public UserResponseDTO getUserId(String username) {
        UserResponseDTO user;
        user = eVUserRepo.findIdByUsername(username);
        return user;
    }
}
