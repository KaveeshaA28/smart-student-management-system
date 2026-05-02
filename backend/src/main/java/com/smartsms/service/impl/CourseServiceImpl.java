package com.smartsms.service.impl;

import com.smartsms.dto.CourseDto;
import com.smartsms.dto.CourseRequestDto;
import com.smartsms.entity.Course;
import com.smartsms.entity.Role;
import com.smartsms.entity.User;
import com.smartsms.exception.ResourceNotFoundException;
import com.smartsms.repository.CourseRepository;
import com.smartsms.repository.UserRepository;
import com.smartsms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Override
    public CourseDto createCourse(CourseRequestDto request) {

        if (courseRepository.existsByCode(request.getCode())) {
            throw new RuntimeException(
                "Course code already exists: " + request.getCode());
        }

        Course course = Course.builder()
                .code(request.getCode().toUpperCase())
                .name(request.getName())
                .description(request.getDescription())
                .credits(request.getCredits())
                .active(true)
                .build();

        if (request.getLecturerId() != null) {
            User lecturer = userRepository.findById(request.getLecturerId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Lecturer", "id", request.getLecturerId()));

            if (lecturer.getRole() != Role.LECTURER &&
                lecturer.getRole() != Role.ADMIN) {
                throw new RuntimeException(
                    "User is not a lecturer or admin");
            }
            course.setLecturer(lecturer);
        }

        courseRepository.save(course);
        return CourseDto.fromEntity(course);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDto getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Course", "id", id));
        return CourseDto.fromEntity(course);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDto getCourseByCode(String code) {
        Course course = courseRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Course", "code", code));
        return CourseDto.fromEntity(course);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(CourseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDto> getActiveCourses() {
        return courseRepository.findByActiveTrue()
                .stream()
                .map(CourseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDto> searchCourses(String keyword) {
        return courseRepository.searchCourses(keyword)
                .stream()
                .map(CourseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDto> getCoursesByLecturer(Long lecturerId) {
        return courseRepository.findByLecturerId(lecturerId)
                .stream()
                .map(CourseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDto updateCourse(Long id, CourseRequestDto request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Course", "id", id));

        if (!course.getCode().equals(request.getCode().toUpperCase())) {
            if (courseRepository.existsByCode(request.getCode())) {
                throw new RuntimeException(
                    "Course code already exists: " + request.getCode());
            }
            course.setCode(request.getCode().toUpperCase());
        }

        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setCredits(request.getCredits());

        if (request.getLecturerId() != null) {
            User lecturer = userRepository.findById(request.getLecturerId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Lecturer", "id", request.getLecturerId()));
            course.setLecturer(lecturer);
        } else {
            course.setLecturer(null);
        }

        courseRepository.save(course);
        return CourseDto.fromEntity(course);
    }

    @Override
    public CourseDto assignLecturer(Long courseId, Long lecturerId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Course", "id", courseId));

        User lecturer = userRepository.findById(lecturerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Lecturer", "id", lecturerId));

        if (lecturer.getRole() != Role.LECTURER &&
            lecturer.getRole() != Role.ADMIN) {
            throw new RuntimeException("User is not a lecturer");
        }

        course.setLecturer(lecturer);
        courseRepository.save(course);
        return CourseDto.fromEntity(course);
    }

    @Override
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Course", "id", id));
        course.setActive(false);
        courseRepository.save(course);
    }
}