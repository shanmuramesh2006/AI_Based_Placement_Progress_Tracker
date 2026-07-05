package com.placement.dto;

import lombok.Data;

import java.util.List;

@Data
public class TestGenerateResponse {
    private String sessionId;
    private List<TestQuestionDto> questions;
}
