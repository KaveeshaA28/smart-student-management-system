package com.smartsms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CourseRequestDto {

    @NotBlank(message = "Course code is required")
    private String code;

    @NotBlank(message = "Course name is required")
    private String name;

    private String description;

    @NotNull(message = "Credits is required")
    @Min(value = 1, message = "Credits must be at least 1")
    @Max(value = 6, message = "Credits cannot exceed 6")
    private Integer credits;

    private Long lecturerId;
}