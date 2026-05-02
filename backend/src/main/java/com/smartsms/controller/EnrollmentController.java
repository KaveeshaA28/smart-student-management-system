package com.smartsms.controller;

import com.smartsms.dto.EnrollmentDto;
import com.smartsms.dto.EnrollmentRequestDto;
import com.smartsms.entity.Enrollment;
import com.smartsms.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<List<EnrollmentDto>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentService.getAllEnrollments());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<EnrollmentDto> getEnrollmentById(
            @PathVariable Long id) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentById(id));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<List<EnrollmentDto>> getByStudent(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(
                enrollmentService.getEnrollmentsByStudent(studentId));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<List<EnrollmentDto>> getByCourse(
            @PathVariable Long courseId) {
        return ResponseEntity.ok(
                enrollmentService.getEnrollmentsByCourse(courseId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnrollmentDto> enrollStudent(
            @Valid @RequestBody EnrollmentRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(enrollmentService.enrollStudent(request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<EnrollmentDto> updateStatus(
            @PathVariable Long id,
            @RequestParam Enrollment.EnrollmentStatus status) {
        return ResponseEntity.ok(
                enrollmentService.updateStatus(id, status));
    }

    @PatchMapping("/{id}/drop")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> dropEnrollment(
            @PathVariable Long id) {
        enrollmentService.dropEnrollment(id);
        return ResponseEntity.ok(
                Map.of("message", "Student dropped from course successfully"));
    }
}