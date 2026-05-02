package com.smartsms.service.impl;

import com.smartsms.dto.GpaDto;
import com.smartsms.dto.MarkDto;
import com.smartsms.dto.MarkRequestDto;
import com.smartsms.entity.*;
import com.smartsms.exception.ResourceNotFoundException;
import com.smartsms.repository.*;
import com.smartsms.service.MarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MarkServiceImpl implements MarkService {

    private final MarkRepository markRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;

    // ── GPA Calculation Logic ──────────────────────────
    private String calculateGrade(double percentage) {
        if (percentage >= 85) return "A";
        if (percentage >= 75) return "B+";
        if (percentage >= 65) return "B";
        if (percentage >= 55) return "C+";
        if (percentage >= 45) return "C";
        if (percentage >= 35) return "D";
        return "F";
    }

    private double calculateGpaPoints(String grade) {
        return switch (grade) {
            case "A"  -> 4.0;
            case "B+" -> 3.5;
            case "B"  -> 3.0;
            case "C+" -> 2.5;
            case "C"  -> 2.0;
            case "D"  -> 1.0;
            default   -> 0.0;
        };
    }

    @Override
    public MarkDto addMark(MarkRequestDto request) {
        Enrollment enrollment = enrollmentRepository
                .findById(request.getEnrollmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Enrollment", "id", request.getEnrollmentId()));

        double percentage = (request.getMarksObtained() /
                request.getMaxMarks()) * 100;
        String grade = calculateGrade(percentage);
        double gpaPoints = calculateGpaPoints(grade);

        Mark mark = Mark.builder()
                .enrollment(enrollment)
                .assessmentType(request.getAssessmentType())
                .marksObtained(request.getMarksObtained())
                .maxMarks(request.getMaxMarks())
                .grade(grade)
                .gpaPoints(gpaPoints)
                .remarks(request.getRemarks())
                .build();

        markRepository.save(mark);
        return MarkDto.fromEntity(mark);
    }

    @Override
    @Transactional(readOnly = true)
    public MarkDto getMarkById(Long id) {
        Mark mark = markRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Mark", "id", id));
        return MarkDto.fromEntity(mark);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MarkDto> getMarksByEnrollment(Long enrollmentId) {
        return markRepository.findByEnrollmentId(enrollmentId)
                .stream()
                .map(MarkDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MarkDto> getMarksByStudent(Long studentId) {
        return markRepository.findByStudentId(studentId)
                .stream()
                .map(MarkDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MarkDto> getMarksByCourse(Long courseId) {
        return markRepository.findByCourseId(courseId)
                .stream()
                .map(MarkDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public MarkDto updateMark(Long id, MarkRequestDto request) {
        Mark mark = markRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Mark", "id", id));

        double percentage = (request.getMarksObtained() /
                request.getMaxMarks()) * 100;
        String grade = calculateGrade(percentage);
        double gpaPoints = calculateGpaPoints(grade);

        mark.setMarksObtained(request.getMarksObtained());
        mark.setMaxMarks(request.getMaxMarks());
        mark.setAssessmentType(request.getAssessmentType());
        mark.setGrade(grade);
        mark.setGpaPoints(gpaPoints);
        mark.setRemarks(request.getRemarks());

        markRepository.save(mark);
        return MarkDto.fromEntity(mark);
    }

    @Override
    public void deleteMark(Long id) {
        Mark mark = markRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Mark", "id", id));
        markRepository.delete(mark);
    }

    @Override
    @Transactional(readOnly = true)
    public GpaDto calculateGpaByEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository
                .findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Enrollment", "id", enrollmentId));

        List<Mark> marks = markRepository
                .findByEnrollmentId(enrollmentId);
        List<MarkDto> markDtos = marks.stream()
                .map(MarkDto::fromEntity)
                .collect(Collectors.toList());

        double avgGpa = marks.isEmpty() ? 0.0 :
                marks.stream()
                        .mapToDouble(Mark::getGpaPoints)
                        .average()
                        .orElse(0.0);

        avgGpa = Math.round(avgGpa * 100.0) / 100.0;
        String courseGrade = calculateGrade(avgGpa / 4.0 * 100);

        return GpaDto.builder()
                .studentId(enrollment.getStudent().getId())
                .studentName(enrollment.getStudent()
                        .getUser().getName())
                .studentNumber(enrollment.getStudent()
                        .getStudentNumber())
                .courseId(enrollment.getCourse().getId())
                .courseName(enrollment.getCourse().getName())
                .courseCode(enrollment.getCourse().getCode())
                .courseCredits(enrollment.getCourse().getCredits())
                .courseGpa(avgGpa)
                .courseGrade(courseGrade)
                .marks(markDtos)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public GpaDto calculateCumulativeGpa(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Student", "id", studentId));

        List<Mark> allMarks = markRepository
                .findActiveMarksByStudent(studentId);

        double cumulativeGpa = allMarks.isEmpty() ? 0.0 :
                allMarks.stream()
                        .mapToDouble(Mark::getGpaPoints)
                        .average()
                        .orElse(0.0);

        cumulativeGpa = Math.round(cumulativeGpa * 100.0) / 100.0;

        List<MarkDto> markDtos = allMarks.stream()
                .map(MarkDto::fromEntity)
                .collect(Collectors.toList());

        return GpaDto.builder()
                .studentId(student.getId())
                .studentName(student.getUser().getName())
                .studentNumber(student.getStudentNumber())
                .cumulativeGpa(cumulativeGpa)
                .marks(markDtos)
                .build();
    }
}