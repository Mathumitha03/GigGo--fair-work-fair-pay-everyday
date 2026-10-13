package com.GigGo.service;

import com.GigGo.entity.booking.Assignment;
import com.GigGo.entity.booking.Booking;
import com.GigGo.entity.profile.Worker;

public interface WorkerNotificationService {

    void notifyWorkerOfOffer(Worker worker, Booking booking, Assignment assignment);
}
