// Google Apps Script URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzLQQ3erU1evhSi6VeyVTbrT2F3e32-oqYe9UeSds73uHvLR4e1c_S1nspEc2qz-PQ9/exec';

// Global variables
let quizData = [];
let currentQuizDay = 1;
let currentCategory = '';

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuizData();
    setupQuiz();
    setupDragAndDrop();
    setupSubmitButton();
    checkIfAlreadySubmitted();
});

// Load quiz data from JSON file
async function loadQuizData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        quizData = data.categories;
    } catch (error) {
        console.error('Error loading quiz data:', error);
        showMessage('Error loading quiz data. Please refresh the page.', 'error');
    }
}

// Get current quiz day based on New York timezone
function getCurrentQuizDay() {
    const now = new Date();
    const nyTime = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(now);
    
    const startDate = '2025-06-30';
    const currentDate = new Date(nyTime);
    const start = new Date(startDate);
    const daysDiff = Math.floor((currentDate - start) / (1000 * 60 * 60 * 24));
    const day = (daysDiff % 365) + 1;
    
    return day > 0 ? day : 365 + day;
}

// Setup the quiz for current day
function setupQuiz() {
    currentQuizDay = getCurrentQuizDay();
    const todayQuiz = quizData.find(q => q.day === currentQuizDay);
    
    if (!todayQuiz) {
        showMessage('No quiz available for today.', 'error');
        return;
    }
    
    currentCategory = todayQuiz.category;
    
    // Update UI
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/New_York'
    });
    document.getElementById('quiz-category').textContent = currentCategory;
    
    // Shuffle items and display
    const shuffledItems = shuffleArray([...todayQuiz.items]);
    displayItems(shuffledItems);
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Display items in the list
function displayItems(items) {
    const list = document.getElementById('sortable-list');
    list.innerHTML = '';
    
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'sortable-item';
        li.dataset.item = item;
        li.innerHTML = `
            <span class="rank-number">${index + 1}</span>
            <span class="item-text">${item}</span>
            <span class="drag-handle">☰</span>
        `;
        list.appendChild(li);
    });
}

// Setup drag and drop with SortableJS
function setupDragAndDrop() {
    const list = document.getElementById('sortable-list');
    
    Sortable.create(list, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onEnd: function() {
            updateRankNumbers();
        }
    });
}

// Update rank numbers after reordering
function updateRankNumbers() {
    const items = document.querySelectorAll('.sortable-item');
    items.forEach((item, index) => {
        item.querySelector('.rank-number').textContent = index + 1;
    });
}

// Setup submit button
function setupSubmitButton() {
    document.getElementById('submit-btn').addEventListener('click', submitRankings);
}

// Generate or retrieve session ID
function getOrCreateSessionId() {
    let sessionId = localStorage.getItem('quiz-session-id');
    if (!sessionId) {
        sessionId = 'session-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
        localStorage.setItem('quiz-session-id', sessionId);
    }
    return sessionId;
}

// Check if already submitted today
function checkIfAlreadySubmitted() {
    const submissionKey = `submitted-day-${currentQuizDay}`;
    const submitted = localStorage.getItem(submissionKey);
    
    if (submitted) {
        document.getElementById('submit-btn').disabled = true;
        showMessage('You have already submitted your rankings for today. Come back tomorrow!', 'info');
    }
}

// Submit rankings
async function submitRankings() {
    const items = document.querySelectorAll('.sortable-item');
    const rankings = Array.from(items).map(item => item.dataset.item);
    
    // Show loading
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('submit-btn').disabled = true;
    
    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                day: currentQuizDay,
                category: currentCategory,
                rankings: rankings,
                sessionId: getOrCreateSessionId(),
                userAgent: navigator.userAgent
            })
        });
        
        handleSubmissionSuccess();
        
    } catch (error) {
        console.error('Submission error:', error);
        handleSubmissionError();
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}

// Handle successful submission
function handleSubmissionSuccess() {
    const submissionKey = `submitted-day-${currentQuizDay}`;
    localStorage.setItem(submissionKey, 'true');
    
    showMessage('Thank you! Your rankings have been submitted successfully.', 'success');
    document.getElementById('submit-btn').disabled = true;
}

// Handle submission error
function handleSubmissionError() {
    showMessage('Error submitting rankings. Please try again.', 'error');
    document.getElementById('submit-btn').disabled = false;
}

// Show message to user
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    
    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            messageEl.className = 'message';
        }, 5000);
    }
}