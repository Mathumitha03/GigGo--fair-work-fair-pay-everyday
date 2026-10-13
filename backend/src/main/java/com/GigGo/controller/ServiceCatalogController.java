package com.GigGo.controller;

import com.GigGo.dto.common.ApiResponse;
import com.GigGo.dto.service.ServiceCategoryResponseDto;
import com.GigGo.dto.service.ServiceProblemResponseDto;
import com.GigGo.service.ServiceCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
@Tag(name = "Service Catalog", description = "Public endpoints for listing available service categories and problem options")
public class ServiceCatalogController {

    private final ServiceCatalogService serviceCatalogService;

    @GetMapping
    @Operation(summary = "Get Available Services", description = "Retrieves all active service categories (e.g. CARPENTER, PAINTER, CLEANER, GARDEN_CLEANER).")
    public ResponseEntity<ApiResponse<List<ServiceCategoryResponseDto>>> getServices() {
        List<ServiceCategoryResponseDto> services = serviceCatalogService.getAllServiceCategories();
        return ResponseEntity.ok(ApiResponse.success(services, "Service categories retrieved successfully."));
    }

    @GetMapping("/{serviceId}/problems")
    @Operation(summary = "Get Problems for a Service", description = "Retrieves all specific problems belonging to the selected service category.")
    public ResponseEntity<ApiResponse<List<ServiceProblemResponseDto>>> getProblemsForService(@PathVariable UUID serviceId) {
        List<ServiceProblemResponseDto> problems = serviceCatalogService.getProblemsForService(serviceId);
        return ResponseEntity.ok(ApiResponse.success(problems, "Service problems retrieved successfully."));
    }
}
