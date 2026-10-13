package com.GigGo.repository;

import com.GigGo.entity.booking.Booking;
import com.GigGo.enums.BookingStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Optional<Booking> findByBookingReference(String bookingReference);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Booking b WHERE b.id = :id")
    Optional<Booking> findByIdWithLock(@Param("id") UUID id);

    List<Booking> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);

    List<Booking> findByAssignedWorkerIdOrderByCreatedAtDesc(UUID workerId);

    List<Booking> findByStatus(BookingStatus status);

    boolean existsByAssignedWorkerIdAndStatusIn(UUID workerId, List<BookingStatus> statuses);

    @Query("SELECT b FROM Booking b WHERE b.customer.cooperative.id = :cooperativeId ORDER BY b.createdAt DESC")
    List<Booking> findByCustomerCooperativeId(@Param("cooperativeId") UUID cooperativeId);

    List<Booking> findByServiceProblemIdOrderByCreatedAtDesc(UUID serviceProblemId);
}
