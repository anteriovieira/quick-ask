// Initialize side panel on install/startup
chrome.runtime.onInstalled.addListener(async () => {
    try {
        if (chrome.sidePanel) {
            await chrome.sidePanel.setOptions({
                path: 'sidepanel.html',
                enabled: true
            });
            console.log('Side panel initialized on install');
        } else {
            console.error('Side panel API not available - Chrome version might be too old (needs 114+)');
        }
    } catch (error) {
        console.error('Error initializing side panel:', error);
    }
});

// Also set on startup
chrome.runtime.onStartup.addListener(async () => {
    try {
        if (chrome.sidePanel) {
            await chrome.sidePanel.setOptions({
                path: 'sidepanel.html',
                enabled: true
            });
            console.log('Side panel initialized on startup');
        }
    } catch (error) {
        console.error('Error initializing side panel on startup:', error);
    }
});

// Set side panel options for all tabs when they become active
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        if (chrome.sidePanel) {
            await chrome.sidePanel.setOptions({
                tabId: activeInfo.tabId,
                path: 'sidepanel.html',
                enabled: true
            });
        }
    } catch (error) {
        // Ignore errors
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        try {
            if (chrome.sidePanel) {
                await chrome.sidePanel.setOptions({
                    tabId: tabId,
                    path: 'sidepanel.html',
                    enabled: true
                });
            }
        } catch (error) {
            // Ignore errors
        }
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'askAI') {
        handleAskAI(request, sendResponse);
        return true; // Will respond asynchronously
    }
    
    if (request.action === 'openSidePanel') {
        const tabId = sender.tab?.id;
        if (!tabId) {
            console.error('No tab ID available');
            sendResponse({ success: false, error: 'No tab ID' });
            return;
        }
        
        // Open side panel - options should already be set by onActivated/onUpdated
        // Just call open() directly in response to user gesture
        if (!chrome.sidePanel) {
            console.error('Side panel API is not available');
            sendResponse({ success: false, error: 'Side panel API not available' });
            return;
        }
        
        console.log('=== Opening side panel for tab:', tabId);
        
        // Call open() directly - this must be in response to user gesture
        chrome.sidePanel.open({ tabId }).then(() => {
            console.log('✅ Side panel opened successfully');
            sendResponse({ success: true });
        }).catch((error) => {
            console.error('❌ Error opening side panel:', error);
            // Try setting options and opening again
            chrome.sidePanel.setOptions({
                tabId: tabId,
                path: 'sidepanel.html',
                enabled: true
            }).then(() => {
                return chrome.sidePanel.open({ tabId });
            }).then(() => {
                console.log('✅ Side panel opened after setting options');
                sendResponse({ success: true });
            }).catch((retryError) => {
                console.error('❌ Retry also failed:', retryError);
                sendResponse({ success: false, error: retryError.message });
            });
        });
        
        return true; // Will respond asynchronously
    }
    
    if (request.action === 'getCurrentSelection') {
        // Forward request to content script
        chrome.tabs.sendMessage(request.tabId, { action: 'getCurrentSelection' }, (response) => {
            sendResponse(response);
        });
        return true;
    }
    
    if (request.action === 'textSelected') {
        // Broadcast to side panel
        chrome.runtime.sendMessage(request);
        sendResponse({ success: true });
    }
});

async function openSidePanel(tabId) {
    try {
        console.log('=== Opening side panel for tab:', tabId);
        
        // Check if sidePanel API is available
        if (!chrome.sidePanel) {
            console.error('Side panel API is not available. Chrome version might be too old.');
            return;
        }
        
        // First, ensure side panel is enabled globally
        console.log('Setting global side panel options...');
        await chrome.sidePanel.setOptions({
            path: 'sidepanel.html',
            enabled: true
        });
        console.log('Global options set');
        
        // Then set it for the specific tab
        console.log('Setting tab-specific side panel options...');
        await chrome.sidePanel.setOptions({
            tabId: tabId,
            path: 'sidepanel.html',
            enabled: true
        });
        console.log('Tab options set');
        
        // Small delay to ensure options are set
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Then open it
        console.log('Calling chrome.sidePanel.open({ tabId: ' + tabId + ' })');
        await chrome.sidePanel.open({ tabId });
        console.log('✅ Side panel opened successfully for tab:', tabId);
    } catch (error) {
        console.error('❌ Error opening side panel:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        // Try opening globally as fallback
        try {
            console.log('Trying to open side panel globally (no tabId)...');
            await chrome.sidePanel.open({});
            console.log('✅ Side panel opened globally');
        } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError);
            // Last resort: try to open with windowId
            try {
                console.log('Trying with windowId...');
                const tab = await chrome.tabs.get(tabId);
                console.log('Tab info:', tab);
                if (tab.windowId) {
                    await chrome.sidePanel.open({ windowId: tab.windowId });
                    console.log('✅ Side panel opened with windowId:', tab.windowId);
                }
            } catch (lastError) {
                console.error('❌ Last resort failed:', lastError);
            }
        }
    }
}

async function handleAskAI(request, sendResponse) {
    try {
        const { openaiApiKey } = await chrome.storage.sync.get('openaiApiKey');

        if (!openaiApiKey) {
            sendResponse({ error: 'Please set your OpenAI API Key in the extension options.' });
            return;
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant. The user will provide a text selection and a question about it. Answer the question based on the text provided, but you can also use your general knowledge if needed. Be concise.'
                    },
                    {
                        role: 'user',
                        content: `Text: "${request.text}"\n\nQuestion: ${request.question}`
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API Error:', errorData);
            sendResponse({ error: errorData.error?.message || 'Failed to get response from AI.' });
            return;
        }

        const data = await response.json();
        const answer = data.choices[0].message.content;
        sendResponse({ answer });

    } catch (error) {
        console.error('Fetch Error:', error);
        sendResponse({ error: 'Network error or invalid API key.' });
    }
}
