package com.GigGo.service;

import com.GigGo.dto.service.ServiceCategoryResponseDto;
import com.GigGo.dto.service.ServiceProblemResponseDto;

import java.util.List;
import java.util.UUID;

public interface ServiceCatalogService {

    List<ServiceCategoryResponseDto> getAllServiceCategories();

    List<ServiceProblemResponseDto> getProblemsForService(UUID serviceId);
}
