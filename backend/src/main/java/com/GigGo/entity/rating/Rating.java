package com.GigGo.entity.rating;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.booking.Booking;
import com.GigGo.entity.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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
    name = "ratings",
    indexes = {
        @Index(name = "idx_ratings_booking", columnList = "booking_id", unique = true),
        @Index(name = "idx_ratings_ratee", columnList = "ratee_id"),
        @Index(name = "idx_ratings_rater", columnList = "rater_id")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"booking", "rater", "ratee"})
public class Rating extends BaseEntity {

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rater_id", nullable = false)
    private User rater;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ratee_id", nullable = false)
    private User ratee;

    @NotNull
    @Min(1)
    @Max(5)
    @Column(name = "score", nullable = false)
    private Integer score;

    @Min(1)
    @Max(5)
    @Column(name = "aspect_punctuality")
    private Integer aspectPunctuality;

    @Min(1)
    @Max(5)
    @Column(name = "aspect_quality")
    private Integer aspectQuality;

    @Min(1)
    @Max(5)
    @Column(name = "aspect_behaviour")
    private Integer aspectBehaviour;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Builder.Default
    @Column(name = "is_public", nullable = false)
    private boolean isPublic = true;
}
