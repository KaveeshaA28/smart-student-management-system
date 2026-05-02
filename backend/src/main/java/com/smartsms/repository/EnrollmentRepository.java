package com.smartsms.repository;

import com.smartsms.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudentId(Long studentId);

    List<Enrollment> findByCourseId(Long courseId);

    Optional<Enrollment> findByStudentIdAndCourseId(
            Long studentId, Long courseId);

    Boolean existsByStudentIdAndCourseId(
            Long studentId, Long courseId);

    List<Enrollment> findByStudentIdAndStatus(
            Long studentId, Enrollment.EnrollmentStatus status);

    List<Enrollment> findByCourseIdAndStatus(
            Long courseId, Enrollment.EnrollmentStatus status);

    @Query("SELECT COUNT(e) FROM Enrollment e " +
            "WHERE e.course.id = :courseId " +
            "AND e.status = 'ACTIVE'")
    Long countActiveEnrollmentsByCourse(Long courseId);

    @Query("SELECT COUNT(e) FROM Enrollment e " +
            "WHERE e.student.id = :studentId " +
            "AND e.status = 'ACTIVE'")
    Long countActiveEnrollmentsByStudent(Long studentId);
}