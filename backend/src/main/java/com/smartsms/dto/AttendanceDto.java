package com.smartsms.dto;

import com.smartsms.entity.Attendance;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDto {

    private Long id;

    // Enrollment info
    private Long enrollmentId;

    // Student info
    private Long studentId;
    private String studentName;
    private String studentNumber;

    // Course info
    private Long courseId;
    private String courseName;
    private String courseCode;

    // Attendance info
    private LocalDate date;
    private Attendance.AttendanceStatus status;
    private String remarks;
    private String markedByName;
    private LocalDateTime createdAt;

    public static AttendanceDto fromEntity(Attendance attendance) {
        AttendanceDto dto = AttendanceDto.builder()
                .id(attendance.getId())
                .enrollmentId(attendance.getEnrollment().getId())
                .studentId(attendance.getEnrollment()
                        .getStudent().getId())
                .studentName(attendance.getEnrollment()
                        .getStudent().getUser().getName())
                .studentNumber(attendance.getEnrollment()
                        .getStudent().getStudentNumber())
                .courseId(attendance.getEnrollment()
                        .getCourse().getId())
                .courseName(attendance.getEnrollment()
                        .getCourse().getName())
                .courseCode(attendance.getEnrollment()
                        .getCourse().getCode())
                .date(attendance.getDate())
                .status(attendance.getStatus())
                .remarks(attendance.getRemarks())
                .createdAt(attendance.getCreatedAt())
                .build();

        if (attendance.getMarkedBy() != null) {
            dto.setMarkedByName(attendance.getMarkedBy().getName());
        }

        return dto;
    }
}