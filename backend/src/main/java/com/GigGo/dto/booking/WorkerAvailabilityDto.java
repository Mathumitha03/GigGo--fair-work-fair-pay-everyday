package com.GigGo.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkerAvailabilityDto {

    private Boolean isAvailable;
    private Double latitude;
    private Double longitude;
}
