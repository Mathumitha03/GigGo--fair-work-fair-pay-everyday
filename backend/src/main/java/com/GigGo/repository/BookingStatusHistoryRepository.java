package com.GigGo.repository;

import com.GigGo.entity.booking.BookingStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookingStatusHistoryRepository extends JpaRepository<BookingStatusHistory, UUID> {

    List<BookingStatusHistory> findByBookingIdOrderByChangedAtDesc(UUID bookingId);
}
