// Chat management
let chats = [];
let activeChat = null;
let currentSelection = '';
let messagesContainer = null;
let questionInput = null;
let sendBtn = null;
let lastHandledText = '';

const STORAGE_KEY = 'quickask_chats';
const ACTIVE_CHAT_KEY = 'quickask_active_chat';

function init() {
    messagesContainer = document.getElementById('messages');
    questionInput = document.getElementById('questionInput');
    sendBtn = document.getElementById('sendBtn');

    // Load chats from localStorage
    loadChats();

    // Chat functionality
    setupChat();

    // Quick action buttons
    setupQuickActions();

    // New chat buttons
    setupNewChatButtons();

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

function setupNewChatButtons() {
    const newChatBtn = document.getElementById('newChatBtn');
    const newChatIcon = document.getElementById('newChatIcon');

    if (newChatBtn) {
        newChatBtn.addEventListener('click', createNewChat);
    }

    if (newChatIcon) {
        newChatIcon.addEventListener('click', createNewChat);
    }
}

function loadChats() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const storedActiveChat = localStorage.getItem(ACTIVE_CHAT_KEY);

        if (stored) {
            chats = JSON.parse(stored);
        }

        if (storedActiveChat && chats.find(c => c.id === storedActiveChat)) {
            activeChat = storedActiveChat;
            loadChat(activeChat);
        } else if (chats.length > 0) {
            // Load the most recent chat
            activeChat = chats[0].id;
            loadChat(activeChat);
        }

        renderChatList();
    } catch (error) {
        console.error('Error loading chats:', error);
        chats = [];
    }
}

function saveChats() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
        if (activeChat) {
            localStorage.setItem(ACTIVE_CHAT_KEY, activeChat);
        }
    } catch (error) {
        console.error('Error saving chats:', error);
    }
}

function createNewChat() {
    const newChat = {
        id: `chat_${Date.now()}`,
        title: 'New Chat',
        messages: [],
        selectedText: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    chats.unshift(newChat);
    activeChat = newChat.id;

    saveChats();
    renderChatList();
    loadChat(activeChat);
}

function switchChat(chatId) {
    activeChat = chatId;
    localStorage.setItem(ACTIVE_CHAT_KEY, activeChat);
    loadChat(chatId);
    renderChatList();
}

function loadChat(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    // Clear messages container
    messagesContainer.innerHTML = '';

    // Set current selection
    currentSelection = chat.selectedText || '';
    lastHandledText = currentSelection;

    // Load messages
    if (chat.messages.length === 0) {
        // Show empty state
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <h3>Select text to get started</h3>
            <p>Select any text on the page and click "Ask AI" to start asking questions about it.</p>
        `;
        messagesContainer.appendChild(emptyState);

        // Disable input
        questionInput.disabled = true;
        sendBtn.disabled = true;

        // Hide quick actions
        const quickActions = document.getElementById('quickActions');
        if (quickActions) {
            quickActions.style.display = 'none';
        }
    } else {
        // Render messages
        chat.messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${msg.type}`;
            msgDiv.innerHTML = formatMessage(msg.text);
            messagesContainer.appendChild(msgDiv);
        });

        // Enable input if there's selected text
        if (currentSelection) {
            questionInput.disabled = false;
            sendBtn.disabled = false;
            questionInput.focus();

            // Show quick actions
            const quickActions = document.getElementById('quickActions');
            if (quickActions) {
                quickActions.style.display = 'flex';
            }
        }
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function renderChatList() {
    const chatList = document.getElementById('chatList');
    if (!chatList) return;

    chatList.innerHTML = '';

    chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${chat.id === activeChat ? 'active' : ''}`;
        chatItem.innerHTML = `
            <div class="chat-item-title">${chat.title}</div>
            <div class="chat-item-time">${formatTime(chat.updatedAt)}</div>
        `;
        chatItem.addEventListener('click', () => switchChat(chat.id));
        chatList.appendChild(chatItem);
    });
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Less than 1 minute
    if (diff < 60000) {
        return 'Just now';
    }

    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}m ago`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}h ago`;
    }

    // Less than 7 days
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}d ago`;
    }

    // Format as date
    return date.toLocaleDateString();
}

function updateChatTitle(chatId, firstMessage) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    // Use first 50 characters of the first user message
    const title = firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : '');
    chat.title = title;
    chat.updatedAt = Date.now();

    saveChats();
    renderChatList();
}

function formatMessage(text) {
    // Simple markdown parsing
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
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

    // Create new chat if none exists or if current chat already has messages
    const chat = chats.find(c => c.id === activeChat);
    if (!chat || chat.messages.length > 0) {
        createNewChat();
    }

    // Update current chat
    const currentChat = chats.find(c => c.id === activeChat);
    if (currentChat) {
        currentChat.selectedText = text;
        currentChat.updatedAt = Date.now();

        // Clear empty state
        const emptyState = messagesContainer.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        // Add selected text message
        const selectedTextMsg = {
            text: `"${text.substring(0, 200)}${text.length > 200 ? '...' : ''}"`,
            type: 'user'
        };
        currentChat.messages.push(selectedTextMsg);
        appendMessage(selectedTextMsg.text, selectedTextMsg.type);

        // Add welcome message
        const welcomeMsg = {
            text: 'Hello! I see you selected some text. How can I help you with it?',
            type: 'ai'
        };
        currentChat.messages.push(welcomeMsg);
        appendMessage(welcomeMsg.text, welcomeMsg.type);

        // Update title with selected text
        updateChatTitle(activeChat, text);

        // Enable input
        questionInput.disabled = false;
        sendBtn.disabled = false;
        questionInput.focus();

        // Show quick actions
        const quickActions = document.getElementById('quickActions');
        if (quickActions) {
            quickActions.style.display = 'flex';
        }

        saveChats();
    }
}

function appendMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.innerHTML = formatMessage(text);
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
    const question = questionInput.value.trim();
    if (!question || !currentSelection) return;

    // Add user message
    const userMsg = {
        text: question,
        type: 'user'
    };

    const chat = chats.find(c => c.id === activeChat);
    if (chat) {
        chat.messages.push(userMsg);
        chat.updatedAt = Date.now();
        saveChats();
        renderChatList();
    }

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

        let answerText;
        if (response.error) {
            answerText = `Error: ${response.error}`;
        } else {
            answerText = response.answer;
        }

        // Add AI message to chat
        const aiMsg = {
            text: answerText,
            type: 'ai'
        };

        if (chat) {
            chat.messages.push(aiMsg);
            chat.updatedAt = Date.now();
            saveChats();
            renderChatList();
        }

        appendMessage(answerText, 'ai');
    } catch (err) {
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) {
            loadingElement.remove();
        }

        const errorText = 'Error: Could not connect to background script.';
        const errorMsg = {
            text: errorText,
            type: 'ai'
        };

        if (chat) {
            chat.messages.push(errorMsg);
            chat.updatedAt = Date.now();
            saveChats();
            renderChatList();
        }

        appendMessage(errorText, 'ai');
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
