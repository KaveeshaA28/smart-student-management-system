package com.smartsms.repository;

import com.smartsms.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarkRepository extends JpaRepository<Mark, Long> {

    List<Mark> findByEnrollmentId(Long enrollmentId);

    List<Mark> findByEnrollmentIdAndAssessmentType(
            Long enrollmentId, Mark.AssessmentType type);

    @Query("SELECT m FROM Mark m " +
            "WHERE m.enrollment.student.id = :studentId")
    List<Mark> findByStudentId(Long studentId);

    @Query("SELECT m FROM Mark m " +
            "WHERE m.enrollment.course.id = :courseId")
    List<Mark> findByCourseId(Long courseId);

    @Query("SELECT AVG(m.gpaPoints) FROM Mark m " +
            "WHERE m.enrollment.id = :enrollmentId")
    Double getAverageGpaByEnrollment(Long enrollmentId);

    @Query("SELECT m FROM Mark m " +
            "WHERE m.enrollment.student.id = :studentId " +
            "AND m.enrollment.status = 'ACTIVE'")
    List<Mark> findActiveMarksByStudent(Long studentId);
}