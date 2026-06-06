package com.dacn.backend.service;

import com.dacn.backend.dto.SuggestionRequestDTO;
import com.dacn.backend.model.UserSuggestedStation;
import com.dacn.backend.repository.EVUserRepo;
import com.dacn.backend.repository.UserSuggestionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {
    @Autowired
    private UserSuggestionRepo userSuggestionRepo;
    @Autowired
    private EVUserRepo userRepo;

    public boolean suggestStation(SuggestionRequestDTO suggestionDTO, String userId) {
        UserSuggestedStation suggestion = new UserSuggestedStation();
        suggestion.setLocation(suggestionDTO.getLocation());
        suggestion.setDescription(suggestionDTO.getDescription());
        suggestion.setUser(userRepo.getReferenceById(userId));
        suggestion.setTimestamp(LocalDateTime.now());
        userSuggestionRepo.save(suggestion);
        return true;
    }
}
