package com.smartsms.dto;

import com.smartsms.entity.Course;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {

    private Long id;
    private String code;
    private String name;
    private String description;
    private Integer credits;
    private Long lecturerId;
    private String lecturerName;
    private String lecturerEmail;
    private Boolean active;
    private LocalDateTime createdAt;

    public static CourseDto fromEntity(Course course) {
        CourseDto dto = CourseDto.builder()
                .id(course.getId())
                .code(course.getCode())
                .name(course.getName())
                .description(course.getDescription())
                .credits(course.getCredits())
                .active(course.getActive())
                .createdAt(course.getCreatedAt())
                .build();

        if (course.getLecturer() != null) {
            dto.setLecturerId(course.getLecturer().getId());
            dto.setLecturerName(course.getLecturer().getName());
            dto.setLecturerEmail(course.getLecturer().getEmail());
        }

        return dto;
    }
}