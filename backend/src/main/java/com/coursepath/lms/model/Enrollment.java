
package com.coursepath.lms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "enrollments")
public class Enrollment {
    
    @Id
    private String id;
    
    private String courseId;
    private String studentId;
    private LocalDateTime enrolledDate;
    private double progress;
    private List<String> completedModules;
}
