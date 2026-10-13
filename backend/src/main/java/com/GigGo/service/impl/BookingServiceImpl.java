package com.GigGo.service.impl;

import com.GigGo.dto.booking.AssignmentResponseDto;
import com.GigGo.dto.booking.BookingResponseDto;
import com.GigGo.dto.booking.CreateBookingRequestDto;
import com.GigGo.dto.booking.CreateServiceRequestDto;
import com.GigGo.dto.booking.RespondAssignmentDto;
import com.GigGo.dto.booking.ServiceRequestResponseDto;
import com.GigGo.dto.booking.WorkerAvailabilityDto;
import com.GigGo.entity.authentication.User;
import com.GigGo.entity.booking.Assignment;
import com.GigGo.entity.booking.Booking;
import com.GigGo.entity.booking.BookingStatusHistory;
import com.GigGo.entity.cooperative.LabourCooperative;
import com.GigGo.entity.profile.Customer;
import com.GigGo.entity.profile.Worker;
import com.GigGo.entity.service.ServiceCategory;
import com.GigGo.entity.service.ServiceProblem;
import com.GigGo.enums.AssignmentStatus;
import com.GigGo.enums.BookingStatus;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.UserStatus;
import com.GigGo.enums.WorkerVerificationStatus;
import com.GigGo.exception.ResourceNotFoundException;
import com.GigGo.repository.AssignmentRepository;
import com.GigGo.repository.BookingRepository;
import com.GigGo.repository.BookingStatusHistoryRepository;
import com.GigGo.repository.CustomerRepository;
import com.GigGo.repository.LabourCooperativeRepository;
import com.GigGo.repository.ServiceCategoryRepository;
import com.GigGo.repository.ServiceOfferingRepository;
import com.GigGo.repository.ServiceProblemRepository;
import com.GigGo.repository.UserRepository;
import com.GigGo.repository.WorkerRepository;
import com.GigGo.service.BookingService;
import com.GigGo.service.WorkerNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final AssignmentRepository assignmentRepository;
    private final BookingStatusHistoryRepository bookingStatusHistoryRepository;
    private final CustomerRepository customerRepository;
    private final WorkerRepository workerRepository;
    private final LabourCooperativeRepository cooperativeRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final ServiceProblemRepository serviceProblemRepository;
    private final UserRepository userRepository;
    private final ServiceOfferingRepository serviceOfferingRepository;
    private final WorkerNotificationService workerNotificationService;

    @Override
    @Transactional
    public ServiceRequestResponseDto createServiceRequest(UUID customerUserId, CreateServiceRequestDto request) {
        Customer customer = customerRepository.findByUserId(customerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Customer profile not found for user ID: " + customerUserId));

        // Validation 1: Customer must belong to a valid cooperative society (DB Record)
        LabourCooperative customerCooperative = customer.getCooperative();
        if (customerCooperative == null) {
            throw new IllegalArgumentException("Customer is not affiliated with a cooperative society. Please select a society first.");
        }

        // Validation 2: Latitude bounds (-90 to 90)
        if (request.getLatitude() == null || request.getLatitude() < -90.0 || request.getLatitude() > 90.0) {
            throw new IllegalArgumentException("Latitude must be between -90 and 90.");
        }

        // Validation 3: Longitude bounds (-180 to 180)
        if (request.getLongitude() == null || request.getLongitude() < -180.0 || request.getLongitude() > 180.0) {
            throw new IllegalArgumentException("Longitude must be between -180 and 180.");
        }

        // Validation 4: Problem existence
        ServiceProblem problem = serviceProblemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new com.GigGo.exception.ResourceNotFoundException("Service problem not found with ID: " + request.getProblemId()));

        // Service category is derived directly from the problem
        ServiceCategory category = problem.getCategory();

        // Validation 5: If serviceId is also provided, verify that the problem belongs to the selected service
        if (request.getServiceId() != null) {
            ServiceCategory providedCategory = serviceCategoryRepository.findById(request.getServiceId())
                    .orElseThrow(() -> new com.GigGo.exception.ResourceNotFoundException("Service category not found with ID: " + request.getServiceId()));

            if (!category.getId().equals(providedCategory.getId())) {
                throw new IllegalArgumentException("Problem '" + problem.getName() + "' does not belong to service category '" + providedCategory.getName() + "'.");
            }
        }

        String bookingReference = "BG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Point location = createPoint(request.getLatitude(), request.getLongitude());

        BigDecimal basePrice = problem.getEstimatedPrice() != null ? problem.getEstimatedPrice()
                : (category.getBasePrice() != null ? category.getBasePrice() : new BigDecimal("300.00"));

        String address = (request.getServiceAddress() != null && !request.getServiceAddress().isBlank())
                ? request.getServiceAddress().trim()
                : "Customer GPS Location (" + request.getLatitude() + ", " + request.getLongitude() + ")";

        Booking booking = Booking.builder()
                .bookingReference(bookingReference)
                .customer(customer)
                .serviceCategory(category)
                .serviceProblem(problem)
                .location(location)
                .serviceAddress(address)
                .scheduledStartTime(Instant.now())
                .specialInstructions(request.getSpecialInstructions() != null ? request.getSpecialInstructions() : problem.getName())
                .timeWindow("Immediate")
                .totalAmount(basePrice)
                .fairWageEstimate(basePrice)
                .status(BookingStatus.REQUESTED)
                .build();

        booking = bookingRepository.save(booking);

        recordStatusHistory(booking, null, BookingStatus.REQUESTED, customer.getUser(),
                "Service request created for problem '" + problem.getName() + "' in category '" + category.getName() + "' under society '" + customerCooperative.getName() + "'");

        log.info("Customer {} created service request {} for problem '{}' in society '{}'",
                customer.getId(), booking.getBookingReference(), problem.getName(), customerCooperative.getName());

        // Dispatch worker selection
        dispatchNextWorker(booking.getId());

        return mapToServiceRequestDto(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceRequestResponseDto getServiceRequestById(UUID requestId, UUID requestingCustomerUserId) {
        Booking booking = bookingRepository.findById(requestId)
                .or(() -> bookingRepository.findByServiceProblemIdOrderByCreatedAtDesc(requestId).stream().findFirst())
                .orElseThrow(() -> new IllegalArgumentException("Service request not found with ID: " + requestId));

        // Enforce ownership authorization: Customer A cannot access Customer B's request
        if (!booking.getCustomer().getUser().getId().equals(requestingCustomerUserId)) {
            throw new AccessDeniedException("Access denied: You are not authorized to view this service request.");
        }

        return mapToServiceRequestDto(booking);
    }

    @Override
    @Transactional
    public ServiceRequestResponseDto cancelServiceRequest(UUID requestId, UUID requestingCustomerUserId) {
        Booking booking = findBookingForUpdate(requestId)
                .or(() -> bookingRepository.findByServiceProblemIdOrderByCreatedAtDesc(requestId).stream().findFirst())
                .orElseThrow(() -> new IllegalArgumentException("Service request not found with ID: " + requestId));

        if (!booking.getCustomer().getUser().getId().equals(requestingCustomerUserId)) {
            throw new AccessDeniedException("Access denied: You are not authorized to cancel this service request.");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel a completed service request.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            return mapToServiceRequestDto(booking);
        }

        // Invalidate any active assignment attempts
        List<Assignment> activeAssignments = assignmentRepository.findByBookingIdAndStatus(requestId, AssignmentStatus.OFFERED);
        for (Assignment a : activeAssignments) {
            a.setStatus(AssignmentStatus.CANCELLED);
            a.setRespondedAt(Instant.now());
            assignmentRepository.save(a);
        }

        BookingStatus oldStatus = booking.getStatus();
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason("Cancelled by customer");
        booking.setAssignedWorker(null);
        Booking saved = bookingRepository.save(booking);
        if (saved != null) {
            booking = saved;
        }

        recordStatusHistory(booking, oldStatus, BookingStatus.CANCELLED, booking.getCustomer().getUser(), "Service request cancelled by customer");

        return mapToServiceRequestDto(booking);
    }

    @Override
    @Transactional
    public BookingResponseDto createBooking(UUID customerUserId, CreateBookingRequestDto request) {
        Customer customer = customerRepository.findByUserId(customerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Customer profile not found for user ID: " + customerUserId));

        LabourCooperative customerCooperative = customer.getCooperative();
        if (customerCooperative == null) {
            throw new IllegalStateException("Customer is not affiliated with a cooperative society. Please select a society first.");
        }

        ServiceCategory serviceCategory = null;
        if (request.getServiceCategoryId() != null) {
            serviceCategory = serviceCategoryRepository.findById(request.getServiceCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Service category not found with ID: " + request.getServiceCategoryId()));
        } else {
            List<ServiceCategory> categories = serviceCategoryRepository.findAll();
            if (!categories.isEmpty()) {
                serviceCategory = categories.get(0);
            } else {
                throw new IllegalStateException("No service categories available in the system.");
            }
        }

        String bookingReference = "BG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Point location = createPoint(request.getLatitude(), request.getLongitude());

        BigDecimal basePrice = serviceCategory.getBasePrice() != null ? serviceCategory.getBasePrice() : new BigDecimal("300.00");
        BigDecimal totalAmount = request.getTotalAmount() != null ? request.getTotalAmount() : basePrice;
        BigDecimal fairWage = request.getFairWageEstimate() != null ? request.getFairWageEstimate() : basePrice;

        Booking booking = Booking.builder()
                .bookingReference(bookingReference)
                .customer(customer)
                .serviceCategory(serviceCategory)
                .location(location)
                .serviceAddress(request.getServiceAddress().trim())
                .scheduledStartTime(request.getScheduledStartTime() != null ? request.getScheduledStartTime() : Instant.now())
                .specialInstructions(request.getSpecialInstructions())
                .timeWindow(request.getTimeWindow() != null ? request.getTimeWindow() : "Standard")
                .totalAmount(totalAmount)
                .fairWageEstimate(fairWage)
                .status(BookingStatus.REQUESTED)
                .build();

        booking = bookingRepository.save(booking);

        recordStatusHistory(booking, null, BookingStatus.REQUESTED, customer.getUser(),
                "Booking created by customer under cooperative society: " + customerCooperative.getName());

        dispatchNextWorker(booking.getId());

        booking = bookingRepository.findById(booking.getId()).orElse(booking);
        return mapToBookingDto(booking);
    }

    @Override
    @Transactional
    public BookingResponseDto setCustomerCooperative(UUID customerUserId, UUID cooperativeId) {
        Customer customer = customerRepository.findByUserId(customerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Customer profile not found for user ID: " + customerUserId));

        LabourCooperative coop = cooperativeRepository.findById(cooperativeId)
                .orElseThrow(() -> new IllegalArgumentException("Cooperative society not found with ID: " + cooperativeId));

        customer.setCooperative(coop);
        customerRepository.save(customer);

        List<Booking> bookings = bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId());
        if (!bookings.isEmpty()) {
            return mapToBookingDto(bookings.get(0));
        }

        return BookingResponseDto.builder()
                .customerId(customer.getId())
                .customerName(customer.getUser().getName())
                .customerCooperativeId(coop.getId())
                .customerCooperativeName(coop.getName())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDto getBookingById(UUID bookingId, UUID requestingUserId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + bookingId));
        return mapToBookingDto(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDto> getCustomerBookings(UUID customerUserId) {
        Customer customer = customerRepository.findByUserId(customerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Customer profile not found for user ID: " + customerUserId));

        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId()).stream()
                .map(this::mapToBookingDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponseDto> getWorkerAssignments(UUID workerUserId) {
        Worker worker = workerRepository.findByUserId(workerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Worker profile not found for user ID: " + workerUserId));

        return assignmentRepository.findByWorkerIdOrderByAssignedAtDesc(worker.getId()).stream()
                .map(this::mapToAssignmentDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssignmentResponseDto getPendingWorkerAssignment(UUID workerUserId) {
        Worker worker = workerRepository.findByUserId(workerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Worker profile not found for user ID: " + workerUserId));

        List<Assignment> pendingList = assignmentRepository.findByWorkerIdAndStatusOrderByAssignedAtDesc(worker.getId(), AssignmentStatus.OFFERED);
        if (pendingList.isEmpty()) {
            return null;
        }
        return mapToAssignmentDto(pendingList.get(0));
    }

    @Override
    @Transactional
    public BookingResponseDto respondToAssignment(UUID workerUserId, UUID assignmentId, RespondAssignmentDto response) {
        Worker worker = workerRepository.findByUserId(workerUserId)
                .orElseThrow(() -> new AccessDeniedException("Worker profile not found for user ID: " + workerUserId));

        if (worker.getUser() == null || worker.getUser().getRole() != UserRole.WORKER) {
            throw new AccessDeniedException("Only authenticated workers can respond to assignment offers.");
        }

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with ID: " + assignmentId));

        if (!assignment.getWorker().getId().equals(worker.getId())) {
            throw new AccessDeniedException("Worker is not authorized to respond to another worker's offer.");
        }

        Booking booking = findBookingForUpdate(assignment.getBooking().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking request has been cancelled by customer.");
        }

        if (booking.getStatus() == BookingStatus.ACCEPTED && assignment.getStatus() != AssignmentStatus.ACCEPTED) {
            throw new IllegalStateException("Booking has already been accepted.");
        }

        if (assignment.getStatus() != AssignmentStatus.OFFERED) {
            throw new IllegalStateException("Assignment offer is no longer valid or has already expired (Status: " + assignment.getStatus() + ").");
        }

        if (assignment.isExpired()) {
            assignment.setStatus(AssignmentStatus.TIMED_OUT);
            assignment.setRespondedAt(Instant.now());
            assignmentRepository.save(assignment);
            dispatchNextWorker(booking.getId());
            throw new IllegalStateException("Assignment offer has expired (30-second window elapsed).");
        }

        boolean accepted = Boolean.TRUE.equals(response.getAccept());

        if (accepted) {
            assignment.setStatus(AssignmentStatus.ACCEPTED);
            assignment.setRespondedAt(Instant.now());
            assignmentRepository.save(assignment);

            BookingStatus oldStatus = booking.getStatus();
            booking.setStatus(BookingStatus.ACCEPTED);
            booking.setAssignedWorker(worker);
            bookingRepository.save(booking);

            recordStatusHistory(booking, oldStatus, BookingStatus.ACCEPTED, worker.getUser(),
                    "Worker " + worker.getUser().getName() + " ACCEPTED the booking request.");
        } else {
            assignment.setStatus(AssignmentStatus.REJECTED);
            assignment.setRespondedAt(Instant.now());
            assignmentRepository.save(assignment);

            BookingStatus oldStatus = booking.getStatus();
            recordStatusHistory(booking, oldStatus, BookingStatus.REQUESTED, worker.getUser(),
                    "Worker " + worker.getUser().getName() + " REJECTED the offer. Finding next available worker in society...");

            dispatchNextWorker(booking.getId());
        }

        Booking updatedBooking = bookingRepository.findById(booking.getId()).orElse(booking);
        return mapToBookingDto(updatedBooking);
    }

    @Override
    @Transactional
    public BookingResponseDto respondToRequest(UUID workerUserId, UUID requestId, RespondAssignmentDto response) {
        Worker worker = workerRepository.findByUserId(workerUserId)
                .orElseThrow(() -> new AccessDeniedException("Worker profile not found for user ID: " + workerUserId));

        if (worker.getUser() == null || worker.getUser().getRole() != UserRole.WORKER) {
            throw new AccessDeniedException("Only authenticated workers can respond to assignment offers.");
        }

        Booking booking = findBookingForUpdate(requestId).orElse(null);
        Assignment activeAssignment = null;

        if (booking != null) {
            activeAssignment = assignmentRepository.findFirstByBookingIdAndStatusOrderByAssignedAtDesc(booking.getId(), AssignmentStatus.OFFERED).orElse(null);
        }

        // Fallback: If requestId is actually a problemId, resolve to the active offer for this worker
        if (booking == null || activeAssignment == null) {
            List<Assignment> offersByProblem = assignmentRepository.findByWorkerIdAndStatusAndProblemId(worker.getId(), AssignmentStatus.OFFERED, requestId);
            if (!offersByProblem.isEmpty()) {
                activeAssignment = offersByProblem.get(0);
                booking = activeAssignment.getBooking();
            } else if (booking == null) {
                booking = bookingRepository.findByServiceProblemIdOrderByCreatedAtDesc(requestId).stream().findFirst().orElse(null);
            }
        }

        if (booking == null) {
            throw new ResourceNotFoundException("Service request not found with ID: " + requestId);
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Service request has been cancelled by customer.");
        }

        if (booking.getStatus() == BookingStatus.ACCEPTED) {
            throw new IllegalStateException("Service request has already been accepted.");
        }

        if (booking.getStatus() == BookingStatus.NO_WORKER_AVAILABLE) {
            throw new IllegalStateException("Service request is closed: no worker available.");
        }

        if (activeAssignment == null) {
            activeAssignment = assignmentRepository.findFirstByBookingIdAndStatusOrderByAssignedAtDesc(booking.getId(), AssignmentStatus.OFFERED)
                    .orElseThrow(() -> new IllegalStateException("No active offer exists for this request (offer may have expired or already been processed)."));
        }

        if (!activeAssignment.getWorker().getId().equals(worker.getId())) {
            throw new AccessDeniedException("Worker is not authorized to respond to another worker's offer.");
        }

        if (activeAssignment.isExpired()) {
            activeAssignment.setStatus(AssignmentStatus.TIMED_OUT);
            activeAssignment.setRespondedAt(Instant.now());
            assignmentRepository.save(activeAssignment);
            dispatchNextWorker(booking.getId());
            throw new IllegalStateException("Assignment offer has expired (30-second window elapsed).");
        }

        boolean accepted = Boolean.TRUE.equals(response.getAccept());

        if (accepted) {
            activeAssignment.setStatus(AssignmentStatus.ACCEPTED);
            activeAssignment.setRespondedAt(Instant.now());
            assignmentRepository.save(activeAssignment);

            BookingStatus oldStatus = booking.getStatus();
            booking.setStatus(BookingStatus.ACCEPTED);
            booking.setAssignedWorker(worker);
            bookingRepository.save(booking);

            recordStatusHistory(booking, oldStatus, BookingStatus.ACCEPTED, worker.getUser(),
                    "Worker " + worker.getUser().getName() + " ACCEPTED the service request.");
        } else {
            activeAssignment.setStatus(AssignmentStatus.REJECTED);
            activeAssignment.setRespondedAt(Instant.now());
            assignmentRepository.save(activeAssignment);

            BookingStatus oldStatus = booking.getStatus();
            recordStatusHistory(booking, oldStatus, BookingStatus.REQUESTED, worker.getUser(),
                    "Worker " + worker.getUser().getName() + " REJECTED the offer. Finding next available worker in society...");

            dispatchNextWorker(booking.getId());
        }

        Booking updatedBooking = bookingRepository.findById(booking.getId()).orElse(booking);
        return mapToBookingDto(updatedBooking);
    }

    @Override
    @Transactional
    public void updateWorkerAvailability(UUID workerUserId, WorkerAvailabilityDto availabilityDto) {
        Worker worker = workerRepository.findByUserId(workerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Worker profile not found for user ID: " + workerUserId));

        if (availabilityDto.getIsAvailable() != null) {
            worker.setAvailable(availabilityDto.getIsAvailable());
        }
        if (availabilityDto.getLatitude() != null && availabilityDto.getLongitude() != null) {
            worker.setCurrentLocation(createPoint(availabilityDto.getLatitude(), availabilityDto.getLongitude()));
        }

        workerRepository.save(worker);
    }

    @Override
    @Transactional
    public boolean dispatchNextWorker(UUID bookingId) {
        Booking booking = findBookingForUpdate(bookingId).orElse(null);
        if (booking == null) {
            return false;
        }

        if (booking.getStatus() == BookingStatus.ACCEPTED ||
            booking.getStatus() == BookingStatus.IN_PROGRESS ||
            booking.getStatus() == BookingStatus.COMPLETED ||
            booking.getStatus() == BookingStatus.CANCELLED) {
            return false;
        }

        LabourCooperative customerCooperative = booking.getCustomer().getCooperative();
        if (customerCooperative == null) {
            return false;
        }

        List<Assignment> previousAssignments = assignmentRepository.findByBookingId(bookingId);
        Set<UUID> attemptedWorkerIds = previousAssignments.stream()
                .map(a -> a.getWorker().getId())
                .collect(Collectors.toSet());

        List<Worker> societyWorkers = workerRepository.findEligibleWorkersByCooperativeSorted(customerCooperative.getId());

        ServiceCategory serviceCategory = booking.getServiceCategory();

        List<Worker> eligibleCandidates = societyWorkers.stream()
                .filter(w -> w.getPrimaryCooperative() != null && customerCooperative.getId().equals(w.getPrimaryCooperative().getId()))
                .filter(w -> !attemptedWorkerIds.contains(w.getId()))
                .filter(Worker::isAvailable)
                .filter(w -> w.getUser() != null && w.getUser().getStatus() == UserStatus.ACTIVE && w.getUser().getRole() == UserRole.WORKER)
                .filter(w -> w.getVerificationStatus() != WorkerVerificationStatus.REJECTED)
                .filter(w -> isWorkerEligibleForService(w, serviceCategory))
                .filter(w -> !isWorkerBusyWithActiveJob(w.getId()))
                .collect(Collectors.toList());

        if (eligibleCandidates.isEmpty()) {
            BookingStatus oldStatus = booking.getStatus();
            booking.setStatus(BookingStatus.NO_WORKER_AVAILABLE);
            booking.setAssignedWorker(null);
            bookingRepository.save(booking);

            recordStatusHistory(booking, oldStatus, BookingStatus.NO_WORKER_AVAILABLE, null,
                    "No remaining eligible available workers found in customer's cooperative society: " + customerCooperative.getName());

            return false;
        }

        Worker selectedWorker = eligibleCandidates.get(0);
        int rank = attemptedWorkerIds.size() + 1;
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(30);

        Assignment assignment = Assignment.builder()
                .booking(booking)
                .worker(selectedWorker)
                .rotationWeightUsed(selectedWorker.getRotationWeight() != null ? selectedWorker.getRotationWeight() : BigDecimal.ONE)
                .rank(rank)
                .status(AssignmentStatus.OFFERED)
                .assignedAt(now)
                .expiresAt(expiresAt)
                .build();

        assignment = assignmentRepository.save(assignment);

        BookingStatus oldStatus = booking.getStatus();
        booking.setStatus(BookingStatus.WAITING_FOR_WORKER);
        booking.setAssignedWorker(selectedWorker);
        bookingRepository.save(booking);

        recordStatusHistory(booking, oldStatus, BookingStatus.WAITING_FOR_WORKER, null,
                "Offered gig (Attempt #" + rank + ") to worker " + selectedWorker.getUser().getName() + " in society: " + customerCooperative.getName());

        // Notify selected worker of offer
        workerNotificationService.notifyWorkerOfOffer(selectedWorker, booking, assignment);

        return true;
    }

    @Scheduled(fixedDelay = 3000)
    @Override
    @Transactional
    public void expirePendingOffersAndDispatchNext() {
        expirePendingOffersAndDispatchNext(Instant.now());
    }

    @Override
    @Transactional
    public void expirePendingOffersAndDispatchNext(Instant now) {
        Instant cutoffTime = now.minusSeconds(30);
        List<Assignment> expiredList = assignmentRepository.findExpiredAssignmentsWithNow(AssignmentStatus.OFFERED, cutoffTime, now);
        if (expiredList == null || expiredList.isEmpty()) {
            expiredList = assignmentRepository.findExpiredAssignments(AssignmentStatus.OFFERED, cutoffTime);
        }

        for (Assignment assignment : expiredList) {
            Booking booking = findBookingForUpdate(assignment.getBooking().getId()).orElse(null);
            if (booking == null) {
                continue;
            }

            if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.ACCEPTED || booking.getStatus() == BookingStatus.COMPLETED) {
                assignment.setStatus(AssignmentStatus.CANCELLED);
                assignment.setRespondedAt(now);
                assignmentRepository.save(assignment);
                continue;
            }

            if (assignment.getStatus() == AssignmentStatus.OFFERED) {
                assignment.setStatus(AssignmentStatus.TIMED_OUT);
                assignment.setRespondedAt(now);
                assignmentRepository.save(assignment);

                recordStatusHistory(booking, booking.getStatus(), BookingStatus.REQUESTED, null,
                        "Worker " + assignment.getWorker().getUser().getName() + " offer TIMED_OUT after 30 seconds timeout.");

                dispatchNextWorker(booking.getId());
            }
        }
    }

    private Optional<Booking> findBookingForUpdate(UUID id) {
        return bookingRepository.findByIdWithLock(id)
                .or(() -> bookingRepository.findById(id));
    }

    private boolean isWorkerEligibleForService(Worker worker, ServiceCategory category) {
        if (category == null) {
            return true;
        }
        if (serviceOfferingRepository != null && serviceOfferingRepository.existsByWorkerIdAndCategoryIdAndIsActiveTrue(worker.getId(), category.getId())) {
            return true;
        }
        String skills = worker.getSkills();
        if (skills != null && !skills.isBlank()) {
            String lowerSkills = skills.toLowerCase();
            String catName = category.getName() != null ? category.getName().toLowerCase() : "";
            String catSlug = category.getSlug() != null ? category.getSlug().toLowerCase() : "";
            return (!catName.isBlank() && lowerSkills.contains(catName)) ||
                   (!catSlug.isBlank() && lowerSkills.contains(catSlug));
        }
        return true;
    }

    private boolean isWorkerBusyWithActiveJob(UUID workerId) {
        if (assignmentRepository.existsByWorkerIdAndStatus(workerId, AssignmentStatus.OFFERED)) {
            return true;
        }
        return bookingRepository.existsByAssignedWorkerIdAndStatusIn(workerId, List.of(BookingStatus.ACCEPTED, BookingStatus.IN_PROGRESS));
    }

    private Point createPoint(Double latitude, Double longitude) {
        double lat = latitude != null ? latitude : 13.0827;
        double lng = longitude != null ? longitude : 80.2707;
        GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326);
        return gf.createPoint(new Coordinate(lng, lat));
    }

    private void recordStatusHistory(Booking booking, BookingStatus fromStatus, BookingStatus toStatus, User changedBy, String notes) {
        BookingStatusHistory history = BookingStatusHistory.builder()
                .booking(booking)
                .fromStatus(fromStatus)
                .toStatus(toStatus)
                .changedBy(changedBy)
                .notes(notes)
                .changedAt(Instant.now())
                .build();
        bookingStatusHistoryRepository.save(history);
    }

    private ServiceRequestResponseDto mapToServiceRequestDto(Booking booking) {
        ServiceRequestResponseDto.ServiceRequestResponseDtoBuilder builder = ServiceRequestResponseDto.builder()
                .requestId(booking.getId())
                .bookingReference(booking.getBookingReference())
                .serviceAddress(booking.getServiceAddress())
                .createdAt(booking.getCreatedAt() != null ? booking.getCreatedAt() : Instant.now());

        String statusStr;
        if (booking.getStatus() == BookingStatus.WAITING_FOR_WORKER || booking.getStatus() == BookingStatus.ASSIGNED) {
            statusStr = "WAITING_FOR_WORKER";
        } else if (booking.getStatus() == BookingStatus.NO_WORKER_AVAILABLE) {
            statusStr = "NO_WORKER_AVAILABLE";
        } else if (booking.getStatus() == BookingStatus.REQUESTED || booking.getStatus() == BookingStatus.SEARCHING_WORKER) {
            statusStr = "SEARCHING_WORKER";
        } else {
            statusStr = booking.getStatus().name();
        }
        builder.status(statusStr);

        if (booking.getLocation() != null) {
            builder.latitude(booking.getLocation().getY())
                    .longitude(booking.getLocation().getX());
        }

        if (booking.getServiceCategory() != null) {
            builder.service(booking.getServiceCategory().getName())
                    .serviceName(booking.getServiceCategory().getName())
                    .serviceId(booking.getServiceCategory().getId());
        }

        if (booking.getServiceProblem() != null) {
            builder.problem(booking.getServiceProblem().getName())
                    .problemName(booking.getServiceProblem().getName())
                    .problemId(booking.getServiceProblem().getId());
        }

        if (booking.getCustomer() != null) {
            Customer c = booking.getCustomer();
            builder.customerId(c.getId());
            if (c.getUser() != null) {
                builder.customerName(c.getUser().getName());
            }
            if (c.getCooperative() != null) {
                builder.societyId(c.getCooperative().getId())
                        .societyName(c.getCooperative().getName());
            }
        }

        if (booking.getAssignedWorker() != null) {
            Worker w = booking.getAssignedWorker();
            String workerIdStr = w.getCooperativeWorkerId() != null ? w.getCooperativeWorkerId() : (w.getId() != null ? w.getId().toString() : "");
            builder.assignedWorker(ServiceRequestResponseDto.WorkerSummaryDto.builder()
                    .workerId(workerIdStr)
                    .name(w.getUser() != null ? w.getUser().getName() : "")
                    .phone(w.getUser() != null ? w.getUser().getPhone() : "")
                    .build());
        }

        Optional<Assignment> activeOfferOpt = assignmentRepository.findFirstByBookingIdAndStatusOrderByAssignedAtDesc(booking.getId(), AssignmentStatus.OFFERED);
        if (activeOfferOpt.isPresent()) {
            Assignment active = activeOfferOpt.get();
            Instant offerExpires = active.getExpiresAt() != null ? active.getExpiresAt() : (active.getAssignedAt() != null ? active.getAssignedAt().plusSeconds(30) : null);
            builder.offerExpiresAt(offerExpires)
                    .attemptNumber(active.getRank());
        }

        return builder.build();
    }

    private BookingResponseDto mapToBookingDto(Booking booking) {
        BookingResponseDto.BookingResponseDtoBuilder builder = BookingResponseDto.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .serviceAddress(booking.getServiceAddress())
                .scheduledStartTime(booking.getScheduledStartTime())
                .scheduledEndTime(booking.getScheduledEndTime())
                .actualStartTime(booking.getActualStartTime())
                .actualEndTime(booking.getActualEndTime())
                .status(booking.getStatus())
                .totalAmount(booking.getTotalAmount())
                .fairWageEstimate(booking.getFairWageEstimate())
                .specialInstructions(booking.getSpecialInstructions())
                .cancellationReason(booking.getCancellationReason())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt());

        if (booking.getLocation() != null) {
            builder.latitude(booking.getLocation().getY())
                    .longitude(booking.getLocation().getX());
        }

        if (booking.getCustomer() != null) {
            Customer c = booking.getCustomer();
            builder.customerId(c.getId());
            if (c.getUser() != null) {
                builder.customerName(c.getUser().getName())
                        .customerPhone(c.getUser().getPhone());
            }
            if (c.getCooperative() != null) {
                builder.customerCooperativeId(c.getCooperative().getId())
                        .customerCooperativeName(c.getCooperative().getName());
            }
        }

        if (booking.getServiceCategory() != null) {
            builder.serviceCategoryId(booking.getServiceCategory().getId())
                    .serviceCategoryName(booking.getServiceCategory().getName());
        }

        if (booking.getAssignedWorker() != null) {
            Worker w = booking.getAssignedWorker();
            builder.assignedWorkerId(w.getId());
            if (w.getUser() != null) {
                builder.assignedWorkerName(w.getUser().getName())
                        .assignedWorkerPhone(w.getUser().getPhone());
            }
        }

        Optional<Assignment> activeOfferOpt = assignmentRepository.findFirstByBookingIdAndStatusOrderByAssignedAtDesc(booking.getId(), AssignmentStatus.OFFERED);
        if (activeOfferOpt.isPresent()) {
            builder.currentAssignment(mapToAssignmentDto(activeOfferOpt.get()));
        }

        return builder.build();
    }

    private AssignmentResponseDto mapToAssignmentDto(Assignment assignment) {
        AssignmentResponseDto.AssignmentResponseDtoBuilder builder = AssignmentResponseDto.builder()
                .id(assignment.getId())
                .bookingId(assignment.getBooking().getId())
                .bookingReference(assignment.getBooking().getBookingReference())
                .status(assignment.getStatus())
                .rank(assignment.getRank())
                .rotationWeightUsed(assignment.getRotationWeightUsed())
                .assignedAt(assignment.getAssignedAt())
                .expiresAt(assignment.getAssignedAt() != null ? assignment.getAssignedAt().plusSeconds(30) : null)
                .respondedAt(assignment.getRespondedAt());

        Booking b = assignment.getBooking();
        if (b != null) {
            builder.serviceAddress(b.getServiceAddress())
                    .specialInstructions(b.getSpecialInstructions());
            if (b.getServiceCategory() != null) {
                builder.serviceCategoryName(b.getServiceCategory().getName());
            }
            if (b.getCustomer() != null && b.getCustomer().getUser() != null) {
                builder.customerId(b.getCustomer().getId())
                        .customerName(b.getCustomer().getUser().getName())
                        .customerPhone(b.getCustomer().getUser().getPhone());
            }
        }

        Worker w = assignment.getWorker();
        if (w != null) {
            builder.workerId(w.getId());
            if (w.getUser() != null) {
                builder.workerName(w.getUser().getName());
            }
            if (w.getPrimaryCooperative() != null) {
                builder.workerCooperativeId(w.getPrimaryCooperative().getId())
                        .workerCooperativeName(w.getPrimaryCooperative().getName());
            }
        }

        return builder.build();
    }
}
