package com.placement.dto;

import lombok.Data;

@Data
public class TestResultResponse {
    private Integer score;
    private Integer correctCount;
    private Integer totalQuestions;
    private String message;
}
