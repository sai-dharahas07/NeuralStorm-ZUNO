
export const KEYS = {
  disabilities: "neuralstorm_disabilities",
  preferences: "neuralstorm_learning_preferences",
  diagnostic: "neuralstorm_diagnostic_result",
  practice: "neuralstorm_practice_result",
  completed: "neuralstorm_completed_lessons",
  reading: "neuralstorm_reading_settings",
  largeText: "zuno_large_text",
  highContrast: "zuno_high_contrast",
  visualMode: "zuno_visual_mode",
  language: "zuno_language",
  role: "zuno_user_role",
  lessons: "zuno_custom_lessons",
  customTests: "zuno_custom_tests",
  learnerPlans: "zuno_learner_plans",
  misconception: "zuno_misconception_insights",
  focus: "zuno_focus_mode",
  parentAccess: "zuno_parent_access",
  teachers: "zuno_teachers",
  testSubmissions: "zuno_test_submissions",
  offlineQueue: "zuno_offline_queue"
};

export const SUPPORT_IDS = [
  "dyslexia",
  "adhd",
  "visual",
  "hearing",
  "none"
];

export const LEARNING_STYLES = [
  "visual",
  "reading",
  "audio",
  "interactive"
];

export const DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced"
];

export const PACES = [
  "slow",
  "normal",
  "fast"
];

export const LANGUAGES = ["en", "te", "hi"];

// Default Machine Learning lessons
export const DEFAULT_LESSONS = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    level: "Beginner",
    duration: 10,
    description: "Understand what Machine Learning is and how it works.",
    body: "Machine Learning is a branch of Artificial Intelligence. It allows computers to learn patterns from data and make predictions without being explicitly programmed for every task."
  },
  {
    id: 2,
    title: "Types of Machine Learning",
    level: "Beginner",
    duration: 15,
    description: "Explore supervised, unsupervised and reinforcement learning.",
    body: "There are three main types of Machine Learning. Supervised learning uses labelled data. Unsupervised learning finds patterns in unlabelled data. Reinforcement learning learns through rewards and penalties."
  },
  {
    id: 3,
    title: "Understanding Training Data",
    level: "Intermediate",
    duration: 15,
    description: "Learn how data helps a model make predictions.",
    body: "Training data is the information used to teach a Machine Learning model. The model identifies patterns in the training data and uses what it learns to make predictions on new data."
  },
  {
    id: 4,
    title: "Introduction to Model Evaluation",
    level: "Intermediate",
    duration: 20,
    description: "Understand accuracy and model performance.",
    body: "Model evaluation measures how well a Machine Learning model performs. Accuracy is one common metric. It measures the proportion of predictions that are correct."
  }
];

// Safely read JSON from localStorage or sessionStorage
export function readJSON(key, fallback, sessionFirst = false) {
  const stores = sessionFirst
    ? [sessionStorage, localStorage]
    : [localStorage];

  for (const store of stores) {
    try {
      const value = store.getItem(key);

      if (value !== null) {
        return JSON.parse(value);
      }
    } catch {
      // Ignore malformed data and try the next storage.
    }
  }

  return fallback;
}

// Save JSON data
export function writeJSON(key, value, both = false) {
  localStorage.setItem(key, JSON.stringify(value));

  if (both) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
}

// Get lessons, including teacher-created lessons
export function getLessons() {
  const saved = readJSON(KEYS.lessons, null);

  return Array.isArray(saved) ? saved : DEFAULT_LESSONS;
}

// Telugu and Hindi lesson translations
export const LESSON_TRANSLATIONS = {
  te: [
    {
      title: "మెషిన్ లెర్నింగ్ పరిచయం",
      description: "మెషిన్ లెర్నింగ్ అంటే ఏమిటి మరియు అది ఎలా పనిచేస్తుందో తెలుసుకోండి.",
      body: "మెషిన్ లెర్నింగ్ అనేది కృత్రిమ మేధస్సులో ఒక భాగం. ఇది కంప్యూటర్లు డేటా నుండి నమూనాలను నేర్చుకుని, ప్రతి పనికి ప్రత్యేకంగా ప్రోగ్రామ్ చేయకుండానే అంచనాలు చేయడానికి సహాయపడుతుంది."
    },
    {
      title: "మెషిన్ లెర్నింగ్ రకాలు",
      description: "సూపర్వైజ్డ్, అన్‌సూపర్వైజ్డ్ మరియు రీన్‌ఫోర్స్‌మెంట్ లెర్నింగ్ గురించి తెలుసుకోండి.",
      body: "మెషిన్ లెర్నింగ్‌లో మూడు ప్రధాన రకాలు ఉన్నాయి. సూపర్వైజ్డ్ లెర్నింగ్ లేబుల్ ఉన్న డేటాను ఉపయోగిస్తుంది. అన్‌సూపర్వైజ్డ్ లెర్నింగ్ లేబుల్ లేని డేటాలో నమూనాలను కనుగొంటుంది. రీన్‌ఫోర్స్‌మెంట్ లెర్నింగ్ బహుమతులు మరియు శిక్షల ద్వారా నేర్చుకుంటుంది."
    },
    {
      title: "ట్రైనింగ్ డేటాను అర్థం చేసుకోవడం",
      description: "మోడల్ అంచనాలు చేయడానికి డేటా ఎలా సహాయపడుతుందో తెలుసుకోండి.",
      body: "ట్రైనింగ్ డేటా అనేది మెషిన్ లెర్నింగ్ మోడల్‌కు శిక్షణ ఇవ్వడానికి ఉపయోగించే సమాచారం. మోడల్ ఈ డేటాలోని నమూనాలను గుర్తించి, కొత్త డేటాపై అంచనాలు చేయడానికి నేర్చుకుంటుంది."
    },
    {
      title: "మోడల్ మూల్యాంకన పరిచయం",
      description: "మోడల్ ఖచ్చితత్వం మరియు పనితీరును అర్థం చేసుకోండి.",
      body: "మోడల్ మూల్యాంకనం మెషిన్ లెర్నింగ్ మోడల్ ఎంత బాగా పనిచేస్తుందో కొలుస్తుంది. ఖచ్చితత్వం ఒక ముఖ్యమైన కొలమానం. సరైన అంచనాల నిష్పత్తిని ఇది తెలియజేస్తుంది."
    }
  ],

  hi: [
    {
      title: "मशीन लर्निंग का परिचय",
      description: "जानें कि मशीन लर्निंग क्या है और यह कैसे काम करती है।",
      body: "मशीन लर्निंग कृत्रिम बुद्धिमत्ता की एक शाखा है। यह कंप्यूटर को डेटा से पैटर्न सीखने और हर काम के लिए अलग से प्रोग्राम किए बिना अनुमान लगाने में मदद करती है।"
    },
    {
      title: "मशीन लर्निंग के प्रकार",
      description: "सुपरवाइज्ड, अनसुपरवाइज्ड और रीइन्फोर्समेंट लर्निंग को समझें।",
      body: "मशीन लर्निंग के तीन मुख्य प्रकार हैं। सुपरवाइज्ड लर्निंग लेबल वाले डेटा का उपयोग करती है। अनसुपरवाइज्ड लर्निंग बिना लेबल वाले डेटा में पैटर्न खोजती है। रीइन्फोर्समेंट लर्निंग पुरस्कार और दंड के माध्यम से सीखती है।"
    },
    {
      title: "ट्रेनिंग डेटा को समझना",
      description: "जानें कि डेटा मॉडल को अनुमान लगाने में कैसे मदद करता है।",
      body: "ट्रेनिंग डेटा वह जानकारी है जिसका उपयोग मशीन लर्निंग मॉडल को सिखाने के लिए किया जाता है। मॉडल इस डेटा में पैटर्न पहचानता है और नए डेटा पर अनुमान लगाना सीखता है।"
    },
    {
      title: "मॉडल मूल्यांकन का परिचय",
      description: "मॉडल की सटीकता और प्रदर्शन को समझें।",
      body: "मॉडल मूल्यांकन यह मापता है कि मशीन लर्निंग मॉडल कितना अच्छा काम करता है। सटीकता एक सामान्य माप है। यह सही अनुमानों का अनुपात बताती है।"
    }
  ]
};

// Return lessons in the selected language
export function getLocalizedLessons(lang = "en") {
  const base = getLessons();
  const translations = LESSON_TRANSLATIONS[lang];

  if (!translations) {
    return base;
  }

  return base.map((lesson, index) => {
    // Do not overwrite teacher-created lessons.
    if (lesson.teacherCreated) {
      return lesson;
    }

    return {
      ...lesson,
      ...(translations[index] || {})
    };
  });
}
