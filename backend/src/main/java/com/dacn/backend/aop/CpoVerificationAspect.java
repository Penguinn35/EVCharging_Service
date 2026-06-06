package com.dacn.backend.aop;

import com.dacn.backend.annotation.RequiresVerifiedCpo;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.repository.CPORepo;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class CpoVerificationAspect {

    private final CPORepo cpoRepo;

    public CpoVerificationAspect(CPORepo cpoRepository) {
        this.cpoRepo = cpoRepository;
    }

    // Intercepts methods or classes marked with @RequiresVerifiedCpo
    @Before("@annotation(requiresVerifiedCpo) || @within(requiresVerifiedCpo)")
    public void verifyCpoStatus(RequiresVerifiedCpo requiresVerifiedCpo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User is not authenticated.");
        }

        // Get your principal (cast it to your specific JWT principal class)
        Object principal = authentication.getPrincipal();

        // Replace 'YourCustomJwtPrincipal' with the actual class name of your principal
        if (principal instanceof UserPrincipal customPrincipal) {
            String companyId = customPrincipal.getCompanyId(); // Use your custom method

            boolean isVerified = cpoRepo.findById(companyId)
                    .map(cpo -> Boolean.TRUE.equals(cpo.getIsVerified()))
                    .orElse(false);

            if (!isVerified) {
                throw new AccessDeniedException("Access denied. Your CPO account is not verified.");
            }
        } else {
            throw new AccessDeniedException("Invalid authentication principal type.");
        }
    }
}