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
      'US': 'US',
      'UK': 'UK',
      'AU': 'AU',
      'CA': 'CA',
      'NZ': 'NZ',
      'ZA': 'ZA'
    };
    const variantName = variantNames[this.englishVariant] || 'US';

    // Create the rewrite button
    const rewriteBtn = document.createElement('div');
    rewriteBtn.className = 'native-english-rewrite-btn';
    rewriteBtn.innerHTML = `
      <button class="rewrite-button" title="Rewrite for ${variantName}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.51-6.84L9.37 4.5C8.16 3.42 6.49 3.42 5.28 4.5l-1.5 1.31C2.57 6.87 2.3 7.96 2.66 9c.36 1.04 1.2 1.88 2.24 2.24 1.04.36 2.13.09 3.19-.57l.03.03L5.58 13.8c-.35.35-.35.92 0 1.27.35.35.92.35 1.27 0l2.54-2.54.03.03c1.66 1.66 4.38 1.66 6.04 0l1.41-1.41c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.41 1.41c-.78.78-2.05.78-2.83 0-.78-.78-.78-2.05 0-2.83l1.41-1.41c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-1.41 1.41z"/>
        </svg>
        ${variantName}
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
      <span>...</span>
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
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: overlayFadeIn 0.3s ease-out;
    `;

    // Create dialog
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2);
      max-width: 900px;
      max-height: 85vh;
      width: 95%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: dialogSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
    `;

    // Add CSS animations and styles to the dialog
    const dialogStyles = document.createElement('style');
    dialogStyles.textContent = `
      @keyframes overlayFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes dialogSlideIn {
        from { 
          opacity: 0; 
          transform: scale(0.9) translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: scale(1) translateY(0); 
        }
      }
      
      .gorgeous-dialog-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 28px;
        position: relative;
        overflow: hidden;
      }
      
      .gorgeous-dialog-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Ccircle cx='51' cy='9' r='2'/%3E%3Ccircle cx='9' cy='51' r='2'/%3E%3Ccircle cx='51' cy='51' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        pointer-events: none;
      }
      
      .gorgeous-dialog-title {
        margin: 0;
        font-size: 22px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;
        z-index: 1;
      }
      
      .gorgeous-dialog-subtitle {
        margin: 10px 0 0 0;
        opacity: 0.9;
        font-size: 15px;
        font-weight: 400;
        position: relative;
        z-index: 1;
      }
      
      .gorgeous-dialog-content {
        flex: 1;
        overflow-y: auto;
        padding: 28px;
        background: #ffffff;
      }
      
      .gorgeous-content-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 28px;
        margin-bottom: 24px;
      }
      
      .gorgeous-content-section h3 {
        margin: 0 0 16px 0;
        color: #2d3748;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .gorgeous-text-area {
        border: 2px solid #e2e8f0;
        border-radius: 16px;
        padding: 20px;
        min-height: 200px;
        width: 100%;
        box-sizing: border-box;
        font-size: 14px;
        line-height: 1.6;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        resize: vertical;
        transition: all 0.3s ease;
      }
      
      .gorgeous-text-area:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        transform: translateY(-2px);
      }
      
      .gorgeous-original-area {
        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        border-color: #cbd5e0;
      }
      
      .gorgeous-rewritten-area {
        background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%);
        border-color: #9ae6b4;
      }
      
      .gorgeous-feedback-section {
        margin-top: 24px;
        padding: 24px;
        background: linear-gradient(135deg, #fffbeb 0%, #fef5e7 100%);
        border-radius: 20px;
        border: 2px solid #fed7aa;
      }
      
      .gorgeous-feedback-title {
        margin: 0 0 16px 0;
        color: #92400e;
        font-size: 15px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .gorgeous-feedback-area {
        background: white;
        border: 2px solid #fbbf24;
        border-radius: 12px;
        padding: 16px;
        width: 100%;
        box-sizing: border-box;
        font-size: 13px;
        line-height: 1.5;
        font-family: inherit;
        resize: vertical;
        min-height: 70px;
        transition: all 0.3s ease;
      }
      
      .gorgeous-feedback-area:focus {
        outline: none;
        border-color: #f59e0b;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        transform: translateY(-1px);
      }
      
      .gorgeous-regenerate-btn {
        margin-top: 16px;
        padding: 14px 24px;
        border: none;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        border-radius: 12px;
        font-size: 14px;
        cursor: pointer;
        font-weight: 600;
        width: 100%;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
      }
      
      .gorgeous-regenerate-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
      }
      
      .gorgeous-regenerate-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
      
      .gorgeous-dialog-footer {
        padding: 28px;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        display: flex;
        gap: 16px;
        justify-content: flex-end;
        border-top: 1px solid #e2e8f0;
      }
      
      .gorgeous-footer-btn {
        padding: 14px 28px;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 130px;
      }
      
      .gorgeous-cancel-btn {
        border: 2px solid #e2e8f0;
        background: white;
        color: #4a5568;
      }
      
      .gorgeous-cancel-btn:hover {
        background: #f7fafc;
        border-color: #cbd5e0;
        transform: translateY(-1px);
      }
      
      .gorgeous-accept-btn {
        border: none;
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
      }
      
      .gorgeous-accept-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);
      }
      
      @media (max-width: 768px) {
        .gorgeous-content-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
        
        .gorgeous-dialog-content {
          padding: 20px;
        }
        
        .gorgeous-dialog-footer {
          padding: 20px;
          flex-direction: column;
        }
        
        .gorgeous-footer-btn {
          min-width: auto;
        }
      }
    `;
    document.head.appendChild(dialogStyles);

    dialog.innerHTML = `
      <div class="gorgeous-dialog-header">
        <h2 class="gorgeous-dialog-title">
          ✨ Preview Email (${variantName})
        </h2>
        <p class="gorgeous-dialog-subtitle">
          Review the changes and choose to accept, edit, or cancel
        </p>
      </div>
      
      <div class="gorgeous-dialog-content">
        <div class="gorgeous-content-grid">
          <div class="gorgeous-content-section">
            <h3>📝 Original Text</h3>
            <textarea 
              id="originalTextArea" 
              class="gorgeous-text-area gorgeous-original-area"
            >${originalText}</textarea>
          </div>
          
          <div class="gorgeous-content-section">
            <h3>✨ Rewritten Text</h3>
            <textarea 
              id="rewrittenTextArea" 
              class="gorgeous-text-area gorgeous-rewritten-area"
            >${rewrittenText}</textarea>
            
            <div class="gorgeous-feedback-section">
              <h4 class="gorgeous-feedback-title">
                💬 Feedback for Improvement
              </h4>
              <textarea 
                id="feedbackTextArea" 
                class="gorgeous-feedback-area"
                placeholder="e.g., 'Make it more brief', 'Add more details', 'Make it more formal', 'Use simpler language'..."
              ></textarea>
              <button 
                id="regenerateBtn" 
                class="gorgeous-regenerate-btn"
              >
                🔄 Regenerate with Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="gorgeous-dialog-footer">
        <button id="cancelBtn" class="gorgeous-footer-btn gorgeous-cancel-btn">
          ❌ Cancel
        </button>
        <button id="acceptBtn" class="gorgeous-footer-btn gorgeous-accept-btn">
          ✅ Accept Changes
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

    // Add emoji prefix based on type
    const emoji = type === 'success' ? '✅' : '❌';
    messageEl.textContent = `${emoji} ${message}`;

    // Position and style
    messageEl.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      padding: 16px 24px;
      border-radius: 16px;
      z-index: 10000;
      font-size: 14px;
      font-weight: 600;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 400px;
      backdrop-filter: blur(10px);
      animation: messageSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
    `;

    if (type === 'success') {
      messageEl.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
      messageEl.style.color = 'white';
      messageEl.style.boxShadow = '0 8px 32px rgba(72, 187, 120, 0.4)';
    } else {
      messageEl.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
      messageEl.style.color = 'white';
      messageEl.style.boxShadow = '0 8px 32px rgba(245, 101, 101, 0.4)';
    }

    // Add CSS animation
    if (!document.querySelector('#gorgeous-message-animations')) {
      const messageAnimations = document.createElement('style');
      messageAnimations.id = 'gorgeous-message-animations';
      messageAnimations.textContent = `
        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateX(100%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes messageSlideOut {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(100%) scale(0.8);
          }
        }
        
        .native-english-message:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
      `;
      document.head.appendChild(messageAnimations);
    }

    document.body.appendChild(messageEl);

    // Add click to dismiss
    messageEl.addEventListener('click', () => {
      messageEl.style.animation = 'messageSlideOut 0.3s ease-in forwards';
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.parentNode.removeChild(messageEl);
        }
      }, 300);
    });

    // Auto remove after 4 seconds with animation
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.style.animation = 'messageSlideOut 0.3s ease-in forwards';
        setTimeout(() => {
          if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
          }
        }, 300);
      }
    }, 4000);
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