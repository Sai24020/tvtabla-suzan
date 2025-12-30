const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // baseUrl: 'http://127.0.0.1:5500',
    setupNodeEvents(on, config) {
      // Log task for student information
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      // Get student name from environment variable set by PowerShell scripts
      if (process.env.CYPRESS_STUDENT_NAME) {
        config.env.STUDENT_NAME = process.env.CYPRESS_STUDENT_NAME;
      }

      return config;
    },
    
  },
  env: {
    student: '', // Legacy support
    STUDENT_NAME: '', // New standardized name
  }
  // Usage examples:
  // PowerShell: .\PsCypressOpen.ps1 (auto-detects git username)
  // Manual: npx cypress run --env STUDENT_NAME='Student Name'
  // Legacy: npx cypress run --env student='Benji Osterlund_12345'
  
});
