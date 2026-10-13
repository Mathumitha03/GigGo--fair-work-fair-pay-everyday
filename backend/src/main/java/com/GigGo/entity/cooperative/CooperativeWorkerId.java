package com.GigGo.entity.cooperative;

import com.GigGo.entity.common.BaseEntity;
import com.GigGo.enums.CooperativeWorkerIdStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(
    name = "cooperative_worker_ids",
    indexes = {
        @Index(name = "idx_cooperative_worker_ids_worker_id", columnList = "worker_id", unique = true),
        @Index(name = "idx_cooperative_worker_ids_status", columnList = "status")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class CooperativeWorkerId extends BaseEntity {

    @NotBlank
    @Column(name = "worker_id", nullable = false, unique = true, length = 20)
    private String workerId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private CooperativeWorkerIdStatus status = CooperativeWorkerIdStatus.AVAILABLE;
}
