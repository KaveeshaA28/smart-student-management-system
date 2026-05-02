package com.smartsms.service;

import com.smartsms.dto.EnrollmentDto;
import com.smartsms.dto.EnrollmentRequestDto;
import com.smartsms.entity.Enrollment;

import java.util.List;

public interface EnrollmentService {
    EnrollmentDto enrollStudent(EnrollmentRequestDto request);

    EnrollmentDto getEnrollmentById(Long id);

    List<EnrollmentDto> getAllEnrollments();

    List<EnrollmentDto> getEnrollmentsByStudent(Long studentId);

    List<EnrollmentDto> getEnrollmentsByCourse(Long courseId);

    EnrollmentDto updateStatus(Long id, Enrollment.EnrollmentStatus status);

    void dropEnrollment(Long id);
}