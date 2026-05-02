package com.smartsms.service;

import com.smartsms.dto.StudentDto;
import com.smartsms.dto.StudentRequestDto;

import java.util.List;

public interface StudentService {
    StudentDto createStudent(StudentRequestDto request);
    StudentDto getStudentById(Long id);
    StudentDto getStudentByStudentNumber(String studentNumber);
    List<StudentDto> getAllStudents();
    List<StudentDto> searchStudents(String keyword);
    StudentDto updateStudent(Long id, StudentRequestDto request);
    void deleteStudent(Long id);
}