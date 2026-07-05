package com.placement.controller;

import com.placement.dto.ProgressRequest;
import com.placement.entity.DailyProgress;
import com.placement.entity.Student;
import com.placement.repository.DailyProgressRepository;
import com.placement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private DailyProgressRepository progressRepository;

    @Autowired
    private StudentRepository studentRepository;

    private Student getCurrentStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return studentRepository.findByEmail(email).orElseThrow();
    }

    @PostMapping("/log")
    public ResponseEntity<?> logProgress(@RequestBody ProgressRequest request) {
        Student student = getCurrentStudent();
        DailyProgress progress = new DailyProgress();
        progress.setStudent(student);
        progress.setCategory(request.getCategory());
        progress.setSubSector(request.getSubSector());
        progress.setScore(request.getScore());
        progress.setLogDate(request.getLogDate() != null ? request.getLogDate() : LocalDate.now());
        progress.setNotes(request.getNotes());

        progressRepository.save(progress);
        return ResponseEntity.ok("Progress logged successfully");
    }

    @GetMapping("/daily")
    public ResponseEntity<List<DailyProgress>> getDailyProgress(
            @RequestParam(required = false) String category,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Student student = getCurrentStudent();
        List<DailyProgress> data;
        
        if (category == null || category.isEmpty() || category.equalsIgnoreCase("All")) {
            data = progressRepository.findByStudentIdAndLogDateBetween(student.getId(), startDate, endDate);
        } else {
            data = progressRepository.findByStudentIdAndCategoryAndLogDateBetween(student.getId(), category, startDate, endDate);
        }
        return ResponseEntity.ok(data);
    }
}
