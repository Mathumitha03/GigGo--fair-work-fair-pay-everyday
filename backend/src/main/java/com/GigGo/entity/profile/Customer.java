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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;
import org.locationtech.jts.geom.Point;

@Entity
@Table(
    name = "customers",
    indexes = {
        @Index(name = "idx_customers_user_id", columnList = "user_id", unique = true),
        @Index(name = "idx_customers_city", columnList = "city")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = "user")
public class Customer extends BaseEntity {

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Size(max = 255)
    @Column(name = "default_address")
    private String defaultAddress;

    @Size(max = 255)
    @Column(name = "address_line_2")
    private String addressLine2;

    @Size(max = 100)
    @Column(name = "city", length = 100)
    private String city;

    @Size(max = 100)
    @Column(name = "state", length = 100)
    private String state;

    @Size(max = 20)
    @Column(name = "postal_code", length = 20)
    private String postalCode;

    /**
     * Default household location coordinates (PostGIS Point, SRID 4326).
     */
    @Column(name = "location", columnDefinition = "geometry(Point, 4326)")
    private Point location;

    /**
     * Comma-separated or JSON list of preferred service category tags.
     */
    @Column(name = "preferred_services", columnDefinition = "TEXT")
    private String preferredServices;

    @Column(name = "emergency_contact", length = 20)
    private String emergencyContact;
}
