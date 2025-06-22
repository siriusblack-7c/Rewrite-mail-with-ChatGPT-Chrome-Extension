// Gmail Integration Content Script
class GmailRewriter {
  constructor() {
    this.apiKey = null;
    this.englishVariant = 'US'; // Default value
    this.init();
    this.setupStorageListener();
  }

  async init() {
    // Load API key and English variant from storage
    const result = await chrome.storage.sync.get(['openaiApiKey', 'englishVariant']);
    this.apiKey = result.openaiApiKey;
    this.englishVariant = result.englishVariant || 'US'; // Default to US English
    // Initialize the extension
    this.waitForGmail();
  }

  setupStorageListener() {
    // Listen for storage changes to update settings in real-time
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync') {
        if (changes.openaiApiKey) {
          this.apiKey = changes.openaiApiKey.newValue;
        }
        if (changes.englishVariant) {
          this.englishVariant = changes.englishVariant.newValue || 'US';
          // Re-add buttons with new variant names
          this.refreshRewriteButtons();
        }
      }
    });
  }

  refreshRewriteButtons() {
    // Remove existing buttons
    const existingButtons = document.querySelectorAll('.native-english-rewrite-btn');
    existingButtons.forEach(button => button.remove());

    // Re-add buttons with updated variant names
    this.addRewriteButtonsToExistingCompose();
  }

  waitForGmail() {
    // Wait for Gmail to load
    const checkGmailLoaded = () => {
      if (document.querySelector('[role="main"]')) {
        this.setupGmailIntegration();
      } else {
        setTimeout(checkGmailLoaded, 1000);
      }
    };

    checkGmailLoaded();
  }

  setupGmailIntegration() {
    // Monitor for compose windows
    this.observeComposeWindows();

    // Add rewrite button to existing compose windows
    this.addRewriteButtonsToExistingCompose();
  }

  observeComposeWindows() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Check for new compose windows
            const composeWindows = node.querySelectorAll('[role="dialog"]');
            composeWindows.forEach(window => {
              this.addRewriteButtonToCompose(window);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  addRewriteButtonsToExistingCompose() {
    const composeWindows = document.querySelectorAll('[role="dialog"]');
    composeWindows.forEach(window => {
      this.addRewriteButtonToCompose(window);
    });
  }

  addRewriteButtonToCompose(composeWindow) {
    // Check if button already exists
    if (composeWindow.querySelector('.native-english-rewrite-btn')) {
      return;
    }

    // Find the compose toolbar
    const toolbar = composeWindow.querySelector('[role="toolbar"]');
    if (!toolbar) return;

    // Get the display name for the selected English variant
    const variantNames = {
      'US': 'American English',
      'UK': 'British English',
      'AU': 'Australian English',
      'CA': 'Canadian English',
      'NZ': 'New Zealand English',
      'ZA': 'South African English'
    };
    const variantName = variantNames[this.englishVariant] || 'American English';

    // Create the rewrite button
    const rewriteBtn = document.createElement('div');
    rewriteBtn.className = 'native-english-rewrite-btn';
    rewriteBtn.innerHTML = `
      <button class="rewrite-button" title="Rewrite for ${variantName}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.51-6.84L9.37 4.5C8.16 3.42 6.49 3.42 5.28 4.5l-1.5 1.31C2.57 6.87 2.3 7.96 2.66 9c.36 1.04 1.2 1.88 2.24 2.24 1.04.36 2.13.09 3.19-.57l.03.03L5.58 13.8c-.35.35-.35.92 0 1.27.35.35.92.35 1.27 0l2.54-2.54.03.03c1.66 1.66 4.38 1.66 6.04 0l1.41-1.41c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.41 1.41c-.78.78-2.05.78-2.83 0-.78-.78-.78-2.05 0-2.83l1.41-1.41c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-1.41 1.41z"/>
        </svg>
        Rewrite for ${variantName}
      </button>
    `;

    // Style the button
    rewriteBtn.style.marginLeft = '8px';
    rewriteBtn.style.display = 'inline-block';

    // Add click handler
    const button = rewriteBtn.querySelector('.rewrite-button');
    button.addEventListener('click', () => this.handleRewrite(composeWindow));

    // Insert the button
    toolbar.appendChild(rewriteBtn);
  }

  async handleRewrite(composeWindow) {
    if (!this.apiKey) {
      this.showMessage('Please set your OpenAI API key in the extension popup first.', 'error');
      return;
    }

    // Find the compose body
    const composeBody = composeWindow.querySelector('[role="textbox"][aria-label*="Message Body"]');
    if (!composeBody) {
      this.showMessage('Could not find email content to rewrite.', 'error');
      return;
    }

    const originalText = composeBody.innerText.trim();
    if (!originalText) {
      this.showMessage('Please enter some text to rewrite.', 'error');
      return;
    }

    // Show loading state
    const button = composeWindow.querySelector('.rewrite-button');
    const originalButtonText = button.innerHTML;
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="spinning">
        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
      </svg>
      Rewriting...
    `;
    button.disabled = true;

    try {
      // Call ChatGPT API
      const rewrittenText = await this.rewriteWithChatGPT(originalText);

      // Show preview dialog instead of directly replacing
      this.showPreviewDialog(composeWindow, originalText, rewrittenText, composeBody);

    } catch (error) {
      console.error('Rewrite error:', error);
      this.showMessage('Failed to rewrite email. Please try again.', 'error');
    } finally {
      // Restore button state
      button.innerHTML = originalButtonText;
      button.disabled = false;
    }
  }

  getSystemPrompt(englishVariant) {
    const baseInstructions = 'You are a professional writing assistant. Rewrite the following email text to improve grammar, word choice, and sentence structure to sound natural and professional. Maintain the original meaning and tone. Keep the same level of formality as the original. IMPORTANT: Preserve all text formatting including line breaks, bullet points, numbered lists, and paragraph structure. Return only the rewritten text without any additional commentary.';

    const prompts = {
      'US': `${baseInstructions} Use American spelling (e.g., "color", "analyze", "organize"), American terminology, and natural American phrasing to sound like a native American English speaker.`,

      'UK': `${baseInstructions} Use British spelling (e.g., "colour", "analyse", "organise"), British terminology (e.g., "whilst", "amongst", "post" for mail), and natural British phrasing to sound like a native British English speaker.`,

      'AU': `${baseInstructions} Use Australian spelling (British-based), Australian terminology and expressions, and natural Australian phrasing to sound like a native Australian English speaker.`,

      'CA': `${baseInstructions} Use Canadian spelling (mix of British and American), Canadian terminology, and natural Canadian phrasing to sound like a native Canadian English speaker.`,

      'NZ': `${baseInstructions} Use New Zealand spelling (British-based), New Zealand terminology and expressions, and natural New Zealand phrasing to sound like a native New Zealand English speaker.`,

      'ZA': `${baseInstructions} Use South African spelling (British-based), South African terminology and expressions, and natural South African phrasing to sound like a native South African English speaker.`
    };

    return prompts[englishVariant] || prompts['US']; // Default to US English
  }

  splitEmailContent(text) {
    // Common signature separators
    const signatureSeparators = [
      /\n--\s*\n/,           // Standard signature separator with newlines
      /\n--\s*$/,            // Signature separator at end
      /^--\s*\n/,            // Signature separator at start
      /\n-- \n/,             // Signature separator with space
      /\n--$/,               // Simple signature separator at end
      /^--$/m,               // Signature separator on its own line
      /\n---+\s*\n/,         // Multiple dashes
      /\nBest regards,/i,    // Common signature starts
      /\nSincerely,/i,
      /\nKind regards,/i,
      /\nThanks,/i,
      /\nRegards,/i,
      /\nCheers,/i,
      /\nBest,/i
    ];

    // Try to find signature separator
    for (const separator of signatureSeparators) {
      const match = text.match(separator);
      if (match) {
        const splitIndex = match.index;
        const mainContent = text.substring(0, splitIndex).trim();
        const signature = text.substring(splitIndex).trim();

        // Only split if we have meaningful content in both parts
        if (mainContent.length > 10 && signature.length > 2) {
          return {
            mainContent: mainContent,
            signature: signature,
            hasSignature: true
          };
        }
      }
    }

    // No signature found, return original text
    return {
      mainContent: text.trim(),
      signature: '',
      hasSignature: false
    };
  }

  combineEmailContent(mainContent, signature, hasSignature) {
    if (!hasSignature || !signature) {
      return mainContent;
    }

    // Ensure proper spacing between content and signature
    const cleanMain = mainContent.trim();
    const cleanSignature = signature.trim();

    // If signature doesn't start with standard separator, add one
    if (!cleanSignature.startsWith('--')) {
      return `${cleanMain}\n\n${cleanSignature}`;
    }

    return `${cleanMain}\n${cleanSignature}`;
  }

  updateComposeBodyWithFormatting(composeBody, text) {
    // Preserve formatting while converting to HTML for Gmail
    let formattedText = text
      // Preserve paragraph breaks (double newlines)
      .replace(/\n\n/g, '</p><p>')
      // Convert single newlines to line breaks, but preserve list structure
      .replace(/\n(?![\s]*[-•*])/g, '<br>')
      // Handle bullet points with various markers
      .replace(/\n[\s]*[-•*]\s*(.+)/g, '<br>• $1')
      // Handle numbered lists
      .replace(/\n[\s]*(\d+\.)\s*(.+)/g, '<br>$1 $2')
      // Handle signature separators
      .replace(/\n--[\s]*\n/g, '<br>--<br>')
      .replace(/\n--[\s]*$/g, '<br>--');

    // Wrap in paragraph tags if not already wrapped
    if (!formattedText.startsWith('<p>')) {
      formattedText = `<p>${formattedText}</p>`;
    }

    // Clean up any empty paragraphs
    formattedText = formattedText.replace(/<p><\/p>/g, '');

    composeBody.innerHTML = formattedText;
  }

  async rewriteWithChatGPT(text) {
    // Split email content to handle signature separately
    const { mainContent, signature, hasSignature } = this.splitEmailContent(text);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(this.englishVariant)
          },
          {
            role: 'user',
            content: mainContent
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const rewrittenMainContent = data.choices[0].message.content;

    // Combine rewritten content with original signature
    return this.combineEmailContent(rewrittenMainContent, signature, hasSignature);
  }

  async rewriteWithFeedback(text, feedback) {
    // Split email content to handle signature separately
    const { mainContent, signature, hasSignature } = this.splitEmailContent(text);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(this.englishVariant)
          },
          {
            role: 'user',
            content: `Please rewrite the following email text. Additionally, please incorporate this specific feedback: "${feedback}"\n\nEmail text to rewrite:\n${mainContent}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const rewrittenMainContent = data.choices[0].message.content;

    // Combine rewritten content with original signature
    return this.combineEmailContent(rewrittenMainContent, signature, hasSignature);
  }

  showPreviewDialog(composeWindow, originalText, rewrittenText, composeBody) {
    // Get the display name for the selected English variant
    const variantNames = {
      'US': 'American English',
      'UK': 'British English',
      'AU': 'Australian English',
      'CA': 'Canadian English',
      'NZ': 'New Zealand English',
      'ZA': 'South African English'
    };
    const variantName = variantNames[this.englishVariant] || 'American English';

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'native-english-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
    `;

    // Create dialog
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white;
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      max-width: 800px;
      max-height: 80vh;
      width: 90%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    `;

    dialog.innerHTML = `
      <div style="padding: 20px; border-bottom: 1px solid #e0e0e0;">
        <h2 style="margin: 0; color: #202124; font-size: 18px; font-weight: 500;">
          Preview Email (${variantName})
        </h2>
        <p style="margin: 8px 0 0 0; color: #5f6368; font-size: 14px;">
          Review the changes and choose to accept, edit, or cancel
        </p>
      </div>
      
      <div style="flex: 1; overflow-y: auto; padding: 20px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div>
            <h3 style="margin: 0 0 10px 0; color: #202124; font-size: 14px; font-weight: 500;">
              Original Text
            </h3>
            <textarea 
              id="originalTextArea" 
              style="background: #f8f9fa; padding: 15px; border-radius: 4px; border: 1px solid #e0e0e0; min-height: 150px; width: 100%; box-sizing: border-box; font-size: 14px; line-height: 1.5; font-family: inherit; resize: vertical;"
            >${originalText}</textarea>
          </div>
          
          <div>
            <h3 style="margin: 0 0 10px 0; color: #202124; font-size: 14px; font-weight: 500;">
              Rewritten Text
            </h3>
            <textarea 
              id="rewrittenTextArea" 
              style="background: #e8f5e8; padding: 15px; border-radius: 4px; border: 1px solid #ceead6; min-height: 150px; width: 100%; box-sizing: border-box; font-size: 14px; line-height: 1.5; font-family: inherit; resize: vertical;"
            >${rewrittenText}</textarea>
            
            <div style="margin-top: 15px;">
              <h4 style="margin: 0 0 8px 0; color: #202124; font-size: 13px; font-weight: 500;">
                Feedback for Improvement
              </h4>
              <textarea 
                id="feedbackTextArea" 
                placeholder="e.g., 'Make it more brief', 'Add more details', 'Make it more formal', 'Use simpler language'..."
                style="background: #fff3e0; padding: 12px; border-radius: 4px; border: 1px solid #ffcc80; width: 100%; box-sizing: border-box; font-size: 13px; line-height: 1.4; font-family: inherit; resize: vertical; min-height: 60px;"
              ></textarea>
              <button 
                id="regenerateBtn" 
                style="margin-top: 8px; padding: 6px 12px; border: none; background: #ff9800; color: white; border-radius: 4px; font-size: 13px; cursor: pointer; font-weight: 500; width: 100%;"
              >
                🔄 Regenerate with Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div style="padding: 20px; border-top: 1px solid #e0e0e0; display: flex; gap: 12px; justify-content: flex-end;">
        <button id="cancelBtn" style="padding: 8px 16px; border: 1px solid #dadce0; background: white; color: #3c4043; border-radius: 4px; font-size: 14px; cursor: pointer;">
          Cancel
        </button>
        <button id="acceptBtn" style="padding: 8px 16px; border: none; background: #1a73e8; color: white; border-radius: 4px; font-size: 14px; cursor: pointer; font-weight: 500;">
          Accept Changes
        </button>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Handle button clicks
    const cancelBtn = dialog.querySelector('#cancelBtn');
    const acceptBtn = dialog.querySelector('#acceptBtn');
    const rewrittenTextArea = dialog.querySelector('#rewrittenTextArea');
    const originalTextArea = dialog.querySelector('#originalTextArea');
    const feedbackTextArea = dialog.querySelector('#feedbackTextArea');
    const regenerateBtn = dialog.querySelector('#regenerateBtn');

    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    acceptBtn.addEventListener('click', () => {
      const finalText = rewrittenTextArea.value;

      // Update the compose body with the final text, preserving formatting
      this.updateComposeBodyWithFormatting(composeBody, finalText);

      // Trigger input event to notify Gmail
      composeBody.dispatchEvent(new Event('input', { bubbles: true }));

      // Close dialog
      document.body.removeChild(overlay);

      this.showMessage('Email updated successfully!', 'success');
    });

    regenerateBtn.addEventListener('click', async () => {
      const currentText = originalTextArea.value.trim();
      const feedback = feedbackTextArea.value.trim();

      if (!currentText) {
        this.showMessage('Please enter some text to rewrite.', 'error');
        return;
      }

      if (!feedback) {
        this.showMessage('Please provide feedback for improvement.', 'error');
        return;
      }

      // Show loading state
      const originalButtonText = regenerateBtn.innerHTML;
      regenerateBtn.innerHTML = '🔄 Regenerating...';
      regenerateBtn.disabled = true;

      try {
        // Call ChatGPT API with feedback
        const newRewrittenText = await this.rewriteWithFeedback(currentText, feedback);

        // Update the rewritten text area
        rewrittenTextArea.value = newRewrittenText;

        // Clear feedback
        feedbackTextArea.value = '';

        this.showMessage('Text regenerated successfully!', 'success');

      } catch (error) {
        console.error('Regenerate error:', error);
        this.showMessage('Failed to regenerate text. Please try again.', 'error');
      } finally {
        // Restore button state
        regenerateBtn.innerHTML = originalButtonText;
        regenerateBtn.disabled = false;
      }
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });

    // Focus the rewritten textarea
    setTimeout(() => {
      rewrittenTextArea.focus();
      rewrittenTextArea.setSelectionRange(rewrittenTextArea.value.length, rewrittenTextArea.value.length);
    }, 100);
  }

  showMessage(message, type) {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `native-english-message ${type}`;
    messageEl.textContent = message;

    // Position and style
    messageEl.style.position = 'fixed';
    messageEl.style.top = '20px';
    messageEl.style.right = '20px';
    messageEl.style.padding = '12px 16px';
    messageEl.style.borderRadius = '4px';
    messageEl.style.zIndex = '10000';
    messageEl.style.fontSize = '14px';
    messageEl.style.fontWeight = '500';
    messageEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';

    if (type === 'success') {
      messageEl.style.backgroundColor = '#4CAF50';
      messageEl.style.color = 'white';
    } else {
      messageEl.style.backgroundColor = '#f44336';
      messageEl.style.color = 'white';
    }

    document.body.appendChild(messageEl);

    // Remove after 3 seconds
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, 3000);
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new GmailRewriter());
} else {
  new GmailRewriter();
}

// Add spinning animation CSS
const style = document.createElement('style');
style.textContent = `
  .spinning {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style); 