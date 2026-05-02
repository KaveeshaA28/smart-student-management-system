package com.smartsms.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GpaDto {

    private Long studentId;
    private String studentName;
    private String studentNumber;

    // Per course GPA
    private Long courseId;
    private String courseName;
    private String courseCode;
    private Integer courseCredits;
    private Double courseGpa;
    private String courseGrade;

    // All marks for this enrollment
    private List<MarkDto> marks;

    // Cumulative GPA across all courses
    private Double cumulativeGpa;
    private Integer totalCredits;
}