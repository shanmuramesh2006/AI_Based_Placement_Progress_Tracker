package com.placement.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "monthly_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "report_month", nullable = false)
    private Integer reportMonth;

    @Column(name = "report_year", nullable = false)
    private Integer year;

    @Column(name = "weak_area")
    private String weakArea;

    @Column(name = "strong_area")
    private String strongArea;

    @Column(columnDefinition = "TEXT")
    private String insight;

    @Column(name = "action_plan", columnDefinition = "TEXT")
    private String actionPlan;

    @Column(columnDefinition = "TEXT")
    private String quote;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
