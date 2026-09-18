package com.GigGo.entity.notification;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.common.BaseEntity;
import com.GigGo.enums.IVROutcome;
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

@Entity
@Table(
    name = "ivr_interaction_logs",
    indexes = {
        @Index(name = "idx_ivr_call_sid", columnList = "call_sid"),
        @Index(name = "idx_ivr_user", columnList = "user_id"),
        @Index(name = "idx_ivr_phone", columnList = "phone_number")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = "user")
public class IVRInteractionLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank
    @Size(max = 100)
    @Column(name = "call_sid", nullable = false, length = 100)
    private String callSid;

    @NotBlank
    @Size(max = 20)
    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Size(max = 100)
    @Column(name = "flow_step", length = 100)
    private String flowStep;

    @Size(max = 50)
    @Column(name = "dtmf_input", length = 50)
    private String dtmfInput;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "outcome", nullable = false, length = 30)
    private IVROutcome outcome;

    @Size(max = 500)
    @Column(name = "recording_url", length = 500)
    private String recordingUrl;

    @Builder.Default
    @Column(name = "duration_seconds")
    private Integer durationSeconds = 0;
}
