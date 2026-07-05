package com.placement.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProgressRequest {
    private String category;
    private String subSector;
    private Integer score;
    private LocalDate logDate;
    private String notes;
}
