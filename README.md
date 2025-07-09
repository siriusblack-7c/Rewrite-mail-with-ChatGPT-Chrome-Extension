# Multi-Language Email Assistant

A Chrome extension that integrates with Gmail to rewrite emails using AI, making them sound like they were written by native speakers of your target language. Perfect for international businesses, language learners, and global communication.

## Features

- **Gmail Integration**: Seamlessly integrates with Gmail's compose interface
- **Multi-Language Support**: Rewrite emails into 120+ languages including:
  - 🇺🇸 English (American, British, Australian, Canadian, New Zealand, South African)
  - 🇪🇸 Spanish, 🇫🇷 French, 🇩🇪 German, 🇮🇹 Italian, 🇵🇹 Portuguese
  - 🇨🇳 Chinese (Simplified/Traditional), 🇯🇵 Japanese, 🇰🇷 Korean
  - 🇷🇺 Russian, 🇦🇷 Arabic, 🇮🇳 Hindi, and many more
- **AI-Powered Rewriting**: Uses OpenAI's ChatGPT to improve grammar, word choice, and sentence structure
- **Native Speaker Quality**: Makes emails sound like they were written by native speakers of your target language
- **Google Translate Integration**: Translate text between languages using Google Translate API
- **Interactive Preview & Edit**: Shows three-column comparison with original, translated, and AI-rewritten text
- **Iterative Improvement**: Provide feedback like "make it more brief" or "add more details" to regenerate improved versions
- **Smart Signature Handling**: Automatically preserves email signatures (content after "--") without rewriting
- **Format Preservation**: Maintains bullet points, numbered lists, paragraphs, and text structure
- **Speech Input**: Voice-to-text input support for composing emails
- **Gorgeous Modern UI**: Beautiful gradient design with smooth animations, glassmorphism effects, and responsive layout
- **Example**: 
  ```
  Input (English): "Please send report today
  - Financial data
  - Market analysis"
  
  Output (Spanish): "Por favor, envíe el informe hoy
  • Datos financieros
  • Análisis de mercado"
  
  Output (French): "Veuillez envoyer le rapport aujourd'hui
  • Données financières
  • Analyse de marché"
  ```
- **Safe Editing**: Original message remains intact until you approve the changes
- **Easy to Use**: Simple one-click button in Gmail compose window with intuitive preview dialog
- **Secure**: API keys stored locally in your browser, never shared

## Installation

### Method 1: Developer Mode (For immediate use)

1. **Download the Extension Files**
   - Save all the files in this directory to a folder on your computer

2. **Open Chrome Extensions**
   - Open Google Chrome
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

4. **Get API Keys**
   
   **For OpenAI (Required for AI rewriting):**
   - Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new account or sign in
   - Generate a new API key
   - Copy the key (starts with "sk-")

   **For Google Translate (Optional for translation):**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project and enable Google Translate API
   - Create credentials and get your API key

5. **Configure the Extension**
   - Click the extension icon in Chrome's toolbar
   - Enter your OpenAI API key
   - Select your target language (any of 120+ supported languages)
   - Optionally: Enter Google Translate API key for translation features
   - Click "Save Settings"

## Usage

1. **Open Gmail**
   - Go to [Gmail](https://mail.google.com)
   - Compose a new email or reply to an existing one

2. **Write Your Email**
   - Type your email content in any language

3. **Rewrite to Your Target Language**
   - Look for the "Rewrite to [Your Target Language]" button in the compose toolbar
   - Click the button to start the AI rewriting process

4. **Preview, Translate, and Improve**
   - A preview dialog will appear with three columns:
     - **Original Text**: Your input text (editable, with speech input support)
     - **Translated Text**: Google Translate result (if configured)
     - **AI Rewritten Text**: OpenAI's improved version in your target language
   - Edit any text directly in the dialog
   - **Use Speech Input**: Click the microphone button to dictate text
   - **Translate**: Click translate button to see Google Translate version
   - **Provide feedback**: Use the feedback box to request specific improvements like:
     - "Make it more brief"
     - "Add more details" 
     - "Make it more formal"
     - "Use simpler language"
   - Click "🔄 Regenerate" to get an improved version
   - Repeat the feedback process as many times as needed
   - Click "Accept Changes" to apply the final text, or "Cancel" to keep your original

5. **Review and Send**
   - Your email now contains the improved text in your target language
   - Make any final adjustments if needed
   - Send your email with confidence

## How It Works

The extension:
1. Detects when you're composing an email in Gmail
2. Adds a "Rewrite to [Target Language]" button to the compose window
3. When clicked, automatically detects and preserves email signatures (content after "--")
4. Sends only the main email content to OpenAI's ChatGPT API with instructions for your target language
5. Receives improved text that sounds like it was written by a native speaker of your target language
6. Optionally translates text using Google Translate API for comparison
7. Preserves original formatting (bullet points, lists, paragraphs) while improving the language
8. Shows a comprehensive preview dialog with original, translated, and AI-rewritten text
9. Supports speech input for voice-to-text composition
10. Only updates your email after you approve the changes, maintaining signatures and formatting

## Supported Languages

The extension supports 120+ languages including:

**Major Languages:**
- English (US, UK, AU, CA, NZ, ZA variants)
- Spanish, French, German, Italian, Portuguese
- Chinese (Simplified/Traditional), Japanese, Korean
- Russian, Arabic, Hindi, Bengali, Urdu
- Dutch, Swedish, Norwegian, Danish, Finnish

**And many more:** Ukrainian, Polish, Czech, Hungarian, Romanian, Bulgarian, Croatian, Serbian, Slovak, Slovenian, Lithuanian, Latvian, Estonian, Greek, Turkish, Hebrew, Persian, Thai, Vietnamese, Indonesian, Malay, Tagalog, Swahili, and dozens of others.

## Privacy & Security

- **Local Storage**: Your API keys are stored locally in your browser only
- **No Data Collection**: The extension doesn't collect or store your email content
- **Direct API Communication**: Your text is sent directly to OpenAI/Google servers
- **Temporary Processing**: APIs process your text and return the improved version

## API Costs

### OpenAI API (Required for AI rewriting)
- GPT-4o-mini: Very affordable, typically $0.001-0.002 per email
- GPT-4: More expensive but higher quality
- Check [OpenAI's pricing](https://openai.com/pricing) for current rates

### Google Translate API (Optional for translation)
- Very affordable, typically $0.00001-0.00002 per character
- Check [Google Translate pricing](https://cloud.google.com/translate/pricing) for current rates

## Troubleshooting

### Extension Not Working
- Make sure you're on Gmail (mail.google.com)
- Refresh the Gmail page
- Check that the extension is enabled in chrome://extensions/

### Button Not Appearing
- Try composing a new email
- Check if Gmail has fully loaded
- Refresh the page and try again

### API Key Issues
- **OpenAI**: Ensure your API key starts with "sk-" and verify it's valid at [OpenAI Platform](https://platform.openai.com)
- **Google**: Ensure your API key is valid and has Google Translate API enabled
- Check that you have available credits/quota

### Rewriting Fails
- Check your internet connection
- Verify your OpenAI account has available credits
- Try with a shorter email if the text is very long

### Translation Not Working
- Ensure Google Translate API key is set
- Check that billing is enabled in Google Cloud Console
- Verify target and input languages are selected

### Signature Not Preserved
- Ensure your signature follows standard format with "--" separator
- Signatures are detected after common phrases like "Best regards," "Sincerely," etc.
- Manual signature separators: use "--" on its own line

### Formatting Issues
- The extension preserves bullet points (•, -, *) and numbered lists
- Paragraph breaks (double line breaks) are maintained
- If formatting appears broken, try using standard markdown-style formatting

## Customization

You can modify the AI prompts in `content.js` to change how the rewriting works:

```javascript
// Find the initializeVariantPrompts method in content.js and modify the prompts
async initializeVariantPrompts() {
  // Modify the prompt to customize AI behavior
  return `Your custom instructions here...`;
}
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Chrome Developer Console for error messages
3. Ensure all requirements are met (API keys, Gmail access, etc.)

## Version History

- **v2.0**: Added multi-language support (120+ languages), Google Translate integration, speech input, and comprehensive three-column preview dialog. Transformed from English-only to full multi-language email assistant.
- **v1.5**: Converted help section to collapsible hamburger menu for cleaner, more compact popup interface. Added smooth animations for menu transitions and improved overall UX.
- **v1.4**: Complete UI redesign with gorgeous modern interface featuring gradient backgrounds, glassmorphism effects, smooth animations, hover effects, and enhanced responsive design. Improved popup and preview dialog styling.
- **v1.3**: Added smart signature handling (preserves content after "--" without rewriting) and enhanced formatting preservation for bullet points, numbered lists, and text structure
- **v1.2**: Added interactive feedback system - users can provide specific feedback (e.g., "make it more brief") to iteratively improve the AI rewriting. Made original text editable in preview dialog.
- **v1.1**: Added support for multiple English variants (US, UK, AU, CA, NZ, ZA) with region-specific prompts and terminology
- **v1.0**: Initial release with basic Gmail integration and ChatGPT rewriting

## License

This project is for internal business use. Modify and distribute according to your organization's policies. 