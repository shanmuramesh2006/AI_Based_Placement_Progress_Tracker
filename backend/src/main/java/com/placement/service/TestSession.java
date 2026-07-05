package com.placement.service;

import com.placement.dto.TestQuestionDto;
import lombok.Data;

import java.util.List;

@Data
public class TestSession {
    private String sessionId;
    private String category;
    private List<TestQuestionDto> questions;
}
