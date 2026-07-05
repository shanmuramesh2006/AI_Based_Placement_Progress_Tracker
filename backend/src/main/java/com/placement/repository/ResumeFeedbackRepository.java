package com.placement.repository;

import com.placement.entity.ResumeFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeFeedbackRepository extends JpaRepository<ResumeFeedback, Long> {
    List<ResumeFeedback> findByStudentId(Long studentId);
}
