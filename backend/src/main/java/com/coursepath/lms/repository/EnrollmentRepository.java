
package com.coursepath.lms.repository;

import com.coursepath.lms.model.Enrollment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends MongoRepository<Enrollment, String> {
    List<Enrollment> findByStudentId(String studentId);
    Optional<Enrollment> findByCourseIdAndStudentId(String courseId, String studentId);
}
