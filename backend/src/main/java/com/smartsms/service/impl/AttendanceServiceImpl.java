package com.smartsms.service.impl;

import com.smartsms.dto.AttendanceDto;
import com.smartsms.dto.AttendanceRequestDto;
import com.smartsms.dto.AttendanceStatsDto;
import com.smartsms.entity.*;
import com.smartsms.exception.ResourceNotFoundException;
import com.smartsms.repository.*;
import com.smartsms.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    @Override
    public AttendanceDto markAttendance(
            AttendanceRequestDto request, String markedByEmail) {

        if (attendanceRepository.existsByEnrollmentIdAndDate(
                request.getEnrollmentId(), request.getDate())) {
            throw new RuntimeException(
                "Attendance already marked for this date");
        }

        Enrollment enrollment = enrollmentRepository
                .findById(request.getEnrollmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Enrollment", "id", request.getEnrollmentId()));

        if (enrollment.getStatus() !=
                Enrollment.EnrollmentStatus.ACTIVE) {
            throw new RuntimeException(
                "Cannot mark attendance for inactive enrollment");
        }

        User markedBy = userRepository.findByEmail(markedByEmail)
                .orElse(null);

        Attendance attendance = Attendance.builder()
                .enrollment(enrollment)
                .date(request.getDate())
                .status(request.getStatus())
                .remarks(request.getRemarks())
                .markedBy(markedBy)
                .build();

        attendanceRepository.save(attendance);
        return AttendanceDto.fromEntity(attendance);
    }

    @Override
    public List<AttendanceDto> markBulkAttendance(
            List<AttendanceRequestDto> requests,
            String markedByEmail) {
        return requests.stream()
                .map(r -> markAttendance(r, markedByEmail))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceDto getAttendanceById(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Attendance", "id", id));
        return AttendanceDto.fromEntity(attendance);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceDto> getAttendanceByEnrollment(
            Long enrollmentId) {
        return attendanceRepository
                .findByEnrollmentId(enrollmentId)
                .stream()
                .map(AttendanceDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceDto> getAttendanceByCourseAndDate(
            Long courseId, LocalDate date) {
        return attendanceRepository
                .findByCourseIdAndDate(courseId, date)
                .stream()
                .map(AttendanceDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceDto> getAttendanceByCourse(Long courseId) {
        return attendanceRepository.findByCourseId(courseId)
                .stream()
                .map(AttendanceDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public AttendanceDto updateAttendance(
            Long id, AttendanceRequestDto request) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Attendance", "id", id));
        attendance.setStatus(request.getStatus());
        attendance.setRemarks(request.getRemarks());
        attendance.setDate(request.getDate());
        attendanceRepository.save(attendance);
        return AttendanceDto.fromEntity(attendance);
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceStatsDto getAttendanceStats(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository
                .findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Enrollment", "id", enrollmentId));

        long total = attendanceRepository
                .countByEnrollmentId(enrollmentId);
        long present = attendanceRepository
                .countByEnrollmentIdAndStatus(enrollmentId,
                    Attendance.AttendanceStatus.PRESENT);
        long absent = attendanceRepository
                .countByEnrollmentIdAndStatus(enrollmentId,
                    Attendance.AttendanceStatus.ABSENT);
        long late = attendanceRepository
                .countByEnrollmentIdAndStatus(enrollmentId,
                    Attendance.AttendanceStatus.LATE);
        long excused = attendanceRepository
                .countByEnrollmentIdAndStatus(enrollmentId,
                    Attendance.AttendanceStatus.EXCUSED);

        double percentage = total > 0
                ? ((double)(present + late) / total) * 100
                : 0.0;

        return AttendanceStatsDto.builder()
                .studentId(enrollment.getStudent().getId())
                .studentName(enrollment.getStudent()
                        .getUser().getName())
                .studentNumber(enrollment.getStudent()
                        .getStudentNumber())
                .courseId(enrollment.getCourse().getId())
                .courseName(enrollment.getCourse().getName())
                .totalClasses(total)
                .present(present)
                .absent(absent)
                .late(late)
                .excused(excused)
                .attendancePercentage(
                    Math.round(percentage * 100.0) / 100.0)
                .build();
    }

    @Override
    public void deleteAttendance(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Attendance", "id", id));
        attendanceRepository.delete(attendance);
    }
}