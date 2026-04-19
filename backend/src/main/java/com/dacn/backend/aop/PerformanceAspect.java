package com.dacn.backend.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class PerformanceAspect {
    private static final Logger LOGGER = LoggerFactory.getLogger(PerformanceAspect.class);

    @Around("""
        execution(* com.dacn.backend.service.StationService.*(..))
        || execution(* com.dacn.backend.service.UserService.*(..))
""")
    public Object performanceMeasure(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        try {
            Object object = joinPoint.proceed();
            return object;
        }
        finally {
            long endTime = System.currentTimeMillis();
            LOGGER.info("Method {} executed in {} milliseconds", joinPoint.getSignature(), endTime - startTime);
        }

    }
}
