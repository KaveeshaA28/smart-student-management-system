package com.smartsms.repository;

import com.smartsms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findByCode(String code);

    Boolean existsByCode(String code);

    List<Course> findByActiveTrue();

    List<Course> findByLecturerId(Long lecturerId);

    @Query("SELECT c FROM Course c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Course> searchCourses(String keyword);
}