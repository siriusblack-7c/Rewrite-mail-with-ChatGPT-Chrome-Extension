// Gmail Integration Content Script
class GmailRewriter {
  constructor() {
    this.apiKey = null;
    this.englishVariant = 'US';
    this.dialogStylesInjected = false;
    this.init();
    this.setupStorageListener();
  }

  async init() {
    const result = await chrome.storage.sync.get(['openaiApiKey', 'englishVariant']);
    this.apiKey = result.openaiApiKey;
    this.englishVariant = result.englishVariant || 'US';
    this.waitForGmail();
  }

  setupStorageListener() {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync') {
        if (changes.openaiApiKey) this.apiKey = changes.openaiApiKey.newValue;
        if (changes.englishVariant) {
          this.englishVariant = changes.englishVariant.newValue || 'US';
          this.refreshRewriteButtons();
        }
      }
    });
  }

  refreshRewriteButtons() {
    document.querySelectorAll('.native-english-rewrite-btn').forEach(btn => btn.remove());
    this.addRewriteButtonsToExistingCompose();
  }

  waitForGmail() {
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
    this.observeComposeWindows();
    this.addRewriteButtonsToExistingCompose();

    // Also scan for reply areas after a delay (they might load later)
    setTimeout(() => {
      this.addRewriteButtonsToExistingCompose();
    }, 2000);
  }

  observeComposeWindows() {
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            // Handle new compose dialogs
            node.querySelectorAll('[role="dialog"]').forEach(win => this.addRewriteButtonToCompose(win));

            // Handle reply compose areas - look for any container with formatting toolbar
            node.querySelectorAll('[role="toolbar"], .J-Z').forEach(toolbar => {
              const composeContainer = toolbar.closest('[role="main"], .nH, .if, body') ||
                toolbar.parentElement?.closest('[role="main"], .nH, .if, body') ||
                document.body;
              if (composeContainer && this.isReplyComposeArea(composeContainer)) {
                setTimeout(() => this.addRewriteButtonToCompose(composeContainer), 100);
              }
            });

            // Also check if the added node itself is a compose area
            if (this.isReplyComposeArea(node)) {
              setTimeout(() => this.addRewriteButtonToCompose(node), 100);
            }

            // Check for any contenteditable areas that might be reply compose
            node.querySelectorAll('[contenteditable="true"]').forEach(editableArea => {
              const container = editableArea.closest('[role="main"], .if, .nH, body') || document.body;
              if (this.isReplyComposeArea(container)) {
                setTimeout(() => this.addRewriteButtonToCompose(container), 100);
              }
            });
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  isReplyComposeArea(element) {
    // Check if this element contains a reply compose interface
    if (!element.querySelector) return false;

    const hasEditableArea = element.querySelector('[role="textbox"][aria-label*="Message Body"]') ||
      element.querySelector('.Am.Al.editable') ||
      element.querySelector('[contenteditable="true"][aria-label*="Message"]') ||
      element.querySelector('[contenteditable="true"]');

    const hasToolbar = element.querySelector('[role="toolbar"]') ||
      element.querySelector('.J-Z') ||
      element.querySelector('[command="+bold"]') ||
      element.querySelector('[command="+italic"]') ||
      element.querySelector('[aria-label*="Bold"]') ||
      element.querySelector('[aria-label*="Italic"]');

    return hasEditableArea && hasToolbar;
  }

  addRewriteButtonsToExistingCompose() {
    // Handle existing compose dialogs
    document.querySelectorAll('[role="dialog"]').forEach(win => this.addRewriteButtonToCompose(win));

    // Handle existing reply compose areas - check document body and main containers
    const containersToCheck = [
      document.body,
      ...document.querySelectorAll('[role="main"]'),
      ...document.querySelectorAll('.nH'),
      ...document.querySelectorAll('.if'),
      ...document.querySelectorAll('.AD'),
      ...document.querySelectorAll('.hx')
    ];

    containersToCheck.forEach(container => {
      if (this.isReplyComposeArea(container)) {
        this.addRewriteButtonToCompose(container);
      }
    });

    // Also look for any toolbar and try to find its compose area
    document.querySelectorAll('[role="toolbar"], .J-Z').forEach(toolbar => {
      if (toolbar.querySelector('[command="+bold"], [command="+italic"], [aria-label*="Bold"], [aria-label*="Italic"]')) {
        const container = toolbar.closest('[role="main"]') ||
          toolbar.closest('.nH') ||
          toolbar.closest('.if') ||
          document.body;
        if (this.isReplyComposeArea(container)) {
          this.addRewriteButtonToCompose(container);
        }
      }
    });
  }

  addRewriteButtonToCompose(composeWindow) {
    if (composeWindow.querySelector('.native-english-rewrite-btn')) return;

    const waitForToolbar = (attempts = 0) => {
      // Try more specific selectors first, then fall back to general one
      let toolbar = composeWindow.querySelector('[role="toolbar"][aria-label="Formatting options"]');

      if (!toolbar) {
        // Fallback: look for any toolbar with formatting buttons
        const toolbars = composeWindow.querySelectorAll('[role="toolbar"]');
        for (const tb of toolbars) {
          // Check if it contains formatting buttons (bold, italic, etc.)
          if (tb.querySelector('[command="+bold"], [command="+italic"], [aria-label*="Bold"], [aria-label*="Italic"]')) {
            toolbar = tb;
            break;
          }
        }
      }

      if (!toolbar) {
        // Final fallback: look for the J-Z class which is Gmail's formatting toolbar
        toolbar = composeWindow.querySelector('.J-Z');
      }

      if (toolbar) {
        this.createRewriteButton(composeWindow, toolbar);
      } else if (attempts < 20) { // Try for 10 seconds (500ms * 20)
        setTimeout(() => waitForToolbar(attempts + 1), 500);
      }
    };

    waitForToolbar();
  }

  ensureButtonStyles() {
    // Inject critical button styles directly into the page if not already present
    if (!document.querySelector('#native-english-button-styles')) {
      const style = document.createElement('style');
      style.id = 'native-english-button-styles';
      style.textContent = `
        .native-english-rewrite-btn {
          display: inline-block !important;
          margin-left: 12px !important;
          user-select: none !important;
        }
        .native-english-rewrite-btn .rewrite-button {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          padding: 8px 10px !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          border: none !important;
          border-radius: 12px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
          position: relative !important;
          overflow: hidden !important;
          user-select: none !important;
          outline: none !important;
        }
        .native-english-rewrite-btn .rewrite-button:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
          transform: translateY(-2px) !important;
        }
        .native-english-rewrite-btn .rewrite-button:active {
          transform: translateY(0px) !important;
        }
        .native-english-rewrite-btn .rewrite-button:disabled {
          background: linear-gradient(135deg, #a0aec0, #cbd5e0) !important;
          cursor: not-allowed !important;
          transform: none !important;
          box-shadow: none !important;
        }
        .native-english-rewrite-btn .rewrite-button svg {
          width: 16px !important;
          height: 16px !important;
          fill: currentColor !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  createRewriteButton(composeWindow, toolbar) {
    // Don't add if button already exists
    if (composeWindow.querySelector('.native-english-rewrite-btn')) return;

    // Ensure button styles are injected
    this.ensureButtonStyles();

    const variantNames = { US: 'US', UK: 'UK', AU: 'AU', CA: 'CA', NZ: 'NZ', ZA: 'ZA' };
    const variantName = variantNames[this.englishVariant] || 'US';

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

    rewriteBtn.querySelector('.rewrite-button').addEventListener('click', () => this.handleRewrite(composeWindow));
    toolbar.appendChild(rewriteBtn);
  }

  async handleRewrite(composeWindow) {
    if (!this.apiKey) return this.showMessage('Please set your OpenAI API key in the extension popup first.', 'error');

    // Try multiple selectors to find the compose body (for both compose and reply)
    let composeBody = composeWindow.querySelector('[role="textbox"][aria-label*="Message Body"]') ||
      composeWindow.querySelector('.Am.Al.editable[contenteditable="true"]') ||
      composeWindow.querySelector('[contenteditable="true"][aria-label*="Message"]') ||
      composeWindow.querySelector('.editable[contenteditable="true"]');

    if (!composeBody) return this.showMessage('Could not find email content to rewrite.', 'error');

    const originalText = composeBody.innerText.trim();
    if (!originalText) return this.showMessage('Please enter some text to rewrite.', 'error');

    const button = composeWindow.querySelector('.rewrite-button');
    const originalButtonText = button.innerHTML;
    button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="spinning"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/></svg><span>...</span>`;
    button.disabled = true;

    try {
      const rewrittenText = await this.rewriteWithChatGPT(originalText);
      this.showPreviewDialog(composeWindow, originalText, rewrittenText, composeBody);
    } catch (error) {
      console.error('Rewrite error:', error);
      this.showMessage('Failed to rewrite email. Please try again.', 'error');
    } finally {
      button.innerHTML = originalButtonText;
      button.disabled = false;
    }
  }

  getSystemPrompt(englishVariant) {
    const base = 'You are a professional writing assistant. Rewrite the following email text to improve grammar, word choice, and sentence structure to sound natural and professional. Maintain the original meaning and tone. Keep the same level of formality as the original. IMPORTANT: Preserve all text formatting including line breaks, bullet points, numbered lists, and paragraph structure. Return only the rewritten text without any additional commentary.';
    const prompts = {
      US: `${base} Use American spelling (e.g., "color", "analyze", "organize"), American terminology, and natural American phrasing to sound like a native American English speaker.`,
      UK: `${base} Use British spelling (e.g., "colour", "analyse", "organise"), British terminology (e.g., "whilst", "amongst", "post" for mail), and natural British phrasing to sound like a native British English speaker.`,
      AU: `${base} Use Australian spelling (British-based), Australian terminology and expressions, and natural Australian phrasing to sound like a native Australian English speaker.`,
      CA: `${base} Use Canadian spelling (mix of British and American), Canadian terminology, and natural Canadian phrasing to sound like a native Canadian English speaker.`,
      NZ: `${base} Use New Zealand spelling (British-based), New Zealand terminology and expressions, and natural New Zealand phrasing to sound like a native New Zealand English speaker.`,
      ZA: `${base} Use South African spelling (British-based), South African terminology and expressions, and natural South African phrasing to sound like a native South African English speaker.`
    };
    return prompts[englishVariant] || prompts.US;
  }

  splitEmailContent(text) {
    const signatureSeparators = [
      /\n--\s*\n/, /\n--\s*$/, /^--\s*\n/, /\n-- \n/, /\n--$/, /^--$/m, /\n---+\s*\n/,
      /\nBest regards,/i, /\nSincerely,/i, /\nKind regards,/i, /\nThanks,/i, /\nRegards,/i, /\nCheers,/i, /\nBest,/i
    ];
    for (const sep of signatureSeparators) {
      const match = text.match(sep);
      if (match) {
        const splitIndex = match.index;
        const mainContent = text.substring(0, splitIndex).trim();
        const signature = text.substring(splitIndex).trim();
        if (mainContent.length > 10 && signature.length > 2) {
          return { mainContent, signature, hasSignature: true };
        }
      }
    }
    return { mainContent: text.trim(), signature: '', hasSignature: false };
  }

  combineEmailContent(mainContent, signature, hasSignature) {
    if (!hasSignature || !signature) return mainContent;
    const cleanMain = mainContent.trim();
    const cleanSignature = signature.trim();
    if (!cleanSignature.startsWith('--')) return `${cleanMain}\n\n${cleanSignature}`;
    return `${cleanMain}\n${cleanSignature}`;
  }

  updateComposeBodyWithFormatting(composeBody, text) {
    let formattedText = text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n(?![\s]*[-•*])/g, '<br>')
      // Handle bullet points but exclude signature separators (multiple dashes)
      .replace(/\n[\s]*[-•*](?!-)\s*(.+)/g, '<br>• $1')  // Only single - or • or *, not multiple dashes
      .replace(/\n[\s]*(\d+\.)\s*(.+)/g, '<br>$1 $2')
      .replace(/\n--[\s]*\n/g, '<br>--<br>')
      .replace(/\n--[\s]*$/g, '<br>--')
      // Preserve signature separators with multiple dashes
      .replace(/\n([-]{2,})/g, '<br>$1');  // Keep multiple dashes as-is
    if (!formattedText.startsWith('<p>')) formattedText = `<p>${formattedText}</p>`;
    formattedText = formattedText.replace(/<p><\/p>/g, '');
    composeBody.innerHTML = formattedText;
  }

  async rewriteWithChatGPT(text) {
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
          { role: 'system', content: this.getSystemPrompt(this.englishVariant) },
          { role: 'user', content: mainContent }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    const data = await response.json();
    const rewrittenMainContent = data.choices[0].message.content;
    return this.combineEmailContent(rewrittenMainContent, signature, hasSignature);
  }

  async rewriteWithFeedback(text, feedback) {
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
          { role: 'system', content: this.getSystemPrompt(this.englishVariant) },
          {
            role: 'user', content: `Please rewrite the following email text. Additionally, please incorporate this specific feedback: "${feedback}"
\nEmail text to rewrite:\n${mainContent}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    const data = await response.json();
    const rewrittenMainContent = data.choices[0].message.content;
    return this.combineEmailContent(rewrittenMainContent, signature, hasSignature);
  }

  showPreviewDialog(composeWindow, originalText, rewrittenText, composeBody) {
    const variantNames = {
      US: 'American English', UK: 'British English', AU: 'Australian English', CA: 'Canadian English', NZ: 'New Zealand English', ZA: 'South African English'
    };
    const variantName = variantNames[this.englishVariant] || 'American English';
    const overlay = document.createElement('div');
    overlay.className = 'native-english-overlay';
    overlay.style.cssText = `position: fixed;top: 0;left: 0;right: 0;bottom: 0;background: rgba(0, 0, 0, 0.7);backdrop-filter: blur(8px);z-index: 10001;display: flex;align-items: center;justify-content: center;font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;animation: overlayFadeIn 0.3s ease-out;`;
    const dialog = document.createElement('div');
    dialog.style.cssText = `background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);border-radius: 10px;box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2);max-width: 900px;max-height: 85vh;width: 95%;overflow: hidden;display: flex;flex-direction: column;animation: dialogSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);position: relative;`;
    dialog.innerHTML = `
      <div class="gorgeous-dialog-header">
        <h2 class="gorgeous-dialog-title">✨ Preview Email (${variantName})</h2>
        <p class="gorgeous-dialog-subtitle">Review the changes and choose to accept, edit, or cancel</p>
      </div>
      <div class="gorgeous-dialog-content">
        <div class="gorgeous-content-grid">
          <div class="gorgeous-content-section">
            <h3>📝 Original Text</h3>
            <textarea id="originalTextArea" class="gorgeous-text-area gorgeous-original-area">${originalText}</textarea>
          </div>
          <div class="gorgeous-content-section">
            <h3>✨ Rewritten Text</h3>
            <textarea id="rewrittenTextArea" class="gorgeous-text-area gorgeous-rewritten-area">${rewrittenText}</textarea>
            <div class="gorgeous-feedback-section">
              <h4 class="gorgeous-feedback-title">💬 Feedback for Improvement</h4>
              <textarea id="feedbackTextArea" class="gorgeous-feedback-area" placeholder="e.g., 'Make it more brief', 'Add more details', 'Make it more formal', 'Use simpler language'..."></textarea>
              <button id="regenerateBtn" class="gorgeous-regenerate-btn">🔄 Regenerate with Feedback</button>
            </div>
          </div>
        </div>
      </div>
      <div class="gorgeous-dialog-footer">
        <button id="cancelBtn" class="gorgeous-footer-btn gorgeous-cancel-btn">✖ Cancel</button>
        <button id="acceptBtn" class="gorgeous-footer-btn gorgeous-accept-btn">✔ Accept Changes</button>
      </div>
    `;
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    const cancelBtn = dialog.querySelector('#cancelBtn');
    const acceptBtn = dialog.querySelector('#acceptBtn');
    const rewrittenTextArea = dialog.querySelector('#rewrittenTextArea');
    const originalTextArea = dialog.querySelector('#originalTextArea');
    const feedbackTextArea = dialog.querySelector('#feedbackTextArea');
    const regenerateBtn = dialog.querySelector('#regenerateBtn');
    cancelBtn.addEventListener('click', () => document.body.removeChild(overlay));
    acceptBtn.addEventListener('click', () => {
      const finalText = rewrittenTextArea.value;
      this.updateComposeBodyWithFormatting(composeBody, finalText);
      composeBody.dispatchEvent(new Event('input', { bubbles: true }));
      document.body.removeChild(overlay);
      this.showMessage('Email updated successfully!', 'success');
    });
    regenerateBtn.addEventListener('click', async () => {
      const currentText = originalTextArea.value.trim();
      const feedback = feedbackTextArea.value.trim();
      if (!currentText) return this.showMessage('Please enter some text to rewrite.', 'error');
      if (!feedback) return this.showMessage('Please provide feedback for improvement.', 'error');
      const originalButtonText = regenerateBtn.innerHTML;
      regenerateBtn.innerHTML = '🔄 Regenerating...';
      regenerateBtn.disabled = true;
      try {
        const newRewrittenText = await this.rewriteWithFeedback(currentText, feedback);
        rewrittenTextArea.value = newRewrittenText;
        feedbackTextArea.value = '';
        this.showMessage('Text regenerated successfully!', 'success');
      } catch (error) {
        console.error('Regenerate error:', error);
        this.showMessage('Failed to regenerate text. Please try again.', 'error');
      } finally {
        regenerateBtn.innerHTML = originalButtonText;
        regenerateBtn.disabled = false;
      }
    });
    overlay.addEventListener('click', e => { if (e.target === overlay) document.body.removeChild(overlay); });
    setTimeout(() => {
      rewrittenTextArea.focus();
      rewrittenTextArea.setSelectionRange(rewrittenTextArea.value.length, rewrittenTextArea.value.length);
    }, 100);
  }

  showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `native-english-message ${type}`;
    const emoji = type === 'success' ? '✔' : '✖';
    messageEl.textContent = `${emoji} ${message}`;
    messageEl.style.cssText = `position: fixed;top: 24px;right: 24px;padding: 16px 24px;border-radius: 4px;z-index: 11000;font-size: 14px;font-weight: 600;font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;max-width: 400px;backdrop-filter: blur(10px);animation: messageSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);cursor: pointer;`;
    if (type === 'success') {
      messageEl.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
      messageEl.style.color = 'white';
      messageEl.style.boxShadow = '0 8px 32px rgba(72, 187, 120, 0.4)';
    } else {
      messageEl.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
      messageEl.style.color = 'white';
      messageEl.style.boxShadow = '0 8px 32px rgba(245, 101, 101, 0.4)';
    }
    document.body.appendChild(messageEl);
    messageEl.addEventListener('click', () => {
      messageEl.style.animation = 'messageSlideOut 0.3s ease-in forwards';
      setTimeout(() => { if (messageEl.parentNode) messageEl.parentNode.removeChild(messageEl); }, 300);
    });
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.style.animation = 'messageSlideOut 0.3s ease-in forwards';
        setTimeout(() => { if (messageEl.parentNode) messageEl.parentNode.removeChild(messageEl); }, 300);
      }
    }, 4000);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new GmailRewriter());
} else {
  new GmailRewriter();
} 