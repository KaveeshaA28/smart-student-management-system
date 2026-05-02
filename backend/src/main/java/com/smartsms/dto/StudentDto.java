package com.smartsms.dto;

import com.smartsms.entity.Student;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDto {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String studentNumber;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private Student.Gender gender;
    private Integer enrolledYear;
    private Boolean active;
    private LocalDateTime createdAt;

    // Static factory method - converts Entity to DTO
    public static StudentDto fromEntity(Student student) {
        return StudentDto.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .name(student.getUser().getName())
                .email(student.getUser().getEmail())
                .studentNumber(student.getStudentNumber())
                .phone(student.getPhone())
                .address(student.getAddress())
                .dateOfBirth(student.getDateOfBirth())
                .gender(student.getGender())
                .enrolledYear(student.getEnrolledYear())
                .active(student.getUser().getActive())
                .createdAt(student.getCreatedAt())
                .build();
    }
}