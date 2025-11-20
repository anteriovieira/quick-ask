document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveBtn').addEventListener('click', saveOptions);

function saveOptions() {
  const apiKey = document.getElementById('apiKey').value;
  const status = document.getElementById('status');

  if (!apiKey) {
    showStatus('Please enter a valid API key.', 'error');
    return;
  }

  chrome.storage.sync.set(
    { openaiApiKey: apiKey },
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
    { openaiApiKey: '' },
    (items) => {
      document.getElementById('apiKey').value = items.openaiApiKey;
    }
  );
}

function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
}
