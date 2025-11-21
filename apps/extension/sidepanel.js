let currentSelection = '';
let messagesContainer = null;
let questionInput = null;
let sendBtn = null;
let lastHandledText = ''; // Track last handled text to prevent duplicates

function init() {
    messagesContainer = document.getElementById('messages');
    questionInput = document.getElementById('questionInput');
    sendBtn = document.getElementById('sendBtn');

    // Chat functionality
    setupChat();

    // Quick action buttons
    setupQuickActions();

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'textSelected') {
            // Only handle if it's a new selection
            if (request.text && request.text !== lastHandledText) {
                handleTextSelected(request.text);
            }
            sendResponse({ success: true });
        }
    });

    // Check if there's already a selection when side panel opens
    checkForExistingSelection();
}

function setupChat() {
    // Send button click handler
    sendBtn.addEventListener('click', sendMessage);

    // Enter key handler
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !sendBtn.disabled) {
            sendMessage();
        }
    });
}

function setupQuickActions() {
    const quickActions = document.getElementById('quickActions');
    const quickActionBtns = quickActions.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            if (action && currentSelection) {
                // Set the input value and send the message
                questionInput.value = action;
                sendMessage();
            }
        });
    });
}

function checkForExistingSelection() {
    // Request current selection from content script via background
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.runtime.sendMessage({ 
                action: 'getCurrentSelection',
                tabId: tabs[0].id
            }, (response) => {
                if (response && response.text && response.text !== lastHandledText) {
                    handleTextSelected(response.text);
                }
            });
        }
    });
}

function handleTextSelected(text) {
    // Prevent duplicate handling of the same text
    if (text === lastHandledText) {
        return;
    }
    
    lastHandledText = text;
    currentSelection = text;
    
    // Clear empty state
    const emptyState = messagesContainer.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    // Clear existing messages if this is a new selection (but keep conversation history if user already asked questions)
    const userMessages = messagesContainer.querySelectorAll('.message.user');
    if (userMessages.length === 0) {
        // Clear all messages and start fresh
        messagesContainer.innerHTML = '';
    }

    // Enable input
    questionInput.disabled = false;
    sendBtn.disabled = false;
    questionInput.focus();

    // Show quick actions
    const quickActions = document.getElementById('quickActions');
    if (quickActions) {
        quickActions.style.display = 'flex';
    }

    // Show selected text as a user message (like the user started the chat)
    appendMessage(`"${text.substring(0, 200)}${text.length > 200 ? '...' : ''}"`, 'user');
    
    // Show welcome message
    appendMessage('Hello! I see you selected some text. How can I help you with it?', 'ai');
}

function appendMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    
    // Simple markdown parsing
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');

    msgDiv.innerHTML = formattedText;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
    const question = questionInput.value.trim();
    if (!question || !currentSelection) return;

    // Add user message
    appendMessage(question, 'user');
    questionInput.value = '';
    questionInput.disabled = true;
    sendBtn.disabled = true;

    // Add loading state
    const loadingId = Date.now().toString();
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'message ai';
    loadingMsg.id = loadingId;
    loadingMsg.textContent = 'Thinking...';
    messagesContainer.appendChild(loadingMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'askAI',
            text: currentSelection,
            question: question
        });

        // Remove loading
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) {
            loadingElement.remove();
        }

        if (response.error) {
            appendMessage(`Error: ${response.error}`, 'ai');
        } else {
            appendMessage(response.answer, 'ai');
        }
    } catch (err) {
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) {
            loadingElement.remove();
        }
        appendMessage('Error: Could not connect to background script.', 'ai');
    }

    questionInput.disabled = false;
    sendBtn.disabled = false;
    questionInput.focus();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
