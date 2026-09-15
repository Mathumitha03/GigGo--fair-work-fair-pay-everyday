package com.GigGo.dto.cooperative;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class CreateCooperativeRequestDto {

    @NotBlank(message = "Proposed cooperative society name is required")
    @Size(max = 150)
    private String proposedName;

    @NotBlank(message = "Proposed registration number is required")
    @Size(max = 100)
    private String proposedRegistrationNumber;

    @NotBlank(message = "Proposed region is required")
    @Size(max = 100)
    private String proposedRegion;

    private String proposedAddress;
    private String contactEmail;
    private String contactPhone;
    private String rationale;
    private String supportingDocumentUrl;
}
