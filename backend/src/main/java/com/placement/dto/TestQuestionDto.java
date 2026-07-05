package com.placement.dto;

import lombok.Data;

import java.util.List;

@Data
public class TestQuestionDto {
    private String id;
    private String prompt;
    private String type;
    private String instructions;
    private List<String> options;
    private List<TestCaseDto> testCases;
    private String solution;
}
