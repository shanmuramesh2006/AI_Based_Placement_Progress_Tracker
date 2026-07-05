package com.placement.dto;

import lombok.Data;

import java.util.List;

@Data
public class TestSubmissionRequest {
    private String sessionId;
    private List<TestAnswerDto> answers;
}
