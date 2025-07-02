// Gmail Integration Content Script - Optimized
class GmailRewriter {
  constructor() {
    this.apiKey = null;
    this.englishVariant = 'US';
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.rateLimitInfo = {
      resetTime: null,
      retryAfter: null,
      requestsInWindow: 0,
      windowStart: Date.now()
    };

    // Performance caches
    this.cachedSelectors = new Map();
    this.variantPrompts = this.initializeVariantPrompts();
    this.variantNames = {
      US: 'American English', UK: 'British English', AU: 'Australian English',
      CA: 'Canadian English', NZ: 'New Zealand English', ZA: 'South African English'
    };

    this.init();
    this.setupStorageListener();
  }

  async init() {
    const result = await chrome.storage.sync.get(['openaiApiKey', 'englishVariant']);
    this.apiKey = result.openaiApiKey;
    this.englishVariant = result.englishVariant || 'US';
    this.checkForConflicts();
    this.waitForGmail();
  }

  initializeVariantPrompts() {
    const base = 'You are a professional writing assistant. Rewrite the following email text to improve grammar, word choice, and sentence structure to sound natural and professional. Maintain the original meaning and tone. Keep the same level of formality as the original. IMPORTANT: Preserve all text formatting including line breaks, bullet points, numbered lists, and paragraph structure. Return only the rewritten text without any additional commentary.';

    return {
      US: `${base} Use American spelling (e.g., "color", "analyze", "organize"), American terminology, and natural American phrasing to sound like a native American English speaker.`,
      UK: `${base} Use British spelling (e.g., "colour", "analyse", "organise"), British terminology (e.g., "whilst", "amongst", "post" for mail), and natural British phrasing to sound like a native British English speaker.`,
      AU: `${base} Use Australian spelling (British-based), Australian terminology and expressions, and natural Australian phrasing to sound like a native Australian English speaker.`,
      CA: `${base} Use Canadian spelling (mix of British and American), Canadian terminology, and natural Canadian phrasing to sound like a native Canadian English speaker.`,
      NZ: `${base} Use New Zealand spelling (British-based), New Zealand terminology and expressions, and natural New Zealand phrasing to sound like a native New Zealand English speaker.`,
      ZA: `${base} Use South African spelling (British-based), South African terminology and expressions, and natural South African phrasing to sound like a native South African English speaker.`
    };
  }

  getCachedSelector(key, selector, context = document) {
    if (!this.cachedSelectors.has(key)) {
      this.cachedSelectors.set(key, context.querySelector(selector));
    }
    return this.cachedSelectors.get(key);
  }

  clearSelectorCache() {
    this.cachedSelectors.clear();
  }

  async checkCreditsAndBilling() {
    if (!this.apiKey) throw new Error('No API key provided');

    try {
      const billingResponse = await fetch('https://api.openai.com/v1/dashboard/billing/credit_grants', {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });

      if (!billingResponse.ok) {
        if (billingResponse.status === 401 || billingResponse.status === 403) {
          throw new Error('INVALID_API_KEY');
        }

        const modelResponse = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        });

        if (!modelResponse.ok) {
          if (modelResponse.status === 401 || modelResponse.status === 403) {
            throw new Error('INVALID_API_KEY');
          }
          throw new Error('API_CHECK_FAILED');
        }
        return { hasCredits: 'unknown', hasBilling: 'unknown' };
      }

      const billingData = await billingResponse.json();
      const hasActiveCredits = billingData.grants?.some(grant =>
        grant.effective_at * 1000 <= Date.now() &&
        grant.expires_at * 1000 > Date.now() &&
        grant.used_amount < grant.granted_amount
      ) || false;

      let hasBillingSetup = false;
      if (!hasActiveCredits) {
        try {
          const usageResponse = await fetch('https://api.openai.com/v1/dashboard/billing/usage', {
            headers: { 'Authorization': `Bearer ${this.apiKey}` }
          });
          hasBillingSetup = usageResponse.ok;
        } catch (e) {
          // Ignore billing check errors
        }
      }

      return {
        hasCredits: hasActiveCredits,
        hasBilling: hasBillingSetup || hasActiveCredits,
        grants: billingData.grants || []
      };
    } catch (error) {
      if (error.message === 'INVALID_API_KEY') throw error;
      return { hasCredits: 'unknown', hasBilling: 'unknown' };
    }
  }

  checkForConflicts() {
    setTimeout(() => {
      const conflicts = [
        document.querySelector('[data-grammarly-shadow-root], .gr_, [data-gramm]'),
        document.querySelector('[class*="boomerang"], [class*="mixmax"], [class*="streak"]')
      ];

      if (conflicts[0]) console.warn('Gmail Rewriter: Grammarly detected. This may cause conflicts.');
      if (conflicts[1]) console.warn('Gmail Rewriter: Other Gmail extensions detected.');
    }, 3000);
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
    this.clearSelectorCache();
    this.addRewriteButtonsToExistingCompose();
  }

  // Optimized Rate limiting
  async waitForRateLimit() {
    const now = Date.now();

    if (this.rateLimitInfo.retryAfter && now < this.rateLimitInfo.retryAfter) {
      const waitTime = this.rateLimitInfo.retryAfter - now;
      return new Promise(resolve => setTimeout(resolve, waitTime));
    }

    if (now - this.rateLimitInfo.windowStart > 60000) {
      this.rateLimitInfo.requestsInWindow = 0;
      this.rateLimitInfo.windowStart = now;
    }

    if (this.rateLimitInfo.requestsInWindow >= 15) {
      const waitTime = 60000 - (now - this.rateLimitInfo.windowStart);
      if (waitTime > 0) {
        return new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  async exponentialBackoff(attempt) {
    const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 30000);
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  async makeApiRequestWithRetry(requestBody, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await this.waitForRateLimit();
        this.rateLimitInfo.requestsInWindow++;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify(requestBody)
        });

        this.updateRateLimitInfo(response);

        if (response.ok) return await response.json();

        if (response.status === 429) {
          const errorData = await response.json();
          const retryAfter = response.headers.get('retry-after');

          this.rateLimitInfo.retryAfter = retryAfter
            ? Date.now() + (parseInt(retryAfter) * 1000)
            : Date.now() + (Math.pow(2, attempt) * 1000);

          if (attempt === maxRetries) {
            throw new Error(`429: ${errorData.error?.message || 'Rate limit exceeded after retries'}`);
          }

          await this.exponentialBackoff(attempt);
          continue;
        }

        // Handle other errors
        if (response.status === 401 || response.status === 403) {
          throw new Error(`${response.status}: Invalid API key`);
        }

        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`400: ${errorData.error?.message || 'Bad request'}`);
        }

        if (response.status >= 500) {
          if (attempt === maxRetries) {
            throw new Error(`${response.status}: Server error after retries`);
          }
          await this.exponentialBackoff(attempt);
          continue;
        }

        const errorData = await response.json();
        throw new Error(`${response.status}: ${errorData.error?.message || 'API request failed'}`);

      } catch (error) {
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
          if (attempt === maxRetries) {
            throw new Error(`Network error after ${maxRetries + 1} attempts: ${error.message}`);
          }
          await this.exponentialBackoff(attempt);
          continue;
        }
        throw error;
      }
    }
  }

  updateRateLimitInfo(response) {
    const remaining = response.headers.get('x-ratelimit-remaining-requests');
    const reset = response.headers.get('x-ratelimit-reset-requests');

    if (remaining && parseInt(remaining) < 5) {
      this.rateLimitInfo.requestsInWindow = Math.max(this.rateLimitInfo.requestsInWindow, 15);
    }

    if (reset) {
      const resetMatch = reset.match(/(\d+)m(\d+)s/) || reset.match(/(\d+)s/);
      if (resetMatch) {
        const minutes = parseInt(resetMatch[1]) || 0;
        const seconds = parseInt(resetMatch[2]) || parseInt(resetMatch[1]) || 0;
        this.rateLimitInfo.retryAfter = Date.now() + (minutes * 60 + seconds) * 1000;
      }
    }
  }

  async addToQueue(requestData) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ requestData, resolve, reject, timestamp: Date.now() });

      if (this.requestQueue.length > 1) {
        this.showMessage(`Request queued (${this.requestQueue.length} pending). Please wait...`, 'info');
      }

      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;

    try {
      while (this.requestQueue.length > 0) {
        const { requestData, resolve, reject } = this.requestQueue.shift();

        try {
          const result = await this.makeApiRequestWithRetry(requestData);
          resolve(result);
        } catch (error) {
          reject(error);
        }

        if (this.requestQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  async handleCreditsAndBillingError() {
    try {
      this.showMessage('Checking your OpenAI account...', 'info');
      const creditInfo = await this.checkCreditsAndBilling();

      if (creditInfo.hasCredits === false && creditInfo.hasBilling === false) {
        this.showDetailedBillingMessage();
      } else if (creditInfo.hasCredits === false && creditInfo.hasBilling === true) {
        this.showMessage('OpenAI credits exhausted. Your usage has exceeded your current plan limits. Please check your OpenAI dashboard and consider upgrading your plan.', 'error');
      } else {
        this.showDetailedBillingMessage();
      }
    } catch (error) {
      if (error.message === 'INVALID_API_KEY') {
        this.showMessage('Invalid API key. Please check your OpenAI API key in the extension popup.', 'error');
      } else {
        this.showDetailedBillingMessage();
      }
    }
  }

  showDetailedBillingMessage() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); z-index: 11000;`;

    const messageContainer = document.createElement('div');
    messageContainer.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 12px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); max-width: 500px; width: 90%; z-index: 11001; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`;

    messageContainer.innerHTML = `
      <div style="padding: 24px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">⚠️</div>
          <h3 style="margin: 0; color: #1a202c; font-size: 18px; font-weight: 600;">OpenAI Credits Required</h3>
        </div>
        
        <div style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">
          <p style="margin: 0 0 12px 0;"><strong>Your OpenAI API key might not have credits or billing setup.</strong></p>
          
          <p style="margin: 0 0 12px 0;">To use this extension, you need:</p>
          <ul style="margin: 0 0 12px 0; padding-left: 20px;">
            <li>A valid OpenAI API key</li>
            <li>A billing method on file (credit card)</li>
            <li>Available credits or usage limits</li>
          </ul>
          
          <p style="margin: 0; font-weight: 600; color: #d69e2e;">💡 OpenAI allows creating API keys without billing, but they won't work without credits!</p>
        </div>

        <div style="background: #fef5e7; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 12px 0; color: #92400e; font-size: 14px; font-weight: 600;">📋 Steps to Fix:</h4>
          <ol style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.5;">
            <li>Go to <a href="https://platform.openai.com/account/billing/overview" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 600;">OpenAI Billing Dashboard</a></li>
            <li>Add a payment method (credit card)</li>
            <li>Add credits or set up auto-recharge</li>
            <li>Wait a few minutes, then try again</li>
          </ol>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button onclick="window.open('https://platform.openai.com/account/billing/overview', '_blank')" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Open Billing Dashboard</button>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: linear-gradient(135deg, #6b7280, #4b5563); color: white; border: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Close</button>
        </div>
      </div>
    `;

    overlay.addEventListener('click', e => {
      if (e.target === overlay) document.body.removeChild(overlay);
    });

    overlay.appendChild(messageContainer);
    document.body.appendChild(overlay);

    setTimeout(() => {
      if (overlay.parentNode) document.body.removeChild(overlay);
    }, 15000);
  }

  waitForGmail() {
    // Enhanced Gmail detection for page reloads and navigation
    let checkAttempts = 0;
    const maxAttempts = 30; // 30 seconds max wait

    const checkGmailLoaded = () => {
      const gmailLoaded = document.querySelector('[role="main"]') &&
        (document.querySelector('.nH') || document.querySelector('[role="banner"]'));

      if (gmailLoaded) {
        console.log('Gmail Rewriter: Gmail detected, setting up integration...');
        this.setupGmailIntegration();
      } else if (checkAttempts < maxAttempts) {
        checkAttempts++;
        setTimeout(checkGmailLoaded, 1000);
      } else {
        console.warn('Gmail Rewriter: Gmail not detected after 30 seconds, trying minimal setup...');
        this.setupGmailIntegration(); // Try anyway
      }
    };

    // Start checking immediately and also listen for URL changes (Gmail SPA navigation)
    checkGmailLoaded();
    this.setupNavigationListener();
  }

  setupNavigationListener() {
    // Listen for Gmail SPA navigation changes
    let lastUrl = location.href;

    const checkUrlChange = () => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log('Gmail Rewriter: URL changed, refreshing integration...');
        this.clearSelectorCache();

        // Wait a bit for new content to load, then refresh buttons
        setTimeout(() => {
          this.addRewriteButtonsToExistingCompose();
        }, 1500);
      }
    };

    // Check for URL changes every 2 seconds
    setInterval(checkUrlChange, 2000);

    // Also listen for hashchange and popstate events
    window.addEventListener('hashchange', () => {
      setTimeout(() => {
        this.clearSelectorCache();
        this.addRewriteButtonsToExistingCompose();
      }, 1500);
    });

    window.addEventListener('popstate', () => {
      setTimeout(() => {
        this.clearSelectorCache();
        this.addRewriteButtonsToExistingCompose();
      }, 1500);
    });
  }

  setupGmailIntegration() {
    this.observeComposeWindows();
    this.addRewriteButtonsToExistingCompose();

    // Multiple delayed scans to catch dynamically loaded content
    setTimeout(() => this.addRewriteButtonsToExistingCompose(), 2000);
    setTimeout(() => this.addRewriteButtonsToExistingCompose(), 5000);
    setTimeout(() => this.addRewriteButtonsToExistingCompose(), 10000);

    // Start periodic scanning for missed compose windows (especially after page reloads)
    this.startPeriodicScan();
  }

  startPeriodicScan() {
    // Periodic scan every 10 seconds to catch any missed compose windows
    setInterval(() => {
      const existingButtons = document.querySelectorAll('.native-english-rewrite-btn').length;
      const potentialComposeAreas = document.querySelectorAll(
        '[role="dialog"], .nH .if, .adn, .AD, [contenteditable="true"][aria-label*="Message"]'
      ).length;

      // If we find compose areas without buttons, do a scan
      if (potentialComposeAreas > existingButtons) {
        console.log('Gmail Rewriter: Periodic scan detected missing buttons, refreshing...');
        this.addRewriteButtonsToExistingCompose();
      }
    }, 10000);
  }

  observeComposeWindows() {
    const observer = new MutationObserver(mutations => {
      const addedNodes = [];
      let hasSignificantChanges = false;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            addedNodes.push(node);

            // Check if this is a significant Gmail UI change
            if (node.querySelector && (
              node.querySelector('[role="dialog"]') ||
              node.querySelector('[role="toolbar"]') ||
              node.querySelector('.J-Z') ||
              node.querySelector('[contenteditable="true"]') ||
              node.classList?.contains('nH') ||
              node.classList?.contains('if') ||
              node.classList?.contains('adn')
            )) {
              hasSignificantChanges = true;
            }
          }
        }
      }

      if (addedNodes.length === 0) return;

      // Batch process added nodes
      addedNodes.forEach(node => {
        // Check for compose dialogs
        node.querySelectorAll('[role="dialog"]').forEach(win => this.addRewriteButtonToCompose(win));

        // Check for inline compose areas
        node.querySelectorAll('.nH .if, .adn, .AD').forEach(composeArea => {
          if (this.isReplyComposeArea(composeArea)) {
            setTimeout(() => this.addRewriteButtonToCompose(composeArea), 100);
          }
        });

        // Check if the node itself is a compose area
        if (this.isReplyComposeArea(node)) {
          setTimeout(() => this.addRewriteButtonToCompose(node), 100);
        }

        // Check for any new toolbars that might indicate compose areas
        node.querySelectorAll('[role="toolbar"], .J-Z').forEach(toolbar => {
          const composeContainer = toolbar.closest('[role="dialog"], .nH .if, .adn, .AD') ||
            toolbar.parentElement?.closest('[role="main"]');
          if (composeContainer && this.isReplyComposeArea(composeContainer)) {
            setTimeout(() => this.addRewriteButtonToCompose(composeContainer), 200);
          }
        });
      });

      // If significant changes detected, do a broader scan
      if (hasSignificantChanges) {
        setTimeout(() => {
          this.clearSelectorCache();
          this.addRewriteButtonsToExistingCompose();
        }, 500);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'role', 'aria-label']
    });
  }

  isReplyComposeArea(element) {
    if (!element?.querySelector) return false;

    const hasEditableArea = element.querySelector('[role="textbox"][aria-label*="Message Body"], .Am.Al.editable, [contenteditable="true"]');
    const hasToolbar = element.querySelector('[role="toolbar"], .J-Z, [command="+bold"], [aria-label*="Bold"]');

    return !!(hasEditableArea && hasToolbar);
  }

  addRewriteButtonsToExistingCompose() {
    // More robust detection for different Gmail loading states
    const composeSelectors = [
      '[role="dialog"]',                    // Compose pop-up dialogs
      '.nH .if',                           // Inline compose areas
      '[data-message-id]',                 // Reply areas with message IDs
      '.adn',                              // Gmail compose container
      '.AD',                               // Another Gmail compose class
      '[role="main"] [contenteditable="true"]' // Any contenteditable in main area
    ];

    // Check each type of compose area
    composeSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (element.tagName === 'DIV' && (
          element.querySelector('[role="textbox"]') ||
          element.querySelector('[contenteditable="true"]') ||
          this.isReplyComposeArea(element)
        )) {
          this.addRewriteButtonToCompose(element);
        }
      });
    });

    // Fallback: check all containers with compose-like content
    const containers = [
      document.body,
      ...document.querySelectorAll('[role="main"], .nH, .if, .adn, .AD, .aoI')
    ];

    containers.forEach(container => {
      if (this.isReplyComposeArea(container)) {
        this.addRewriteButtonToCompose(container);
      }
    });

    // Special check for minimized compose windows that may not be detected
    document.querySelectorAll('.nH .if .nr').forEach(minimizedCompose => {
      const parent = minimizedCompose.closest('.if');
      if (parent && this.isReplyComposeArea(parent)) {
        this.addRewriteButtonToCompose(parent);
      }
    });
  }

  addRewriteButtonToCompose(composeWindow) {
    if (!composeWindow || composeWindow.querySelector('.native-english-rewrite-btn')) return;

    const findToolbar = () => {
      // Try multiple toolbar selectors in order of specificity
      const toolbarSelectors = [
        '[role="toolbar"][aria-label="Formatting options"]',
        '[role="toolbar"][aria-label*="Format"]',
        '[role="toolbar"]',
        '.J-Z',                                    // Gmail's formatting toolbar class
        '.aoD.hl',                                 // Alternative Gmail toolbar
        '.Am.Al .Au',                              // Bottom toolbar area
        '[command="+bold"]',                       // Find by Bold button
        '[aria-label*="Bold"]'                     // Find by Bold button aria-label
      ];

      for (const selector of toolbarSelectors) {
        const toolbar = composeWindow.querySelector(selector);
        if (toolbar) {
          // Verify it's actually a formatting toolbar
          if (toolbar.querySelector('[command="+bold"], [command="+italic"], [aria-label*="Bold"], [aria-label*="Italic"]') ||
            toolbar.closest('.J-Z') ||
            toolbar.classList.contains('J-Z')) {
            return toolbar;
          }
        }
      }
      return null;
    };

    const toolbar = findToolbar();
    if (toolbar) {
      this.createRewriteButton(composeWindow, toolbar);
    } else {
      // Enhanced polling with better detection
      let attempts = 0;
      const maxAttempts = 15; // Increased for page reload scenarios

      const poll = () => {
        const tb = findToolbar();
        if (tb) {
          this.createRewriteButton(composeWindow, tb);
        } else if (++attempts < maxAttempts) {
          // Use longer intervals after initial attempts
          const delay = attempts < 5 ? 300 : attempts < 10 ? 600 : 1000;
          setTimeout(poll, delay);
        } else {
          // Last resort: try to create button near any contenteditable area
          const contentArea = composeWindow.querySelector('[contenteditable="true"], [role="textbox"]');
          if (contentArea) {
            const nearbyContainer = contentArea.parentElement?.querySelector('div') || contentArea.parentElement;
            if (nearbyContainer && !nearbyContainer.querySelector('.native-english-rewrite-btn')) {
              console.log('Gmail Rewriter: Creating button in fallback location');
              this.createRewriteButton(composeWindow, nearbyContainer);
            }
          }
        }
      };

      // Start polling after a short delay to let DOM settle
      setTimeout(poll, 200);
    }
  }

  ensureButtonStyles() {
    if (document.querySelector('#native-english-button-styles')) return;

    const style = document.createElement('style');
    style.id = 'native-english-button-styles';
    style.textContent = `.native-english-rewrite-btn{display:inline-block!important;margin-left:12px!important;user-select:none!important}.native-english-rewrite-btn .rewrite-button{display:inline-flex!important;align-items:center!important;gap:8px!important;padding:8px 10px!important;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)!important;color:white!important;border:none!important;border-radius:12px!important;font-size:14px!important;font-weight:600!important;cursor:pointer!important;transition:all .3s ease!important;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif!important;box-shadow:0 4px 15px rgba(102,126,234,.3)!important;position:relative!important;overflow:hidden!important;user-select:none!important;outline:none!important}.native-english-rewrite-btn .rewrite-button:hover{background:linear-gradient(135deg,#5a67d8 0%,#6b46c1 100%)!important;box-shadow:0 8px 25px rgba(102,126,234,.4)!important;transform:translateY(-2px)!important}.native-english-rewrite-btn .rewrite-button:active{transform:translateY(0px)!important}.native-english-rewrite-btn .rewrite-button:disabled{background:linear-gradient(135deg,#a0aec0,#cbd5e0)!important;cursor:not-allowed!important;transform:none!important;box-shadow:none!important}.native-english-rewrite-btn .rewrite-button svg{width:16px!important;height:16px!important;fill:currentColor!important}`;
    document.head.appendChild(style);
  }

  createRewriteButton(composeWindow, toolbar) {
    if (composeWindow.querySelector('.native-english-rewrite-btn')) return;

    this.ensureButtonStyles();

    const rewriteBtn = document.createElement('div');
    rewriteBtn.className = 'native-english-rewrite-btn';
    rewriteBtn.innerHTML = `<button class="rewrite-button" title="Rewrite for ${this.englishVariant}"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.51-6.84L9.37 4.5C8.16 3.42 6.49 3.42 5.28 4.5l-1.5 1.31C2.57 6.87 2.3 7.96 2.66 9c.36 1.04 1.2 1.88 2.24 2.24 1.04.36 2.13.09 3.19-.57l.03.03L5.58 13.8c-.35.35-.35.92 0 1.27.35.35.92.35 1.27 0l2.54-2.54.03.03c1.66 1.66 4.38 1.66 6.04 0l1.41-1.41c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.41 1.41c-.78.78-2.05.78-2.83 0-.78-.78-.78-2.05 0-2.83l1.41-1.41c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-1.41 1.41z"/></svg>${this.englishVariant}</button>`;

    rewriteBtn.querySelector('.rewrite-button').addEventListener('click', () => this.handleRewrite(composeWindow));
    toolbar.appendChild(rewriteBtn);
  }

  // Optimized text extraction
  extractUserInputFromHTML(composeBody) {
    const clone = composeBody.cloneNode(true);

    // Remove quoted content efficiently
    clone.querySelectorAll('blockquote, [class*="quote"], [class*="gmail_quote"], .gmail_extra').forEach(el => el.remove());

    // Text pattern matching for quoted content
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
    const quotedPatterns = [/^\s*On .+? wrote:/m, /^\s*From: .+/m, /^\s*>{1,}/m, /Original Message/i, /Forwarded message/i];

    let node;
    while (node = walker.nextNode()) {
      if (quotedPatterns.some(pattern => pattern.test(node.textContent))) {
        let current = node.parentNode;
        while (current && current !== clone) {
          let next = current.nextSibling;
          while (next) {
            const toRemove = next;
            next = next.nextSibling;
            toRemove.remove();
          }
          current = current.parentNode;
        }
        node.remove();
        break;
      }
    }

    return {
      text: clone.innerText.trim(),
      html: clone.innerHTML.trim()
    };
  }

  // Streamlined rewrite handler
  async handleRewrite(composeWindow) {
    if (!this.apiKey) return this.showMessage('Please set your OpenAI API key in the extension popup first.', 'error');

    const composeBody = composeWindow.querySelector('[role="textbox"][aria-label*="Message Body"], .Am.Al.editable[contenteditable="true"], [contenteditable="true"][aria-label*="Message"], .editable[contenteditable="true"]');
    if (!composeBody) return this.showMessage('Could not find email content to rewrite.', 'error');

    // Fast quoted content detection
    const hasQuotedContent = !!(composeBody.querySelector('blockquote, .gmail_quote, [class*="quote"]') ||
      /wrote:|Original Message|From:/.test(composeBody.innerHTML));

    let originalText, originalHTML, isUserInputOnly;

    if (hasQuotedContent) {
      const extraction = this.extractUserInputFromHTML(composeBody);
      originalText = extraction.text;
      originalHTML = extraction.html;
      isUserInputOnly = true;
    } else {
      originalText = composeBody.innerText.trim();
      originalHTML = composeBody.innerHTML;
      isUserInputOnly = false;
    }

    if (!originalText) return this.showMessage('Please enter some text to rewrite.', 'error');

    const button = composeWindow.querySelector('.rewrite-button');
    const originalButtonText = button.innerHTML;
    button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="spinning"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/></svg><span>...</span>`;
    button.disabled = true;

    try {
      const rewrittenText = await this.rewriteWithChatGPT(originalText);
      this.showPreviewDialog(composeWindow, originalText, rewrittenText, composeBody, isUserInputOnly, originalHTML);
    } catch (error) {
      this.handleRewriteError(error);
    } finally {
      button.innerHTML = originalButtonText;
      button.disabled = false;
    }
  }

  handleRewriteError(error) {
    console.error('Rewrite error:', error);

    if (error.message.includes('401') || error.message.includes('403')) {
      this.showMessage('Invalid API key. Please check your OpenAI API key in the extension popup.', 'error');
    } else if (error.message.includes('429')) {
      const message = error.message.includes('after retries')
        ? 'OpenAI rate limit exceeded. Please wait a few minutes before trying again.'
        : 'Rate limit exceeded. The request is being retried automatically...';
      this.showMessage(message, error.message.includes('after retries') ? 'error' : 'info');
    } else if (/insufficient_quota|quota|exceeded|billing/.test(error.message)) {
      this.handleCreditsAndBillingError();
      return;
    } else if (error.message.includes('Network error') || error.message.includes('fetch')) {
      this.showMessage('Network error. Please check your internet connection and try again.', 'error');
    } else if (error.message.includes('Server error')) {
      this.showMessage('OpenAI server error. Please try again in a few moments.', 'error');
    } else if (error.message.includes('400')) {
      this.showMessage('Request error. The text might be too long or contain invalid content.', 'error');
    } else {
      this.showMessage('Failed to rewrite email. Please try again.', 'error');
    }
  }

  // Optimized email content processing
  splitEmailContent(text) {
    const separators = [/\n--\s*\n/, /\n--\s*$/, /^--\s*\n/, /\n-- \n/, /\n--$/, /^--$/m, /\n---+\s*\n/, /\nBest regards,/i, /\nSincerely,/i, /\nKind regards,/i, /\nThanks,/i, /\nRegards,/i, /\nCheers,/i, /\nBest,/i];

    for (const sep of separators) {
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
    return cleanSignature.startsWith('--') ? `${cleanMain}\n${cleanSignature}` : `${cleanMain}\n\n${cleanSignature}`;
  }

  // Optimized API calls
  async rewriteWithChatGPT(text) {
    const { mainContent, signature, hasSignature } = this.splitEmailContent(text);

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: this.variantPrompts[this.englishVariant] || this.variantPrompts.US },
        { role: 'user', content: mainContent }
      ],
      max_tokens: 1000,
      temperature: 0.3
    };

    const data = await this.addToQueue(requestBody);
    return this.combineEmailContent(data.choices[0].message.content, signature, hasSignature);
  }

  async rewriteWithFeedback(text, feedback) {
    const { mainContent, signature, hasSignature } = this.splitEmailContent(text);

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: this.variantPrompts[this.englishVariant] || this.variantPrompts.US },
        { role: 'user', content: `Please rewrite the following email text. Additionally, please incorporate this specific feedback: "${feedback}"\n\nEmail text to rewrite:\n${mainContent}` }
      ],
      max_tokens: 1000,
      temperature: 0.3
    };

    const data = await this.addToQueue(requestBody);
    return this.combineEmailContent(data.choices[0].message.content, signature, hasSignature);
  }

  // Optimized HTML operations
  replaceUserInputInHTMLCompose(composeBody, originalUserText, rewrittenUserText, originalHTML) {
    const currentHTML = composeBody.innerHTML;
    let formattedRewrittenText = rewrittenUserText.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>');

    if (!formattedRewrittenText.startsWith('<p>') && formattedRewrittenText.length > 0) {
      formattedRewrittenText = '<p>' + formattedRewrittenText + '</p>';
    }

    if (originalHTML && currentHTML.includes(originalHTML)) {
      composeBody.innerHTML = currentHTML.replace(originalHTML, formattedRewrittenText);
    } else {
      const quotedMarkers = ['<blockquote', 'class="gmail_quote"', 'wrote:</div>', 'wrote:</span>', 'Original Message', 'From:</div>', 'From:</span>'];
      let insertionPoint = -1;

      for (const marker of quotedMarkers) {
        const index = currentHTML.indexOf(marker);
        if (index !== -1) {
          insertionPoint = index;
          break;
        }
      }

      if (insertionPoint !== -1) {
        const beforeQuoted = currentHTML.substring(0, insertionPoint);
        const quotedContent = currentHTML.substring(insertionPoint);
        const cleanBefore = beforeQuoted.replace(/<p[^>]*>.*?<\/p>/g, '').replace(/<div[^>]*>.*?<\/div>/g, '').trim();
        composeBody.innerHTML = cleanBefore + formattedRewrittenText + '<br><br>' + quotedContent;
      } else {
        composeBody.innerHTML = formattedRewrittenText;
      }
    }
  }

  updateComposeBodyWithFormatting(composeBody, text) {
    let formattedText = text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n(?![\s]*[-•*])/g, '<br>')
      .replace(/\n[\s]*[-•*](?!-)\s*(.+)/g, '<br>• $1')
      .replace(/\n[\s]*(\d+\.)\s*(.+)/g, '<br>$1 $2')
      .replace(/\n--[\s]*\n/g, '<br>--<br>')
      .replace(/\n--[\s]*$/g, '<br>--')
      .replace(/\n([-]{2,})/g, '<br>$1');

    if (!formattedText.startsWith('<p>')) formattedText = `<p>${formattedText}</p>`;
    composeBody.innerHTML = formattedText.replace(/<p><\/p>/g, '');
  }

  // Optimized preview dialog
  showPreviewDialog(composeWindow, originalText, rewrittenText, composeBody, isUserInputOnly = false, originalHTML = null) {
    const variantName = this.variantNames[this.englishVariant] || 'American English';

    const overlay = document.createElement('div');
    overlay.className = 'native-english-overlay';
    overlay.style.cssText = `position: fixed;top: 0;left: 0;right: 0;bottom: 0;background: rgba(0, 0, 0, 0.7);backdrop-filter: blur(8px);z-index: 10001;display: flex;align-items: center;justify-content: center;font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`;

    const dialog = document.createElement('div');
    dialog.style.cssText = `background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);border-radius: 10px;box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);max-width: 900px;max-height: 85vh;width: 95%;overflow: hidden;display: flex;flex-direction: column;position: relative;`;

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

    // Event listeners
    dialog.querySelector('#cancelBtn').addEventListener('click', () => document.body.removeChild(overlay));

    dialog.querySelector('#acceptBtn').addEventListener('click', () => {
      const finalText = dialog.querySelector('#rewrittenTextArea').value;

      if (isUserInputOnly && originalHTML) {
        this.replaceUserInputInHTMLCompose(composeBody, originalText, finalText, originalHTML);
      } else {
        this.updateComposeBodyWithFormatting(composeBody, finalText);
      }

      composeBody.dispatchEvent(new Event('input', { bubbles: true }));
      document.body.removeChild(overlay);
      this.showMessage('Email updated successfully!', 'success');
    });

    dialog.querySelector('#regenerateBtn').addEventListener('click', async (e) => {
      const currentText = dialog.querySelector('#originalTextArea').value.trim();
      const feedback = dialog.querySelector('#feedbackTextArea').value.trim();

      if (!currentText) return this.showMessage('Please enter some text to rewrite.', 'error');
      if (!feedback) return this.showMessage('Please provide feedback for improvement.', 'error');

      const btn = e.target;
      const originalButtonText = btn.innerHTML;
      btn.innerHTML = '🔄 Regenerating...';
      btn.disabled = true;

      try {
        const newRewrittenText = await this.rewriteWithFeedback(currentText, feedback);
        dialog.querySelector('#rewrittenTextArea').value = newRewrittenText;
        dialog.querySelector('#feedbackTextArea').value = '';
        this.showMessage('Text regenerated successfully!', 'success');
      } catch (error) {
        this.handleRegenerateError(error);
      } finally {
        btn.innerHTML = originalButtonText;
        btn.disabled = false;
      }
    });

    overlay.addEventListener('click', e => { if (e.target === overlay) document.body.removeChild(overlay); });
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    setTimeout(() => {
      const textArea = dialog.querySelector('#rewrittenTextArea');
      textArea.focus();
      textArea.setSelectionRange(textArea.value.length, textArea.value.length);
    }, 100);
  }

  handleRegenerateError(error) {
    console.error('Regenerate error:', error);

    if (error.message.includes('401') || error.message.includes('403')) {
      this.showMessage('Invalid API key. Please check your OpenAI API key.', 'error');
    } else if (error.message.includes('429')) {
      const message = error.message.includes('after retries')
        ? 'Rate limit exceeded after retries. Please wait several minutes before trying again.'
        : 'Rate limit exceeded. Retrying automatically...';
      this.showMessage(message, error.message.includes('after retries') ? 'error' : 'info');
    } else if (/insufficient_quota|quota|exceeded|billing/.test(error.message)) {
      this.handleCreditsAndBillingError();
    } else if (error.message.includes('Network error')) {
      this.showMessage('Network error. Please check your connection.', 'error');
    } else if (error.message.includes('Server error')) {
      this.showMessage('OpenAI server error. Please try again later.', 'error');
    } else {
      this.showMessage('Failed to regenerate text. Please try again.', 'error');
    }
  }

  showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `native-english-message ${type}`;

    const styles = {
      success: { emoji: '✔', bg: 'linear-gradient(135deg, #48bb78, #38a169)', shadow: 'rgba(72, 187, 120, 0.4)' },
      info: { emoji: 'ℹ', bg: 'linear-gradient(135deg, #4299e1, #3182ce)', shadow: 'rgba(66, 153, 225, 0.4)' },
      error: { emoji: '✖', bg: 'linear-gradient(135deg, #f56565, #e53e3e)', shadow: 'rgba(245, 101, 101, 0.4)' }
    };

    const style = styles[type] || styles.error;
    messageEl.textContent = `${style.emoji} ${message}`;
    messageEl.style.cssText = `position: fixed;top: 24px;right: 24px;padding: 16px 24px;border-radius: 4px;z-index: 11000;font-size: 14px;font-weight: 600;font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;max-width: 400px;backdrop-filter: blur(10px);cursor: pointer;background: ${style.bg};color: white;box-shadow: 0 8px 32px ${style.shadow};`;

    messageEl.addEventListener('click', () => {
      messageEl.style.animation = 'messageSlideOut 0.3s ease-in forwards';
      setTimeout(() => messageEl.remove(), 300);
    });

    document.body.appendChild(messageEl);

    const dismissTime = type === 'info' ? 2000 : 4000;
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.style.animation = 'messageSlideOut 0.3s ease-in forwards';
        setTimeout(() => messageEl.remove(), 300);
      }
    }, dismissTime);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new GmailRewriter());
} else {
  new GmailRewriter();
} 