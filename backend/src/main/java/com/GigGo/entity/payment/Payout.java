package com.GigGo.entity.payment;

import com.GigGo.entity.common.BaseEntity;
import com.GigGo.entity.cooperative.LabourCooperative;
import com.GigGo.entity.profile.Worker;
import com.GigGo.enums.PayoutStatus;
import com.GigGo.enums.PayoutType;
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
import java.time.Instant;

@Entity
@Table(
    name = "payouts",
    indexes = {
        @Index(name = "idx_payouts_worker", columnList = "worker_id"),
        @Index(name = "idx_payouts_cooperative", columnList = "cooperative_id"),
        @Index(name = "idx_payouts_status", columnList = "status"),
        @Index(name = "idx_payouts_settled_at", columnList = "settled_at")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"worker", "cooperative"})
public class Payout extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id")
    private Worker worker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooperative_id")
    private LabourCooperative cooperative;

    @NotNull
    @DecimalMin(value = "0.00")
    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @NotNull
    @Builder.Default
    @Column(name = "currency", nullable = false, length = 10)
    private String currency = "INR";

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payout_type", nullable = false, length = 30)
    private PayoutType payoutType;

    @NotNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private PayoutStatus status = PayoutStatus.PENDING;

    @Size(max = 100)
    @Column(name = "utr_reference", length = 100)
    private String utrReference;

    @Size(max = 100)
    @Column(name = "razorpay_payout_id", length = 100)
    private String razorpayPayoutId;

    @Column(name = "settled_at")
    private Instant settledAt;

    @Column(name = "failure_reason", length = 300)
    private String failureReason;
}
