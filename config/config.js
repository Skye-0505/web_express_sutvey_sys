// constants/surveyConstants.js

module.exports = {
    // Page text
    PAGE_TITLE: "Health & Lifestyle Survey",
    PAGE_HEADING: "Health & Lifestyle Questionnaire",
    PAGE_SUBTITLE: "Tell us about your lifestyle to help us generate meaningful health data analysis",
    
    // Navigation
    NAV_BRAND: "Health & Lifestyle Survey",
    
    // Progress bar
    PROGRESS_COMPLETE: "% Complete",
    
    // Form sections
    SECTIONS: {
        BASIC_INFO: "Part 1: Basic Information",
        EXERCISE: "Part 2: Exercise Habits",
        SLEEP: "Part 3: Sleep Habits",
        DIET: "Part 4: Dietary Habits",
        SELF_ASSESSMENT: "Part 5: Health Self-Assessment"
    },
    
    // Age groups
    AGE_GROUPS: {
        '18-25': '18-25 years (Young Adult)',
        '26-35': '26-35 years (Adult)',
        '36-50': '36-50 years (Middle Age)',
        '50+': '50+ years (Senior)'
    },
    
    // Genders with icons
    GENDERS: {
        'Male': { label: 'Male', icon: 'mars' },
        'Female': { label: 'Female', icon: 'venus' },
        'Other': { label: 'Other', icon: 'genderless' }
    },
    
    // Hong Kong districts by region
    DISTRICTS: {
        'Hong Kong Island': ['Central and Western', 'Wan Chai', 'Eastern', 'Southern'],
        'Kowloon': ['Yau Tsim Mong', 'Sham Shui Po', 'Kowloon City', 'Wong Tai Sin', 'Kwun Tong'],
        'New Territories': ['North', 'Tai Po', 'Sha Tin', 'Sai Kung', 'Tsuen Wan', 'Tuen Mun', 'Yuen Long', 'Kwai Tsing', 'Islands']
    },
    
    // Exercise frequency
    EXERCISE_FREQUENCY: {
        '0': '🛋️ Sedentary (0 times/week)',
        '1-2': '🚶 Light (1-2 times/week)',
        '3-4': '🏃 Moderate (3-4 times/week)',
        '5+': '💪 Active (5+ times/week)'
    },
    
    // Exercise types
    EXERCISE_TYPES: [
        { value: 'running', label: 'Running', icon: 'running' },
        { value: 'swimming', label: 'Swimming', icon: 'swimmer' },
        { value: 'gym', label: 'Gym', icon: 'dumbbell' },
        { value: 'yoga', label: 'Yoga', icon: 'praying-hands' }
    ],
    
    // Sleep hours
    SLEEP_HOURS: {
        '<6': '😫 Insufficient (<6 hours)',
        '6-8': '😊 Normal (6-8 hours)',
        '8+': '😴 Sufficient (8+ hours)'
    },
    
    // Sleep quality
    SLEEP_QUALITY: {
        'poor': '⭐ Poor (Frequent insomnia)',
        'fair': '⭐⭐ Fair (Inconsistent)',
        'good': '⭐⭐⭐ Good (Generally restful)',
        'excellent': '⭐⭐⭐⭐ Excellent (Fall asleep easily)'
    },
    
    // Diet types
    DIET_TYPES: {
        'omnivore': '🍖 Omnivore',
        'vegetarian': '🥬 Vegetarian (with eggs/dairy)',
        'vegan': '🌱 Vegan',
        'keto': '🥑 Keto'
    },
    
    // Fast food frequency
    FASTFOOD_FREQUENCY: {
        'rarely': '🥗 Rarely (Occasional)',
        'weekly': '🍔 Weekly (Few times/week)',
        'daily': '🍟 Daily'
    },
    
    // Health score labels
    HEALTH_SCORES: [
        { value: 1, label: '1 😞' },
        { value: 2, label: '2 😐' },
        { value: 3, label: '3 🙂' },
        { value: 4, label: '4 😊' },
        { value: 5, label: '5 💪' }
    ],
    
    // Regular checkup options
    REGULAR_CHECKUP: {
        'yes': { label: 'Yes', icon: 'check-circle' },
        'no': { label: 'No', icon: 'times-circle' }
    },
    
    // Form labels and placeholders
    LABELS: {
        age_group: 'Age Group',
        gender: 'Gender',
        district: 'District',
        exercise_frequency: 'Weekly Exercise Frequency',
        exercise_type: 'Preferred Exercise Types (Multiple choice)',
        sleep_hours: 'Average Sleep Hours',
        sleep_quality: 'Sleep Quality Rating',
        diet_type: 'Diet Type',
        water_intake: 'Daily Water Intake (cups)',
        fastfood_frequency: 'Fast Food Frequency',
        health_score: 'Overall Health Score',
        regular_checkup: 'Regular Health Checkup',
        
        // Placeholders
        select_age: 'Select your age group',
        select_gender: 'Select gender',
        select_district: 'Select your district in Hong Kong',
        select_exercise_frequency: 'Select exercise frequency',
        select_sleep_hours: 'Select sleep hours',
        select_sleep_quality: 'Rate your sleep quality',
        select_diet_type: 'Select diet type',
        select_fastfood_frequency: 'Select frequency',
        
        // Helper text
        water_helper: '1 cup ≈ 250ml',
        
        // Validation messages
        validation: {
            required: 'This field is required',
            select_age: 'Please select age group',
            select_gender: 'Please select gender',
            select_district: 'Please select your district',
            select_exercise_frequency: 'Please select exercise frequency',
            select_sleep_hours: 'Please select sleep hours',
            select_sleep_quality: 'Please select sleep quality',
            select_diet_type: 'Please select diet type',
            select_fastfood_frequency: 'Please select frequency',
            select_health_score: 'Please select health score',
            select_checkup: 'Please select checkup status',
            water_range: 'Please enter a number between 1-15'
        }
    },
    
    // Buttons
    BUTTONS: {
        submit: 'Submit Survey',
        reset: 'Reset'
    },
    
    // Footer
    FOOTER: {
        text: 'Thank you for participating in the Health & Lifestyle Survey | Data used for statistical analysis only'
    }
};