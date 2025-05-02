
package com.coursepath.lms.dto;

import com.coursepath.lms.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String username;
    private String name;
    private String email;
    private Role role;
    
    public JwtResponse(String token, String id, String username, String name, String email, Role role) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
