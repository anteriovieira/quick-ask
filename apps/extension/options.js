document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveBtn').addEventListener('click', saveOptions);

const DEFAULT_SYSTEM_PROMPT = 'You are a helpful assistant. The user will provide a text selection and a question about it. Answer the question based on the text provided, but you can also use your general knowledge if needed. Be concise.';

function saveOptions() {
  const apiKey = document.getElementById('apiKey').value;
  const systemPrompt = document.getElementById('systemPrompt').value;
  const status = document.getElementById('status');

  if (!apiKey) {
    showStatus('Please enter a valid API key.', 'error');
    return;
  }

  chrome.storage.sync.set(
    {
      openaiApiKey: apiKey,
      systemPrompt: systemPrompt
    },
    () => {
      showStatus('Settings saved successfully!', 'success');
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    }
  );
}

function restoreOptions() {
  chrome.storage.sync.get(
    {
      openaiApiKey: '',
      systemPrompt: DEFAULT_SYSTEM_PROMPT
    },
    (items) => {
      document.getElementById('apiKey').value = items.openaiApiKey;
      document.getElementById('systemPrompt').value = items.systemPrompt;
    }
  );
}

function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
}
