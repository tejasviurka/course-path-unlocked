
package com.coursepath.lms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EnrollRequest {
    @NotBlank
    private String courseId;
}
