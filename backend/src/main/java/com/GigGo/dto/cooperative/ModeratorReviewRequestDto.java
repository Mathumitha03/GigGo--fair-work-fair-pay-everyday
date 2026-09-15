package com.GigGo.dto.cooperative;

import com.GigGo.enums.MembershipStatus;
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
public class ModeratorReviewRequestDto {

    /**
     * ACTIVE (to approve) or REJECTED
     */
    @NotNull(message = "Review status (ACTIVE to approve, or REJECTED) is required")
    private MembershipStatus status;

    private String membershipNumber;
    private String rejectionReason;
}
