package com.smartsms.dto;

import com.smartsms.entity.Student;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentRequestDto {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Student number is required")
    private String studentNumber;

    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private Student.Gender gender;
    private Integer enrolledYear;
}