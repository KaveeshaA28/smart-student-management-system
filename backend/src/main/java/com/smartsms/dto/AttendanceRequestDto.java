package com.smartsms.dto;

import com.smartsms.entity.Attendance;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AttendanceRequestDto {

    @NotNull(message = "Enrollment ID is required")
    private Long enrollmentId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Status is required")
    private Attendance.AttendanceStatus status;

    private String remarks;
}