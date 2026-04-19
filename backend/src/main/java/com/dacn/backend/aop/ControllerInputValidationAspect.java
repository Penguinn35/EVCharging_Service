package com.dacn.backend.aop;

import com.dacn.backend.dto.RatingRequestDTO;
import com.dacn.backend.dto.UserRegisterDTO;
import com.dacn.backend.model.Rating;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.model.type.Coordinate;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class ControllerInputValidationAspect {
    private static final Logger LOGGER = LoggerFactory.getLogger(ControllerInputValidationAspect.class);

    @Around("execution(* com.dacn.backend.controller.Authenticator.registerUser(..)) && args(user)")
    public Object validateRegisterUserInput(ProceedingJoinPoint joinPoint, UserRegisterDTO user) throws Throwable {
        String usernameRegex = "^[a-zA-Z].{7,}";
        if (!user.getUsername().matches(usernameRegex)) {
            LOGGER.info("Username is invalid, it must contain at least 8 letters start with an a-z or A-Z character");
            throw new IllegalArgumentException("Username is invalid, it must contain at least 8 letters start with an a-z or A-Z character");
        }
        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$";
        if (!user.getPassword().matches(passwordRegex)) {
            LOGGER.info("Password is not valid");
            throw new IllegalArgumentException("Password must be at least 8 characters long, which contains lowercase and uppercase characters, numbers and special characters");
        }
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        if (!user.getEmail().matches(emailRegex)) {
            LOGGER.info("Email is not valid");
            throw new IllegalArgumentException("Email is not in a valid form");
        }
        if (user.getFullName() == null || user.getFullName().isEmpty()) {
            LOGGER.info("Full name is not valid");
            throw new IllegalArgumentException("Full name must not be empty");
        }

        return joinPoint.proceed();
    }

    @Around("execution(* com.dacn.backend.controller.StationController.getStationByLocation(..)) && args(position)")
    public Object validateFindNearStationsInput(ProceedingJoinPoint joinPoint, Coordinate position) throws Throwable {
        if (position.getLongitude() == null || position.getLatitude() == null
        || position.getLongitude().isNaN() || position.getLatitude().isNaN()) {
            throw new IllegalArgumentException("The coordinate must not be null and must be a floating point number");
        }
        return joinPoint.proceed();
    }

    @Around("execution(* com.dacn.backend.controller.StationRatingController.sendRating(..)) && args(rating, principal)")
    public Object validateRatingInput(ProceedingJoinPoint joinPoint, RatingRequestDTO rating, UserPrincipal principal) throws Throwable {
        if (rating.getPoint() <= 0 || rating.getPoint() > 5) {
            throw new IllegalArgumentException("The rating point must be between 1 to 5");
        }
        return joinPoint.proceed();
    }
}
