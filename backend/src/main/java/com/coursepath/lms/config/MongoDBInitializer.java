
package com.coursepath.lms.config;

import com.coursepath.lms.model.Course;
import com.coursepath.lms.model.Module;
import com.coursepath.lms.model.Role;
import com.coursepath.lms.repository.CourseRepository;
import com.coursepath.lms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class MongoDBInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseRepository courseRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize admin user
        try {
            userService.register(
                    "admin",
                    "admin123",
                    "Admin User",
                    "admin@lms.com",
                    Role.ADMIN
            );
            System.out.println("Admin user created successfully");
        } catch (Exception e) {
            System.out.println("Admin user already exists");
        }

        // Initialize student user
        try {
            userService.register(
                    "student",
                    "student123",
                    "Student User",
                    "student@lms.com",
                    Role.STUDENT
            );
            System.out.println("Student user created successfully");
        } catch (Exception e) {
            System.out.println("Student user already exists");
        }
        
        // Initialize sample courses if none exist
        if (courseRepository.count() == 0) {
            initializeSampleCourses();
        }
    }
    
    private void initializeSampleCourses() {
        // Course 1
        Course webDev = new Course();
        webDev.setTitle("Introduction to Web Development");
        webDev.setDescription("Learn the basics of HTML, CSS, and JavaScript to build modern websites.");
        webDev.setThumbnail("https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=500");
        webDev.setInstructor("Jane Smith");
        webDev.setDuration("8 weeks");
        
        List<Module> webDevModules = new ArrayList<>();
        
        Module htmlModule = new Module();
        htmlModule.setId("m1");
        htmlModule.setTitle("HTML Fundamentals");
        htmlModule.setContent("Learn the basics of HTML, the backbone of any website.");
        htmlModule.setVideoUrl("https://www.youtube.com/watch?v=qz0aGYrrlhU");
        
        Module cssModule = new Module();
        cssModule.setId("m2");
        cssModule.setTitle("CSS Styling");
        cssModule.setContent("Learn how to style your HTML elements with CSS.");
        cssModule.setVideoUrl("https://www.youtube.com/watch?v=1PnVor36_40");
        
        Module jsModule = new Module();
        jsModule.setId("m3");
        jsModule.setTitle("JavaScript Basics");
        jsModule.setContent("Introduction to JavaScript programming language.");
        jsModule.setVideoUrl("https://www.youtube.com/watch?v=W6NZfCO5SIk");
        
        webDevModules.add(htmlModule);
        webDevModules.add(cssModule);
        webDevModules.add(jsModule);
        
        webDev.setModules(webDevModules);
        webDev.setEnrolledStudents(new ArrayList<>());
        
        // Course 2
        Course reactDev = new Course();
        reactDev.setTitle("Advanced React Development");
        reactDev.setDescription("Master React by building real-world applications with hooks, context API, and more.");
        reactDev.setThumbnail("https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=500");
        reactDev.setInstructor("John Doe");
        reactDev.setDuration("10 weeks");
        
        List<Module> reactDevModules = new ArrayList<>();
        
        Module reactHooksModule = new Module();
        reactHooksModule.setId("m1");
        reactHooksModule.setTitle("React Hooks");
        reactHooksModule.setContent("Learn how to use React Hooks to manage state and side effects.");
        reactHooksModule.setVideoUrl("https://www.youtube.com/watch?v=dpw9EHDh2bM");
        
        Module reactContextModule = new Module();
        reactContextModule.setId("m2");
        reactContextModule.setTitle("Context API");
        reactContextModule.setContent("Learn how to use Context API for state management.");
        reactContextModule.setVideoUrl("https://www.youtube.com/watch?v=35lXWvCuM8o");
        
        reactDevModules.add(reactHooksModule);
        reactDevModules.add(reactContextModule);
        
        reactDev.setModules(reactDevModules);
        reactDev.setEnrolledStudents(new ArrayList<>());
        
        // Course 3
        Course mongodb = new Course();
        mongodb.setTitle("MongoDB for Developers");
        mongodb.setDescription("Learn how to use MongoDB for modern web applications.");
        mongodb.setThumbnail("https://images.unsplash.com/photo-1580894896813-652ff5aa8146?q=80&w=500");
        mongodb.setInstructor("Alice Johnson");
        mongodb.setDuration("6 weeks");
        
        List<Module> mongodbModules = new ArrayList<>();
        
        Module mongoIntroModule = new Module();
        mongoIntroModule.setId("m1");
        mongoIntroModule.setTitle("Introduction to MongoDB");
        mongoIntroModule.setContent("Learn the basics of MongoDB and how it differs from SQL databases.");
        mongoIntroModule.setVideoUrl("https://www.youtube.com/watch?v=pWbMrx5rVBE");
        
        Module mongoCrudModule = new Module();
        mongoCrudModule.setId("m2");
        mongoCrudModule.setTitle("CRUD Operations");
        mongoCrudModule.setContent("Learn how to perform Create, Read, Update, and Delete operations in MongoDB.");
        mongoCrudModule.setVideoUrl("https://www.youtube.com/watch?v=UzLwcPjJtIU");
        
        mongodbModules.add(mongoIntroModule);
        mongodbModules.add(mongoCrudModule);
        
        mongodb.setModules(mongodbModules);
        mongodb.setEnrolledStudents(new ArrayList<>());
        
        // Save all courses
        courseRepository.saveAll(Arrays.asList(webDev, reactDev, mongodb));
        
        System.out.println("Sample courses created successfully");
    }
}
