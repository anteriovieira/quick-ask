# Quick Ask - AI Text Assistant

A Chrome extension that lets you select any text on a webpage and instantly ask AI questions about it using OpenAI's GPT models. The extension opens a native side panel for seamless interaction.

## Features

- 🎯 **Text Selection**: Select any text on any webpage using your mouse or keyboard
- 💬 **Native Side Panel**: Chat interface opens in Chrome's native side panel for a seamless experience
- ⚡ **Quick Actions**: Pre-built action buttons like "Explain it", "Translate", "Fix typo", "Summarize", and more
- 🎨 **Theme Support**: Automatically adapts to your browser's light/dark theme
- 🔒 **Secure**: Your API key is stored locally using Chrome's secure storage
- ⌨️ **Keyboard Shortcut**: Press `Ctrl+K` (or `Cmd+K` on Mac) to quickly open the chat

<img width="1280" height="800" alt="image 1" src="https://github.com/user-attachments/assets/cbf9a2be-c16d-4506-a40d-10a3f768e1a4" />



## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd deepask
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in the top right)

4. Click "Load unpacked" and select the extension directory

5. The extension icon should appear in your Chrome toolbar

## Configuration

Before using Quick Ask, you need to set up your OpenAI API key:

1. Click the Quick Ask extension icon in your Chrome toolbar
2. Enter your OpenAI API key in the settings page
3. Click "Save Settings"

**Note**: You can get an API key from [OpenAI's website](https://platform.openai.com/api-keys). The API key is stored securely in your browser's local storage and never leaves your device.

## Usage

### Basic Usage

1. **Select Text**: Highlight any text on a webpage using your mouse or keyboard
2. **Click "Ask AI"**: A floating button will appear near your selection
3. **Ask Questions**: The side panel opens automatically, and you can ask questions about the selected text
4. **Use Quick Actions**: Click any quick action button (e.g., "Explain it", "Translate") for instant results

### Keyboard Shortcut

- Press `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac) to open the chat panel with your current selection

### Quick Actions

The extension provides several quick action buttons:

- **Answer that**: Get an answer to a question
- **Explain it**: Get a detailed explanation
- **Translate**: Translate the text to another language
- **Fix typo**: Correct spelling and grammar errors
- **Summarize**: Get a concise summary
- **Make it shorter**: Condense the text
- **Make it longer**: Expand the text

## How It Works

1. **Content Script**: Injects a floating "Ask AI" button when text is selected
2. **Side Panel**: Opens Chrome's native side panel for the chat interface
3. **Background Service**: Handles API calls to OpenAI securely
4. **Storage**: Saves your API key and preferences locally

## Technical Details

### Architecture

- **Manifest V3**: Built using Chrome's latest extension manifest format
- **Content Scripts**: `content.js` handles text selection and UI injection
- **Background Service Worker**: `background.js` manages API calls and side panel communication
- **Side Panel**: `sidepanel.html/js` provides the chat interface
- **Options Page**: `options.html/js` handles settings and API key configuration

### Permissions

- `storage`: To save your API key and preferences
- `activeTab`: To access the current tab's content
- `scripting`: To inject content scripts
- `sidePanel`: To open the native side panel
- `https://api.openai.com/*`: To make API calls to OpenAI

### Browser Compatibility

- Chrome/Chromium (Manifest V3 support required)
- Edge (Chromium-based)
- Other Chromium-based browsers

## Development

### Project Structure

```
deepask/
├── manifest.json          # Extension manifest
├── background.js          # Service worker for API calls
├── content.js             # Content script for text selection
├── sidepanel.html         # Side panel UI
├── sidepanel.js           # Side panel logic
├── options.html           # Settings page
├── options.js             # Settings logic
├── styles.css             # Global styles
└── icons/                 # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Key Features Implementation

- **Text Selection Detection**: Uses `mouseup`, `keyup`, and `selectionchange` events
- **Shadow DOM**: UI elements are encapsulated to prevent style conflicts
- **Theme Detection**: Uses `prefers-color-scheme` media query for automatic theme switching
- **Debouncing**: Prevents duplicate API calls and message handling

## Troubleshooting

### The "Ask AI" button doesn't appear

- Make sure you've selected text on the page
- Try refreshing the page
- Check the browser console for errors (F12)

### API errors

- Verify your API key is correct in the settings
- Ensure you have credits/quota available in your OpenAI account
- Check your internet connection

### Side panel doesn't open

- Make sure you're using a compatible browser (Chrome/Edge)
- Try clicking the extension icon to manually open settings
- Reload the extension from `chrome://extensions/`

## Privacy & Security

- Your API key is stored locally in Chrome's secure storage
- All API calls are made directly from your browser to OpenAI
- No data is sent to third-party servers (except OpenAI's API)
- The extension only accesses pages you explicitly interact with

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]

## Support

[Add support information here]

