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

    public String getProposedName() {
        return proposedName;
    }

    public void setProposedName(String proposedName) {
        this.proposedName = proposedName;
    }

    public String getProposedRegistrationNumber() {
        return proposedRegistrationNumber;
    }

    public void setProposedRegistrationNumber(String proposedRegistrationNumber) {
        this.proposedRegistrationNumber = proposedRegistrationNumber;
    }

    public String getProposedRegion() {
        return proposedRegion;
    }

    public void setProposedRegion(String proposedRegion) {
        this.proposedRegion = proposedRegion;
    }

    public String getProposedAddress() {
        return proposedAddress;
    }

    public void setProposedAddress(String proposedAddress) {
        this.proposedAddress = proposedAddress;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getRationale() {
        return rationale;
    }

    public void setRationale(String rationale) {
        this.rationale = rationale;
    }

    public String getSupportingDocumentUrl() {
        return supportingDocumentUrl;
    }

    public void setSupportingDocumentUrl(String supportingDocumentUrl) {
        this.supportingDocumentUrl = supportingDocumentUrl;
    }
}
