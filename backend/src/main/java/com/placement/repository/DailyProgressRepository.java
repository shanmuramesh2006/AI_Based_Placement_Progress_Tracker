package com.placement.repository;

import com.placement.entity.DailyProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyProgressRepository extends JpaRepository<DailyProgress, Long> {
    List<DailyProgress> findByStudentIdAndLogDateBetween(Long studentId, LocalDate startDate, LocalDate endDate);
    List<DailyProgress> findByStudentIdAndCategoryAndLogDateBetween(Long studentId, String category, LocalDate startDate, LocalDate endDate);
}
