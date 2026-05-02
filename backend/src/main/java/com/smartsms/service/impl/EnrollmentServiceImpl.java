package com.smartsms.service.impl;

import com.smartsms.dto.EnrollmentDto;
import com.smartsms.dto.EnrollmentRequestDto;
import com.smartsms.entity.*;
import com.smartsms.exception.ResourceNotFoundException;
import com.smartsms.repository.*;
import com.smartsms.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    @Override
    public EnrollmentDto enrollStudent(EnrollmentRequestDto request) {

        // Check already enrolled
        if (enrollmentRepository.existsByStudentIdAndCourseId(
                request.getStudentId(), request.getCourseId())) {
            throw new RuntimeException(
                    "Student is already enrolled in this course");
        }

        Student student = studentRepository
                .findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student", "id", request.getStudentId()));

        Course course = courseRepository
                .findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course", "id", request.getCourseId()));

        if (!course.getActive()) {
            throw new RuntimeException(
                    "Cannot enroll in an inactive course");
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .status(Enrollment.EnrollmentStatus.ACTIVE)
                .build();

        enrollmentRepository.save(enrollment);
        return EnrollmentDto.fromEntity(enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public EnrollmentDto getEnrollmentById(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Enrollment", "id", id));
        return EnrollmentDto.fromEntity(enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentRepository.findAll()
                .stream()
                .map(EnrollmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentDto> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId)
                .stream()
                .map(EnrollmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentDto> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId)
                .stream()
                .map(EnrollmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public EnrollmentDto updateStatus(
            Long id, Enrollment.EnrollmentStatus status) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Enrollment", "id", id));
        enrollment.setStatus(status);
        enrollmentRepository.save(enrollment);
        return EnrollmentDto.fromEntity(enrollment);
    }

    @Override
    public void dropEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Enrollment", "id", id));
        enrollment.setStatus(Enrollment.EnrollmentStatus.DROPPED);
        enrollmentRepository.save(enrollment);
    }
}