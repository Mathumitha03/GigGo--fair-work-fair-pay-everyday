package com.GigGo.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CooperativeWorkerIdDataInitializer implements CommandLineRunner {

    @Override
    public void run(String... args) {
        log.info("Cooperative Worker System initialized. Workers are registered by Cooperative Manager.");
    }
}
