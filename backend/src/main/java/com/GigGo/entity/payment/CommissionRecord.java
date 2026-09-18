package com.GigGo.entity.payment;

import com.GigGo.entity.common.BaseEntity;
import com.GigGo.entity.cooperative.LabourCooperative;
import com.GigGo.enums.CommissionStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
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
    name = "commission_records",
    indexes = {
        @Index(name = "idx_comm_transaction", columnList = "transaction_id", unique = true),
        @Index(name = "idx_comm_cooperative", columnList = "cooperative_id"),
        @Index(name = "idx_comm_status", columnList = "status")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"transaction", "cooperative"})
public class CommissionRecord extends BaseEntity {

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false, unique = true)
    private Transaction transaction;

    /**
     * Direct foreign key to LabourCooperative for efficient aggregation and reporting,
     * avoiding costly multi-table joins across Transaction -> Booking -> ServiceOffering -> Worker -> Cooperative.
     */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooperative_id", nullable = false)
    private LabourCooperative cooperative;

    @NotNull
    @DecimalMin(value = "0.00")
    @Column(name = "commission_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal commissionAmount;

    @NotNull
    @DecimalMin(value = "0.00")
    @Column(name = "commission_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal commissionRate;

    @DecimalMin(value = "0.00")
    @Column(name = "platform_fee", precision = 12, scale = 2)
    private BigDecimal platformFee;

    @DecimalMin(value = "0.00")
    @Column(name = "cooperative_share", precision = 12, scale = 2)
    private BigDecimal cooperativeShare;

    @DecimalMin(value = "0.00")
    @Column(name = "worker_share", precision = 12, scale = 2)
    private BigDecimal workerShare;

    @NotNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private CommissionStatus status = CommissionStatus.ACCRUED;
}
