package com.GigGo.entity.support;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.common.BaseEntity;
import com.GigGo.enums.TicketPriority;
import com.GigGo.enums.TicketStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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

import java.time.Instant;

@Entity
@Table(
    name = "support_tickets",
    indexes = {
        @Index(name = "idx_tickets_number", columnList = "ticket_number", unique = true),
        @Index(name = "idx_tickets_raised_by", columnList = "raised_by_id"),
        @Index(name = "idx_tickets_status", columnList = "status"),
        @Index(name = "idx_tickets_assigned_to", columnList = "assigned_to_id")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"raisedBy", "assignedTo"})
public class SupportTicket extends BaseEntity {

    @NotBlank
    @Size(max = 64)
    @Column(name = "ticket_number", nullable = false, unique = true, length = 64)
    private String ticketNumber;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raised_by_id", nullable = false)
    private User raisedBy;

    @NotBlank
    @Size(max = 200)
    @Column(name = "subject", nullable = false, length = 200)
    private String subject;

    @NotBlank
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 20)
    private TicketPriority priority = TicketPriority.MEDIUM;

    @NotNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private TicketStatus status = TicketStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @Column(name = "resolved_at")
    private Instant resolvedAt;
}
