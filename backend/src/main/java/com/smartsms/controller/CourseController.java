package com.smartsms.controller;

import com.smartsms.dto.CourseDto;
import com.smartsms.dto.CourseRequestDto;
import com.smartsms.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<List<CourseDto>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<List<CourseDto>> getActiveCourses() {
        return ResponseEntity.ok(courseService.getActiveCourses());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/code/{code}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<CourseDto> getCourseByCode(
            @PathVariable String code) {
        return ResponseEntity.ok(courseService.getCourseByCode(code));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<List<CourseDto>> searchCourses(
            @RequestParam String keyword) {
        return ResponseEntity.ok(courseService.searchCourses(keyword));
    }

    @GetMapping("/lecturer/{lecturerId}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<List<CourseDto>> getCoursesByLecturer(
            @PathVariable Long lecturerId) {
        return ResponseEntity.ok(
            courseService.getCoursesByLecturer(lecturerId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseDto> createCourse(
            @Valid @RequestBody CourseRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(courseService.createCourse(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseDto> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequestDto request) {
        return ResponseEntity.ok(courseService.updateCourse(id, request));
    }

    @PatchMapping("/{courseId}/assign-lecturer/{lecturerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseDto> assignLecturer(
            @PathVariable Long courseId,
            @PathVariable Long lecturerId) {
        return ResponseEntity.ok(
            courseService.assignLecturer(courseId, lecturerId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteCourse(
            @PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(
            Map.of("message", "Course deactivated successfully"));
    }
}