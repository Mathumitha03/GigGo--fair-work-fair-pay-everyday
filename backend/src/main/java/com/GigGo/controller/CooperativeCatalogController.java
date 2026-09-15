package com.GigGo.controller;

import com.GigGo.dto.common.ApiResponse;
import com.GigGo.dto.cooperative.CooperativeResponseDto;
import com.GigGo.service.CooperativeAffiliationService;
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
@RequestMapping("/api/v1/cooperatives")
@RequiredArgsConstructor
@Tag(name = "Cooperative Catalog", description = "Public & authenticated catalog of active Labour Cooperative Societies")
public class CooperativeCatalogController {

    private final CooperativeAffiliationService affiliationService;

    @GetMapping
    @Operation(summary = "List Active Cooperative Societies", description = "Returns all active registered labour cooperative societies in the federation")
    public ResponseEntity<ApiResponse<List<CooperativeResponseDto>>> listCooperatives() {
        List<CooperativeResponseDto> cooperatives = affiliationService.getAllActiveCooperatives();
        return ResponseEntity.ok(ApiResponse.success(cooperatives, "Active cooperatives retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Cooperative Details", description = "Retrieves details of a specific cooperative society")
    public ResponseEntity<ApiResponse<CooperativeResponseDto>> getCooperative(@PathVariable UUID id) {
        CooperativeResponseDto cooperative = affiliationService.getCooperativeById(id);
        return ResponseEntity.ok(ApiResponse.success(cooperative, "Cooperative retrieved successfully"));
    }
}
