
package com.coursepath.lms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "courses")
public class Course {
    
    @Id
    private String id;
    
    private String title;
    private String description;
    private String thumbnail;
    private String instructor;
    private String duration;
    private List<Module> modules;
    private List<String> enrolledStudents;
}
