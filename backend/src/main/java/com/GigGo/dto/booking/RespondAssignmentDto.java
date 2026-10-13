package com.GigGo.dto.booking;

import jakarta.validation.constraints.NotNull;
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
public class RespondAssignmentDto {

    @NotNull(message = "Accepted status is required")
    private Boolean accept;

    private String notes;
}
