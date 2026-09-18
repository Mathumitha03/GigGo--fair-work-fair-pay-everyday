package com.GigGo.entity.profile;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.common.BaseEntity;
import com.GigGo.entity.cooperative.LabourCooperative;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(
    name = "cooperative_managers",
    indexes = {
        @Index(name = "idx_coop_managers_user_id", columnList = "user_id", unique = true),
        @Index(name = "idx_coop_managers_coop_id", columnList = "cooperative_id")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"user", "cooperative"})
public class CooperativeManager extends BaseEntity {

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooperative_id", nullable = false)
    private LabourCooperative cooperative;

    @Size(max = 100)
    @Column(name = "designation", length = 100)
    private String designation;

    @Size(max = 50)
    @Column(name = "employee_code", length = 50)
    private String employeeCode;
}
