
package com.coursepath.lms.service;

import com.coursepath.lms.model.Course;
import com.coursepath.lms.model.Enrollment;
import com.coursepath.lms.repository.CourseRepository;
import com.coursepath.lms.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private UserService userService;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public Course createCourse(Course course) {
        if (course.getEnrolledStudents() == null) {
            course.setEnrolledStudents(new ArrayList<>());
        }
        return courseRepository.save(course);
    }

    public Course updateCourse(String id, Course courseDetails) {
        Course course = getCourseById(id);
        
        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setThumbnail(courseDetails.getThumbnail());
        course.setInstructor(courseDetails.getInstructor());
        course.setDuration(courseDetails.getDuration());
        course.setModules(courseDetails.getModules());
        
        return courseRepository.save(course);
    }

    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }

    public List<Course> getEnrolledCourses(String studentId) {
        return courseRepository.findByEnrolledStudentsContaining(studentId);
    }

    public Enrollment enrollStudent(String courseId, String studentId) {
        Course course = getCourseById(courseId);
        
        if (!course.getEnrolledStudents().contains(studentId)) {
            course.getEnrolledStudents().add(studentId);
            courseRepository.save(course);
        }
        
        userService.enrollCourse(studentId, courseId);
        
        // Check if enrollment already exists
        return enrollmentRepository.findByCourseIdAndStudentId(courseId, studentId)
                .orElseGet(() -> {
                    Enrollment enrollment = new Enrollment();
                    enrollment.setCourseId(courseId);
                    enrollment.setStudentId(studentId);
                    enrollment.setEnrolledDate(LocalDateTime.now());
                    enrollment.setProgress(0);
                    enrollment.setCompletedModules(new ArrayList<>());
                    return enrollmentRepository.save(enrollment);
                });
    }
    
    public Enrollment updateProgress(String courseId, String studentId, String moduleId, boolean isCompleted) {
        Enrollment enrollment = enrollmentRepository.findByCourseIdAndStudentId(courseId, studentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        List<String> completedModules = enrollment.getCompletedModules();
        
        if (isCompleted && !completedModules.contains(moduleId)) {
            completedModules.add(moduleId);
        } else if (!isCompleted) {
            completedModules.remove(moduleId);
        }
        
        Course course = getCourseById(courseId);
        int totalModules = course.getModules().size();
        double progress = totalModules > 0 ? (double) completedModules.size() / totalModules * 100 : 0;
        
        enrollment.setCompletedModules(completedModules);
        enrollment.setProgress(progress);
        
        return enrollmentRepository.save(enrollment);
    }
    
    public List<Enrollment> getStudentEnrollments(String studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }
    
    public Enrollment getEnrollment(String courseId, String studentId) {
        return enrollmentRepository.findByCourseIdAndStudentId(courseId, studentId)
                .orElse(null);
    }
}
