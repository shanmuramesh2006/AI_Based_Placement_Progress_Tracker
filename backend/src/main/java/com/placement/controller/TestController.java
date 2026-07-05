package com.placement.controller;

import com.placement.dto.TestGenerationRequest;
import com.placement.dto.TestGenerateResponse;
import com.placement.dto.TestResultResponse;
import com.placement.dto.TestSubmissionRequest;
import com.placement.entity.DailyProgress;
import com.placement.entity.Student;
import com.placement.repository.DailyProgressRepository;
import com.placement.repository.StudentRepository;
import com.placement.service.AptitudeTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/tests")
public class TestController {

    @Autowired
    private AptitudeTestService testService;

    @Autowired
    private DailyProgressRepository progressRepository;

    @Autowired
    private StudentRepository studentRepository;

    private Student getCurrentStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return studentRepository.findByEmail(email).orElseThrow();
    }

    @PostMapping("/generate")
    public ResponseEntity<TestGenerateResponse> generateTest(@RequestBody TestGenerationRequest request) {
        TestGenerateResponse response = testService.createTestSession(request.getCategory(), request.getCount() != null ? request.getCount() : 5);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit")
    public ResponseEntity<TestResultResponse> submitTest(@RequestBody TestSubmissionRequest request) {
        TestResultResponse result = testService.gradeSubmission(request.getSessionId(), request.getAnswers());
        String category = testService.getSessionCategory(request.getSessionId());

        Student student = getCurrentStudent();
        DailyProgress progress = new DailyProgress();
        progress.setStudent(student);
        progress.setCategory(category);
        progress.setSubSector("Auto Test");
        progress.setScore(result.getScore());
        progress.setLogDate(LocalDate.now());
        progress.setNotes("Auto-graded test session");
        progressRepository.save(progress);

        return ResponseEntity.ok(result);
    }
}
