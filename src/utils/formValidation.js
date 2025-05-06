
// Form validation utilities

export const validateRegisterForm = (formData) => {
  const errors = {};
  
  if (!formData.username?.trim()) {
    errors.username = 'Username is required';
  } else if (formData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!formData.username?.trim()) {
    errors.username = 'Username is required';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

export const validateCourseForm = (formData) => {
  const errors = {};
  
  if (!formData.title?.trim()) {
    errors.title = 'Course title is required';
  }
  
  if (!formData.description?.trim()) {
    errors.description = 'Course description is required';
  }
  
  if (!formData.instructor?.trim()) {
    errors.instructor = 'Instructor name is required';
  }
  
  if (!formData.duration?.trim()) {
    errors.duration = 'Course duration is required';
  }
  
  if (!formData.thumbnail?.trim()) {
    errors.thumbnail = 'Thumbnail URL is required';
  }
  
  // Validate modules if they exist
  if (Array.isArray(formData.modules) && formData.modules.length > 0) {
    const moduleErrors = [];
    let hasErrors = false;
    
    formData.modules.forEach((module, index) => {
      const moduleError = {};
      
      if (!module.title?.trim()) {
        moduleError.title = 'Module title is required';
        hasErrors = true;
      }
      
      if (!module.content?.trim()) {
        moduleError.content = 'Module content is required';
        hasErrors = true;
      }
      
      moduleErrors[index] = moduleError;
    });
    
    if (hasErrors) {
      errors.modules = moduleErrors;
    }
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};
