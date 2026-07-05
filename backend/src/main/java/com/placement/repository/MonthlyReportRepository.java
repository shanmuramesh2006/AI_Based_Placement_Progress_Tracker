package com.placement.repository;

import com.placement.entity.MonthlyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MonthlyReportRepository extends JpaRepository<MonthlyReport, Long> {
    Optional<MonthlyReport> findByStudentIdAndReportMonthAndYear(Long studentId, Integer reportMonth, Integer year);
}
