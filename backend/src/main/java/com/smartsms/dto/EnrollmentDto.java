package com.smartsms.dto;

import com.smartsms.entity.Enrollment;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDto {

    private Long id;

    // Student info
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentNumber;

    // Course info
    private Long courseId;
    private String courseName;
    private String courseCode;
    private Integer courseCredits;

    // Enrollment info
    private LocalDate enrolledDate;
    private Enrollment.EnrollmentStatus status;
    private LocalDateTime createdAt;

    public static EnrollmentDto fromEntity(Enrollment enrollment) {
        return EnrollmentDto.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudent().getId())
                .studentName(enrollment.getStudent().getUser().getName())
                .studentEmail(enrollment.getStudent().getUser().getEmail())
                .studentNumber(enrollment.getStudent().getStudentNumber())
                .courseId(enrollment.getCourse().getId())
                .courseName(enrollment.getCourse().getName())
                .courseCode(enrollment.getCourse().getCode())
                .courseCredits(enrollment.getCourse().getCredits())
                .enrolledDate(enrollment.getEnrolledDate())
                .status(enrollment.getStatus())
                .createdAt(enrollment.getCreatedAt())
                .build();
    }
}