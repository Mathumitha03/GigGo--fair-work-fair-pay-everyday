package com.GigGo.entity.payment;

import com.GigGo.entity.booking.Booking;
import com.GigGo.entity.common.BaseEntity;
import com.GigGo.entity.profile.Customer;
import com.GigGo.enums.PaymentMethod;
import com.GigGo.enums.TransactionStatus;
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
    name = "transactions",
    indexes = {
        @Index(name = "idx_trans_booking", columnList = "booking_id"),
        @Index(name = "idx_trans_customer", columnList = "customer_id"),
        @Index(name = "idx_trans_razorpay_ref", columnList = "razorpay_reference"),
        @Index(name = "idx_trans_status", columnList = "status"),
        @Index(name = "idx_trans_paid_at", columnList = "paid_at")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"booking", "customer"})
public class Transaction extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Size(max = 100)
    @Column(name = "razorpay_payment_id", length = 100)
    private String razorpayPaymentId;

    @Size(max = 100)
    @Column(name = "razorpay_order_id", length = 100)
    private String razorpayOrderId;

    @Size(max = 255)
    @Column(name = "razorpay_signature", length = 255)
    private String razorpaySignature;

    @Size(max = 100)
    @Column(name = "razorpay_reference", length = 100)
    private String razorpayReference;

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
    @Column(name = "payment_method", nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @NotNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private TransactionStatus status = TransactionStatus.INITIATED;

    @Column(name = "paid_at")
    private Instant paidAt;

    @Column(name = "failure_reason", length = 300)
    private String failureReason;
}
