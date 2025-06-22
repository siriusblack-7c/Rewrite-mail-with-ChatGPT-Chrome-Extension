# Native English Email Assistant

A Chrome extension that integrates with Gmail to rewrite emails using ChatGPT, making them sound like they were written by a native English speaker from your preferred region (US, UK, Australia, Canada, New Zealand, or South Africa). Perfect for accounting firms and businesses working with international teams.

## Features

- **Gmail Integration**: Seamlessly integrates with Gmail's compose interface
- **Multiple English Variants**: Choose from 6 different English variants:
  - 🇺🇸 American English (US)
  - 🇬🇧 British English (UK)  
  - 🇦🇺 Australian English (AU)
  - 🇨🇦 Canadian English (CA)
  - 🇳🇿 New Zealand English (NZ)
  - 🇿🇦 South African English (ZA)
- **AI-Powered Rewriting**: Uses OpenAI's ChatGPT to improve grammar, word choice, and sentence structure
- **Professional Tone**: Maintains the original meaning while making emails sound more professional and native
- **Interactive Preview & Edit**: Shows side-by-side comparison with editable original and rewritten text
- **Iterative Improvement**: Provide feedback like "make it more brief" or "add more details" to regenerate improved versions
- **Smart Signature Handling**: Automatically preserves email signatures (content after "--") without rewriting
- **Format Preservation**: Maintains bullet points, numbered lists, paragraphs, and text structure
- **Example**: 
  ```
  Input: "Please send report today
  - Financial data
  - Market analysis
  --
  Best regards,
  John Smith"
  
  Output: "Please send the report today
  • Financial data  
  • Market analysis
  --
  Best regards,
  John Smith"
  ```
- **Safe Editing**: Original message remains intact until you approve the changes
- **Easy to Use**: Simple one-click button in Gmail compose window with intuitive preview dialog
- **Secure**: API key stored locally in your browser, never shared

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

4. **Get OpenAI API Key**
   - Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new account or sign in
   - Generate a new API key
   - Copy the key (starts with "sk-")

5. **Configure the Extension**
   - Click the extension icon in Chrome's toolbar
   - Enter your OpenAI API key
   - Select your preferred English variant (US, UK, AU, CA, NZ, or ZA)
   - Click "Save Settings"

## Usage

1. **Open Gmail**
   - Go to [Gmail](https://mail.google.com)
   - Compose a new email or reply to an existing one

2. **Write Your Email**
   - Type your email content as you normally would

3. **Rewrite for Your Selected English Variant**
   - Look for the blue "Rewrite for [Your Selected Variant]" button in the compose toolbar (e.g., "Rewrite for British English")
   - Click the button to start the AI rewriting process

4. **Preview, Edit, and Improve**
   - A preview dialog will appear showing your original text (editable) alongside the AI-improved version
   - Edit either the original or rewritten text directly in the dialog
   - **Provide feedback**: Use the feedback box to request specific improvements like:
     - "Make it more brief"
     - "Add more details" 
     - "Make it more formal"
     - "Use simpler language"
   - Click "🔄 Regenerate with Feedback" to get an improved version
   - Repeat the feedback process as many times as needed
   - Click "Accept Changes" to apply the final text, or "Cancel" to keep your original

5. **Review and Send**
   - Your email now contains the improved text
   - Make any final adjustments if needed
   - Send your email with confidence

## How It Works

The extension:
1. Detects when you're composing an email in Gmail
2. Adds a "Rewrite for [Your Selected Variant]" button to the compose window
3. When clicked, automatically detects and preserves email signatures (content after "--")
4. Sends only the main email content to OpenAI's ChatGPT API with instructions for your chosen English variant
5. Receives improved text that sounds like it was written by a native speaker of your selected English variant
6. Preserves original formatting (bullet points, lists, paragraphs) while improving the language
7. Shows a preview dialog with original and rewritten text side-by-side
8. Allows you to edit the rewritten text and provide feedback for regeneration
9. Only updates your email after you approve the changes, maintaining signatures and formatting

## Privacy & Security

- **Local Storage**: Your API key is stored locally in your browser only
- **No Data Collection**: The extension doesn't collect or store your email content
- **Direct API Communication**: Your text is sent directly to OpenAI's servers
- **Temporary Processing**: OpenAI processes your text and returns the improved version

## API Costs

This extension uses OpenAI's API, which has usage-based pricing:
- GPT-3.5-turbo: Very affordable, typically $0.001-0.002 per email
- GPT-4: More expensive but higher quality
- Check [OpenAI's pricing](https://openai.com/pricing) for current rates

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
- Ensure your API key starts with "sk-"
- Verify the key is valid at [OpenAI Platform](https://platform.openai.com)
- Check that you have available credits

### Rewriting Fails
- Check your internet connection
- Verify your OpenAI account has available credits
- Try with a shorter email if the text is very long

### Signature Not Preserved
- Ensure your signature follows standard format with "--" separator
- Signatures are detected after common phrases like "Best regards," "Sincerely," etc.
- Manual signature separators: use "--" on its own line

### Formatting Issues
- The extension preserves bullet points (•, -, *) and numbered lists
- Paragraph breaks (double line breaks) are maintained
- If formatting appears broken, try using standard markdown-style formatting

## Customization

You can modify the AI prompt in `content.js` to change how the rewriting works:

```javascript
// Find this section in content.js and modify the system message
{
  role: 'system',
  content: 'Your custom instructions here...'
}
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Chrome Developer Console for error messages
3. Ensure all requirements are met (API key, Gmail access, etc.)

## Version History

- **v1.3**: Added smart signature handling (preserves content after "--" without rewriting) and enhanced formatting preservation for bullet points, numbered lists, and text structure
- **v1.2**: Added interactive feedback system - users can provide specific feedback (e.g., "make it more brief") to iteratively improve the AI rewriting. Made original text editable in preview dialog.
- **v1.1**: Added support for multiple English variants (US, UK, AU, CA, NZ, ZA) with region-specific prompts and terminology
- **v1.0**: Initial release with basic Gmail integration and ChatGPT rewriting

## License

This project is for internal business use. Modify and distribute according to your organization's policies. 