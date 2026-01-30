export type Language = 'en' | 'ru' | 'az';
export interface Translations {
    common: {
        open: string;
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        close: string;
        confirm: string;
        loading: string;
        error: string;
        success: string;
        on: string;
        off: string;
        back: string;
        next: string;
        submit: string;
        search: string;
        filter: string;
        settings: string;
        profile: string;
        logout: string;
        login: string;
        signup: string;
        home: string;
        of: string;
        continue: string;
        notSet: string;
        showPassword: string;
        hidePassword: string;
        emailRequired: string;
        invalidEmail: string;
        passwordRequired: string;
        passwordTooShort: string;
        passwordRequirements: string;
    };
    nav: {
        features: string;
        howItWorks: string;
        pricing: string;
        faq: string;
        profile: string;
        logout: string;
        backToHome: string;
    };
    profile: {
        title: string;
        subtitle: string;
        settingsTitle: string;
        settingsSubtitle: string;
        contactInfo: string;
        contactInfoDesc: string;
        accountDetails: string;
        accountDetailsDesc: string;
        statistics: string;
        statisticsDesc: string;
        habitsDone: string;
        currentStreak: string;
        bestStreak: string;
        totalDays: string;
        email: string;
        username: string;
        name: string;
        surname: string;
        updateName: string;
        updateSurname: string;
        changeYourName: string;
        changeYourSurname: string;
        profileUpdated: string;
        failedToUpdateProfile: string;
        memberSince: string;
        accountType: string;
        member: string;
        upgrade: string;
        change: string;
        dangerZone: string;
        dangerZoneDesc: string;
        deleteAccount: string;
        deleteAccountDesc: string;
        deleteAccountConfirm: string;
        dashboard: string;
        profileCardHelp: string;
        logoutDesc: string;
        changeUsernameTitle: string;
        changeUsernameDesc: string;
        savingUsername: string;
        usernameUpdated: string;
        failedToUpdateUsername: string;
        profileTab: string;
        settingsTab: string;
        logoPreview: string;
        logoZoom: string;
        logoUpload: string;
        logoUploading: string;
        logoRemove: string;
        logoUpdated: string;
        logoRemoved: string;
        logoTooLarge: string;
        logoOnlyFormats: string;
        logoSaveUpload: string;
        logoUploadGif: string;
        logoPreviewTitle: string;
        logoPreviewDescCrop: string;
        logoPreviewDescGif: string;
        noImageSelected: string;
        failedToUploadLogo: string;
        failedToRemoveLogo: string;
        failedToCropLogo: string;
    };
    settings: {
        title: string;
        subtitle: string;
        generalSettings: string;
        generalSettingsDesc: string;
        emailNotifications: string;
        emailNotificationsDesc: string;
        language: string;
        languageDesc: string;
        theme: string;
        themeDesc: string;
        system: string;
        light: string;
        dark: string;
        security: string;
        securityDesc: string;
        changePassword: string;
        changePasswordDesc: string;
        update: string;
        configure: string;
    };
    subscription: {
        title: string;
        monthly: string;
        yearly: string;
        features: string;
        basic: {
            name: string;
            price: string;
            period: string;
            description: string;
            button: string;
        };
        standard: {
            name: string;
            price: string;
            period: string;
            description: string;
            button: string;
        };
        premium: {
            name: string;
            price: string;
            period: string;
            description: string;
            button: string;
        };
        feat: {
            limited: string;
            basicSupport: string;
            weeklyBlogs: string;
            drive: string;
            allFramework: string;
        };
    };
    auth: {
        login: string;
        signup: string;
        email: string;
        password: string;
        confirmPassword: string;
        forgotPassword: string;
        rememberMe: string;
        alreadyHaveAccount: string;
        dontHaveAccount: string;
    };
    language: {
        english: string;
        russian: string;
        azerbaijani: string;
    };
    hero: {
        badge: string;
        title: string;
        titleHighlight: string;
        description: string;
        startJourney: string;
        watchDemo: string;
        firstTracker: string;
        personalization: string;
        habitsTracked: string;
        dailyHabits: string;
        todayProgress: string;
        habitsCompleted: string;
        aiSuggestion: string;
        doingGreat: string;
        personalAdvice: string;
        featuresTitle: string;
        featuresSubtitle: string;
        howItWorksTitle: string;
        howItWorksSubtitle: string;
        faqTitle: string;
        faqSubtitle: string;
        aiSuggestions: string;
        motivationalMessage: string;
        personalAdviceTitle: string;
        suggestionsBasedOn: string;
        encouragement: string;
        relatedTo: string;
        greatConsistency: string;
        priority: string;
        high: string;
        medium: string;
        low: string;
    };
    addHabit: {
        title: string;
        subtitle: string;
        placeholder: string;
        suggestedForYou: string;
        prompt: string;
        failedToGenerate: string;
        aiTimeout: string;
    };
    login: {
        title: string;
        subtitle: string;
        email: string;
        password: string;
        forgotPassword: string;
        loginButton: string;
        loggingIn: string;
        loginWithGoogle: string;
        dontHaveAccount: string;
        signUp: string;
        loggedIn: string;
        loginFailed: string;
    };
    signup: {
        title: string;
        subtitle: string;
        username: string;
        email: string;
        name: string;
        surname: string;
        password: string;
        confirmPassword: string;
        passwordHint: string;
        createAccount: string;
        creatingAccount: string;
        alreadyHaveAccount: string;
        signIn: string;
        verifyEmail: string;
        verifySubtitle: string;
        verificationCode: string;
        enterCode: string;
        verifying: string;
        verifyButton: string;
        emailVerified: string;
        accountCreated: string;
        passwordsNotMatch: string;
        passwordTooShort: string;
        registrationFailed: string;
        otpVerificationFailed: string;
        termsAndPrivacy: string;
    };
    setPassword: {
        title: string;
        subtitle: string;
        newPassword: string;
        confirmPassword: string;
        setPassword: string;
        settingPassword: string;
        passwordSet: string;
        sessionExpired: string;
        failedToSet: string;
        passwordsNotMatch: string;
        passwordTooShort: string;
    };
    forgotPassword: {
        title: string;
        subtitle: string;
        email: string;
        sendCode: string;
        sending: string;
        otpSent: string;
        requestFailed: string;
        verifyTitle: string;
        verifySubtitle: string;
        resetTitle: string;
        resetSubtitle: string;
        otpLabel: string;
        otpHelp: string;
        verifyOtp: string;
        verifying: string;
        otpVerified: string;
        verifyFailed: string;
        newPassword: string;
        confirmPassword: string;
        resetPassword: string;
        resetting: string;
        passwordReset: string;
        resetFailed: string;
        resend: string;
        backToLogin: string;
    };
    todayPlan: {
        dailyHabits: string;
        todayProgress: string;
        dateProgress: string;
        loading: string;
        noHabits: string;
        habitsCompleted: string;
        habitUnmarked: string;
        habitCompleted: string;
        failedToLoad: string;
        failedToUpdate: string;
        failedToLoadDetails: string;
        onlyToday: string;
        duration: string;
        priority: string;
    };
    habitPlan: {
        overview: string;
        edit: string;
        description: string;
        enterDescription: string;
        save: string;
        cancel: string;
        descriptionUpdated: string;
        failedToUpdate: string;
        dayPlan: string;
        viewPlan: string;
        noPlan: string;
        noPlanAvailable: string;
        day: string;
        loading: string;
        notFound: string;
    };
    addHabitDialog: {
        title: string;
        subtitle: string;
        titleLabel: string;
        descriptionLabel: string;
        category: string;
        cancel: string;
        saving: string;
        addHabit: string;
        addingHabit: string;
        habitAdded: string;
        failedToAdd: string;
    };
    sidebar: {
        todaysPlan: string;
        addHabit: string;
        habits: string;
        loading: string;
        noHabits: string;
        edit: string;
        delete: string;
        deleteConfirmTitle: string;
        deleteConfirmDesc: string;
        editHabit: string;
        editHabitDesc: string;
        title: string;
        description: string;
        titlePlaceholder: string;
        descriptionPlaceholder: string;
        saving: string;
        profile: string;
        logout: string;
        signIn: string;
    };
    footer: {
        description: string;
        product: string;
        features: string;
        howItWorks: string;
        pricing: string;
        demo: string;
        company: string;
        aboutUs: string;
        blog: string;
        careers: string;
        contact: string;
        copyright: string;
        enterEmail: string;
        subscribe: string;
    };
    priority: {
        label: string;
        high: string;
        medium: string;
        low: string;
    };
    otp: {
        title: string;
        subtitle: string;
        verificationCode: string;
        enterCode: string;
        verify: string;
        didntReceive: string;
        resend: string;
        confirmationTitle: string;
        confirmationDesc: string;
        codeLabel: string;
        confirming: string;
        confirm: string;
        sending: string;
        sent: string;
        failed: string;
    };
    pages: {
        backToHome: string;
    };
    selectors: {
        selectDays: string;
        frequency: string;
        daily: string;
        dailyDesc: string;
        weekly: string;
        weeklyDesc: string;
        monthly: string;
        monthlyDesc: string;
        planLength: string;
        planLengthHint: string;
        startDate: string;
        startDateHint: string;
        time: string;
        selectDaysFirst: string;
        timeForEachDay: string;
        duration: string;
        durationPlaceholder: string;
        durationHint: string;
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
        mon: string;
        tue: string;
        wed: string;
        thu: string;
        fri: string;
        sat: string;
        sun: string;
    };
    habitPlanModal: {
        progress: string;
        notStarted: string;
        completedDays: string;
        currentStreak: string;
        days: string;
        dayPlan: string;
        completed: string;
        tipsForToday: string;
        noPlanAvailable: string;
        generatePlan: string;
        programNotStarted: string;
        noCreationDate: string;
        allDaysOverview: string;
        close: string;
        deleting: string;
    };
    chatInput: {
        placeholder: string;
        addAttachment: string;
        voiceInput: string;
        send: string;
    };
    habitSuggestion: {
        noSuggestions: string;
    };
    landing: {
        habits: {
            morningWorkout: string;
            read30min: string;
            healthyLunch: string;
            earlySleep: string;
        };
        features: {
            autoTextToHabit: {
                title: string;
                description: string;
            };
            smartRecommendations: {
                title: string;
                description: string;
            };
            motivationalMessages: {
                title: string;
                description: string;
            };
            progressAnalytics: {
                title: string;
                description: string;
            };
        };
        timeline: {
            step1: {
                step: string;
                title: string;
                subtitle: string;
                description: string;
                example: string;
            };
            step2: {
                step: string;
                title: string;
                subtitle: string;
                description: string;
                badges: {
                    morningRun: string;
                    time: string;
                    daily: string;
                };
            };
            step3: {
                step: string;
                title: string;
                subtitle: string;
                description: string;
                stats: {
                    dayStreak: string;
                    successRate: string;
                };
            };
        };
        faqs: {
            q1: {
                question: string;
                answer: string;
            };
            q2: {
                question: string;
                answer: string;
            };
            q3: {
                question: string;
                answer: string;
            };
            q4: {
                question: string;
                answer: string;
            };
            q5: {
                question: string;
                answer: string;
            };
        };
        overlay: {
            suggestions: {
                meditate: {
                    title: string;
                    time: string;
                    desc: string;
                    category: string;
                };
                hydrate: {
                    title: string;
                    time: string;
                    desc: string;
                    category: string;
                };
                planDay: {
                    title: string;
                    time: string;
                    desc: string;
                    category: string;
                };
            };
            motivation: {
                message: string;
            };
            advice: {
                highPriority: string;
                mediumPriority: string;
                lowPriority: string;
            };
        };
        demo: {
            slide1: {
                title: string;
                description: string;
            };
            slide2: {
                title: string;
                description: string;
            };
            slide3: {
                title: string;
                description: string;
            };
            slide4: {
                title: string;
                description: string;
            };
            next: string;
            back: string;
            done: string;
        };
    };
}
export const translations: Record<Language, Translations> = {
    en: {
        common: {
            open: 'Open',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            close: 'Close',
            confirm: 'Confirm',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            on: 'On',
            off: 'Off',
            back: 'Back',
            next: 'Next',
            submit: 'Submit',
            search: 'Search',
            filter: 'Filter',
            settings: 'Settings',
            profile: 'Profile',
            logout: 'Logout',
            login: 'Login',
            signup: 'Sign Up',
            home: 'Home',
            of: 'of',
            continue: 'Continue',
            notSet: 'Not set',
            showPassword: 'Show password',
            hidePassword: 'Hide password',
            emailRequired: 'Email is required',
            invalidEmail: 'Please enter a valid email address',
            passwordRequired: 'Password is required',
            passwordTooShort: 'Password must be at least 8 characters',
            passwordRequirements: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        },
        nav: {
            features: 'Features',
            howItWorks: 'How it Works',
            pricing: 'Pricing',
            faq: 'FAQ',
            profile: 'Profile',
            logout: 'Logout',
            backToHome: 'Back to Home',
        },
        profile: {
            title: 'Profile',
            subtitle: 'Manage your account information and preferences',
            settingsTitle: 'Settings',
            settingsSubtitle: 'Configure your account settings and preferences',
            contactInfo: 'Contact Information',
            contactInfoDesc: 'Your contact details and how to reach you',
            accountDetails: 'Account Details',
            accountDetailsDesc: 'Information about your account',
            statistics: 'Statistics',
            statisticsDesc: 'Your habit tracking progress',
            habitsDone: 'Habits Done',
            currentStreak: 'Current Streak',
            bestStreak: 'Best Streak',
            totalDays: 'Total Days',
            email: 'Email',
            username: 'Username',
            name: 'Name',
            surname: 'Surname',
            updateName: 'Update name',
            updateSurname: 'Update surname',
            changeYourName: 'Change your name',
            changeYourSurname: 'Change your surname',
            profileUpdated: 'Profile updated',
            failedToUpdateProfile: 'Failed to update profile',
            memberSince: 'Member Since',
            accountType: 'Subscription Plan',
            member: 'Free Plan',
            upgrade: 'Upgrade',
            change: 'Change',
            dangerZone: 'Danger Zone',
            dangerZoneDesc: 'Irreversible and destructive actions',
            deleteAccount: 'Delete Account',
            deleteAccountDesc: 'Permanently delete your account and all data',
            deleteAccountConfirm: 'Your account and all associated data will be permanently deleted.',
            dashboard: 'User Dashboard',
            profileCardHelp: 'Here you can see and manage information related to your HabitForge account.',
            logoutDesc: 'Sign out from your account',
            changeUsernameTitle: 'Change username',
            changeUsernameDesc: 'Update your display name (no OTP required).',
            savingUsername: 'Saving username...',
            usernameUpdated: 'Username updated',
            failedToUpdateUsername: 'Failed to update username',
            profileTab: 'Profile',
            settingsTab: 'Settings',
            logoPreview: 'Preview',
            logoZoom: 'Zoom',
            logoUpload: 'Upload logo',
            logoUploading: 'Uploading...',
            logoRemove: 'Remove logo',
            logoUpdated: 'Logo updated',
            logoRemoved: 'Logo removed',
            logoTooLarge: 'Logo is too large (max 5MB)',
            logoOnlyFormats: 'Only PNG/JPEG/WEBP/GIF are allowed',
            logoSaveUpload: 'Save & upload',
            logoUploadGif: 'Upload GIF',
            logoPreviewTitle: 'Preview logo',
            logoPreviewDescCrop: 'Adjust zoom and position — this is how it will look on your account.',
            logoPreviewDescGif: "Animated GIFs can't be cropped here (to keep animation). You can preview it and upload as-is.",
            noImageSelected: 'No image selected',
            failedToUploadLogo: 'Failed to upload logo',
            failedToRemoveLogo: 'Failed to remove logo',
            failedToCropLogo: 'Failed to crop logo',
        },
        subscription: {
            title: 'Simple Pricing Plans',
            monthly: 'Monthly',
            yearly: 'Yearly',
            features: 'Features',
            basic: {
                name: 'Free Plan',
                price: '$0',
                period: 'Per month/user',
                description: 'Ideal for individuals getting started with our service. No credit card required.',
                button: 'Current Plan',
            },
            standard: {
                name: 'Standard Plan',
                price: '$20',
                period: 'Per month/user',
                description: 'Perfect for small businesses looking to grow. Start with a 30-day free trial.',
                button: 'Get Started',
            },
            premium: {
                name: 'Premium Plan',
                price: 'Custom',
                period: 'Per month/user',
                description: 'Best for large organizations with advanced needs. Contact us for a custom quote.',
                button: 'Get Started',
            },
            feat: {
                limited: 'AI habit suggestions',
                basicSupport: 'Smart habit plan generation',
                weeklyBlogs: 'Streak & progress tracking',
                drive: 'Statistics dashboard',
                allFramework: 'Reminders & notifications',
            },
        },
        settings: {
            title: 'Settings',
            subtitle: 'Configure your account settings and preferences',
            generalSettings: 'General Settings',
            generalSettingsDesc: 'Manage your account preferences',
            emailNotifications: 'Email Notifications',
            emailNotificationsDesc: 'Receive email updates about your habits',
            language: 'Language',
            languageDesc: 'Choose your preferred language',
            theme: 'Theme',
            themeDesc: 'Select your display theme',
            system: 'System',
            light: 'Light',
            dark: 'Dark',
            security: 'Security',
            securityDesc: 'Protect your account',
            changePassword: 'Change Password',
            changePasswordDesc: 'Update your password regularly',
            update: 'Update',
            configure: 'Configure',
        },
        auth: {
            login: 'Login',
            signup: 'Sign Up',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            forgotPassword: 'Forgot Password?',
            rememberMe: 'Remember me',
            alreadyHaveAccount: 'Already have an account?',
            dontHaveAccount: "Don't have an account?",
        },
        language: {
            english: 'English',
            russian: 'Русский',
            azerbaijani: 'Azərbaycan',
        },
        hero: {
            badge: 'AI-Powered Habit Tracking',
            title: 'Forge Your Best Self with',
            titleHighlight: 'Smart Habits',
            description: 'HabitForge helps you build better habits — automatically creating routines from your goals, suggesting new ones, inspiring you, and analyzing your progress.',
            startJourney: 'Start Your Journey',
            watchDemo: 'Watch Demo',
            firstTracker: 'AI-Powered Tracker',
            personalization: '100% Personalization',
            habitsTracked: '50+ Habits Tracked',
            dailyHabits: 'Daily Habits',
            todayProgress: "Today's Progress",
            habitsCompleted: '2 of 4 habits completed',
            aiSuggestion: 'AI Suggestion',
            doingGreat: "You're doing great!",
            personalAdvice: 'Personal Advice',
            featuresTitle: 'Powerful Features for Habit Success',
            featuresSubtitle: 'Everything you need to build and maintain healthy habits',
            howItWorksTitle: 'How HabitForge Works',
            howItWorksSubtitle: 'Three simple steps to turn goals into daily wins',
            faqTitle: 'Frequently Asked Questions',
            faqSubtitle: 'Everything you need to know about HabitForge',
            aiSuggestions: 'AI Suggestions',
            motivationalMessage: 'Motivational Message',
            personalAdviceTitle: 'Personal Advice',
            suggestionsBasedOn: 'Based on your current habits, here are some AI-generated suggestions:',
            encouragement: 'Encouragement',
            relatedTo: 'Related to',
            greatConsistency: 'Great consistency in fitness; add recovery and protect evening reading time.',
            priority: 'Priority',
            high: 'High',
            medium: 'Medium',
            low: 'Low',
        },
        addHabit: {
            title: 'Add New Habit',
            subtitle: 'What habit would you like to build today?',
            placeholder: "e.g., 'I want to drink more water' or 'Read 30 mins daily'",
            suggestedForYou: 'Suggested for you',
            prompt: 'Prompt',
            failedToGenerate: 'Failed to generate suggestions',
            aiTimeout: 'AI did not respond in time. Please try again (and check your AI / Hugging Face settings).',
        },
        login: {
            title: 'Login to your account',
            subtitle: 'Enter your email below to login to your account',
            email: 'Email',
            password: 'Password',
            forgotPassword: 'Forgot your password?',
            loginButton: 'Login',
            loggingIn: 'Logging in...',
            loginWithGoogle: 'Login with Google',
            dontHaveAccount: "Don't have an account?",
            signUp: 'Sign up',
            loggedIn: 'Logged in',
            loginFailed: 'Login failed',
        },
        signup: {
            title: 'Create your account',
            subtitle: 'Enter your information below to create your account',
            username: 'Username',
            email: 'Email',
            name: 'Name',
            surname: 'Surname',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            passwordHint: 'Must be at least 8 characters long.',
            createAccount: 'Create Account',
            creatingAccount: 'Creating Account...',
            alreadyHaveAccount: 'Already have an account?',
            signIn: 'Sign in',
            verifyEmail: 'Verify your email',
            verifySubtitle: 'We sent a 6-digit code to',
            verificationCode: 'Verification code',
            enterCode: 'Enter the 6-digit code sent to your email.',
            verifying: 'Verifying...',
            verifyButton: 'Verify Email',
            emailVerified: 'Email verified',
            accountCreated: 'Account created. Check your email for the OTP code.',
            passwordsNotMatch: 'Passwords do not match',
            passwordTooShort: 'Password must be at least 8 characters long',
            registrationFailed: 'Registration failed',
            otpVerificationFailed: 'OTP verification failed',
            termsAndPrivacy: 'By clicking continue, you agree to our Terms of Service and Privacy Policy.',
        },
        setPassword: {
            title: 'Set your password',
            subtitle: 'Create a password to secure your account. You can use this password to login without Google next time.',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password',
            setPassword: 'Set Password',
            settingPassword: 'Setting Password...',
            passwordSet: 'Password set',
            sessionExpired: 'Session expired. Please login again.',
            failedToSet: 'Failed to set password',
            passwordsNotMatch: 'Passwords do not match',
            passwordTooShort: 'Password must be at least 8 characters long',
        },
        forgotPassword: {
            title: 'Forgot your password?',
            subtitle: 'Enter your email and we will send you a 6-digit code.',
            email: 'Email',
            sendCode: 'Send Code',
            sending: 'Sending code...',
            otpSent: 'Code sent to your email',
            requestFailed: 'Failed to send code',
            verifyTitle: 'Verify your code',
            verifySubtitle: 'Enter the 6-digit code we sent to your email.',
            resetTitle: 'Reset your password',
            resetSubtitle: 'Enter the code and your new password.',
            otpLabel: 'OTP',
            otpHelp: 'Enter the 6-digit code sent to your email.',
            verifyOtp: 'Verify Code',
            verifying: 'Verifying code...',
            otpVerified: 'Code verified',
            verifyFailed: 'Failed to verify code',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password',
            resetPassword: 'Reset Password',
            resetting: 'Resetting password...',
            passwordReset: 'Password reset successful',
            resetFailed: 'Failed to reset password',
            resend: 'Resend code',
            backToLogin: 'Back to login',
        },
        todayPlan: {
            dailyHabits: 'Daily Habits',
            todayProgress: "Today's Progress",
            dateProgress: 'Progress',
            loading: 'Loading...',
            noHabits: 'No habits scheduled for this day',
            habitsCompleted: 'habits completed',
            habitUnmarked: 'Habit unmarked',
            habitCompleted: 'Habit completed!',
            failedToLoad: 'Failed to load habits',
            failedToUpdate: 'Failed to update habit',
            failedToLoadDetails: 'Failed to load habit details',
            onlyToday: 'You can only mark habits for today',
            duration: 'Duration',
            priority: 'Priority',
        },
        habitPlan: {
            overview: 'Overview',
            edit: 'Edit',
            description: 'Description',
            enterDescription: 'Enter detailed description of the habit...',
            save: 'Save',
            cancel: 'Cancel',
            descriptionUpdated: 'Description updated successfully',
            failedToUpdate: 'Failed to update description',
            dayPlan: 'Plan',
            viewPlan: 'View and edit your',
            noPlan: 'No plan available',
            noPlanAvailable: "This habit doesn't have a day-by-day plan yet.",
            day: 'Day',
            loading: 'Loading…',
            notFound: 'Not found',
        },
        addHabitDialog: {
            title: 'Add Habit',
            subtitle: 'You can edit the title, description, and schedule before adding the habit',
            titleLabel: 'Title',
            descriptionLabel: 'Description',
            category: 'Category',
            cancel: 'Cancel',
            saving: 'Saving...',
            addHabit: 'Add Habit',
            addingHabit: 'Adding habit...',
            habitAdded: 'Habit added',
            failedToAdd: 'Failed to add habit',
        },
        sidebar: {
            todaysPlan: "Today's Plan",
            addHabit: 'Add Habit',
            habits: 'Habits',
            loading: 'Loading…',
            noHabits: 'No habits yet',
            edit: 'Edit',
            delete: 'Delete',
            deleteConfirmTitle: 'Are you sure you want to delete this plan?',
            deleteConfirmDesc: 'will be deleted. This action cannot be undone.',
            editHabit: 'Edit Habit',
            editHabitDesc: 'Rename the habit and update its description.',
            title: 'Title',
            description: 'Description',
            titlePlaceholder: 'Habit title',
            descriptionPlaceholder: 'Habit description',
            saving: 'Saving...',
            profile: 'Profile',
            logout: 'Logout',
            signIn: 'Sign In',
        },
        footer: {
            description: 'Transform your goals into daily wins with AI-powered habit tracking. Build better habits, achieve your dreams.',
            product: 'Product',
            features: 'Features',
            howItWorks: 'How it Works',
            pricing: 'Pricing',
            demo: 'Demo',
            company: 'Company',
            aboutUs: 'About Us',
            blog: 'Blog',
            careers: 'Careers',
            contact: 'Contact',
            copyright: '© 2025 HabitForge. All rights reserved.',
            enterEmail: 'Enter your email',
            subscribe: 'Subscribe',
        },
        priority: {
            label: 'Priority',
            high: 'High Priority',
            medium: 'Medium Priority',
            low: 'Low Priority',
        },
        otp: {
            title: 'Enter verification code',
            subtitle: 'We sent a 6-digit code to your email.',
            verificationCode: 'Verification code',
            enterCode: 'Enter the 6-digit code sent to your email.',
            verify: 'Verify',
            didntReceive: "Didn't receive the code?",
            resend: 'Resend',
            confirmationTitle: 'OTP confirmation',
            confirmationDesc: 'Enter the 6-digit code sent to your email to confirm this action.',
            codeLabel: 'OTP',
            confirming: 'Confirming...',
            confirm: 'Confirm',
            sending: 'Sending OTP...',
            sent: 'OTP sent to your email',
            failed: 'OTP confirmation failed',
        },
        pages: {
            backToHome: 'Back to Home',
        },
        selectors: {
            selectDays: 'Select Days',
            frequency: 'Frequency',
            daily: 'Daily',
            dailyDesc: 'Every day',
            weekly: 'Weekly',
            weeklyDesc: 'Plan for week',
            monthly: 'Monthly',
            monthlyDesc: 'Plan for month',
            planLength: 'Plan length (days)',
            planLengthHint: 'How many days ahead should we generate your plan?',
            startDate: 'Start Date',
            startDateHint: 'Select when you want to start tracking this habit',
            time: 'Time',
            selectDaysFirst: 'Select days first to set times',
            timeForEachDay: 'Time for Each Day',
            duration: 'Duration',
            durationPlaceholder: 'e.g., 30 minutes, 1 hour, 15 min',
            durationHint: 'Enter duration in any format (e.g., "30 minutes", "1 hour", "15 min")',
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday',
            friday: 'Friday',
            saturday: 'Saturday',
            sunday: 'Sunday',
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            fri: 'Fri',
            sat: 'Sat',
            sun: 'Sun',
        },
        habitPlanModal: {
            progress: 'Progress',
            notStarted: 'Not started',
            completedDays: 'Completed days',
            currentStreak: 'Current streak',
            days: 'days',
            dayPlan: 'Plan',
            completed: 'Completed',
            tipsForToday: 'Tips for Today',
            noPlanAvailable: 'No plan available for day',
            generatePlan: 'Generate a plan to get started with your daily tasks',
            programNotStarted: 'Program Not Started',
            noCreationDate: "This habit doesn't have a creation date. Please recreate the habit to start tracking.",
            allDaysOverview: 'All Days Overview',
            close: 'Close',
            deleting: 'Deleting...',
        },
        chatInput: {
            placeholder: 'Describe your habit...',
            addAttachment: 'Add attachment',
            voiceInput: 'Voice input',
            send: 'Send',
        },
        habitSuggestion: {
            noSuggestions: 'No suggestions available',
        },
        landing: {
            habits: {
                morningWorkout: 'Morning Workout',
                read30min: 'Read 30 min',
                healthyLunch: 'Healthy Lunch',
                earlySleep: 'Early Sleep',
            },
            features: {
                autoTextToHabit: {
                    title: 'Auto Text-to-Habit',
                    description: "Write your goal in simple words — we'll turn it into a clear, trackable habit and suggest the best schedule for you.",
                },
                smartRecommendations: {
                    title: 'Smart Recommendations',
                    description: 'Personalized habit suggestions based on your goals, lifestyle, and current routine to accelerate growth.',
                },
                motivationalMessages: {
                    title: 'Motivational Messages',
                    description: 'Encouraging insights and nudges that keep you on track with your habit-building journey.',
                },
                progressAnalytics: {
                    title: 'Progress Statistics',
                    description: 'A quick snapshot of habits done, current streak, best streak, and total days.',
                },
            },
            timeline: {
                step1: {
                    step: 'Step 1',
                    title: 'Describe Your Goal',
                    subtitle: '(Plain Language)',
                    description: 'Tell us what you want to achieve in simple words. No forms or templates required.',
                    example: '"I want to exercise more"',
                },
                step2: {
                    step: 'Step 2',
                    title: 'Get Your Habit Plan',
                    subtitle: '(AI Processing)',
                    description: 'We turn your goal into a clear habit with schedule, duration, and helpful tips.',
                    badges: {
                        morningRun: '🏃‍♂️ Morning Run',
                        time: '⏰ 7:00 AM',
                        daily: '📅 Daily',
                    },
                },
                step3: {
                    step: 'Step 3',
                    title: 'Track & Improve',
                    subtitle: '(Success Analytics)',
                    description: 'Mark completions, keep streaks, and get insights to improve week by week.',
                    stats: {
                        dayStreak: 'day streak',
                        successRate: 'success rate',
                    },
                },
            },
            faqs: {
                q1: {
                    question: "How does HabitForge's AI create habits from my goals?",
                    answer: 'Our AI analyzes your goal description using natural language processing to understand your intent. It then breaks down your goal into specific, measurable actions and suggests optimal timing, frequency, and duration based on your lifestyle patterns and behavioral science principles.',
                },
                q2: {
                    question: 'Can I track multiple habits at once?',
                    answer: 'Absolutely! HabitForge is designed to help you build a complete habit ecosystem. You can track unlimited habits simultaneously, and our AI will help you understand how different habits interact and support each other.',
                },
                q3: {
                    question: 'What if I miss a day or break my streak?',
                    answer: "Don't worry! HabitForge understands that building habits is a journey with ups and downs. Our system provides gentle encouragement and helps you get back on track without judgment. We focus on progress over perfection.",
                },
                q4: {
                    question: 'How do progress statistics work?',
                    answer: 'We show key habit stats like habits done, current streak, best streak, and total days to help you quickly understand your progress.',
                },
                q5: {
                    question: 'Is my data private and secure?',
                    answer: 'Yes! We take privacy seriously. All your data is encrypted and stored securely. We never share your personal information with third parties, and you have full control over your data with options to export or delete it at any time.',
                },
            },
            overlay: {
                suggestions: {
                    meditate: {
                        title: 'Meditate',
                        time: '7:00 AM',
                        desc: 'Mindfulness session before breakfast',
                        category: 'Self-care',
                    },
                    hydrate: {
                        title: 'Hydrate',
                        time: 'Throughout day',
                        desc: 'Drink 8 glasses of water',
                        category: 'Health',
                    },
                    planDay: {
                        title: 'Plan day',
                        time: '9:00 AM',
                        desc: 'Write top 3 priorities',
                        category: 'Productivity',
                    },
                },
                motivation: {
                    message: "You're building momentum! Yesterday you kept your run streak and read 20 minutes. Tiny wins stack into big change. Keep going! 💪",
                },
                advice: {
                    highPriority: 'Block 20:30–21:00 as phone-free reading time each day.',
                    mediumPriority: 'Schedule one rest day per week to maintain run streak.',
                    lowPriority: 'Prep water bottle at night to hit morning hydration goal.',
                },
            },
            demo: {
                slide1: {
                    title: 'Welcome to Habit Forge',
                    description: 'Your smart assistant for building healthy habits with AI.',
                },
                slide2: {
                    title: 'Describe your goal',
                    description: "Just write in chat what you want to achieve (e.g., 'I want to sleep better').",
                },
                slide3: {
                    title: 'Choose habits',
                    description: 'AI will suggest a list of actions. Choose the ones that suit you.',
                },
                slide4: {
                    title: 'Set up schedule',
                    description: 'Specify days and times so we can remind you.',
                },
                next: 'Next',
                back: 'Back',
                done: 'Done',
            },
        },
    },
    ru: {
        common: {
            open: 'Открыть',
            save: 'Сохранить',
            cancel: 'Отмена',
            delete: 'Удалить',
            edit: 'Редактировать',
            close: 'Закрыть',
            confirm: 'Подтвердить',
            loading: 'Загрузка...',
            error: 'Ошибка',
            success: 'Успешно',
            on: 'Вкл',
            off: 'Выкл',
            back: 'Назад',
            next: 'Далее',
            submit: 'Отправить',
            search: 'Поиск',
            filter: 'Фильтр',
            settings: 'Настройки',
            profile: 'Профиль',
            logout: 'Выйти',
            login: 'Войти',
            signup: 'Регистрация',
            home: 'Главная',
            of: 'из',
            continue: 'Продолжить',
            notSet: 'Не задано',
            showPassword: 'Показать пароль',
            hidePassword: 'Скрыть пароль',
            emailRequired: 'Email обязателен',
            invalidEmail: 'Введите корректный email адрес',
            passwordRequired: 'Пароль обязателен',
            passwordTooShort: 'Пароль должен содержать минимум 8 символов',
            passwordRequirements: 'Пароль должен содержать минимум одну заглавную букву, одну строчную, одну цифру и один специальный символ',
        },
        nav: {
            features: 'Возможности',
            howItWorks: 'Как это работает',
            pricing: 'Тарифы',
            faq: 'Часто задаваемые вопросы',
            profile: 'Профиль',
            logout: 'Выйти',
            backToHome: 'Вернуться на главную',
        },
        profile: {
            title: 'Профиль',
            subtitle: 'Управление информацией об аккаунте и настройками',
            settingsTitle: 'Настройки',
            settingsSubtitle: 'Настройка параметров аккаунта и предпочтений',
            contactInfo: 'Контактная информация',
            contactInfoDesc: 'Ваши контактные данные и способы связи',
            accountDetails: 'Детали аккаунта',
            accountDetailsDesc: 'Информация о вашем аккаунте',
            statistics: 'Статистика',
            statisticsDesc: 'Ваш прогресс отслеживания привычек',
            habitsDone: 'Выполнено привычек',
            currentStreak: 'Текущая серия',
            bestStreak: 'Лучшая серия',
            totalDays: 'Всего дней',
            email: 'Электронная почта',
            username: 'Имя пользователя',
            name: 'Имя',
            surname: 'Фамилия',
            updateName: 'Обновить имя',
            updateSurname: 'Обновить фамилию',
            changeYourName: 'Измените ваше имя',
            changeYourSurname: 'Измените вашу фамилию',
            profileUpdated: 'Профиль обновлён',
            failedToUpdateProfile: 'Не удалось обновить профиль',
            memberSince: 'Участник с',
            accountType: 'Тарифный план',
            member: 'Бесплатный план',
            upgrade: 'Улучшить',
            change: 'Изменить',
            dangerZone: 'Опасная зона',
            dangerZoneDesc: 'Необратимые и разрушительные действия',
            deleteAccount: 'Удалить аккаунт',
            deleteAccountDesc: 'Навсегда удалить ваш аккаунт и все данные',
            deleteAccountConfirm: 'Ваш аккаунт и все связанные данные будут навсегда удалены.',
            dashboard: 'Панель пользователя',
            profileCardHelp: 'Здесь вы можете просматривать и управлять информацией, связанной с вашим аккаунтом HabitForge.',
            logoutDesc: 'Выйти из аккаунта',
            changeUsernameTitle: 'Изменить имя пользователя',
            changeUsernameDesc: 'Обновите отображаемое имя (OTP не требуется).',
            savingUsername: 'Сохраняем имя пользователя...',
            usernameUpdated: 'Имя пользователя обновлено',
            failedToUpdateUsername: 'Не удалось обновить имя пользователя',
            profileTab: 'Профиль',
            settingsTab: 'Настройки',
            logoPreview: 'Предпросмотр',
            logoZoom: 'Масштаб',
            logoUpload: 'Загрузить лого',
            logoUploading: 'Загружается...',
            logoRemove: 'Удалить лого',
            logoUpdated: 'Лого обновлено',
            logoRemoved: 'Лого удалено',
            logoTooLarge: 'Лого слишком большое (макс. 5MB)',
            logoOnlyFormats: 'Только PNG/JPEG/WEBP/GIF допускаются',
            logoSaveUpload: 'Сохранить и загрузить',
            logoUploadGif: 'Загрузить GIF',
            logoPreviewTitle: 'Предпросмотр лого',
            logoPreviewDescCrop: 'Настройте масштаб и положение — так это будет выглядеть в вашем аккаунте.',
            logoPreviewDescGif: 'Анимированные GIF нельзя обрезать (чтобы сохранить анимацию). Вы можете просмотреть и загрузить как есть.',
            noImageSelected: 'Изображение не выбрано',
            failedToUploadLogo: 'Не удалось загрузить лого',
            failedToRemoveLogo: 'Не удалось удалить лого',
            failedToCropLogo: 'Не удалось обрезать лого',
        },
        subscription: {
            title: 'Простые тарифные планы',
            monthly: 'Ежемесячно',
            yearly: 'Ежегодно',
            features: 'Возможности',
            basic: {
                name: 'Бесплатный план',
                price: '$0',
                period: 'В месяц/пользователь',
                description: 'Идеально для начинающих. Кредитная карта не требуется.',
                button: 'Текущий план',
            },
            standard: {
                name: 'Стандартный план',
                price: '$20',
                period: 'В месяц/пользователь',
                description: 'Идеально для растущего бизнеса. 30-дневный бесплатный пробный период.',
                button: 'Начать',
            },
            premium: {
                name: 'Премиум план',
                price: 'Индив.',
                period: 'В месяц/пользователь',
                description: 'Для крупных организаций с особыми потребностями. Свяжитесь с нами.',
                button: 'Начать',
            },
            feat: {
                limited: 'AI-подсказки привычек',
                basicSupport: 'Умная генерация плана привычки',
                weeklyBlogs: 'Серии и трекинг прогресса',
                drive: 'Панель статистики',
                allFramework: 'Напоминания и уведомления',
            },
        },
        settings: {
            title: 'Настройки',
            subtitle: 'Настройка параметров аккаунта и предпочтений',
            generalSettings: 'Общие настройки',
            generalSettingsDesc: 'Управление настройками аккаунта',
            emailNotifications: 'Email уведомления',
            emailNotificationsDesc: 'Получать обновления по электронной почте о ваших привычках',
            language: 'Язык',
            languageDesc: 'Выберите предпочитаемый язык',
            theme: 'Тема',
            themeDesc: 'Выберите тему отображения',
            system: 'Системная',
            light: 'Светлая',
            dark: 'Тёмная',
            security: 'Безопасность',
            securityDesc: 'Защитите свой аккаунт',
            changePassword: 'Изменить пароль',
            changePasswordDesc: 'Регулярно обновляйте пароль',
            update: 'Обновить',
            configure: 'Настроить',
        },
        auth: {
            login: 'Войти',
            signup: 'Регистрация',
            email: 'Электронная почта',
            password: 'Пароль',
            confirmPassword: 'Подтвердите пароль',
            forgotPassword: 'Забыли пароль?',
            rememberMe: 'Запомнить меня',
            alreadyHaveAccount: 'Уже есть аккаунт?',
            dontHaveAccount: 'Нет аккаунта?',
        },
        language: {
            english: 'English',
            russian: 'Русский',
            azerbaijani: 'Azərbaycan',
        },
        hero: {
            badge: 'Отслеживание привычек с ИИ',
            title: 'Создайте лучшую версию себя с',
            titleHighlight: 'Умными Привычками',
            description: 'HabitForge помогает вам формировать лучшие привычки — автоматически создавая рутины из ваших целей, предлагая новые, вдохновляя вас и анализируя ваш прогресс.',
            startJourney: 'Начать Путешествие',
            watchDemo: 'Смотреть Демо',
            firstTracker: 'Трекер с ИИ',
            personalization: '100% Персонализация',
            habitsTracked: '50+ Отслеженных Привычек',
            dailyHabits: 'Ежедневные Привычки',
            todayProgress: 'Прогресс Сегодня',
            habitsCompleted: '2 из 4 привычек выполнено',
            aiSuggestion: 'Предложение ИИ',
            doingGreat: 'У вас отлично получается!',
            personalAdvice: 'Персональный Совет',
            featuresTitle: 'Мощные Возможности для Успеха Привычек',
            featuresSubtitle: 'Все, что нужно для формирования и поддержания здоровых привычек',
            howItWorksTitle: 'Как Работает HabitForge',
            howItWorksSubtitle: 'Три простых шага, чтобы превратить цели в ежедневные победы',
            faqTitle: 'Часто Задаваемые Вопросы',
            faqSubtitle: 'Все, что нужно знать о HabitForge',
            aiSuggestions: 'Предложения ИИ',
            motivationalMessage: 'Мотивационное Сообщение',
            personalAdviceTitle: 'Персональный Совет',
            suggestionsBasedOn: 'На основе ваших текущих привычек, вот некоторые предложения, сгенерированные ИИ:',
            encouragement: 'Поддержка',
            relatedTo: 'Связано с',
            greatConsistency: 'Отличная последовательность в фитнесе; добавьте восстановление и защитите время вечернего чтения.',
            priority: 'Приоритет',
            high: 'Высокий',
            medium: 'Средний',
            low: 'Низкий',
        },
        addHabit: {
            title: 'Добавить Новую Привычку',
            subtitle: 'Какую привычку вы хотели бы сформировать сегодня?',
            placeholder: "например, 'Я хочу пить больше воды' или 'Читать 30 минут ежедневно'",
            suggestedForYou: 'Рекомендуется для вас',
            prompt: 'Запрос',
            failedToGenerate: 'Не удалось сгенерировать предложения',
            aiTimeout: 'ИИ не успел ответить. Попробуйте ещё раз (и проверьте настройки AI / Hugging Face).',
        },
        login: {
            title: 'Войти в аккаунт',
            subtitle: 'Введите ваш email для входа в аккаунт',
            email: 'Электронная почта',
            password: 'Пароль',
            forgotPassword: 'Забыли пароль?',
            loginButton: 'Войти',
            loggingIn: 'Вход...',
            loginWithGoogle: 'Войти через Google',
            dontHaveAccount: 'Нет аккаунта?',
            signUp: 'Регистрация',
            loggedIn: 'Вход выполнен',
            loginFailed: 'Ошибка входа',
        },
        signup: {
            title: 'Создать аккаунт',
            subtitle: 'Введите вашу информацию для создания аккаунта',
            username: 'Имя пользователя',
            email: 'Электронная почта',
            name: 'Имя',
            surname: 'Фамилия',
            password: 'Пароль',
            confirmPassword: 'Подтвердите пароль',
            passwordHint: 'Должен быть не менее 8 символов.',
            createAccount: 'Создать аккаунт',
            creatingAccount: 'Создание аккаунта...',
            alreadyHaveAccount: 'Уже есть аккаунт?',
            signIn: 'Войти',
            verifyEmail: 'Подтвердите ваш email',
            verifySubtitle: 'Мы отправили 6-значный код на',
            verificationCode: 'Код подтверждения',
            enterCode: 'Введите 6-значный код, отправленный на ваш email.',
            verifying: 'Проверка...',
            verifyButton: 'Подтвердить Email',
            emailVerified: 'Email подтвержден',
            accountCreated: 'Аккаунт создан. Проверьте ваш email для получения кода OTP.',
            passwordsNotMatch: 'Пароли не совпадают',
            passwordTooShort: 'Пароль должен быть не менее 8 символов',
            registrationFailed: 'Ошибка регистрации',
            otpVerificationFailed: 'Ошибка проверки OTP',
            termsAndPrivacy: 'Нажимая продолжить, вы соглашаетесь с нашими Условиями использования и Политикой конфиденциальности.',
        },
        setPassword: {
            title: 'Установите пароль',
            subtitle: 'Создайте пароль для защиты вашего аккаунта. Вы сможете использовать этот пароль для входа без Google в следующий раз.',
            newPassword: 'Новый пароль',
            confirmPassword: 'Подтвердите пароль',
            setPassword: 'Установить пароль',
            settingPassword: 'Установка пароля...',
            passwordSet: 'Пароль установлен',
            sessionExpired: 'Сессия истекла. Пожалуйста, войдите снова.',
            failedToSet: 'Не удалось установить пароль',
            passwordsNotMatch: 'Пароли не совпадают',
            passwordTooShort: 'Пароль должен быть не менее 8 символов',
        },
        forgotPassword: {
            title: 'Забыли пароль?',
            subtitle: 'Введите email, и мы отправим 6-значный код.',
            email: 'Электронная почта',
            sendCode: 'Отправить код',
            sending: 'Отправка кода...',
            otpSent: 'Код отправлен на email',
            requestFailed: 'Не удалось отправить код',
            verifyTitle: 'Подтвердите код',
            verifySubtitle: 'Введите 6-значный код из письма.',
            resetTitle: 'Сброс пароля',
            resetSubtitle: 'Введите код и новый пароль.',
            otpLabel: 'OTP',
            otpHelp: 'Введите 6-значный код из письма.',
            verifyOtp: 'Подтвердить код',
            verifying: 'Проверка кода...',
            otpVerified: 'Код подтвержден',
            verifyFailed: 'Не удалось подтвердить код',
            newPassword: 'Новый пароль',
            confirmPassword: 'Подтвердите пароль',
            resetPassword: 'Сбросить пароль',
            resetting: 'Сброс пароля...',
            passwordReset: 'Пароль успешно сброшен',
            resetFailed: 'Не удалось сбросить пароль',
            resend: 'Отправить код снова',
            backToLogin: 'Назад к входу',
        },
        todayPlan: {
            dailyHabits: 'Ежедневные Привычки',
            todayProgress: 'Прогресс Сегодня',
            dateProgress: 'Прогресс',
            loading: 'Загрузка...',
            noHabits: 'Нет привычек, запланированных на этот день',
            habitsCompleted: 'привычек выполнено',
            habitUnmarked: 'Привычка отмечена как невыполненная',
            habitCompleted: 'Привычка выполнена!',
            failedToLoad: 'Не удалось загрузить привычки',
            failedToUpdate: 'Не удалось обновить привычку',
            failedToLoadDetails: 'Не удалось загрузить детали привычки',
            onlyToday: 'Вы можете отмечать привычки только на сегодня',
            duration: 'Длительность',
            priority: 'Приоритет',
        },
        habitPlan: {
            overview: 'Обзор',
            edit: 'Редактировать',
            description: 'Описание',
            enterDescription: 'Введите подробное описание привычки...',
            save: 'Сохранить',
            cancel: 'Отмена',
            descriptionUpdated: 'Описание успешно обновлено',
            failedToUpdate: 'Не удалось обновить описание',
            dayPlan: 'План',
            viewPlan: 'Просмотр и редактирование вашего',
            noPlan: 'План недоступен',
            noPlanAvailable: 'У этой привычки пока нет пошагового плана.',
            day: 'День',
            loading: 'Загрузка…',
            notFound: 'Не найдено',
        },
        addHabitDialog: {
            title: 'Добавить Привычку',
            subtitle: 'Вы можете отредактировать название, описание и расписание перед добавлением привычки',
            titleLabel: 'Название',
            descriptionLabel: 'Описание',
            category: 'Категория',
            cancel: 'Отмена',
            saving: 'Сохранение...',
            addHabit: 'Добавить Привычку',
            addingHabit: 'Добавление привычки...',
            habitAdded: 'Привычка добавлена',
            failedToAdd: 'Не удалось добавить привычку',
        },
        sidebar: {
            todaysPlan: 'План на Сегодня',
            addHabit: 'Добавить Привычку',
            habits: 'Привычки',
            loading: 'Загрузка…',
            noHabits: 'Пока нет привычек',
            edit: 'Редактировать',
            delete: 'Удалить',
            deleteConfirmTitle: 'Вы уверены, что хотите удалить этот план?',
            deleteConfirmDesc: 'будет удален. Это действие нельзя отменить.',
            editHabit: 'Редактировать Привычку',
            editHabitDesc: 'Переименуйте привычку и обновите её описание.',
            title: 'Название',
            description: 'Описание',
            titlePlaceholder: 'Название привычки',
            descriptionPlaceholder: 'Описание привычки',
            saving: 'Сохранение...',
            profile: 'Профиль',
            logout: 'Выйти',
            signIn: 'Войти',
        },
        footer: {
            description: 'Превратите ваши цели в ежедневные победы с помощью отслеживания привычек на основе ИИ. Формируйте лучшие привычки, достигайте ваших мечтаний.',
            product: 'Продукт',
            features: 'Возможности',
            howItWorks: 'Как это работает',
            pricing: 'Цены',
            demo: 'Демо',
            company: 'Компания',
            aboutUs: 'О нас',
            blog: 'Блог',
            careers: 'Карьера',
            contact: 'Контакты',
            copyright: '© 2025 HabitForge. Все права защищены.',
            enterEmail: 'Введите ваш email',
            subscribe: 'Подписаться',
        },
        priority: {
            label: 'Приоритет',
            high: 'Высокий Приоритет',
            medium: 'Средний Приоритет',
            low: 'Низкий Приоритет',
        },
        otp: {
            title: 'Введите код подтверждения',
            subtitle: 'Мы отправили 6-значный код на ваш email.',
            verificationCode: 'Код подтверждения',
            enterCode: 'Введите 6-значный код, отправленный на ваш email.',
            verify: 'Подтвердить',
            didntReceive: 'Не получили код?',
            resend: 'Отправить повторно',
            confirmationTitle: 'Подтверждение OTP',
            confirmationDesc: 'Введите 6-значный код, отправленный на ваш email, чтобы подтвердить действие.',
            codeLabel: 'OTP',
            confirming: 'Подтверждаем...',
            confirm: 'Подтвердить',
            sending: 'Отправляем OTP...',
            sent: 'OTP отправлен на ваш email',
            failed: 'Не удалось подтвердить OTP',
        },
        pages: {
            backToHome: 'Вернуться на главную',
        },
        selectors: {
            selectDays: 'Выберите Дни',
            frequency: 'Частота',
            daily: 'Ежедневно',
            dailyDesc: 'Каждый день',
            weekly: 'Еженедельно',
            weeklyDesc: 'План на неделю',
            monthly: 'Ежемесячно',
            monthlyDesc: 'План на месяц',
            planLength: 'Длина плана (дней)',
            planLengthHint: 'На сколько дней вперёд сгенерировать план?',
            startDate: 'Дата начала',
            startDateHint: 'Выберите, когда начать отслеживать эту привычку',
            time: 'Время',
            selectDaysFirst: 'Сначала выберите дни для установки времени',
            timeForEachDay: 'Время для Каждого Дня',
            duration: 'Длительность',
            durationPlaceholder: 'например, 30 минут, 1 час, 15 мин',
            durationHint: 'Введите длительность в любом формате (например, "30 минут", "1 час", "15 мин")',
            monday: 'Понедельник',
            tuesday: 'Вторник',
            wednesday: 'Среда',
            thursday: 'Четверг',
            friday: 'Пятница',
            saturday: 'Суббота',
            sunday: 'Воскресенье',
            mon: 'Пн',
            tue: 'Вт',
            wed: 'Ср',
            thu: 'Чт',
            fri: 'Пт',
            sat: 'Сб',
            sun: 'Вс',
        },
        habitPlanModal: {
            progress: 'Прогресс',
            notStarted: 'Не начато',
            completedDays: 'Завершенные дни',
            currentStreak: 'Текущая серия',
            days: 'дней',
            dayPlan: 'План',
            completed: 'Завершено',
            tipsForToday: 'Советы на Сегодня',
            noPlanAvailable: 'План недоступен для дня',
            generatePlan: 'Создайте план, чтобы начать выполнять ежедневные задачи',
            programNotStarted: 'Программа Не Начата',
            noCreationDate: 'У этой привычки нет даты создания. Пожалуйста, пересоздайте привычку, чтобы начать отслеживание.',
            allDaysOverview: 'Обзор Всех Дней',
            close: 'Закрыть',
            deleting: 'Удаление...',
        },
        chatInput: {
            placeholder: 'Опишите вашу привычку...',
            addAttachment: 'Добавить вложение',
            voiceInput: 'Голосовой ввод',
            send: 'Отправить',
        },
        habitSuggestion: {
            noSuggestions: 'Нет доступных предложений',
        },
        landing: {
            habits: {
                morningWorkout: 'Утренняя Тренировка',
                read30min: 'Читать 30 мин',
                healthyLunch: 'Здоровый Обед',
                earlySleep: 'Ранний Сон',
            },
            features: {
                autoTextToHabit: {
                    title: 'Автоматическое Преобразование Текста в Привычку',
                    description: 'Опишите свою цель простыми словами — мы превратим её в четкую, отслеживаемую привычку и предложим оптимальное расписание для вас.',
                },
                smartRecommendations: {
                    title: 'Умные Рекомендации',
                    description: 'Персонализированные предложения привычек на основе ваших целей, образа жизни и текущего распорядка для ускорения роста.',
                },
                motivationalMessages: {
                    title: 'Мотивационные Сообщения',
                    description: 'Ободряющие идеи и напоминания, которые помогут вам оставаться на правильном пути в формировании привычек.',
                },
                progressAnalytics: {
                    title: 'Статистика Прогресса',
                    description: 'Ключевые метрики: выполнено привычек, текущая серия, лучшая серия и всего дней.',
                },
            },
            timeline: {
                step1: {
                    step: 'Шаг 1',
                    title: 'Опишите Вашу Цель',
                    subtitle: '(Простыми Словами)',
                    description: 'Расскажите нам, чего вы хотите достичь, простыми словами. Никаких форм или шаблонов не требуется.',
                    example: '"Я хочу больше заниматься спортом"',
                },
                step2: {
                    step: 'Шаг 2',
                    title: 'Получите План Привычки',
                    subtitle: '(Обработка ИИ)',
                    description: 'Мы превращаем вашу цель в четкую привычку с расписанием, длительностью и полезными советами.',
                    badges: {
                        morningRun: '🏃‍♂️ Утренняя Пробежка',
                        time: '⏰ 7:00',
                        daily: '📅 Ежедневно',
                    },
                },
                step3: {
                    step: 'Шаг 3',
                    title: 'Отслеживайте и Улучшайте',
                    subtitle: '(Аналитика Успеха)',
                    description: 'Отмечайте выполнение, поддерживайте серии и получайте идеи для улучшения неделя за неделей.',
                    stats: {
                        dayStreak: 'дней подряд',
                        successRate: 'успешность',
                    },
                },
            },
            faqs: {
                q1: {
                    question: 'Как ИИ HabitForge создает привычки из моих целей?',
                    answer: 'Наш ИИ анализирует описание вашей цели с помощью обработки естественного языка, чтобы понять ваше намерение. Затем он разбивает вашу цель на конкретные, измеримые действия и предлагает оптимальное время, частоту и длительность на основе ваших жизненных паттернов и принципов поведенческой науки.',
                },
                q2: {
                    question: 'Могу ли я отслеживать несколько привычек одновременно?',
                    answer: 'Абсолютно! HabitForge разработан, чтобы помочь вам создать полную экосистему привычек. Вы можете отслеживать неограниченное количество привычек одновременно, и наш ИИ поможет вам понять, как разные привычки взаимодействуют и поддерживают друг друга.',
                },
                q3: {
                    question: 'Что если я пропущу день или прерву серию?',
                    answer: 'Не волнуйтесь! HabitForge понимает, что формирование привычек — это путь с взлетами и падениями. Наша система предоставляет мягкое ободрение и помогает вам вернуться на правильный путь без осуждения. Мы фокусируемся на прогрессе, а не на совершенстве.',
                },
                q4: {
                    question: 'Как работает статистика прогресса?',
                    answer: 'Мы показываем выполненные привычки, текущую серию, лучшую серию и общее число дней, чтобы быстро понять ваш прогресс.',
                },
                q5: {
                    question: 'Безопасны ли мои данные?',
                    answer: 'Да! Мы серьезно относимся к конфиденциальности. Все ваши данные зашифрованы и хранятся безопасно. Мы никогда не передаем вашу личную информацию третьим лицам, и у вас есть полный контроль над вашими данными с возможностью экспорта или удаления в любое время.',
                },
            },
            overlay: {
                suggestions: {
                    meditate: {
                        title: 'Медитация',
                        time: '7:00',
                        desc: 'Сессия осознанности перед завтраком',
                        category: 'Самообслуживание',
                    },
                    hydrate: {
                        title: 'Гидратация',
                        time: 'В течение дня',
                        desc: 'Выпить 8 стаканов воды',
                        category: 'Здоровье',
                    },
                    planDay: {
                        title: 'Планирование дня',
                        time: '9:00',
                        desc: 'Записать 3 главных приоритета',
                        category: 'Продуктивность',
                    },
                },
                motivation: {
                    message: 'Вы набираете обороты! Вчера вы сохранили серию пробежек и прочитали 20 минут. Маленькие победы складываются в большие изменения. Продолжайте! 💪',
                },
                advice: {
                    highPriority: 'Заблокируйте 20:30–21:00 как время чтения без телефона каждый день.',
                    mediumPriority: 'Запланируйте один день отдыха в неделю, чтобы поддерживать серию пробежек.',
                    lowPriority: 'Подготовьте бутылку с водой на ночь, чтобы достичь цели утренней гидратации.',
                },
            },
            demo: {
                slide1: {
                    title: 'Добро пожаловать в Habit Forge',
                    description: 'Ваш умный помощник для создания полезных привычек с помощью ИИ.',
                },
                slide2: {
                    title: 'Опишите свою цель',
                    description: "Просто напишите в чат, чего вы хотите достичь (например, 'хочу лучше спать').",
                },
                slide3: {
                    title: 'Выберите привычки',
                    description: 'ИИ предложит список действий. Выберите те, которые вам подходят.',
                },
                slide4: {
                    title: 'Настройте график',
                    description: 'Укажите дни и время выполнения, чтобы мы могли напоминать вам.',
                },
                next: 'Далее',
                back: 'Назад',
                done: 'Готово',
            },
        },
    },
    az: {
        common: {
            open: 'Aç',
            save: 'Saxla',
            cancel: 'Ləğv et',
            delete: 'Sil',
            edit: 'Redaktə et',
            close: 'Bağla',
            confirm: 'Təsdiqlə',
            loading: 'Yüklənir...',
            error: 'Xəta',
            success: 'Uğurlu',
            on: 'Açıq',
            off: 'Bağlı',
            back: 'Geri',
            next: 'Növbəti',
            submit: 'Göndər',
            search: 'Axtar',
            filter: 'Filtrlə',
            settings: 'Parametrlər',
            profile: 'Profil',
            logout: 'Çıxış',
            login: 'Daxil ol',
            signup: 'Qeydiyyat',
            home: 'Ana səhifə',
            of: 'dən',
            continue: 'Davam et',
            notSet: 'Təyin edilməyib',
            showPassword: 'Şifrəni göstər',
            hidePassword: 'Şifrəni gizlət',
            emailRequired: 'E-poçt tələb olunur',
            invalidEmail: 'Düzgün e-poçt ünvanı daxil edin',
            passwordRequired: 'Şifrə tələb olunur',
            passwordTooShort: 'Şifrə minimum 8 simvol olmalıdır',
            passwordRequirements: 'Şifrə minimum bir böyük hərf, bir kiçik hərf, bir rəqəm və bir xüsusi simvol ehtiva etməlidir',
        },
        nav: {
            features: 'Xüsusiyyətlər',
            howItWorks: 'Necə işləyir',
            pricing: 'Tariflər',
            faq: 'Tez-tez verilən suallar',
            profile: 'Profil',
            logout: 'Çıxış',
            backToHome: 'Ana səhifəyə qayıt',
        },
        profile: {
            title: 'Profil',
            subtitle: 'Hesab məlumatlarınızı və parametrlərinizi idarə edin',
            settingsTitle: 'Parametrlər',
            settingsSubtitle: 'Hesab parametrlərinizi və seçimlərinizi konfiqurasiya edin',
            contactInfo: 'Əlaqə məlumatları',
            contactInfoDesc: 'Əlaqə məlumatlarınız və sizinlə əlaqə yolları',
            accountDetails: 'Hesab təfərrüatları',
            accountDetailsDesc: 'Hesabınız haqqında məlumat',
            statistics: 'Statistika',
            statisticsDesc: 'Vərdişlərin izlənməsi gedişatı',
            habitsDone: 'Tamamlanmış vərdişlər',
            currentStreak: 'Cari seriya',
            bestStreak: 'Ən yaxşı seriya',
            totalDays: 'Ümumi günlər',
            email: 'E-poçt',
            username: 'İstifadəçi adı',
            name: 'Ad',
            surname: 'Soyad',
            updateName: 'Adı yenilə',
            updateSurname: 'Soyadı yenilə',
            changeYourName: 'Adınızı dəyişin',
            changeYourSurname: 'Soyadınızı dəyişin',
            profileUpdated: 'Profil yeniləndi',
            failedToUpdateProfile: 'Profili yeniləmək mümkün olmadı',
            memberSince: 'Üzv olundu',
            accountType: 'Abunə Planı',
            member: 'Pulsuz Plan',
            upgrade: 'Yüksəlt',
            change: 'Dəyiş',
            dangerZone: 'Təhlükəli zona',
            dangerZoneDesc: 'Geri qaytarılmaz və məhv edici hərəkətlər',
            deleteAccount: 'Hesabı sil',
            deleteAccountDesc: 'Hesabınızı və bütün məlumatları daimi olaraq silin',
            deleteAccountConfirm: 'Hesabınız və bütün əlaqəli məlumatlar daimi olaraq silinəcək.',
            dashboard: 'İstifadəçi paneli',
            profileCardHelp: 'Burada HabitForge hesabınızla bağlı məlumatları görə və idarə edə bilərsiniz.',
            logoutDesc: 'Hesabdan çıxış edin',
            changeUsernameTitle: 'İstifadəçi adını dəyiş',
            changeUsernameDesc: 'Görünən adınızı yeniləyin (OTP tələb olunmur).',
            savingUsername: 'İstifadəçi adı yadda saxlanılır...',
            usernameUpdated: 'İstifadəçi adı yeniləndi',
            failedToUpdateUsername: 'İstifadəçi adını yeniləmək mümkün olmadı',
            profileTab: 'Profil',
            settingsTab: 'Parametrlər',
            logoPreview: 'Önizləmə',
            logoZoom: 'Böyütmə',
            logoUpload: 'Logo yüklə',
            logoUploading: 'Yüklənir...',
            logoRemove: 'Logonu sil',
            logoUpdated: 'Logo yeniləndi',
            logoRemoved: 'Logo silindi',
            logoTooLarge: 'Logo çox böyükdür (maks. 5MB)',
            logoOnlyFormats: 'Yalnız PNG/JPEG/WEBP/GIF icazə verilir',
            logoSaveUpload: 'Saxla və yüklə',
            logoUploadGif: 'GIF yüklə',
            logoPreviewTitle: 'Logo önizləməsi',
            logoPreviewDescCrop: 'Böyütmə və mövqeyi tənzimləyin — hesabınızda belə görünəcək.',
            logoPreviewDescGif: 'Animasiyalı GIF-lər burada kəsilə bilməz (animasiyanı saxlamaq üçün). Önizləyib olduğu kimi yükləyə bilərsiniz.',
            noImageSelected: 'Şəkil seçilməyib',
            failedToUploadLogo: 'Logonu yükləmək mümkün olmadı',
            failedToRemoveLogo: 'Logonu silmək mümkün olmadı',
            failedToCropLogo: 'Logonu kəsmək mümkün olmadı',
        },
        settings: {
            title: 'Parametrlər',
            subtitle: 'Hesab parametrlərinizi və seçimlərinizi konfiqurasiya edin',
            generalSettings: 'Ümumi parametrlər',
            generalSettingsDesc: 'Hesab parametrlərinizi idarə edin',
            emailNotifications: 'E-poçt bildirişləri',
            emailNotificationsDesc: 'Vərdişləriniz haqqında e-poçt yeniləmələri alın',
            language: 'Dil',
            languageDesc: 'İstədiyiniz dili seçin',
            theme: 'Mövzu',
            themeDesc: 'Göstərmə mövzusunu seçin',
            system: 'Sistem',
            light: 'Açıq',
            dark: 'Qaranlıq',
            security: 'Təhlükəsizlik',
            securityDesc: 'Hesabınızı qoruyun',
            changePassword: 'Şifrəni dəyiş',
            changePasswordDesc: 'Şifrənizi müntəzəm olaraq yeniləyin',
            update: 'Yenilə',
            configure: 'Konfiqurasiya et',
        },
        subscription: {
            title: 'Sadə Qiymət Planları',
            monthly: 'Aylıq',
            yearly: 'İllik',
            features: 'Xüsusiyyətlər',
            basic: {
                name: 'Pulsuz Plan',
                price: '$0',
                period: 'Ayda/istifadəçi',
                description: 'Xidmətimizlə tanış olmaq istəyənlər üçün idealdır. Kredit kartı tələb olunmur.',
                button: 'Cari Plan',
            },
            standard: {
                name: 'Standart Plan',
                price: '$20',
                period: 'Ayda/istifadəçi',
                description: 'Böyümək istəyən kiçik bizneslər üçün mükəmməldir. 30 günlük pulsuz sınaq ilə başlayın.',
                button: 'Başla',
            },
            premium: {
                name: 'Premium Plan',
                price: 'Xüsusi',
                period: 'Ayda/istifadəçi',
                description: 'Qabaqcıl ehtiyacları olan böyük təşkilatlar üçün ən yaxşısı. Xüsusi təklif üçün bizimlə əlaqə saxlayın.',
                button: 'Başla',
            },
            feat: {
                limited: 'İA vərdiş təklifləri',
                basicSupport: 'Ağıllı vərdiş planı yaratma',
                weeklyBlogs: 'Seriya və irəliləyiş izləmə',
                drive: 'Statistika paneli',
                allFramework: 'Xatırlatmalar və bildirişlər',
            },
        },
        auth: {
            login: 'Daxil ol',
            signup: 'Qeydiyyat',
            email: 'E-poçt',
            password: 'Şifrə',
            confirmPassword: 'Şifrəni təsdiqlə',
            forgotPassword: 'Şifrəni unutmusunuz?',
            rememberMe: 'Məni xatırla',
            alreadyHaveAccount: 'Artıq hesabınız var?',
            dontHaveAccount: 'Hesabınız yoxdur?',
        },
        language: {
            english: 'English',
            russian: 'Русский',
            azerbaijani: 'Azərbaycan',
        },
        hero: {
            badge: 'İA ilə Vərdiş İzləmə',
            title: 'Ən Yaxşı Versiyanızı Yaradın',
            titleHighlight: 'Ağıllı Vərdişlərlə',
            description: 'HabitForge daha yaxşı vərdişlər qurmağınıza kömək edir — məqsədlərinizdən avtomatik olaraq rutinlər yaradır, yenilərini təklif edir, sizi ruhlandırır və irəliləyişinizi təhlil edir.',
            startJourney: 'Səyahətinizi Başlayın',
            watchDemo: 'Demo İzlə',
            firstTracker: 'İA İzləyicisi',
            personalization: '100% Fərdiləşdirmə',
            habitsTracked: '50+ İzlənilən Vərdiş',
            dailyHabits: 'Günlük Vərdişlər',
            todayProgress: 'Bu Günün Gedişatı',
            habitsCompleted: '4 vərdişdən 2-si tamamlandı',
            aiSuggestion: 'İA Təklifi',
            doingGreat: 'Əla edirsiniz!',
            personalAdvice: 'Şəxsi Məsləhət',
            featuresTitle: 'Vərdiş Uğuru üçün Güclü Xüsusiyyətlər',
            featuresSubtitle: 'Sağlam vərdişlər qurmaq və saxlamaq üçün lazım olan hər şey',
            howItWorksTitle: 'HabitForge Necə İşləyir',
            howItWorksSubtitle: 'Məqsədləri günlük qələbələrə çevirmək üçün üç sadə addım',
            faqTitle: 'Tez-tez Verilən Suallar',
            faqSubtitle: 'HabitForge haqqında bilməli olduğunuz hər şey',
            aiSuggestions: 'İA Təklifləri',
            motivationalMessage: 'Motivasiya Mesajı',
            personalAdviceTitle: 'Şəxsi Məsləhət',
            suggestionsBasedOn: 'Mövcud vərdişlərinizə əsasən, İA tərəfindən yaradılmış bəzi təkliflər:',
            encouragement: 'Təşviq',
            relatedTo: 'Əlaqəli',
            greatConsistency: 'Fitnessdə əla ardıcıllıq; bərpa əlavə edin və axşam oxuma vaxtını qoruyun.',
            priority: 'Prioritet',
            high: 'Yüksək',
            medium: 'Orta',
            low: 'Aşağı',
        },
        addHabit: {
            title: 'Yeni Vərdiş Əlavə Et',
            subtitle: 'Bu gün hansı vərdişi qurmaq istəyirsiniz?',
            placeholder: "məsələn, 'Daha çox su içmək istəyirəm' və ya 'Gündəlik 30 dəqiqə oxumaq'",
            suggestedForYou: 'Sizin üçün təklif olunur',
            prompt: 'Sorğu',
            failedToGenerate: 'Təkliflər yaradıla bilmədi',
            aiTimeout: 'İA cavab verə bilmədi. Yenidən cəhd edin (və AI / Hugging Face ayarlarını yoxlayın).',
        },
        login: {
            title: 'Hesabınıza daxil olun',
            subtitle: 'Hesabınıza daxil olmaq üçün email daxil edin',
            email: 'E-poçt',
            password: 'Şifrə',
            forgotPassword: 'Şifrəni unutmusunuz?',
            loginButton: 'Daxil ol',
            loggingIn: 'Daxil olunur...',
            loginWithGoogle: 'Google ilə daxil ol',
            dontHaveAccount: 'Hesabınız yoxdur?',
            signUp: 'Qeydiyyat',
            loggedIn: 'Daxil olundu',
            loginFailed: 'Daxil olmaq mümkün olmadı',
        },
        signup: {
            title: 'Hesab yaradın',
            subtitle: 'Hesab yaratmaq üçün məlumatlarınızı daxil edin',
            username: 'İstifadəçi adı',
            email: 'E-poçt',
            name: 'Ad',
            surname: 'Soyad',
            password: 'Şifrə',
            confirmPassword: 'Şifrəni təsdiqlə',
            passwordHint: 'Ən azı 8 simvol olmalıdır.',
            createAccount: 'Hesab Yarat',
            creatingAccount: 'Hesab yaradılır...',
            alreadyHaveAccount: 'Artıq hesabınız var?',
            signIn: 'Daxil ol',
            verifyEmail: 'E-poçtunuzu təsdiqləyin',
            verifySubtitle: '6 rəqəmli kod göndərdik',
            verificationCode: 'Təsdiq kodu',
            enterCode: 'E-poçtunuza göndərilən 6 rəqəmli kodu daxil edin.',
            verifying: 'Təsdiqlənir...',
            verifyButton: 'E-poçtu Təsdiqlə',
            emailVerified: 'E-poçt təsdiqləndi',
            accountCreated: 'Hesab yaradıldı. OTP kodunu almaq üçün e-poçtunuzu yoxlayın.',
            passwordsNotMatch: 'Şifrələr uyğun gəlmir',
            passwordTooShort: 'Şifrə ən azı 8 simvol olmalıdır',
            registrationFailed: 'Qeydiyyat uğursuz oldu',
            otpVerificationFailed: 'OTP təsdiqləmə uğursuz oldu',
            termsAndPrivacy: 'Davam etməklə, İstifadə Şərtlərimizə və Məxfilik Siyasətimizə razılaşırsınız.',
        },
        setPassword: {
            title: 'Şifrənizi təyin edin',
            subtitle: 'Hesabınızı qorumaq üçün şifrə yaradın. Növbəti dəfə Google olmadan bu şifrə ilə daxil ola bilərsiniz.',
            newPassword: 'Yeni Şifrə',
            confirmPassword: 'Şifrəni Təsdiqlə',
            setPassword: 'Şifrəni Təyin Et',
            settingPassword: 'Şifrə təyin edilir...',
            passwordSet: 'Şifrə təyin edildi',
            sessionExpired: 'Sessiya bitib. Zəhmət olmasa yenidən daxil olun.',
            failedToSet: 'Şifrəni təyin etmək mümkün olmadı',
            passwordsNotMatch: 'Şifrələr uyğun gəlmir',
            passwordTooShort: 'Şifrə ən azı 8 simvol olmalıdır',
        },
        forgotPassword: {
            title: 'Şifrəni unutmusunuz?',
            subtitle: 'E-poçtunuzu daxil edin, 6 rəqəmli kod göndərək.',
            email: 'E-poçt',
            sendCode: 'Kodu göndər',
            sending: 'Kod göndərilir...',
            otpSent: 'Kod e-poçtunuza göndərildi',
            requestFailed: 'Kodu göndərmək mümkün olmadı',
            verifyTitle: 'Kodu təsdiqləyin',
            verifySubtitle: 'E-poçta göndərilən 6 rəqəmli kodu daxil edin.',
            resetTitle: 'Şifrəni yenilə',
            resetSubtitle: 'Kodu və yeni şifrəni daxil edin.',
            otpLabel: 'OTP',
            otpHelp: 'E-poçta göndərilən 6 rəqəmli kodu daxil edin.',
            verifyOtp: 'Kodu təsdiqlə',
            verifying: 'Kod yoxlanılır...',
            otpVerified: 'Kod təsdiqləndi',
            verifyFailed: 'Kodu təsdiqləmək mümkün olmadı',
            newPassword: 'Yeni şifrə',
            confirmPassword: 'Şifrəni təsdiqlə',
            resetPassword: 'Şifrəni yenilə',
            resetting: 'Şifrə yenilənir...',
            passwordReset: 'Şifrə uğurla yeniləndi',
            resetFailed: 'Şifrəni yeniləmək mümkün olmadı',
            resend: 'Kodu yenidən göndər',
            backToLogin: 'Girişə qayıt',
        },
        todayPlan: {
            dailyHabits: 'Günlük Vərdişlər',
            todayProgress: 'Bu Günün Gedişatı',
            dateProgress: 'Gedişat',
            loading: 'Yüklənir...',
            noHabits: 'Bu gün üçün planlaşdırılmış vərdiş yoxdur',
            habitsCompleted: 'vərdiş tamamlandı',
            habitUnmarked: 'Vərdiş işarələnmədi',
            habitCompleted: 'Vərdiş tamamlandı!',
            failedToLoad: 'Vərdişləri yükləmək mümkün olmadı',
            failedToUpdate: 'Vərdişi yeniləmək mümkün olmadı',
            failedToLoadDetails: 'Vərdiş detallarını yükləmək mümkün olmadı',
            onlyToday: 'Yalnız bu gün üçün vərdişləri işarələyə bilərsiniz',
            duration: 'Müddət',
            priority: 'Prioritet',
        },
        habitPlan: {
            overview: 'Baxış',
            edit: 'Redaktə et',
            description: 'Təsvir',
            enterDescription: 'Vərdişin ətraflı təsvirini daxil edin...',
            save: 'Saxla',
            cancel: 'Ləğv et',
            descriptionUpdated: 'Təsvir uğurla yeniləndi',
            failedToUpdate: 'Təsviri yeniləmək mümkün olmadı',
            dayPlan: 'Plan',
            viewPlan: 'Baxış və redaktə',
            noPlan: 'Plan mövcud deyil',
            noPlanAvailable: 'Bu vərdişin hələ gün-günlük planı yoxdur.',
            day: 'Gün',
            loading: 'Yüklənir…',
            notFound: 'Tapılmadı',
        },
        addHabitDialog: {
            title: 'Vərdiş Əlavə Et',
            subtitle: 'Vərdişi əlavə etmədən əvvəl başlıq, təsvir və cədvəli redaktə edə bilərsiniz',
            titleLabel: 'Başlıq',
            descriptionLabel: 'Təsvir',
            category: 'Kateqoriya',
            cancel: 'Ləğv et',
            saving: 'Saxlanılır...',
            addHabit: 'Vərdiş Əlavə Et',
            addingHabit: 'Vərdiş əlavə edilir...',
            habitAdded: 'Vərdiş əlavə edildi',
            failedToAdd: 'Vərdişi əlavə etmək mümkün olmadı',
        },
        sidebar: {
            todaysPlan: 'Bu Günün Planı',
            addHabit: 'Vərdiş Əlavə Et',
            habits: 'Vərdişlər',
            loading: 'Yüklənir…',
            noHabits: 'Hələ vərdiş yoxdur',
            edit: 'Redaktə et',
            delete: 'Sil',
            deleteConfirmTitle: 'Bu planı silmək istədiyinizə əminsiniz?',
            deleteConfirmDesc: 'silinəcək. Bu hərəkət geri qaytarıla bilməz.',
            editHabit: 'Vərdişi Redaktə Et',
            editHabitDesc: 'Vərdişi yenidən adlandırın və təsvirini yeniləyin.',
            title: 'Başlıq',
            description: 'Təsvir',
            titlePlaceholder: 'Vərdiş başlığı',
            descriptionPlaceholder: 'Vərdiş təsviri',
            saving: 'Saxlanılır...',
            profile: 'Profil',
            logout: 'Çıxış',
            signIn: 'Daxil ol',
        },
        footer: {
            description: 'İA ilə vərdiş izləmə ilə məqsədlərinizi günlük qələbələrə çevirin. Daha yaxşı vərdişlər qurun, arzularınıza çatın.',
            product: 'Məhsul',
            features: 'Xüsusiyyətlər',
            howItWorks: 'Necə işləyir',
            pricing: 'Qiymətlər',
            demo: 'Demo',
            company: 'Şirkət',
            aboutUs: 'Haqqımızda',
            blog: 'Blog',
            careers: 'Karyera',
            contact: 'Əlaqə',
            copyright: '© 2025 HabitForge. Bütün hüquqlar qorunur.',
            enterEmail: 'E-poçtunuzu daxil edin',
            subscribe: 'Abunə ol',
        },
        priority: {
            label: 'Prioritet',
            high: 'Yüksək Prioritet',
            medium: 'Orta Prioritet',
            low: 'Aşağı Prioritet',
        },
        otp: {
            title: 'Təsdiq kodunu daxil edin',
            subtitle: 'E-poçtunuza 6 rəqəmli kod göndərdik.',
            verificationCode: 'Təsdiq kodu',
            enterCode: 'E-poçtunuza göndərilən 6 rəqəmli kodu daxil edin.',
            verify: 'Təsdiqlə',
            didntReceive: 'Kod almadınız?',
            resend: 'Yenidən göndər',
            confirmationTitle: 'OTP təsdiqi',
            confirmationDesc: 'Bu əməliyyatı təsdiqləmək üçün e-poçtunuza göndərilən 6 rəqəmli kodu daxil edin.',
            codeLabel: 'OTP',
            confirming: 'Təsdiqlənir...',
            confirm: 'Təsdiqlə',
            sending: 'OTP göndərilir...',
            sent: 'OTP e-poçtunuza göndərildi',
            failed: 'OTP təsdiqləmə uğursuz oldu',
        },
        pages: {
            backToHome: 'Ana səhifəyə qayıt',
        },
        selectors: {
            selectDays: 'Günləri Seçin',
            frequency: 'Tezlik',
            daily: 'Günlük',
            dailyDesc: 'Hər gün',
            weekly: 'Həftəlik',
            weeklyDesc: 'Həftə üçün plan',
            monthly: 'Aylıq',
            monthlyDesc: 'Ay üçün plan',
            planLength: 'Plan müddəti (gün)',
            planLengthHint: 'Planı neçə gün qabağa yaradaq?',
            startDate: 'Başlama tarixi',
            startDateHint: 'Bu vərdişi izləməyə nə vaxt başlayacağınızı seçin',
            time: 'Vaxt',
            selectDaysFirst: 'Vaxt təyin etmək üçün əvvəlcə günləri seçin',
            timeForEachDay: 'Hər Gün üçün Vaxt',
            duration: 'Müddət',
            durationPlaceholder: 'məsələn, 30 dəqiqə, 1 saat, 15 dəq',
            durationHint: 'Müddəti istənilən formada daxil edin (məsələn, "30 dəqiqə", "1 saat", "15 dəq")',
            monday: 'Bazar ertəsi',
            tuesday: 'Çərşənbə axşamı',
            wednesday: 'Çərşənbə',
            thursday: 'Cümə axşamı',
            friday: 'Cümə',
            saturday: 'Şənbə',
            sunday: 'Bazar',
            mon: 'B.e.',
            tue: 'Ç.a.',
            wed: 'Çər',
            thu: 'C.a.',
            fri: 'Cüm',
            sat: 'Şən',
            sun: 'Baz',
        },
        habitPlanModal: {
            progress: 'Gedişat',
            notStarted: 'Başlanmayıb',
            completedDays: 'Tamamlanmış günlər',
            currentStreak: 'Cari seriya',
            days: 'gün',
            dayPlan: 'Plan',
            completed: 'Tamamlandı',
            tipsForToday: 'Bu Gün üçün Məsləhətlər',
            noPlanAvailable: 'Gün üçün plan mövcud deyil',
            generatePlan: 'Günlük tapşırıqlara başlamaq üçün plan yaradın',
            programNotStarted: 'Proqram Başlanmayıb',
            noCreationDate: 'Bu vərdişin yaradılma tarixi yoxdur. İzləməyə başlamaq üçün vərdişi yenidən yaradın.',
            allDaysOverview: 'Bütün Günlərin Baxışı',
            close: 'Bağla',
            deleting: 'Silinir...',
        },
        chatInput: {
            placeholder: 'Vərdişinizi təsvir edin...',
            addAttachment: 'Əlavə əlavə et',
            voiceInput: 'Səs girişi',
            send: 'Göndər',
        },
        habitSuggestion: {
            noSuggestions: 'Təklif yoxdur',
        },
        landing: {
            habits: {
                morningWorkout: 'Səhər Məşqi',
                read30min: '30 dəq oxumaq',
                healthyLunch: 'Sağlamlıqla Nahar',
                earlySleep: 'Erkən Yuxu',
            },
            features: {
                autoTextToHabit: {
                    title: 'Avtomatik Mətn-Vərdiş',
                    description: 'Məqsədinizi sadə sözlərlə yazın — biz onu aydın, izlənilə bilən vərdişə çevirəcəyik və sizin üçün ən yaxşı cədvəli təklif edəcəyik.',
                },
                smartRecommendations: {
                    title: 'Ağıllı Təkliflər',
                    description: 'Məqsədlərinizə, həyat tərzinizə və cari rutininizə əsaslanaraq şəxsi vərdiş təklifləri, böyüməni sürətləndirmək üçün.',
                },
                motivationalMessages: {
                    title: 'Motivasiya Mesajları',
                    description: 'Vərdiş qurma səyahətinizdə sizi düzgün yolda saxlamaq üçün təşviqedici fikirlər və xatırlatmalar.',
                },
                progressAnalytics: {
                    title: 'Gedişat Statistikası',
                    description: 'Əsas göstəricilər: tamamlanmış vərdişlər, cari seriya, ən yaxşı seriya və ümumi günlər.',
                },
            },
            timeline: {
                step1: {
                    step: 'Addım 1',
                    title: 'Məqsədinizi Təsvir Edin',
                    subtitle: '(Sadə Dillə)',
                    description: 'Nə əldə etmək istədiyinizi sadə sözlərlə deyin. Heç bir forma və ya şablon tələb olunmur.',
                    example: '"Daha çox idman etmək istəyirəm"',
                },
                step2: {
                    step: 'Addım 2',
                    title: 'Vərdiş Planınızı Alın',
                    subtitle: '(İA Emalı)',
                    description: 'Məqsədinizi cədvəl, müddət və faydalı məsləhətlərlə aydın vərdişə çeviririk.',
                    badges: {
                        morningRun: '🏃‍♂️ Səhər Qaçışı',
                        time: '⏰ 7:00',
                        daily: '📅 Günlük',
                    },
                },
                step3: {
                    step: 'Addım 3',
                    title: 'İzləyin və Təkmilləşdirin',
                    subtitle: '(Uğur Analitikası)',
                    description: 'Tamamlamaları qeyd edin, seriyaları saxlayın və həftə-həftə təkmilləşdirmək üçün fikirlər əldə edin.',
                    stats: {
                        dayStreak: 'gün seriyası',
                        successRate: 'uğur dərəcəsi',
                    },
                },
            },
            faqs: {
                q1: {
                    question: 'HabitForge-nin İA məqsədlərimdən vərdişləri necə yaradır?',
                    answer: 'İA-mız məqsədinizin təsvirini təbii dil emalından istifadə edərək analiz edir ki, niyyətinizi başa düşsün. Sonra məqsədinizi konkret, ölçülə bilən hərəkətlərə bölür və həyat tərzinizə və davranış elmi prinsiplərinə əsaslanaraq optimal vaxt, tezlik və müddət təklif edir.',
                },
                q2: {
                    question: 'Bir neçə vərdişi eyni vaxtda izləyə bilərəmmi?',
                    answer: 'Əlbəttə! HabitForge tam vərdiş ekosistemini qurmağa kömək etmək üçün hazırlanmışdır. Eyni vaxtda limitsiz vərdişi izləyə bilərsiniz və İA-mız müxtəlif vərdişlərin bir-biri ilə necə qarşılıqlı əlaqə qurduğunu və bir-birini necə dəstəklədiyini başa düşməyə kömək edəcək.',
                },
                q3: {
                    question: 'Bir günü qaçırsam və ya seriyamı pozsam nə olar?',
                    answer: 'Narahat olmayın! HabitForge vərdiş qurmağın yüksəliş və enişləri olan bir səyahət olduğunu başa düşür. Sistemimiz yumşaq təşviq təmin edir və məhkəmə olmadan yenidən düzgün yola qayıtmağa kömək edir. Biz mükəmməllikdən çox tərəqqiyə diqqət yetiririk.',
                },
                q4: {
                    question: 'Gedişat statistikası necə işləyir?',
                    answer: 'Tərəqqinizi tez anlamaq üçün tamamlanmış vərdişlər, cari seriya, ən yaxşı seriya və ümumi günləri göstəririk.',
                },
                q5: {
                    question: 'Məlumatlarım məxfi və təhlükəsizdirmi?',
                    answer: 'Bəli! Məxfilikə ciddi yanaşırıq. Bütün məlumatlarınız şifrələnir və təhlükəsiz saxlanılır. Şəxsi məlumatlarınızı heç vaxt üçüncü tərəflərlə paylaşmırıq və istənilən vaxt ixrac və ya silmə seçimləri ilə məlumatlarınız üzərində tam nəzarətə maliksiniz.',
                },
            },
            overlay: {
                suggestions: {
                    meditate: {
                        title: 'Meditasiya',
                        time: '7:00',
                        desc: 'Səhər yeməyindən əvvəl diqqət seansı',
                        category: 'Özünə qulluq',
                    },
                    hydrate: {
                        title: 'Hidratasiya',
                        time: 'Gün ərzində',
                        desc: '8 stəkan su içmək',
                        category: 'Sağlamlıq',
                    },
                    planDay: {
                        title: 'Günü planla',
                        time: '9:00',
                        desc: 'Əsas 3 prioriteti yazmaq',
                        category: 'Məhsuldarlıq',
                    },
                },
                motivation: {
                    message: 'Momentum qurursunuz! Dünən qaçış seriyanızı saxladınız və 20 dəqiqə oxudunuz. Kiçik qələbələr böyük dəyişikliklərə çevrilir. Davam edin! 💪',
                },
                advice: {
                    highPriority: 'Hər gün 20:30–21:00-i telefonsuz oxuma vaxtı kimi bloklayın.',
                    mediumPriority: 'Qaçış seriyasını saxlamaq üçün həftədə bir istirahət günü planlaşdırın.',
                    lowPriority: 'Səhər hidratasiya məqsədinə çatmaq üçün gecə su butulkasını hazırlayın.',
                },
            },
            demo: {
                slide1: {
                    title: 'Habit Forge-a xoş gəlmisiniz',
                    description: 'Süni intellektlə faydalı vərdişlər yaratmaq üçün ağıllı köməkçiniz.',
                },
                slide2: {
                    title: 'Məqsədinizi təsvir edin',
                    description: "Sadəcə çatda nəyə nail olmaq istədiyinizi yazın (məsələn, 'daha yaxşı yatmaq istəyirəm').",
                },
                slide3: {
                    title: 'Vərdişləri seçin',
                    description: 'Süni intellekt hərəkətlər siyahısını təklif edəcək. Sizə uyğun olanları seçin.',
                },
                slide4: {
                    title: 'Cədvəli qurun',
                    description: 'Sizə xatırlada bilməyimiz üçün günləri və vaxtı təyin edin.',
                },
                next: 'Növbəti',
                back: 'Geri',
                done: 'Hazır',
            },
        },
    },
};
