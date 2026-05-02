package com.smartsms.controller;

import com.smartsms.dto.StudentDto;
import com.smartsms.dto.StudentRequestDto;
import com.smartsms.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER','STUDENT')")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/number/{studentNumber}")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<StudentDto> getByStudentNumber(
            @PathVariable String studentNumber) {
        return ResponseEntity.ok(
                studentService.getStudentByStudentNumber(studentNumber));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','LECTURER')")
    public ResponseEntity<List<StudentDto>> searchStudents(
            @RequestParam String keyword) {
        return ResponseEntity.ok(studentService.searchStudents(keyword));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDto> createStudent(
            @Valid @RequestBody StudentRequestDto request) {
        StudentDto created = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDto> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequestDto request) {
        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteStudent(
            @PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(
                Map.of("message", "Student deactivated successfully"));
    }
}