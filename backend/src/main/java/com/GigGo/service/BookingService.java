package com.GigGo.service;

import com.GigGo.dto.booking.AssignmentResponseDto;
import com.GigGo.dto.booking.BookingResponseDto;
import com.GigGo.dto.booking.CreateBookingRequestDto;
import com.GigGo.dto.booking.CreateServiceRequestDto;
import com.GigGo.dto.booking.RespondAssignmentDto;
import com.GigGo.dto.booking.ServiceRequestResponseDto;
import com.GigGo.dto.booking.WorkerAvailabilityDto;

import java.util.List;
import java.util.UUID;

public interface BookingService {

    /**
     * Creates a new service request for the authenticated customer.
     * Validates service existence, problem existence, problem belonging to service, lat/lng bounds,
     * and customer cooperative society from DB record.
     */
    ServiceRequestResponseDto createServiceRequest(UUID customerUserId, CreateServiceRequestDto request);

    /**
     * Gets service request details by ID, enforcing that the requesting customer owns the request.
     */
    ServiceRequestResponseDto getServiceRequestById(UUID requestId, UUID requestingCustomerUserId);

    /**
     * Cancels a service request.
     */
    ServiceRequestResponseDto cancelServiceRequest(UUID requestId, UUID requestingCustomerUserId);

    /**
     * Creates a new booking request for the authenticated customer.
     */
    BookingResponseDto createBooking(UUID customerUserId, CreateBookingRequestDto request);

    /**
     * Sets or updates customer's assigned cooperative society.
     */
    BookingResponseDto setCustomerCooperative(UUID customerUserId, UUID cooperativeId);

    /**
     * Gets booking details by ID.
     */
    BookingResponseDto getBookingById(UUID bookingId, UUID requestingUserId);

    /**
     * Lists bookings for a customer.
     */
    List<BookingResponseDto> getCustomerBookings(UUID customerUserId);

    /**
     * Lists assignments offered to or responded by a worker.
     */
    List<AssignmentResponseDto> getWorkerAssignments(UUID workerUserId);

    /**
     * Gets currently active pending offer for a worker, if any.
     */
    AssignmentResponseDto getPendingWorkerAssignment(UUID workerUserId);

    /**
     * Worker responds (accept / reject) to an offered assignment.
     */
    BookingResponseDto respondToAssignment(UUID workerUserId, UUID assignmentId, RespondAssignmentDto response);

    /**
     * Worker responds (accept / reject) to an offered assignment by service request ID.
     */
    BookingResponseDto respondToRequest(UUID workerUserId, UUID requestId, RespondAssignmentDto response);

    /**
     * Toggles worker availability / online status.
     */
    void updateWorkerAvailability(UUID workerUserId, WorkerAvailabilityDto availabilityDto);

    /**
     * Background state machine ticker / timer task to expire 30s offers and dispatch next worker.
     */
    void expirePendingOffersAndDispatchNext();

    /**
     * Expire pending offers using an explicitly passed cutoff timestamp (for controllable test clocks).
     */
    void expirePendingOffersAndDispatchNext(java.time.Instant now);

    /**
     * Dispatches booking request to the next eligible worker in customer's cooperative society.
     */
    boolean dispatchNextWorker(UUID bookingId);
}
