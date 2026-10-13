package com.GigGo.service.impl;

import com.GigGo.dto.service.ServiceCategoryResponseDto;
import com.GigGo.dto.service.ServiceProblemResponseDto;
import com.GigGo.entity.service.ServiceCategory;
import com.GigGo.entity.service.ServiceProblem;
import com.GigGo.exception.ResourceNotFoundException;
import com.GigGo.repository.ServiceCategoryRepository;
import com.GigGo.repository.ServiceProblemRepository;
import com.GigGo.service.ServiceCatalogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ServiceCatalogServiceImpl implements ServiceCatalogService {

    private final ServiceCategoryRepository serviceCategoryRepository;
    private final ServiceProblemRepository serviceProblemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ServiceCategoryResponseDto> getAllServiceCategories() {
        return serviceCategoryRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc().stream()
                .map(this::mapToCategoryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceProblemResponseDto> getProblemsForService(UUID serviceId) {
        if (!serviceCategoryRepository.existsById(serviceId)) {
            throw new ResourceNotFoundException("Service category not found with ID: " + serviceId);
        }

        List<ServiceProblem> problems = serviceProblemRepository.findByCategoryIdAndIsActiveTrue(serviceId);
        if (problems.isEmpty()) {
            problems = serviceProblemRepository.findByCategoryId(serviceId);
        }

        return problems.stream()
                .map(this::mapToProblemDto)
                .collect(Collectors.toList());
    }

    private ServiceCategoryResponseDto mapToCategoryDto(ServiceCategory category) {
        return ServiceCategoryResponseDto.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .iconUrl(category.getIconUrl())
                .basePrice(category.getBasePrice())
                .build();
    }

    private ServiceProblemResponseDto mapToProblemDto(ServiceProblem problem) {
        return ServiceProblemResponseDto.builder()
                .id(problem.getId())
                .serviceId(problem.getCategory().getId())
                .name(problem.getName())
                .description(problem.getDescription())
                .estimatedPrice(problem.getEstimatedPrice())
                .build();
    }
}
