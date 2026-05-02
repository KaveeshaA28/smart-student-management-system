package com.smartsms.service.impl;

import com.smartsms.dto.StudentDto;
import com.smartsms.dto.StudentRequestDto;
import com.smartsms.entity.Role;
import com.smartsms.entity.Student;
import com.smartsms.entity.User;
import com.smartsms.exception.ResourceNotFoundException;
import com.smartsms.repository.StudentRepository;
import com.smartsms.repository.UserRepository;
import com.smartsms.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public StudentDto createStudent(StudentRequestDto request) {

        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                "Email already in use: " + request.getEmail());
        }

        // Check for duplicate student number
        if (studentRepository.existsByStudentNumber(request.getStudentNumber())) {
            throw new RuntimeException(
                "Student number already exists: " + request.getStudentNumber());
        }

        // Create User account
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .active(true)
                .build();
        userRepository.save(user);

        // Create Student profile
        Student student = Student.builder()
                .user(user)
                .studentNumber(request.getStudentNumber())
                .phone(request.getPhone())
                .address(request.getAddress())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .enrolledYear(request.getEnrolledYear())
                .build();
        studentRepository.save(student);

        return StudentDto.fromEntity(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Student", "id", id));
        return StudentDto.fromEntity(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDto getStudentByStudentNumber(String studentNumber) {
        Student student = studentRepository
                .findByStudentNumber(studentNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Student", "studentNumber", studentNumber));
        return StudentDto.fromEntity(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(StudentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDto> searchStudents(String keyword) {
        return studentRepository.searchStudents(keyword)
                .stream()
                .map(StudentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDto updateStudent(Long id, StudentRequestDto request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Student", "id", id));

        User user = student.getUser();
        user.setName(request.getName());

        // Only update email if changed
        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException(
                    "Email already in use: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }

        // Only update password if provided
        if (request.getPassword() != null &&
            !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);

        // Update student number if changed
        if (!student.getStudentNumber().equals(request.getStudentNumber())) {
            if (studentRepository.existsByStudentNumber(
                    request.getStudentNumber())) {
                throw new RuntimeException(
                    "Student number already exists: " +
                    request.getStudentNumber());
            }
            student.setStudentNumber(request.getStudentNumber());
        }

        student.setPhone(request.getPhone());
        student.setAddress(request.getAddress());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setGender(request.getGender());
        student.setEnrolledYear(request.getEnrolledYear());
        studentRepository.save(student);

        return StudentDto.fromEntity(student);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Student", "id", id));

        // Soft delete - deactivate user account
        User user = student.getUser();
        user.setActive(false);
        userRepository.save(user);
    }
}