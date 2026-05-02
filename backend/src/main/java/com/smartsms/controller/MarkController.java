package com.smartsms.controller;

import com.smartsms.dto.GpaDto;
import com.smartsms.dto.MarkDto;
import com.smartsms.dto.MarkRequestDto;
import com.smartsms.service.MarkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor
public class MarkController {

    private final MarkService markService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<MarkDto> addMark(
            @Valid @RequestBody MarkRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(markService.addMark(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<MarkDto> getMarkById(
            @PathVariable Long id) {
        return ResponseEntity.ok(markService.getMarkById(id));
    }

    @GetMapping("/enrollment/{enrollmentId}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<List<MarkDto>> getByEnrollment(
            @PathVariable Long enrollmentId) {
        return ResponseEntity.ok(
                markService.getMarksByEnrollment(enrollmentId));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<List<MarkDto>> getByStudent(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(
                markService.getMarksByStudent(studentId));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<List<MarkDto>> getByCourse(
            @PathVariable Long courseId) {
        return ResponseEntity.ok(
                markService.getMarksByCourse(courseId));
    }

    @GetMapping("/gpa/enrollment/{enrollmentId}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<GpaDto> getGpaByEnrollment(
            @PathVariable Long enrollmentId) {
        return ResponseEntity.ok(
                markService.calculateGpaByEnrollment(enrollmentId));
    }

    @GetMapping("/gpa/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<GpaDto> getCumulativeGpa(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(
                markService.calculateCumulativeGpa(studentId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<MarkDto> updateMark(
            @PathVariable Long id,
            @Valid @RequestBody MarkRequestDto request) {
        return ResponseEntity.ok(
                markService.updateMark(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<Map<String, String>> deleteMark(
            @PathVariable Long id) {
        markService.deleteMark(id);
        return ResponseEntity.ok(
                Map.of("message", "Mark deleted successfully"));
    }
}