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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

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

    // private String generateSecretKey() {
    //     // TODO Auto-generated method stub
    //     try {
    //         KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
    //         SecretKey secretKey = keyGen.generateKey();
    //         System.out.println("secret key is: " + secretKey.toString());
    //         return Base64.getEncoder().encodeToString(secretKey.getEncoded());
    //     } catch (NoSuchAlgorithmException e) {
    //         throw new RuntimeException("Error generating key ", e);
    //     }
    // }

    public EVUser saveUser(EVUser user) {
        return eVUserRepo.save(user);
    }

    // public String login(EVUser user) {
    //     // TODO Auto-generated method stub
    //     Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
    //     return authentication.isAuthenticated() ? generateToken(user.getUsername()) : "Login Failed";
        
    // }

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

    // private Key getKey() {
    //     // TODO Auto-generated method stub
    //     byte[] keyBytes = Decoders.BASE64.decode(secretKey);
    //     return Keys.hmacShaKeyFor(keyBytes);
    // }

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


}
