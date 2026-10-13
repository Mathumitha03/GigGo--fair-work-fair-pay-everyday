package com.GigGo.controller;

import com.GigGo.dto.common.ApiResponse;
import com.GigGo.dto.booking.BookingResponseDto;
import com.GigGo.dto.booking.CreateBookingRequestDto;
import com.GigGo.security.UserPrincipal;
import com.GigGo.service.BookingService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Hidden
@RestController
@RequestMapping("/api/v1/customer")
@RequiredArgsConstructor
@Tag(name = "Customer Bookings", description = "Endpoints for Customers to create service requests, set cooperative society, and view booking status")
public class CustomerBookingController {

    private final BookingService bookingService;

    @PostMapping("/bookings")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Create a Service Booking Request", description = "Creates a service request and automatically dispatches to eligible workers in the customer's cooperative society.")
    public ResponseEntity<ApiResponse<BookingResponseDto>> createBooking(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CreateBookingRequestDto request) {

        BookingResponseDto response = bookingService.createBooking(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Booking request created and dispatched successfully."));
    }

    @PutMapping("/cooperative/{cooperativeId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Assign Cooperative Society to Customer", description = "Sets or updates the customer's assigned cooperative society.")
    public ResponseEntity<ApiResponse<BookingResponseDto>> setCooperative(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID cooperativeId) {

        BookingResponseDto response = bookingService.setCustomerCooperative(currentUser.getId(), cooperativeId);
        return ResponseEntity.ok(ApiResponse.success(response, "Customer cooperative society updated successfully."));
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get Customer Bookings", description = "Retrieves all service booking requests created by the authenticated customer.")
    public ResponseEntity<ApiResponse<List<BookingResponseDto>>> getCustomerBookings(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        List<BookingResponseDto> response = bookingService.getCustomerBookings(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Customer bookings retrieved successfully."));
    }

    @GetMapping("/bookings/{bookingId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get Booking Details by ID", description = "Retrieves specific booking details and active assignment state.")
    public ResponseEntity<ApiResponse<BookingResponseDto>> getBookingById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID bookingId) {

        BookingResponseDto response = bookingService.getBookingById(bookingId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Booking details retrieved successfully."));
    }
}
