package com.GigGo.entity.service;

import com.GigGo.entity.common.BaseEntity;
import com.GigGo.entity.cooperative.LabourCooperative;
import com.GigGo.entity.profile.Worker;
import com.GigGo.enums.PricingType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
    name = "service_offerings",
    indexes = {
        @Index(name = "idx_svc_off_worker", columnList = "worker_id"),
        @Index(name = "idx_svc_off_cat", columnList = "category_id"),
        @Index(name = "idx_svc_off_coop", columnList = "cooperative_id"),
        @Index(name = "idx_svc_off_active", columnList = "is_active")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"worker", "category", "cooperative"})
public class ServiceOffering extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ServiceCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooperative_id")
    private LabourCooperative cooperative;

    @NotBlank
    @Size(max = 150)
    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "pricing_type", nullable = false, length = 30)
    private PricingType pricingType = PricingType.HOURLY;

    @DecimalMin(value = "0.00")
    @Column(name = "hourly_rate", precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @DecimalMin(value = "0.00")
    @Column(name = "fixed_price", precision = 10, scale = 2)
    private BigDecimal fixedPrice;

    @Builder.Default
    @Column(name = "min_duration_minutes")
    private Integer minDurationMinutes = 60;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
}
