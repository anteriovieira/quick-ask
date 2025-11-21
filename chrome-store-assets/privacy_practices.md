# Chrome Web Store Privacy Practices & Justifications

## ActiveTab
**Justification:**
The extension uses the `activeTab` permission to allow users to invoke the extension's side panel and interact with the specific tab they are currently viewing. This ensures the extension acts on the user's current context when explicitly invoked, without requiring broad host permissions for every site upfront.

## Host Permissions
**Justification:**
- `https://api.openai.com/*`: Required to communicate with the OpenAI API to generate responses to user questions.
- `<all_urls>` (in content scripts): Required to allow the user to select text on any webpage they visit and ask questions about it using the extension's floating button or shortcut.

## Remote Code
**Justification:**
The extension does not use remote code. It only fetches JSON data from the OpenAI API. All logic is contained within the extension package.

## Scripting
**Justification:**
*Note: This permission appears to be unused in the current codebase as content scripts are declared in the manifest. It is recommended to remove it if not needed.*

If retained, the justification is:
To programmatically inject content scripts or styles into the active tab to ensure the extension functions correctly on all pages.

## SidePanel
**Justification:**
The extension's primary interface is a side panel. This permission is required to open and manage the side panel where users interact with the AI assistant and view responses.

## Storage
**Justification:**
The extension uses the `storage` permission to save the user's OpenAI API key and system prompt settings locally on their device. This ensures the user stays logged in to their API provider and retains their preferences across sessions.

## Single Purpose Description
Quick Ask allows users to select text on any webpage and instantly ask an AI assistant questions about that text via a side panel.
