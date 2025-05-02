
package com.coursepath.lms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ModuleProgressRequest {
    @NotBlank
    private String moduleId;
    
    private boolean completed;
}
