package com.GigGo.entity.profile;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
    name = "admins",
    indexes = {
        @Index(name = "idx_admins_user_id", columnList = "user_id", unique = true)
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = "user")
public class Admin extends BaseEntity {

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Size(max = 100)
    @Column(name = "department", length = 100)
    private String department;

    /**
     * Comma-separated or JSON list of granular system permissions.
     */
    @Column(name = "permissions", columnDefinition = "TEXT")
    private String permissions;

    @Builder.Default
    @Column(name = "is_super_admin", nullable = false)
    private boolean superAdmin = false;
}
