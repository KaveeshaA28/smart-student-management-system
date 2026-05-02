package com.smartsms.service;

import com.smartsms.dto.GpaDto;
import com.smartsms.dto.MarkDto;
import com.smartsms.dto.MarkRequestDto;

import java.util.List;

public interface MarkService {
    MarkDto addMark(MarkRequestDto request);

    MarkDto getMarkById(Long id);

    List<MarkDto> getMarksByEnrollment(Long enrollmentId);

    List<MarkDto> getMarksByStudent(Long studentId);

    List<MarkDto> getMarksByCourse(Long courseId);

    MarkDto updateMark(Long id, MarkRequestDto request);

    void deleteMark(Long id);

    GpaDto calculateGpaByEnrollment(Long enrollmentId);

    GpaDto calculateCumulativeGpa(Long studentId);
}