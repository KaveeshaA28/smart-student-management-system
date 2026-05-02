package com.smartsms.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceStatsDto {

    private Long studentId;
    private String studentName;
    private String studentNumber;
    private Long courseId;
    private String courseName;

    private long totalClasses;
    private long present;
    private long absent;
    private long late;
    private long excused;
    private double attendancePercentage;
}