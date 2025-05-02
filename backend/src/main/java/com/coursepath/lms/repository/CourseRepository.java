
package com.coursepath.lms.repository;

import com.coursepath.lms.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByEnrolledStudentsContaining(String studentId);
}
