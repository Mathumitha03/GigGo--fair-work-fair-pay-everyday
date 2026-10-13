package com.GigGo.service.impl;

import com.GigGo.entity.booking.Assignment;
import com.GigGo.entity.booking.Booking;
import com.GigGo.entity.notification.Notification;
import com.GigGo.entity.profile.Worker;
import com.GigGo.enums.NotificationChannel;
import com.GigGo.enums.NotificationStatus;
import com.GigGo.repository.NotificationRepository;
import com.GigGo.service.WorkerNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkerNotificationServiceImpl implements WorkerNotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public void notifyWorkerOfOffer(Worker worker, Booking booking, Assignment assignment) {
        if (worker == null || worker.getUser() == null || booking == null) {
            return;
        }

        try {
            String serviceName = booking.getServiceCategory() != null ? booking.getServiceCategory().getName() : "General";
            String problemName = booking.getServiceProblem() != null ? booking.getServiceProblem().getName() : "Service Request";
            Instant expiresAt = assignment != null ? assignment.getExpiresAt() : Instant.now().plusSeconds(30);

            String title = "New Gig Offer: " + serviceName;
            String message = String.format("New gig offer #%s available for problem: %s. You have 30 seconds to accept.",
                    booking.getBookingReference(), problemName);

            String safeAddress = booking.getServiceAddress() != null ? booking.getServiceAddress().replace("\"", "\\\"") : "";
            String metadataJson = String.format(
                    "{\"requestId\":\"%s\",\"assignmentId\":\"%s\",\"service\":\"%s\",\"problem\":\"%s\",\"expiresAt\":\"%s\",\"attempt\":%d,\"address\":\"%s\"}",
                    booking.getId(),
                    assignment != null ? assignment.getId() : "",
                    serviceName,
                    problemName,
                    expiresAt,
                    assignment != null ? assignment.getRank() : 1,
                    safeAddress
            );

            Notification notification = Notification.builder()
                    .user(worker.getUser())
                    .channel(NotificationChannel.PUSH)
                    .title(title)
                    .message(message)
                    .status(NotificationStatus.DELIVERED)
                    .metadataJson(metadataJson)
                    .build();

            notificationRepository.save(notification);

            log.info("DISPATCH NOTIFICATION: Delivered offer for request {} (attempt #{}) to worker {} (Cooperative Worker ID: {}) expiring at {}",
                    booking.getId(),
                    assignment != null ? assignment.getRank() : 1,
                    worker.getUser().getName(),
                    worker.getCooperativeWorkerId(),
                    expiresAt);
        } catch (Exception e) {
            log.error("Failed to persist notification for worker {}: {}", worker.getId(), e.getMessage());
            // Never break assignment dispatch on notification failure
        }
    }
}
