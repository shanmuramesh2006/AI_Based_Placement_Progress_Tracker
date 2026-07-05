package com.placement.service;

import com.placement.dto.TestQuestionDto;
import com.placement.dto.TestCaseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeminiQuestionGenerator {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
    private String apiUrl;

    public List<TestQuestionDto> generateQuestions(String category, int count) {
        if (apiKey == null || apiKey.isBlank()) {
            return fallbackQuestions(category, count);
        }

        try {
            String prompt = buildPrompt(category, count);
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                    "parts", List.of(Map.of("text", prompt))
                ))
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            String url = apiUrl + "?key=" + apiKey;
            Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) ((Map<String, Object>) ((List<Object>) response.get("candidates")).get(0)).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) ((Map<String, Object>) ((List<Object>) response.get("candidates")).get(0)).get("content");
            String text = extractText(parts);
            return parseQuestions(text, category, count);
        } catch (Exception ex) {
            return fallbackQuestions(category, count);
        }
    }

    private String buildPrompt(String category, int count) {
        return "Generate " + count + " fresh placement practice questions for category " + category + ". " +
                "Return valid JSON only with an array field named questions. Each question object must have fields: id, type, prompt, instructions, solution, options (array for MCQ, empty array otherwise), testCases (array of objects with input and expectedOutput). " +
                "Keep the content concise and suitable for student practice.";
    }

    private String extractText(List<Map<String, Object>> parts) {
        if (parts == null || parts.isEmpty()) {
            return "";
        }
        Object textObject = parts.get(0).get("text");
        return textObject == null ? "" : textObject.toString();
    }

    private List<TestQuestionDto> parseQuestions(String text, String category, int count) {
        List<TestQuestionDto> questions = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            TestQuestionDto question = new TestQuestionDto();
            question.setId(category + "-" + (i + 1));
            question.setType("MCQ");
            question.setPrompt("Generated question " + (i + 1));
            question.setInstructions("Choose the correct option.");
            question.setSolution("A");
            question.setOptions(List.of("A", "B", "C", "D"));
            questions.add(question);
        }
        return questions;
    }

    private List<TestQuestionDto> fallbackQuestions(String category, int count) {
        List<TestQuestionDto> questions = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            TestQuestionDto question = new TestQuestionDto();
            question.setId(category + "-" + i);
            if (category.equalsIgnoreCase("Aptitude")) {
                question.setType("MCQ");
                question.setPrompt("What is 9 x 7?");
                question.setInstructions("Choose the correct option.");
                question.setSolution("63");
                question.setOptions(List.of("63", "56", "72", "49"));
            } else if (category.equalsIgnoreCase("SQL")) {
                question.setType("SQL");
                question.setPrompt("Write a SQL query to select all students with a score above 80.");
                question.setInstructions("Write your query below.");
                question.setSolution("SELECT * FROM students WHERE score > 80;");
            } else if (category.equalsIgnoreCase("Coding")) {
                question.setType("Coding");
                question.setPrompt("Write a function that returns the sum of two integers.");
                question.setInstructions("Provide a function implementation in your chosen language.");
                question.setSolution("def sum(a, b):\n    return a + b");
                question.setTestCases(List.of(new TestCaseDto() {{ setInput("1,2"); setExpectedOutput("3"); }}));
            } else {
                question.setType("MCQ");
                question.setPrompt("Which answer is correct?");
                question.setInstructions("Choose the best option.");
                question.setSolution("Option A");
                question.setOptions(List.of("Option A", "Option B", "Option C", "Option D"));
            }
            questions.add(question);
        }
        return questions;
    }
}
