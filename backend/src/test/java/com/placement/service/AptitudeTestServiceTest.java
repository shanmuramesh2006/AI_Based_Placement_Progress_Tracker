package com.placement.service;

import com.placement.dto.TestGenerateResponse;
import com.placement.dto.TestQuestionDto;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AptitudeTestServiceTest {

    @Test
    void createTestSessionUsesGeneratedQuestionsWhenProvided() {
        GeminiQuestionGenerator generator = mock(GeminiQuestionGenerator.class);
        TestQuestionDto first = new TestQuestionDto();
        first.setId("q1");
        first.setType("MCQ");
        first.setPrompt("What is 2 + 2?");
        first.setInstructions("Choose the right answer");
        first.setSolution("4");

        TestQuestionDto second = new TestQuestionDto();
        second.setId("q2");
        second.setType("MCQ");
        second.setPrompt("What is 3 x 3?");
        second.setInstructions("Choose the right answer");
        second.setSolution("9");

        when(generator.generateQuestions("Aptitude", 2)).thenReturn(List.of(first, second));

        AptitudeTestService service = new AptitudeTestService(generator);
        TestGenerateResponse response = service.createTestSession("Aptitude", 2);

        assertEquals(2, response.getQuestions().size());
        assertEquals("What is 2 + 2?", response.getQuestions().get(0).getPrompt());
        assertEquals("What is 3 x 3?", response.getQuestions().get(1).getPrompt());
    }
}
