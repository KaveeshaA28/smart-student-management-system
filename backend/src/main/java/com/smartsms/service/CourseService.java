package com.smartsms.service;

import com.smartsms.dto.CourseDto;
import com.smartsms.dto.CourseRequestDto;

import java.util.List;

public interface CourseService {
    CourseDto createCourse(CourseRequestDto request);
    CourseDto getCourseById(Long id);
    CourseDto getCourseByCode(String code);
    List<CourseDto> getAllCourses();
    List<CourseDto> getActiveCourses();
    List<CourseDto> searchCourses(String keyword);
    List<CourseDto> getCoursesByLecturer(Long lecturerId);
    CourseDto updateCourse(Long id, CourseRequestDto request);
    CourseDto assignLecturer(Long courseId, Long lecturerId);
    void deleteCourse(Long id);
}