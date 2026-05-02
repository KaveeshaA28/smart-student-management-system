package com.smartsms.dto;

import com.smartsms.entity.Mark;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarkDto {

    private Long id;
    private Long enrollmentId;
    private Long studentId;
    private String studentName;
    private String studentNumber;
    private Long courseId;
    private String courseName;
    private String courseCode;
    private Mark.AssessmentType assessmentType;
    private Double marksObtained;
    private Double maxMarks;
    private Double percentage;
    private String grade;
    private Double gpaPoints;
    private String remarks;
    private LocalDateTime createdAt;

    public static MarkDto fromEntity(Mark mark) {
        double percentage = (mark.getMarksObtained() /
                mark.getMaxMarks()) * 100;

        return MarkDto.builder()
                .id(mark.getId())
                .enrollmentId(mark.getEnrollment().getId())
                .studentId(mark.getEnrollment().getStudent().getId())
                .studentName(mark.getEnrollment()
                        .getStudent().getUser().getName())
                .studentNumber(mark.getEnrollment()
                        .getStudent().getStudentNumber())
                .courseId(mark.getEnrollment().getCourse().getId())
                .courseName(mark.getEnrollment().getCourse().getName())
                .courseCode(mark.getEnrollment().getCourse().getCode())
                .assessmentType(mark.getAssessmentType())
                .marksObtained(mark.getMarksObtained())
                .maxMarks(mark.getMaxMarks())
                .percentage(Math.round(percentage * 100.0) / 100.0)
                .grade(mark.getGrade())
                .gpaPoints(mark.getGpaPoints())
                .remarks(mark.getRemarks())
                .createdAt(mark.getCreatedAt())
                .build();
    }
}