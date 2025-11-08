import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'HomelessAid',
      nav: {
        dashboard: 'Dashboard',
        profiles: 'Profiles',
        createProfile: 'Create Profile',
        allProfiles: 'All Profiles',
        resources: 'Resources',
        shelters: 'Shelters',
        jobs: 'Jobs',
        matches: 'Matches',
        reports: 'Reports',
        settings: 'Settings',
        help: 'Help',
        logout: 'Logout'
      },
      auth: {
        login: 'Login',
        register: 'Register',
        email: 'Email',
        phone: 'Phone Number',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        name: 'Full Name',
        role: 'Role',
        volunteer: 'Volunteer',
        ngoStaff: 'NGO Staff',
        admin: 'Admin',
        sendOTP: 'Send OTP',
        verifyOTP: 'Verify OTP',
        loginButton: 'Sign In',
        registerButton: 'Create Account',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?'
      },
      dashboard: {
        welcome: 'Welcome',
        stats: 'Statistics',
        totalProfiles: 'Total Profiles',
        pendingApprovals: 'Pending Approvals',
        shelterCapacity: 'Shelter Capacity',
        jobPlacements: 'Job Placements',
        recentActivity: 'Recent Activity',
        quickActions: 'Quick Actions'
      },
      profile: {
        createNew: 'Create New Profile',
        basicInfo: 'Basic Information',
        location: 'Location',
        health: 'Health Information',
        skills: 'Skills & Work History',
        needs: 'Needs & Priority',
        consent: 'Consent & Submit',
        name: 'Name',
        alias: 'Alias/Nickname',
        age: 'Age',
        gender: 'Gender',
        photo: 'Photo',
        uploadPhoto: 'Upload Photo'
      },
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        print: 'Print',
        loading: 'Loading...',
        offline: 'You are offline',
        online: 'Back online',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        language: 'Language'
      }
    }
  },
  hi: {
    translation: {
      appName: 'बेघर सहायता',
      nav: {
        dashboard: 'डैशबोर्ड',
        profiles: 'प्रोफाइल',
        createProfile: 'प्रोफाइल बनाएं',
        allProfiles: 'सभी प्रोफाइल',
        resources: 'संसाधन',
        shelters: 'आश्रय',
        jobs: 'नौकरियां',
        matches: 'मैच',
        reports: 'रिपोर्ट',
        settings: 'सेटिंग्स',
        help: 'मदद',
        logout: 'लॉग आउट'
      },
      auth: {
        login: 'लॉगिन',
        register: 'पंजीकरण',
        email: 'ईमेल',
        phone: 'फ़ोन नंबर',
        password: 'पासवर्ड',
        confirmPassword: 'पासवर्ड की पुष्टि करें',
        name: 'पूरा नाम',
        role: 'भूमिका',
        volunteer: 'स्वयंसेवक',
        ngoStaff: 'एनजीओ कर्मचारी',
        admin: 'व्यवस्थापक',
        sendOTP: 'OTP भेजें',
        verifyOTP: 'OTP सत्यापित करें',
        loginButton: 'साइन इन करें',
        registerButton: 'खाता बनाएं',
        noAccount: 'खाता नहीं है?',
        hasAccount: 'पहले से खाता है?'
      },
      dashboard: {
        welcome: 'स्वागत है',
        stats: 'आंकड़े',
        totalProfiles: 'कुल प्रोफाइल',
        pendingApprovals: 'लंबित स्वीकृतियां',
        shelterCapacity: 'आश्रय क्षमता',
        jobPlacements: 'नौकरी प्लेसमेंट',
        recentActivity: 'हाल की गतिविधि',
        quickActions: 'त्वरित कार्य'
      },
      profile: {
        createNew: 'नया प्रोफाइल बनाएं',
        basicInfo: 'बुनियादी जानकारी',
        location: 'स्थान',
        health: 'स्वास्थ्य जानकारी',
        skills: 'कौशल और कार्य इतिहास',
        needs: 'जरूरतें और प्राथमिकता',
        consent: 'सहमति और सबमिट',
        name: 'नाम',
        alias: 'उपनाम',
        age: 'उम्र',
        gender: 'लिंग',
        photo: 'फोटो',
        uploadPhoto: 'फोटो अपलोड करें'
      },
      common: {
        save: 'सहेजें',
        cancel: 'रद्द करें',
        delete: 'हटाएं',
        edit: 'संपादित करें',
        add: 'जोड़ें',
        next: 'अगला',
        previous: 'पिछला',
        submit: 'जमा करें',
        search: 'खोजें',
        filter: 'फ़िल्टर',
        export: 'निर्यात',
        print: 'प्रिंट',
        loading: 'लोड हो रहा है...',
        offline: 'आप ऑफ़लाइन हैं',
        online: 'वापस ऑनलाइन',
        darkMode: 'डार्क मोड',
        lightMode: 'लाइट मोड',
        language: 'भाषा'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
