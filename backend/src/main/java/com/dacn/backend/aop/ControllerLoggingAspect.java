package com.dacn.backend.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class ControllerLoggingAspect {
    private static final Logger LOGGER = LoggerFactory.getLogger(ControllerLoggingAspect.class);

    @Before("execution(* com.dacn.backend.controller..*(..))")
    public void printLogBeforeMethodCall(JoinPoint joinPoint) {
        LOGGER.info("Method {} is called!", joinPoint.getSignature());
    }

    @AfterReturning("execution(* com.dacn.backend.controller..*(..))")
    public void printLogAfterReturningMethodCall(JoinPoint joinPoint) {
        LOGGER.info("Method {} executed successfully!", joinPoint.getSignature());
    }

    @AfterThrowing("execution(* com.dacn.backend.controller..*(..))")
    public void printLogAfterThrowingMethodCall(JoinPoint joinPoint) {
        LOGGER.info("Method {} executed failed!", joinPoint.getSignature());
    }

    @After("execution(* com.dacn.backend.controller..*(..))")
    public void printLogAfterFinallyMethodCall(JoinPoint joinPoint) {
        LOGGER.info("Method {} ended its execution!", joinPoint.getSignature());
    }



}
