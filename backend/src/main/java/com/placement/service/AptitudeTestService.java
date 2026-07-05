package com.placement.service;

import com.placement.dto.TestAnswerDto;
import com.placement.dto.TestGenerateResponse;
import com.placement.dto.TestQuestionDto;
import com.placement.dto.TestResultResponse;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AptitudeTestService {

    private final Map<String, TestSession> sessions = new ConcurrentHashMap<>();
    private final GeminiQuestionGenerator questionGenerator;

    public AptitudeTestService(GeminiQuestionGenerator questionGenerator) {
        this.questionGenerator = questionGenerator;
    }

    public TestGenerateResponse createTestSession(String category, int count) {
        List<TestQuestionDto> questions = generateQuestions(category, count);
        String sessionId = UUID.randomUUID().toString();

        TestSession session = new TestSession();
        session.setSessionId(sessionId);
        session.setCategory(category);
        session.setQuestions(questions);
        sessions.put(sessionId, session);

        TestGenerateResponse response = new TestGenerateResponse();
        response.setSessionId(sessionId);
        response.setQuestions(questions.stream().map(this::maskAnswers).collect(Collectors.toList()));
        return response;
    }

    public TestResultResponse gradeSubmission(String sessionId, List<TestAnswerDto> answers) {
        TestSession session = sessions.get(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("Invalid session ID");
        }

        Map<String, TestQuestionDto> questionMap = session.getQuestions().stream()
                .collect(Collectors.toMap(TestQuestionDto::getId, q -> q));

        int correct = 0;
        for (TestAnswerDto answer : answers) {
            TestQuestionDto question = questionMap.get(answer.getQuestionId());
            if (question == null) continue;
            if (question.getType().equalsIgnoreCase("MCQ")) {
                if (question.getSolution() != null && question.getSolution().equalsIgnoreCase(answer.getAnswer().trim())) {
                    correct++;
                }
            } else if (question.getType().equalsIgnoreCase("SQL") || question.getType().equalsIgnoreCase("Coding")) {
                if (question.getSolution() != null && question.getSolution().trim().equalsIgnoreCase(answer.getAnswer().trim())) {
                    correct++;
                }
            }
        }

        int total = session.getQuestions().size();
        int score = total == 0 ? 0 : (correct * 100) / total;

        TestResultResponse result = new TestResultResponse();
        result.setScore(score);
        result.setCorrectCount(correct);
        result.setTotalQuestions(total);
        result.setMessage("Auto-graded successfully");
        return result;
    }

    private TestQuestionDto maskAnswers(TestQuestionDto question) {
        TestQuestionDto masked = new TestQuestionDto();
        masked.setId(question.getId());
        masked.setPrompt(question.getPrompt());
        masked.setType(question.getType());
        masked.setInstructions(question.getInstructions());
        masked.setOptions(question.getOptions());
        return masked;
    }

    private List<TestQuestionDto> generateQuestions(String category, int count) {
        return questionGenerator.generateQuestions(category, count);
    }

    public String getSessionCategory(String sessionId) {
        TestSession session = sessions.get(sessionId);
        return session != null ? session.getCategory() : "Test";
    }
}
