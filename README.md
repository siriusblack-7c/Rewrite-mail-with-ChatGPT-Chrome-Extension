# Native Email Assistant (v2.2)

An advanced Chrome extension that seamlessly integrates with Gmail to rewrite your emails using AI. It helps you sound like a native speaker in over 120 languages, ensures your message is professional, and preserves all original formatting. It's the ultimate tool for international business, language learners, and flawless global communication.

![Extension Preview](https://i.imgur.com/your-preview-image.png) <!-- It's a good idea to add a real preview image here -->

---

## 🌟 Key Features

- **Seamless Gmail Integration**: Injects a "Rewrite" button directly into the Gmail compose and reply windows.
- **Multi-Language AI Rewriting**: Uses OpenAI's `gpt-4o-mini` to improve grammar, tone, and phrasing in over 120 languages.
  - Supports English variants (US, UK, AU, etc.) and accented English.
- **Google Translate Integration**: Optional side-by-side translation using the Google Translate API.
- **Interactive Preview & Edit Dialog**: A powerful three-column interface to compare, edit, and refine:
  - **Original Text**: Your initial draft, fully editable.
  - **Translated Text**: The direct translation for reference.
  - **Rewritten Text**: The AI-enhanced version.
- **Conversational Feedback History**: The AI remembers your feedback *within a single rewrite session*. Provide instructions like "make it more formal" or "add more detail," and the AI will use that context to regenerate improved versions until it's perfect.
- **Advanced Text Handling**:
  - **Smart Signature Detection**: Automatically identifies and preserves email signatures.
  - **Quoted Text Isolation**: Intelligently separates your new reply from the original email thread.
  - **Formatting Preservation**: Maintains line breaks, paragraphs, bullet points, and numbered lists.
- **Speech-to-Text**: Use your microphone to dictate your email directly into the preview dialog.
- **Modern, User-Friendly UI**: A clean, responsive design with a detailed settings popup and a comprehensive help section.
- **Secure by Design**: API keys are stored locally and are only used for direct communication with API providers. Your email data is never collected.

---

## 🚀 Installation and Setup

### 1. Load the Extension in Chrome
1.  Download all the project files into a single folder on your computer.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **"Developer mode"** using the toggle in the top-right corner.
4.  Click **"Load unpacked"** and select the folder where you saved the extension files.
5.  The "Native Email Assistant" will now appear in your extensions list.

### 2. Configure API Keys
The extension requires API keys to function. Click the extension icon in your Chrome toolbar to open the settings popup.

#### OpenAI API Key (Required for Rewriting)
1.  Go to the [OpenAI API Keys](https://platform.openai.com/api-keys) page and log in or create an account.
2.  **Important**: You must have a valid payment method on file and/or sufficient credits. The extension will not work with a free-trial account that does not have billing set up.
3.  Create a new secret key, copy it, and paste it into the "OpenAI API Key" field in the extension settings.
4.  The extension will validate the key to ensure it works.

#### Google Translate API Key (Optional for Translation)
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (or use an existing one).
3.  Enable the **"Cloud Translation API"** for your project.
4.  Navigate to "Credentials," create a new API Key, and copy it into the "Google Translate API Key" field.

---

## 🛠️ How to Use

1.  **Open Gmail**: Navigate to `mail.google.com`.
2.  **Compose an Email**: Click "Compose" or "Reply."
3.  **Write Your Draft**: Type your message as you normally would.
4.  **Click Rewrite**: Find the ✨ button in the compose toolbar and click it.
5.  **Use the Preview Dialog**:
    -   **Review**: Compare your original text with the translated and rewritten versions.
    -   **Edit**: Make direct changes to the rewritten text.
    -   **Regenerate**: Type feedback into the feedback box and click "Regenerate" for a new version.
    -   **Accept**: Click "Accept Changes" to update the Gmail compose box with the final text.
6.  **Send**: Review your polished email and send it with confidence.

---

## 🔧 Technical Architecture

This extension is built with a robust and defensive architecture designed for the complexities of a single-page application like Gmail.

-   **Manifest V3**: Utilizes the modern and secure Chrome extension platform.
-   **Content Script (`content.js`)**: The core engine that handles all DOM manipulation within Gmail.
    -   **UI Injection**: A multi-layered strategy (`MutationObserver`, periodic scanning, and targeted polling) ensures the "Rewrite" button is reliably injected.
    -   **Resilient API Handling**: Features a request queue, client-side rate-limiting, and exponential backoff for retries to manage API calls efficiently.
    -   **Intelligent Text Parsing**: Uses advanced heuristics to separate user-written replies from quoted email history and signatures.
-   **Popup Script (`popup.js`)**: Manages the settings UI, including real-time API key validation and user configuration.
-   **Background Script (`background.js`)**: A lightweight service worker that handles on-install events and coordinates high-level actions.

---

## 📜 Version History

-   **v2.2 (Current)**: Added conversational feedback history. The AI now remembers all feedback within a single rewrite session, allowing for more accurate, iterative improvements.
-   **v2.1**: Initial release of the modern, feature-rich version.
-   **v2.0**: Added multi-language support (120+ languages), Google Translate integration, speech input, and comprehensive three-column preview dialog. Transformed from English-only to full multi-language email assistant.
-   **v1.5**: Converted help section to collapsible hamburger menu for cleaner, more compact popup interface. Added smooth animations for menu transitions and improved overall UX.
-   **v1.4**: Complete UI redesign with gorgeous modern interface featuring gradient backgrounds, glassmorphism effects, smooth animations, hover effects, and enhanced responsive design. Improved popup and preview dialog styling.
-   **v1.3**: Added smart signature handling (preserves content after "--" without rewriting) and enhanced formatting preservation for bullet points, numbered lists, and text structure
-   **v1.2**: Added interactive feedback system - users can provide specific feedback (e.g., "make it more brief") to iteratively improve the AI rewriting. Made original text editable in preview dialog.
-   **v1.1**: Added support for multiple English variants (US, UK, AU, CA, NZ, ZA) with region-specific prompts and terminology
-   **v1.0**: Initial release with basic Gmail integration and ChatGPT rewriting.

---

## ⚖️ License

This project is for internal business use. Modify and distribute according to your organization's policies. 