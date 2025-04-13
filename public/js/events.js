// events.js - Enhanced with QR code generation and deck management

// DOM Elements
const eventForm = document.getElementById('create-event-form');
const eventsList = document.getElementById('events-list');
const questionForm = document.getElementById('generate-questions-form');
const questionsList = document.getElementById('questions-list');
const generateBtn = document.getElementById('generate-btn');
const topicInput = document.getElementById('topic');
const countInput = document.getElementById('question-count');
const eventIdInput = document.getElementById('event-id');
const saveQuestionsBtn = document.getElementById('save-questions-btn');
const eventsContainer = document.getElementById('events-container');
const generatedQuestionsContainer = document.getElementById('generated-questions');
const eventQuestionsContainer = document.getElementById('event-questions-container');
const eventQuestionsList = document.getElementById('event-questions-list');
const copyLinkBtn = document.getElementById('copy-link-btn');

// State
let currentEventId = '';
let currentEvent = null;
let currentQuestions = [];
let generatedQuestions = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    requireAuth();
    
    // Load events
    loadEvents();
    
    // Setup event listeners
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Create event button
    document.getElementById('create-event-btn').addEventListener('click', createEvent);
    
    // Generate questions button
    generateBtn.addEventListener('click', generateQuestions);
    
    // Save questions button
    saveQuestionsBtn.addEventListener('click', saveQuestions);
    
    // Copy link button
    copyLinkBtn.addEventListener('click', copyParticipantLink);
}

// Load events
async function loadEvents() {
    try {
        eventsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading events...</p>
            </div>
        `;
        
        const events = await apiRequest('/events');
        
        if (events.length === 0) {
            eventsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p>No events found. Create your first event to get started.</p>
                </div>
            `;
            return;
        }
        
        // Clear events container
        eventsContainer.innerHTML = '';
        
        // Add events to container
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'col-md-4 mb-4';
            eventCard.innerHTML = `
                <div class="card event-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${event.name}</h5>
                        <p class="card-text">${event.description}</p>
                        <p class="card-text"><small class="text-muted">Date: ${new Date(event.date).toLocaleDateString()}</small></p>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                        <button class="btn btn-sm btn-primary view-questions" data-id="${event.id}">View Questions</button>
                        <button class="btn btn-sm btn-success generate-questions" data-id="${event.id}" data-bs-toggle="modal" data-bs-target="#generateQuestionsModal">Generate Questions</button>
                    </div>
                </div>
            `;
            eventsContainer.appendChild(eventCard);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.view-questions').forEach(button => {
            button.addEventListener('click', () => viewQuestions(button.dataset.id));
        });
        
        document.querySelectorAll('.generate-questions').forEach(button => {
            button.addEventListener('click', () => {
                currentEventId = button.dataset.id;
                eventIdInput.value = currentEventId;
                // Reset the form
                questionForm.reset();
                generatedQuestionsContainer.classList.add('d-none');
                saveQuestionsBtn.classList.add('d-none');
            });
        });
        
    } catch (error) {
        console.error('Error loading events:', error);
        eventsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-danger">Failed to load events. Please try again later.</p>
            </div>
        `;
        showAlert('Failed to load events. Please try again later.', 'danger');
    }
}

// Create a new event
async function createEvent() {
    const name = document.getElementById('event-name').value;
    const description = document.getElementById('event-description').value;
    const date = document.getElementById('event-date').value;
    
    if (!name || !description || !date) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }
    
    try {
        await apiRequest('/events', 'POST', {
            name,
            description,
            date
        });
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('createEventModal'));
        modal.hide();
        
        // Clear form
        document.getElementById('create-event-form').reset();
        
        // Show success message
        showAlert('Event created successfully', 'success');
        
        // Reload events
        loadEvents();
        
    } catch (error) {
        console.error('Error creating event:', error);
        showAlert('Failed to create event. Please try again later.', 'danger');
    }
}

// Generate questions
async function generateQuestions() {
    const topic = topicInput.value;
    const count = countInput.value;
    
    if (!topic) {
        showAlert('Please enter a topic', 'danger');
        return;
    }
    
    if (!count || count < 1 || count > 10) {
        showAlert('Please enter a valid number of questions (1-10)', 'danger');
        return;
    }
    
    try {
        // Show loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Generating...
        `;
        
        const data = await apiRequest('/questions/generate', 'POST', {
            topic,
            count: parseInt(count)
        });
        
        // Reset button
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate';
        
        // Store generated questions
        generatedQuestions = data.questions;
        
        // Display generated questions
        questionsList.innerHTML = '';
        generatedQuestions.forEach(question => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = question.text;
            questionsList.appendChild(li);
        });
        
        // Show questions and save button
        generatedQuestionsContainer.classList.remove('d-none');
        saveQuestionsBtn.classList.remove('d-none');
        
    } catch (error) {
        console.error('Error generating questions:', error);
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate';
        showAlert('Failed to generate questions. Please try again later.', 'danger');
    }
}

// Save questions
async function saveQuestions() {
    if (!currentEventId) {
        showAlert('No event selected', 'danger');
        return;
    }
    
    if (generatedQuestions.length === 0) {
        showAlert('No questions to save', 'danger');
        return;
    }
    
    try {
        // Show loading state
        saveQuestionsBtn.disabled = true;
        saveQuestionsBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Saving...
        `;
        
        await apiRequest('/questions', 'POST', {
            questions: generatedQuestions,
            eventId: currentEventId
        });
        
        // Reset button
        saveQuestionsBtn.disabled = false;
        saveQuestionsBtn.textContent = 'Save Questions';
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('generateQuestionsModal'));
        modal.hide();
        
        // Show success message
        showAlert('Questions saved successfully', 'success');
        
    } catch (error) {
        console.error('Error saving questions:', error);
        saveQuestionsBtn.disabled = false;
        saveQuestionsBtn.textContent = 'Save Questions';
        showAlert('Failed to save questions. Please try again later.', 'danger');
    }
}

// View questions for an event
async function viewQuestions(eventId) {
    try {
        currentEventId = eventId;
        
        // Show loading state
        eventQuestionsList.innerHTML = `
            <div class="text-center py-3">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading questions...</p>
            </div>
        `;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('viewQuestionsModal'));
        modal.show();
        
        const questions = await apiRequest(`/questions/${eventId}`);
        
        if (questions.length === 0) {
            eventQuestionsList.innerHTML = '<p class="text-center py-3">No questions found for this event.</p>';
            return;
        }
        
        // Clear questions list
        eventQuestionsList.innerHTML = '';
        
        // Add questions to list
        questions.forEach(question => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>${question.text}</div>
                    <span class="badge bg-primary">${question.category || 'General'}</span>
                </div>
            `;
            eventQuestionsList.appendChild(li);
        });
        
    } catch (error) {
        console.error('Error loading questions:', error);
        eventQuestionsList.innerHTML = '<p class="text-center py-3 text-danger">Failed to load questions. Please try again later.</p>';
        showAlert('Failed to load questions. Please try again later.', 'danger');
    }
}

// Copy participant link
function copyParticipantLink() {
    if (!currentEventId) {
        showAlert('No event selected', 'danger');
        return;
    }
    
    const participantUrl = `${window.location.origin}/participant.html?event=${currentEventId}`;
    
    // Create temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = participantUrl;
    document.body.appendChild(tempInput);
    
    // Select and copy
    tempInput.select();
    document.execCommand('copy');
    
    // Remove temporary element
    document.body.removeChild(tempInput);
    
    // Show success message
    showAlert('Participant link copied to clipboard', 'success');
}

// Call init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
