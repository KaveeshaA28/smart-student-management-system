package com.smartsms.repository;

import com.smartsms.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEnrollmentId(Long enrollmentId);

    List<Attendance> findByEnrollmentIdAndDate(
            Long enrollmentId, LocalDate date);

    Optional<Attendance> findByEnrollmentIdAndDateAndStatus(
            Long enrollmentId, LocalDate date,
            Attendance.AttendanceStatus status);

    Boolean existsByEnrollmentIdAndDate(
            Long enrollmentId, LocalDate date);

    List<Attendance> findByEnrollmentIdAndStatus(
            Long enrollmentId, Attendance.AttendanceStatus status);

    // Get attendance for a course on a specific date
    @Query("SELECT a FROM Attendance a " +
            "WHERE a.enrollment.course.id = :courseId " +
            "AND a.date = :date")
    List<Attendance> findByCourseIdAndDate(
            Long courseId, LocalDate date);

    // Get all attendance for a course
    @Query("SELECT a FROM Attendance a " +
            "WHERE a.enrollment.course.id = :courseId")
    List<Attendance> findByCourseId(Long courseId);

    // Count by status for an enrollment
    @Query("SELECT COUNT(a) FROM Attendance a " +
            "WHERE a.enrollment.id = :enrollmentId " +
            "AND a.status = :status")
    Long countByEnrollmentIdAndStatus(
            Long enrollmentId,
            Attendance.AttendanceStatus status);

    // Total classes for enrollment
    @Query("SELECT COUNT(a) FROM Attendance a " +
            "WHERE a.enrollment.id = :enrollmentId")
    Long countByEnrollmentId(Long enrollmentId);
}