package com.smartsms.repository;

import com.smartsms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentNumber(String studentNumber);

    Boolean existsByStudentNumber(String studentNumber);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.user.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.user.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.studentNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Student> searchStudents(String keyword);

    List<Student> findByEnrolledYear(Integer year);
}