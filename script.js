document.addEventListener('DOMContentLoaded', () => {
    // --- Safe Storage Wrapper to prevent SecurityError under file:// ---
    const safeStorage = {
        getItem(key) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.warn("localStorage.getItem failed, using memory storage: ", e);
                return this._data[key] || null;
            }
        },
        setItem(key, value) {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.warn("localStorage.setItem failed, using memory storage: ", e);
                this._data[key] = value;
            }
        },
        _data: {}
    };

    // --- Typewriter Constant Data ---
    const words = {
        en: ['AI Automation Engineer', 'Cybersecurity Specialist', 'Python Developer'],
        uk: ['Інженер з AI-автоматизації', 'Спеціаліст з кібербезпеки', 'Python розробник']
    };

    // --- State Variables ---
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimer = null;
    let activeLangForTyping = '';

    // --- DOM Elements ---
    const themeToggle = document.getElementById('themeToggle');
    const langToggle = document.getElementById('langToggle');
    const langIndicators = langToggle ? langToggle.querySelectorAll('.lang-indicator') : [];
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const typedTextSpan = document.getElementById('typed-text');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const roadmapCards = document.querySelectorAll('.roadmap-card');
    const flowSteps = document.querySelectorAll('.flow-step');
    const contactForm = document.getElementById('contactForm');

    // --- Helper Functions ---
    
    // Theme Management
    function setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.classList.add('light-theme');
        } else {
            document.documentElement.classList.remove('light-theme');
        }
        safeStorage.setItem('preferred-theme', theme);
    }

    // Language Management
    function setLanguage(lang) {
        document.documentElement.setAttribute('lang', lang);
        safeStorage.setItem('preferred-lang', lang);
        
        // Update switcher buttons UI
        if (langIndicators.length >= 2) {
            if (lang === 'en') {
                langIndicators[0].classList.add('active-en');
                langIndicators[1].classList.remove('active-uk');
            } else {
                langIndicators[0].classList.remove('active-en');
                langIndicators[1].classList.add('active-uk');
            }
        }
        
        // Restart typing animation with the new language words
        initTyping(lang);
    }

    // Typewriter Functions
    function initTyping(lang) {
        if (activeLangForTyping !== lang) {
            activeLangForTyping = lang;
            wordIndex = 0;
            charIndex = 0;
            isDeleting = false;
            if (typingTimer) clearTimeout(typingTimer);
            typeEffect();
        }
    }

    function typeEffect() {
        if (!typedTextSpan) return;
        const currentWordList = words[activeLangForTyping];
        const currentWord = currentWordList[wordIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 40 : 100;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % currentWordList.length;
            typeSpeed = 500;
        }
        
        typingTimer = setTimeout(typeEffect, typeSpeed);
    }

    // --- Interactive n8n Workflow Simulation ---
    let activeStepIndex = 0;
    let flowCycleInterval = null;

    function startFlowCycle() {
        if (flowSteps.length === 0) return;
        if (flowCycleInterval) clearInterval(flowCycleInterval);
        
        flowCycleInterval = setInterval(() => {
            flowSteps.forEach(step => step.classList.remove('active-node'));
            flowSteps[activeStepIndex].classList.add('active-node');
            activeStepIndex = (activeStepIndex + 1) % flowSteps.length;
        }, 2200);
    }

    // --- Set up Event Listeners ---

    // Theme Switcher Click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let currentTheme = safeStorage.getItem('preferred-theme') === 'dark' ? 'light' : 'dark';
            setTheme(currentTheme);
        });
    }

    // Language Switcher Click
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            let currentLang = safeStorage.getItem('preferred-lang') === 'en' ? 'uk' : 'en';
            setLanguage(currentLang);
        });
    }

    // Mobile Navigation Menu Toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle && navMenu) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Roadmap filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            roadmapCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // n8n flow interactions
    if (flowSteps.length > 0) {
        flowSteps.forEach((step, index) => {
            step.addEventListener('click', () => {
                clearInterval(flowCycleInterval);
                flowSteps.forEach(s => s.classList.remove('active-node'));
                step.classList.add('active-node');
                activeStepIndex = (index + 1) % flowSteps.length;
                setTimeout(startFlowCycle, 5000);
            });
        });
    }

    // Contact Form handling
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalTextEn = "Transmit Message";
            const originalTextUa = "Надіслати запит";
            const currentLang = safeStorage.getItem('preferred-lang') || 'uk';
            
            submitBtn.disabled = true;
            submitBtn.textContent = currentLang === 'en' ? "Transmitting... ⚡" : "Надсилання... ⚡";
            
            setTimeout(() => {
                if (currentLang === 'en') {
                    submitBtn.textContent = "Data Transmitted Successfully ✓";
                    alert("Message successfully simulated! For real messages, contact via telegram/phone/email.");
                } else {
                    submitBtn.textContent = "Дані успішно відправлено ✓";
                    alert("Повідомлення надіслано! Для прямого зв'язку використовуйте Telegram, телефон або пошту.");
                }
                
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = currentLang === 'en' ? originalTextEn : originalTextUa;
                }, 3000);
            }, 1500);
        });
    }

    // --- Initialization Execution Calls ---
    
    // Load and sanitize theme settings
    let loadedTheme = safeStorage.getItem('preferred-theme');
    if (loadedTheme !== 'light' && loadedTheme !== 'dark') {
        loadedTheme = 'light';
    }
    setTheme(loadedTheme);

    // Load and sanitize language settings
    let loadedLang = safeStorage.getItem('preferred-lang');
    if (loadedLang !== 'en' && loadedLang !== 'uk') {
        loadedLang = 'uk';
    }
    setLanguage(loadedLang);

    // Start n8n cycle animation
    if (flowSteps.length > 0) {
        flowSteps[0].classList.add('active-node');
        activeStepIndex = 1;
        startFlowCycle();
    }
});
