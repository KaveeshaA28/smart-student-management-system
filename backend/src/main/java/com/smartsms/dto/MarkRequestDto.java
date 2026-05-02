package com.smartsms.dto;

import com.smartsms.entity.Mark;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class MarkRequestDto {

    @NotNull(message = "Enrollment ID is required")
    private Long enrollmentId;

    @NotNull(message = "Assessment type is required")
    private Mark.AssessmentType assessmentType;

    @NotNull(message = "Marks obtained is required")
    @Min(value = 0, message = "Marks cannot be negative")
    private Double marksObtained;

    @NotNull(message = "Max marks is required")
    @Min(value = 1, message = "Max marks must be at least 1")
    private Double maxMarks;

    private String remarks;
}