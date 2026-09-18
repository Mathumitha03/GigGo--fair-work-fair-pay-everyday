package com.GigGo.entity.cooperative;

import com.GigGo.entity.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(
    name = "labour_cooperatives",
    indexes = {
        @Index(name = "idx_cooperatives_reg_num", columnList = "registration_number", unique = true),
        @Index(name = "idx_cooperatives_region", columnList = "region")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString
public class LabourCooperative extends BaseEntity {

    @NotBlank
    @Size(max = 150)
    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @NotBlank
    @Size(max = 100)
    @Column(name = "registration_number", nullable = false, unique = true, length = 100)
    private String registrationNumber;

    @NotBlank
    @Size(max = 100)
    @Column(name = "region", nullable = false, length = 100)
    private String region;

    @Column(name = "address", length = 300)
    private String address;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    /**
     * Default cooperative retention/commission percentage (e.g. 5.00 for 5%).
     */
    @NotNull
    @DecimalMin(value = "0.00")
    @DecimalMax(value = "100.00")
    @Builder.Default
    @Column(name = "commission_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal commissionRate = new BigDecimal("5.00");

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "bank_account_details", columnDefinition = "TEXT")
    private String bankAccountDetails;
}
