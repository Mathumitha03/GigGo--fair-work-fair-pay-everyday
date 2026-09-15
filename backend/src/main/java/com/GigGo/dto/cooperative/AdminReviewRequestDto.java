package com.GigGo.dto.cooperative;

import com.GigGo.enums.CooperativeRequestStatus;
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
public class AdminReviewRequestDto {

    /**
     * APPROVED or REJECTED
     */
    @NotNull(message = "Review status (APPROVED or REJECTED) is required")
    private CooperativeRequestStatus status;

    private String adminNotes;
}
