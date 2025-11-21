let shadowHost = null;
let shadowRoot = null;
let floatingBtn = null;
let chatBox = null;
let currentSelection = '';
let selectionTimeout = null;
let lastSelectionText = '';

// Icons
const SPARKLE_ICON = `<svg viewBox="0 0 24 24"><path d="M12 2L14.5 9L22 12L14.5 15L12 22L9.5 15L2 12L9.5 9L12 2Z" /></svg>`;
const SEND_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
const CLOSE_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

function init() {
    // Wait for body to be available
    if (!document.body) {
        setTimeout(init, 100);
        return;
    }

    // Check if already initialized
    if (shadowHost) {
        return;
    }

    try {
        console.log('DeepAsk: Initializing...');
        shadowHost = document.createElement('div');
        shadowHost.id = 'deepask-host';
        document.body.appendChild(shadowHost);
        shadowRoot = shadowHost.attachShadow({ mode: 'open' });

        // Inject styles directly (more reliable than external link)
        const style = document.createElement('style');
        // Detect theme preference
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const accentBlue = isDarkMode ? '#8ab4f8' : '#1a73e8';
        const accentBlueHover = isDarkMode ? '#aecbfa' : '#1557b0';
        const textOnAccent = isDarkMode ? '#202124' : '#ffffff';

        style.textContent = `
          .deepask-reset {
            all: initial;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            box-sizing: border-box;
          }
          .deepask-btn {
            position: absolute;
            background: ${accentBlue};
            border-radius: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            pointer-events: auto;
            border: none;
            z-index: 2147483647;
            padding: 8px 16px;
            animation: fadeIn 0.2s ease-out;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .deepask-btn:hover {
            transform: translateY(-1px) scale(1.02);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.15);
            background: ${accentBlueHover} !important;
          }
          .deepask-btn:active {
            transform: translateY(0) scale(0.98);
          }
          .deepask-btn-content {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .deepask-btn svg {
            width: 16px;
            height: 16px;
            fill: ${textOnAccent};
            flex-shrink: 0;
          }
          .deepask-btn-text {
            color: ${textOnAccent};
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            letter-spacing: 0.01em;
          }

        `;
        shadowRoot.appendChild(style);

        // Add event listeners with capture to catch events early
        document.addEventListener('mouseup', handleSelection, true);
        document.addEventListener('keyup', handleKeyboardSelection, true);
        document.addEventListener('selectionchange', handleSelectionChange, true);
        console.log('DeepAsk: Event listeners attached');
        console.log('DeepAsk: Initialization complete. Try selecting text on the page.');

        // Listen for messages from side panel
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'getCurrentSelection') {
                sendResponse({ text: currentSelection });
                return true;
            }
            if (request.action === 'textSelected') {
                // This is handled by side panel directly
                return true;
            }
        });

        // Add keyboard shortcut to open side panel when text is selected
        document.addEventListener('keydown', async (e) => {
            // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                const selection = window.getSelection();
                const text = selection.toString().trim();
                if (text.length > 0) {
                    e.preventDefault();
                    currentSelection = text;
                    lastSelectionText = text;

                    // Check API key first
                    const { openaiApiKey } = await chrome.storage.sync.get('openaiApiKey');
                    if (!openaiApiKey || openaiApiKey.trim() === '') {
                        chrome.runtime.sendMessage({ action: 'openOptionsPage' });
                        return;
                    }

                    await openSidePanel();
                    removeFloatingButton();
                }
            }
        }, true);

        document.addEventListener('mousedown', (e) => {
            // Don't hide button if clicking on the button itself
            if (e.target.closest('#deepask-host')) {
                return;
            }

            // Hide button if clicking outside (but not on the button itself)
            if (floatingBtn && !chatBox) {
                // Small delay to allow button click to register
                setTimeout(() => {
                    if (floatingBtn && !chatBox) {
                        removeFloatingButton();
                    }
                }, 200);
            }
        }, true);
    } catch (error) {
        console.error('DeepAsk initialization error:', error);
    }
}

function handleSelection(e) {
    // Clear any pending timeout
    if (selectionTimeout) {
        clearTimeout(selectionTimeout);
    }
    // Check immediately, then again after a short delay to catch any delayed selection
    checkAndShowSelection();
    selectionTimeout = setTimeout(() => {
        checkAndShowSelection();
    }, 150);
}

function handleKeyboardSelection(e) {
    // Clear any pending timeout
    if (selectionTimeout) {
        clearTimeout(selectionTimeout);
    }
    // Check for keyboard shortcuts that might select text
    // Also check if text is selected after key release
    selectionTimeout = setTimeout(() => {
        checkAndShowSelection();
    }, 100);
}

function handleSelectionChange() {
    // Clear any pending timeout
    if (selectionTimeout) {
        clearTimeout(selectionTimeout);
    }
    // This fires whenever selection changes, including keyboard selections
    // Debounce to avoid too many calls
    selectionTimeout = setTimeout(() => {
        checkAndShowSelection();
    }, 150);
}

function checkAndShowSelection() {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    console.log('DeepAsk: Checking selection, text length:', text.length, 'text:', text.substring(0, 50));

    // Only proceed if we have text
    if (text.length > 0) {
        // If it's a new selection, show floating button
        if (text !== lastSelectionText) {
            console.log('DeepAsk: New selection detected, showing button');
            currentSelection = text;
            lastSelectionText = text;

            // Get the position of the selection to show button nearby
            try {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                // Position button above the selection, slightly to the right
                const buttonX = rect.right + window.scrollX;
                const buttonY = rect.top + window.scrollY - 45;
                showFloatingButton(buttonX, buttonY);
            } catch (e) {
                console.error('DeepAsk: Error getting selection position', e);
            }
        }
    } else if (text.length === 0) {
        // Clear last selection when selection is cleared
        lastSelectionText = '';
        // Hide button when selection is cleared
        removeFloatingButton();
    }
}

function updateSelectionInChatBox() {
    if (!chatBox) return;
    const messagesContainer = shadowRoot.querySelector('#deepask-messages');
    if (messagesContainer) {
        // Update the user message showing the selected text
        const userMsg = messagesContainer.querySelector('.deepask-message.user');
        if (userMsg) {
            userMsg.textContent = `"${currentSelection.substring(0, 100)}${currentSelection.length > 100 ? '...' : ''}"`;
        }
    }
}

function showFloatingButton(x, y) {
    if (floatingBtn) removeFloatingButton();

    floatingBtn = document.createElement('div');
    floatingBtn.className = 'deepask-btn deepask-reset';
    floatingBtn.innerHTML = `
        <div class="deepask-btn-content">
            ${SPARKLE_ICON}
            <span class="deepask-btn-text">Ask AI</span>
        </div>
    `;

    // Position the button near the selection
    floatingBtn.style.left = `${Math.min(x, window.innerWidth - 120)}px`;
    floatingBtn.style.top = `${Math.max(y, 10)}px`;

    floatingBtn.addEventListener('mousedown', (e) => {
        // Prevent selection from being cleared when clicking button
        e.stopPropagation();
        e.preventDefault();
    });

    floatingBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('🔵 DeepAsk: Button clicked!');
        console.log('🔵 DeepAsk: Using stored selection:', currentSelection.substring(0, 50));

        // Use the stored selection (don't check window.getSelection() as it may be cleared)
        if (!currentSelection || currentSelection.trim() === '') {
            console.error('❌ DeepAsk: No stored selection found!');
            return;
        }

        // Check if API key is set
        const { openaiApiKey } = await chrome.storage.sync.get('openaiApiKey');

        if (!openaiApiKey || openaiApiKey.trim() === '') {
            console.log('DeepAsk: No API key found, opening settings');
            chrome.runtime.sendMessage({ action: 'openOptionsPage' });
            removeFloatingButton();
            return;
        }

        console.log('✅ DeepAsk: API key found, opening side panel with text:', currentSelection.substring(0, 50));
        // Send selected text to side panel and open it
        await openSidePanel();
        removeFloatingButton();
    });

    shadowRoot.appendChild(floatingBtn);

    // Auto-hide button after a few seconds if not clicked
    setTimeout(() => {
        if (floatingBtn && !chatBox) {
            removeFloatingButton();
        }
    }, 5000);
}

function removeFloatingButton() {
    if (floatingBtn) {
        floatingBtn.remove();
        floatingBtn = null;
    }
}



async function openSidePanel() {
    console.log('DeepAsk: Opening side panel with selection:', currentSelection.substring(0, 50));

    try {
        console.log('DeepAsk: Sending openSidePanel message to background script');

        // Request background script to open side panel
        // The background script will get the tab ID from sender.tab.id
        chrome.runtime.sendMessage({ action: 'openSidePanel' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('❌ DeepAsk: Error sending message to background:', chrome.runtime.lastError);
                alert('Error opening side panel. Please check the console for details.');
                return;
            }

            console.log('✅ DeepAsk: Side panel opening response:', response);

            if (response && response.error) {
                console.error('❌ DeepAsk: Error from background:', response.error);
                alert('Error opening side panel: ' + response.error);
                return;
            }

            // Send selected text to side panel after a delay to ensure it's open
            // Use a flag to prevent sending duplicate messages
            if (!window._deepAskTextSent) {
                window._deepAskTextSent = true;
                setTimeout(() => {
                    console.log('DeepAsk: Sending selected text to side panel');
                    chrome.runtime.sendMessage({
                        action: 'textSelected',
                        text: currentSelection
                    }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error('DeepAsk: Error sending text to side panel:', chrome.runtime.lastError);
                        } else {
                            console.log('✅ DeepAsk: Text sent to side panel successfully');
                        }
                        // Reset flag after a short delay to allow new selections
                        setTimeout(() => {
                            window._deepAskTextSent = false;
                        }, 2000);
                    });
                }, 1000);
            }
        });
    } catch (error) {
        console.error('DeepAsk: Exception in openSidePanel:', error);
    }
}

function openChatBox() {
    if (chatBox) {
        console.log('DeepAsk: Chat box already open');
        return;
    }

    console.log('DeepAsk: Opening chat box with selection:', currentSelection.substring(0, 50));
    chatBox = document.createElement('div');
    chatBox.className = 'deepask-box deepask-reset';
    chatBox.innerHTML = `
    <div class="deepask-header">
      <div class="deepask-title">
        ${SPARKLE_ICON} Quick Ask
      </div>
      <button class="deepask-close">${CLOSE_ICON}</button>
    </div>
    <div class="deepask-content" id="deepask-messages">
      <div class="deepask-message ai">
        Hello! I see you selected some text. How can I help you with it?
      </div>
      <div class="deepask-message user" style="font-style: italic; opacity: 0.8;">
        "${currentSelection.substring(0, 100)}${currentSelection.length > 100 ? '...' : ''}"
      </div>
    </div>
    <div class="deepask-input-area">
      <input type="text" class="deepask-input" placeholder="Ask a question..." autofocus>
      <button class="deepask-send">${SEND_ICON}</button>
    </div>
  `;

    shadowRoot.appendChild(chatBox);
    console.log('DeepAsk: Chat box appended to shadow root');

    const closeBtn = chatBox.querySelector('.deepask-close');
    closeBtn.addEventListener('click', closeChatBox);

    const sendBtn = chatBox.querySelector('.deepask-send');
    const input = chatBox.querySelector('.deepask-input');
    const messagesContainer = chatBox.querySelector('#deepask-messages');

    const sendMessage = async () => {
        const question = input.value.trim();
        if (!question) return;

        // Add user message
        appendMessage(question, 'user');
        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;

        // Add loading state
        const loadingId = appendMessage('Thinking...', 'ai');

        try {
            const response = await chrome.runtime.sendMessage({
                action: 'askAI',
                text: currentSelection,
                question: question
            });

            // Remove loading and add response
            const loadingMsg = messagesContainer.querySelector(`[data-id="${loadingId}"]`);
            if (loadingMsg) loadingMsg.remove();

            if (response.error) {
                appendMessage(`Error: ${response.error}`, 'ai');
            } else {
                appendMessage(response.answer, 'ai');
            }
        } catch (err) {
            const loadingMsg = messagesContainer.querySelector(`[data-id="${loadingId}"]`);
            if (loadingMsg) loadingMsg.remove();
            appendMessage('Error: Could not connect to background script.', 'ai');
        }

        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    };

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Focus input
    setTimeout(() => input.focus(), 100);
}

function closeChatBox() {
    if (chatBox) {
        chatBox.remove();
        chatBox = null;
        // Reset selection tracking when closing
        lastSelectionText = '';
    }
}

function appendMessage(text, type) {
    const messagesContainer = shadowRoot.querySelector('#deepask-messages');
    const msgDiv = document.createElement('div');
    const id = Date.now().toString();
    msgDiv.setAttribute('data-id', id);
    msgDiv.className = `deepask-message ${type}`;

    // Simple markdown parsing (bold and code)
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>');

    msgDiv.innerHTML = formattedText;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return id;
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

