package com.smartsms.controller;

import com.smartsms.dto.AttendanceDto;
import com.smartsms.dto.AttendanceRequestDto;
import com.smartsms.dto.AttendanceStatsDto;
import com.smartsms.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<AttendanceDto> markAttendance(
            @Valid @RequestBody AttendanceRequestDto request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attendanceService.markAttendance(
                    request, authentication.getName()));
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<List<AttendanceDto>> markBulkAttendance(
            @RequestBody List<AttendanceRequestDto> requests,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attendanceService.markBulkAttendance(
                    requests, authentication.getName()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<AttendanceDto> getAttendanceById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            attendanceService.getAttendanceById(id));
    }

    @GetMapping("/enrollment/{enrollmentId}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<List<AttendanceDto>> getByEnrollment(
            @PathVariable Long enrollmentId) {
        return ResponseEntity.ok(
            attendanceService.getAttendanceByEnrollment(enrollmentId));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<List<AttendanceDto>> getByCourse(
            @PathVariable Long courseId) {
        return ResponseEntity.ok(
            attendanceService.getAttendanceByCourse(courseId));
    }

    @GetMapping("/course/{courseId}/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<List<AttendanceDto>> getByCourseAndDate(
            @PathVariable Long courseId,
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {
        return ResponseEntity.ok(
            attendanceService.getAttendanceByCourseAndDate(
                courseId, date));
    }

    @GetMapping("/stats/enrollment/{enrollmentId}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<AttendanceStatsDto> getStats(
            @PathVariable Long enrollmentId) {
        return ResponseEntity.ok(
            attendanceService.getAttendanceStats(enrollmentId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<AttendanceDto> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRequestDto request) {
        return ResponseEntity.ok(
            attendanceService.updateAttendance(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteAttendance(
            @PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok(
            Map.of("message", "Attendance deleted successfully"));
    }
}