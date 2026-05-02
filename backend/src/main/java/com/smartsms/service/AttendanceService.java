package com.smartsms.service;

import com.smartsms.dto.AttendanceDto;
import com.smartsms.dto.AttendanceRequestDto;
import com.smartsms.dto.AttendanceStatsDto;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    AttendanceDto markAttendance(
            AttendanceRequestDto request, String markedByEmail);

    List<AttendanceDto> markBulkAttendance(
            List<AttendanceRequestDto> requests, String markedByEmail);

    AttendanceDto getAttendanceById(Long id);

    List<AttendanceDto> getAttendanceByEnrollment(Long enrollmentId);

    List<AttendanceDto> getAttendanceByCourseAndDate(
            Long courseId, LocalDate date);

    List<AttendanceDto> getAttendanceByCourse(Long courseId);

    AttendanceDto updateAttendance(
            Long id, AttendanceRequestDto request);

    AttendanceStatsDto getAttendanceStats(Long enrollmentId);

    void deleteAttendance(Long id);
}