
package com.coursepath.lms.dto;

import com.coursepath.lms.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;
    
    @NotBlank
    @Size(min = 6, max = 100)
    private String password;
    
    @NotBlank
    @Size(min = 3, max = 100)
    private String name;
    
    @NotBlank
    @Email
    private String email;
    
    private Role role = Role.STUDENT;
}
