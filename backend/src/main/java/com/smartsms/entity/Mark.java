package com.smartsms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "marks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @Enumerated(EnumType.STRING)
    @Column(name = "assessment_type", nullable = false)
    private AssessmentType assessmentType;

    @Column(name = "marks_obtained", nullable = false)
    private Double marksObtained;

    @Builder.Default
    @Column(name = "max_marks", nullable = false)
    private Double maxMarks = 100.0;

    @Column(length = 5)
    private String grade;

    @Column(name = "gpa_points")
    private Double gpaPoints;

    @Column(length = 255)
    private String remarks;

    @Column(name = "created_at", updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

    public enum AssessmentType {
        ASSIGNMENT, MIDTERM, FINAL, QUIZ, PROJECT
    }
}