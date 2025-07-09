// --- Language/variant lists (reuse from popup.js) ---
const supportedLanguages = [
  { name: 'Abkhaz', code: 'ab' }, { name: 'Afrikaans', code: 'af' }, { name: 'Albanian', code: 'sq' },
  { name: 'Amharic', code: 'am' }, { name: 'Arabic', code: 'ar' }, { name: 'Armenian', code: 'hy' },
  { name: 'Assamese', code: 'as' }, { name: 'Aymara', code: 'ay' }, { name: 'Azerbaijani', code: 'az' },
  { name: 'Basque', code: 'eu' }, { name: 'Belarusian', code: 'be' }, { name: 'Bengali', code: 'bn' },
  { name: 'Bosnian', code: 'bs' }, { name: 'Bulgarian', code: 'bg' }, { name: 'Burmese', code: 'my' },
  { name: 'Catalan', code: 'ca' }, { name: 'Chinese (Simplified)', code: 'zh-CN' }, { name: 'Chinese (Traditional)', code: 'zh-TW' },
  { name: 'Croatian', code: 'hr' }, { name: 'Czech', code: 'cs' }, { name: 'Danish', code: 'da' },
  { name: 'Dutch', code: 'nl' }, { name: 'English', code: 'en' }, { name: 'Estonian', code: 'et' },
  { name: 'Filipino', code: 'fil' }, { name: 'Finnish', code: 'fi' }, { name: 'French', code: 'fr' },
  { name: 'German', code: 'de' }, { name: 'Greek', code: 'el' }, { name: 'Gujarati', code: 'gu' },
  { name: 'Haitian Creole', code: 'ht' }, { name: 'Hebrew', code: 'he' }, { name: 'Hindi', code: 'hi' },
  { name: 'Hungarian', code: 'hu' }, { name: 'Icelandic', code: 'is' }, { name: 'Indonesian', code: 'id' },
  { name: 'Italian', code: 'it' }, { name: 'Japanese', code: 'ja' }, { name: 'Javanese', code: 'jv' },
  { name: 'Kannada', code: 'kn' }, { name: 'Kazakh', code: 'kk' }, { name: 'Khmer', code: 'km' },
  { name: 'Korean', code: 'ko' }, { name: 'Kurdish (Kurmanji)', code: 'ku' }, { name: 'Kyrgyz', code: 'ky' },
  { name: 'Lao', code: 'lo' }, { name: 'Latvian', code: 'lv' }, { name: 'Lithuanian', code: 'lt' },
  { name: 'Luxembourgish', code: 'lb' }, { name: 'Macedonian', code: 'mk' }, { name: 'Malay', code: 'ms' },
  { name: 'Malayalam', code: 'ml' }, { name: 'Maltese', code: 'mt' }, { name: 'Maori', code: 'mi' },
  { name: 'Marathi', code: 'mr' }, { name: 'Mongolian', code: 'mn' }, { name: 'Nepali', code: 'ne' },
  { name: 'Norwegian', code: 'no' }, { name: 'Persian', code: 'fa' }, { name: 'Polish', code: 'pl' },
  { name: 'Portuguese', code: 'pt' }, { name: 'Punjabi', code: 'pa' }, { name: 'Romanian', code: 'ro' },
  { name: 'Russian', code: 'ru' }, { name: 'Serbian', code: 'sr' }, { name: 'Sinhala', code: 'si' },
  { name: 'Slovak', code: 'sk' }, { name: 'Slovenian', code: 'sl' }, { name: 'Spanish', code: 'es' },
  { name: 'Swahili', code: 'sw' }, { name: 'Swedish', code: 'sv' }, { name: 'Tamil', code: 'ta' },
  { name: 'Telugu', code: 'te' }, { name: 'Thai', code: 'th' }, { name: 'Turkish', code: 'tr' },
  { name: 'Ukrainian', code: 'uk' }, { name: 'Urdu', code: 'ur' }, { name: 'Uzbek', code: 'uz' },
  { name: 'Vietnamese', code: 'vi' }, { name: 'Welsh', code: 'cy' }, { name: 'Xhosa', code: 'xh' },
  { name: 'Yiddish', code: 'yi' }, { name: 'Yoruba', code: 'yo' }, { name: 'Zulu', code: 'zu' }
];
const languageVariants = [
  // --- English Variants ---
  { code: 'US', name: 'United States (American English)' },
  { code: 'UK', name: 'United Kingdom (British English)' },
  { code: 'AU', name: 'Australia (Australian English)' },
  { code: 'CA', name: 'Canada (Canadian English)' },
  { code: 'NZ', name: 'New Zealand (New Zealand English)' },
  { code: 'ZA', name: 'South Africa (South African English)' },
  { code: 'IE', name: 'Ireland (Irish English)' },
  { code: 'IN', name: 'India (Indian English)' },
  { code: 'SG', name: 'Singapore (Singaporean English)' },
  { code: 'SCO', name: 'Scotland (Scottish English)' },
  { code: 'NG', name: 'Nigeria (Nigerian English)' },
  { code: 'PH', name: 'Philippines (Philippine English)' },

  // --- Spanish Variants ---
  { code: 'ES-ES', name: 'Spain (Castilian Spanish)' },
  { code: 'ES-MX', name: 'Mexico (Mexican Spanish)' },
  { code: 'ES-AR', name: 'Argentina (Argentinian Spanish)' },
  { code: 'ES-CO', name: 'Colombia (Colombian Spanish)' },
  { code: 'ES-LATAM', name: 'Latin America (General Spanish)' },

  // --- French Variants ---
  { code: 'FR-FR', name: 'France (European French)' },
  { code: 'FR-CA', name: 'Canada (Canadian French)' },
  { code: 'FR-AF', name: 'Africa (African French)' },

  // --- Portuguese Variants ---
  { code: 'PT-PT', name: 'Portugal (European Portuguese)' },
  { code: 'PT-BR', name: 'Brazil (Brazilian Portuguese)' },

  // --- German Variants ---
  { code: 'DE-DE', name: 'Germany (Standard German)' },
  { code: 'DE-AT', name: 'Austria (Austrian German)' },
  { code: 'DE-CH', name: 'Switzerland (Swiss German)' },

  // --- Chinese Variants ---
  { code: 'ZH-CN', name: 'Mainland China (Mandarin, Simplified)' },
  { code: 'ZH-HK', name: 'Hong Kong (Cantonese, Traditional)' },
  { code: 'ZH-TW', name: 'Taiwan (Taiwanese Mandarin, Traditional)' },

  // --- Arabic Variants ---
  { code: 'AR-MSA', name: 'Modern Standard Arabic' },
  { code: 'AR-EG', name: 'Egypt (Egyptian Arabic)' },
  { code: 'AR-LEV', name: 'Levant (Levantine Arabic)' },

  // --- Accented English ---
  { code: 'EN-ACCENT-FR', name: 'English (French Accent)' },
  { code: 'EN-ACCENT-DE', name: 'English (German Accent)' },
  { code: 'EN-ACCENT-ES', name: 'English (Spanish Accent)' },
  { code: 'EN-ACCENT-IT', name: 'English (Italian Accent)' },
  { code: 'EN-ACCENT-RU', name: 'English (Russian Accent)' },
  { code: 'EN-ACCENT-JP', name: 'English (Japanese Accent)' },
  { code: 'EN-ACCENT-KR', name: 'English (Korean Accent)' },
  { code: 'EN-ACCENT-CN', name: 'English (Chinese Accent)' }
];
// Gmail Integration Content Script - Optimized
class GmailRewriter {
  constructor() {
    this.injectFontAwesome();
    this.apiKey = null;
    this.variant = 'American English';
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

  injectFontAwesome() {
    if (!document.getElementById('native-english-fontawesome')) {
      const link = document.createElement('link');
      link.id = 'native-english-fontawesome';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  }

  async init() {
    const result = await chrome.storage.sync.get(['openaiApiKey', 'languageVariant']);
    this.apiKey = result.openaiApiKey;
    this.variant = result.languageVariant || 'US';
    this.checkForConflicts();
    this.waitForGmail();
  }

  async initializeVariantPrompts() {
    try {
      const result = await chrome.storage.sync.get(['targetLanguage', 'languageVariant']);
      const targetLanguage = result.targetLanguage;
      const englishVariant = result.languageVariant || 'US';

      // If target language is set and it's not English, rewrite to that language
      if (targetLanguage && targetLanguage.code !== 'en') {
        return `You are a professional writing assistant. You have to rewrite the text into ${targetLanguage.name}. Rewrite the following email text to improve grammar, word choice, and sentence structure to sound natural and professional. Maintain the original meaning and tone. Keep the same level of formality as the original. IMPORTANT: Preserve all text formatting including line breaks, bullet points, numbered lists, and paragraph structure. Return only the rewritten text without any additional commentary. Use ${targetLanguage.name} spelling, terminology, phrasing to sound like a native speaker.`;
      } else {
        // Default to English variant rewriting
        return `Variant Model: ${englishVariant} ; You are a professional writing assistant. You have to rewrite the text into English. Rewrite the following email text to improve grammar, word choice, and sentence structure to sound natural and professional. Maintain the original meaning and tone. Keep the same level of formality as the original. IMPORTANT: Preserve all text formatting including line breaks, bullet points, numbered lists, and paragraph structure. Return only the rewritten text without any additional commentary. Use this model's spelling, terminology, phrasing to sound like a native speaker.`;
      }
    } catch (error) {
      // console.error('Error initializing variant prompts:', error);
      // Return a default prompt as a fallback
      return `You are a professional writing assistant. You have to rewrite the text into English. Rewrite the following email text to improve grammar, word choice, and sentence structure to sound natural and professional. Maintain the original meaning and tone. Keep the same level of formality as the original. IMPORTANT: Preserve all text formatting including line breaks, bullet points, numbered lists, and paragraph structure. Return only the rewritten text without any additional commentary. Use US English spelling, terminology, phrasing to sound like a native speaker.`;
    }
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

      // Extension conflict detection completed
    }, 3000);
  }

  setupStorageListener() {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync') {
        if (changes.openaiApiKey) this.apiKey = changes.openaiApiKey.newValue;
        if (changes.languageVariant) {
          this.variant = changes.languageVariant.newValue || 'US';
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
    const backoffTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
    await new Promise(res => setTimeout(res, backoffTime));
    return backoffTime;
  }

  async makeApiRequestWithRetry(requestBody, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await this.waitForRateLimit();

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify(requestBody)
        });

        this.updateRateLimitInfo(response);

        if (response.ok) {
          return await response.json();
        }

        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || response.statusText;

        if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
          const backoffTime = await this.exponentialBackoff(attempt);
          // console.warn(`API error ${response.status}. Retrying in ${Math.round(backoffTime)}ms...`);
          continue;
        }

        throw new Error(`${response.status}: ${errorMessage}`);

      } catch (error) {
        if (error.name === 'TypeError' || !error.message.includes(':')) {
          if (attempt < maxRetries) {
            const backoffTime = await this.exponentialBackoff(attempt);
            // console.warn(`Network error. Retrying in ${Math.round(backoffTime)}ms...`);
            continue;
          } else {
            throw new Error(`Network: Failed to connect to API after ${maxRetries + 1} attempts.`);
          }
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
        this.setupGmailIntegration();
      } else if (checkAttempts < maxAttempts) {
        checkAttempts++;
        setTimeout(checkGmailLoaded, 1000);
      } else {
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
    style.textContent = `
    .native-english-rewrite-btn{display:inline-block!important;margin-left:12px!important;user-select:none!important}.native-english-rewrite-btn .rewrite-button{display:inline-flex!important;align-items:center!important;gap:8px!important;padding:8px 10px!important;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)!important;color:white!important;border:none!important;border-radius:20px!important;font-size:12px!important;font-weight:600!important;cursor:pointer!important;transition:all .3s ease!important;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif!important;box-shadow:0 4px 15px rgba(102,126,234,.3)!important;position:relative!important;overflow:hidden!important;user-select:none!important}.native-english-rewrite-btn .rewrite-button:hover{transform:translateY(-2px)!important;box-shadow:0 6px 20px rgba(102,126,234,.4)!important}.native-english-rewrite-btn .rewrite-button:active{transform:translateY(0)!important}.native-english-rewrite-btn .rewrite-button:disabled{background:linear-gradient(135deg,#a0aec0,#cbd5e0)!important;cursor:not-allowed!important}.native-english-rewrite-btn .rewrite-button-icon{width:16px;height:16px;animation:icon-spin .6s linear infinite;display:none}.native-english-rewrite-btn .rewrite-button.loading .rewrite-button-icon{display:inline-block!important}.native-english-rewrite-btn .rewrite-button.loading .rewrite-button-text{display:none!important}@keyframes icon-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
    .gorgeous-dropdown-input { padding:5px 10px;border-radius:8px;border:1.5px solid #e2e8f0;font-size:13px;background:white;color:rgb(34, 170, 63);font-weight:600;outline:none;min-width:110px;max-width:170px; transition: all 0.2s ease; }
    .gorgeous-dropdown-input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
    .gorgeous-dropdown-options { display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #e2e8f0; border-radius:8px; max-height:180px; overflow-y:auto; z-index:1001; box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
    .gorgeous-dropdown-option { padding:8px 12px; cursor:pointer; font-size:13px; color: #4a5568; }
    .gorgeous-dropdown-option:hover { background-color: #f0f2f5; }
    .gorgeous-dropdown-option-none { padding:8px 12px; color:#aaa; }
    #variantDropdownContainer { position: relative; }
    `;
    document.head.appendChild(style);
  }

  createRewriteButton(composeWindow, toolbar) {
    if (composeWindow.querySelector('.native-english-rewrite-btn')) return;

    this.ensureButtonStyles();

    const rewriteBtn = document.createElement('div');
    rewriteBtn.className = 'native-english-rewrite-btn';
    rewriteBtn.innerHTML = `<button class="rewrite-button" title="Rewrite for ${this.variant}"><i class="fa-solid fa-wand-magic-sparkles"></i></button>`;

    rewriteBtn.querySelector('.rewrite-button').addEventListener('click', () => this.handleRewrite(composeWindow));
    // Try to find the .aDh container (Gmail action bar area)
    const aDh = composeWindow.querySelector('.aDh');
    let inserted = false;
    if (aDh) {
      const table = aDh.querySelector('table');
      if (table) {
        const rows = Array.from(table.querySelectorAll('tr'));
        for (const row of rows) {
          const trashCell = Array.from(row.querySelectorAll('td')).find(td => td.querySelector('div.J-J5-Ji.bty > div.T-I-ax7[aria-label*="Discard draft" i], div.J-J5-Ji.bty > div.T-I-ax7[data-tooltip*="Discard draft" i]'));
          if (trashCell) {
            // Insert the rewrite button before the trash button in this cell
            const trashBtn = trashCell.querySelector('div.J-J5-Ji.bty > div.T-I-ax7[aria-label*="Discard draft" i], div.J-J5-Ji.bty > div.T-I-ax7[data-tooltip*="Discard draft" i]');
            if (trashBtn && trashBtn.parentNode) {
              trashBtn.parentNode.insertBefore(rewriteBtn, trashBtn);
              inserted = true;
              break;
            }
          }
        }
      }
    }
    if (!inserted) {
      // Fallback to previous toolbar logic
      const allToolbars = Array.from(composeWindow.querySelectorAll('[role="toolbar"], .J-Z, .aoD.hl, .Am.Al .Au'));
      let actionToolbar = null;
      let deleteBtn = null;
      for (const tb of allToolbars) {
        deleteBtn = tb.querySelector('div.J-J5-Ji.bty > div.T-I-ax7[aria-label*="Discard draft" i], div.J-J5-Ji.bty > div.T-I-ax7[data-tooltip*="Discard draft" i]');
        if (!deleteBtn) {
          const possibleDeleteSelectors = [
            '[aria-label*="delete" i]',
            '[data-tooltip*="delete" i]',
            '[title*="delete" i]',
            '[aria-label*="discard draft" i]',
            '[data-tooltip*="discard draft" i]'
          ];
          for (const sel of possibleDeleteSelectors) {
            deleteBtn = tb.querySelector(sel);
            if (deleteBtn) break;
          }
        }
        if (!deleteBtn) {
          const trashIconPath = 'M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z';
          const candidates = Array.from(tb.querySelectorAll('button,div'));
          for (const el of candidates) {
            const svg = el.querySelector('svg');
            if (svg && svg.innerHTML.includes(trashIconPath)) {
              deleteBtn = el;
              break;
            }
          }
        }
        if (deleteBtn) {
          actionToolbar = tb;
          break;
        }
      }
      if (actionToolbar && deleteBtn && deleteBtn.parentNode) {
        deleteBtn.parentNode.insertBefore(rewriteBtn, deleteBtn);
      } else {
        const fallbackToolbar = allToolbars[allToolbars.length - 1];
        if (fallbackToolbar) {
          fallbackToolbar.appendChild(rewriteBtn);
        } else {
          toolbar.appendChild(rewriteBtn);
        }
      }
    }
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
    button.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles fa-spin"></i>`;
    button.disabled = true;

    try {
      const { rewrittenText, messages, signature, hasSignature } = await this.rewriteWithChatGPT(originalText);
      this.showPreviewDialog(composeWindow, originalText, rewrittenText, composeBody, isUserInputOnly, originalHTML, messages, signature, hasSignature);
    } catch (error) {
      this.handleApiError(error);
    } finally {
      button.innerHTML = originalButtonText;
      button.disabled = false;
    }
  }

  handleApiError(error, textArea) {
    const [statusStr, ...messageParts] = error.message.split(':');
    const message = messageParts.join(':').trim();
    const status = parseInt(statusStr, 10);

    if (textArea) {
      textArea.value = '';
      textArea.placeholder = 'An error occurred. Please try again.';
    }

    switch (status) {
      case 400:
        this.showMessage('Bad Request: The request was malformed, possibly too long.', 'error');
        break;
      case 401:
        this.showMessage('Authentication Error: Invalid API key. Please check your settings.', 'error');
        break;
      case 402:
        this.showMessage('Billing Issue: Please check your OpenAI account payment method.', 'error');
        this.handleCreditsAndBillingError();
        break;
      case 429:
        this.showMessage('Rate Limit Exceeded: Too many requests. Please wait a moment.', 'error');
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        this.showMessage('OpenAI Server Error: The server is unavailable. Please try again later.', 'error');
        break;
      default:
        if (statusStr === 'Network') {
          this.showMessage('Network Error: Could not connect. Check your internet connection.', 'error');
        } else {
          this.showMessage(`Error: ${message || 'An unknown error occurred.'}`, 'error');
        }
        break;
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

    const messages = [
      { role: 'system', content: await this.initializeVariantPrompts() },
      { role: 'user', content: mainContent }
    ];

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.3
    };

    const data = await this.addToQueue(requestBody);
    const rewrittenContent = data.choices[0].message.content;
    const combinedText = this.combineEmailContent(rewrittenContent, signature, hasSignature);

    // Add assistant's response to messages array for conversation history
    messages.push({ role: 'assistant', content: rewrittenContent });

    return { rewrittenText: combinedText, messages, signature, hasSignature };
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
  async doTranslate() {
    const dialog = document.querySelector('.native-english-overlay');
    const translateBtn = dialog.querySelector('#translateBtn');
    const originalTextArea = dialog.querySelector('#originalTextArea');
    const translatedTextArea = dialog.querySelector('#translatedTextArea');

    if (!translateBtn || !originalTextArea || !translatedTextArea) return;

    let textToTranslate = originalTextArea.value.trim();
    if (!textToTranslate) {
      this.showMessage('No text to translate.', 'error');
      return;
    }

    textToTranslate = textToTranslate.replace(/\n\n/g, '[[PARA]]').replace(/\n/g, '\n');
    const originalBtnHTML = translateBtn.innerHTML;
    translateBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="spinning"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/></svg> Translating...';
    translateBtn.disabled = true;
    translatedTextArea.value = 'Translating...';

    try {
      const settings = await new Promise(resolve => {
        chrome.storage.sync.get(['googleTranslateApiKey', 'targetLanguage', 'inputLanguage'], resolve);
      });

      const { googleTranslateApiKey, targetLanguage, inputLanguage } = settings;

      if (!googleTranslateApiKey || !targetLanguage?.code) {
        throw new Error('Google Translate API key or target language not set.');
      }

      const requestBody = { q: textToTranslate, target: targetLanguage.code };
      if (inputLanguage && inputLanguage !== 'auto') {
        requestBody.source = inputLanguage.code;
      }

      const maxRetries = 3;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(googleTranslateApiKey)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });

          if (response.ok) {
            const data = await response.json();
            if (data?.data?.translations?.[0]) {
              let translated = data.data.translations[0].translatedText;
              translated = translated.replace(/\[\[PARA\]\]/g, '\n\n').replace(/\n/g, '\n');
              translated = this.decodeHtmlEntities(translated);
              translatedTextArea.value = translated;
              this.showMessage('Translation complete!', 'success');
              return;
            }
            throw new Error('Invalid API response from Google Translate.');
          }

          if (response.status === 429 || response.status >= 500) {
            if (attempt === maxRetries) {
              throw new Error(`Google API error ${response.status} after all retries.`);
            }
            await this.exponentialBackoff(attempt);
            continue;
          }

          const errorData = await response.json();
          throw new Error(errorData.error?.message || `HTTP error ${response.status}`);

        } catch (error) {
          if (attempt === maxRetries) throw error;
          if (error.name === 'TypeError') { // Network error
            await this.exponentialBackoff(attempt);
          } else if (error.message.includes('Google API error')) {
            // Already handled in the retry logic above, just continue
          } else {
            throw error; // Don't retry on other errors
          }
        }
      }
    } catch (error) {
      translatedTextArea.value = '';
      this.showMessage('Failed to translate. Please check your API key and network.', 'error');
    } finally {
      translateBtn.innerHTML = originalBtnHTML;
      translateBtn.disabled = false;
    }
  }

  // Decode HTML entities (like &#39; to apostrophe)
  decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }
  // Optimized preview dialog
  showPreviewDialog(composeWindow, originalText, rewrittenText, composeBody, isUserInputOnly = false, originalHTML = null, messages = [], signature = '', hasSignature = false) {
    let conversationHistory = messages;

    const overlay = document.createElement('div');
    overlay.className = 'native-english-overlay';
    overlay.style.cssText = `position: fixed;top: 0;left: 0;right: 0;bottom: 0;background: rgba(0, 0, 0, 0.7);backdrop-filter: blur(8px);z-index: 10001;display: flex;align-items: center;justify-content: center;font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`;

    const dialog = document.createElement('div');
    dialog.style.cssText = `background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);border-radius: 10px;box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);max-width: 1100px;max-height: 85vh;width: 98%;overflow: hidden;display: flex;flex-direction: column;position: relative;`;

    dialog.innerHTML = `
      <div class="gorgeous-dialog-header">
        <h2 class="gorgeous-dialog-title"><i class="fa-solid fa-magic-wand-sparkles" style="color:rgb(185, 224, 43);margin-right:8px;"></i> Preview Email</h2>
        <p class="gorgeous-dialog-subtitle">Review the changes and choose to accept, edit, or cancel</p>
      </div>
      <div class="gorgeous-dialog-content">
        <div class="gorgeous-content-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px;">
          <div class="gorgeous-content-section">
            <h3 style="display:flex;align-items:center;gap:8px;"><i class="fa-solid fa-file-lines" style="color:#2563eb;margin-right:6px;"></i> Original Text <span id="inputLangDropdownContainer"></span></h3>
            <textarea id="originalTextArea" class="gorgeous-text-area gorgeous-original-area">${originalText}</textarea>
            <div style="margin-top: 8px; text-align: left; display: flex; gap: 10px; align-items: center;">
              <button id="speechInputBtn" style="padding: 6px 14px; border-radius: 8px; border: none; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-microphone" style="color:#a78bfa;font-size:16px;"></i> Speech Input
              </button>
              <button id="translateBtn" style="padding: 6px 14px; border-radius:
                8px; border: none; background: linear-gradient(135deg, #38b2ac 0%, #4299e1 100%); color: white; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-globe" style="color:rgb(232, 241, 97);font-size:16px;"></i> Translate
              </button>
            </div>
          </div>
          <div class="gorgeous-content-section">
            <h3 style="display:flex;align-items:center;gap:8px;"><i class="fa-solid fa-globe" style="color:#14b8a6;margin-right:6px;"></i> Translated Text <span id="targetLangDropdownContainer"></span></h3>
            <textarea id="translatedTextArea" class="gorgeous-text-area gorgeous-translated-area" placeholder="(Translation will appear here)"></textarea>
          </div>
          <div class="gorgeous-content-section">
            <h3 style="display:flex;align-items:center;gap:8px;"><i class="fa-solid fa-wand-magic-sparkles" style="color:#22c55e;margin-right:6px;"></i> Rewritten Text <span id="variantDropdownContainer"></span></h3>
            <textarea id="rewrittenTextArea" class="gorgeous-text-area gorgeous-rewritten-area">${rewrittenText}</textarea>
          </div>
        </div>
      </div>
      <div class="gorgeous-feedback-section">
        <h4 class="gorgeous-feedback-title"><i class="fa-solid fa-comment-dots" style="color:#f59e42;margin-right:6px;"></i> Feedback for Improvement</h4>
        <div class="gorgeous-feedback-area-container">
          <textarea id="feedbackTextArea" class="gorgeous-feedback-area" placeholder="e.g., 'Make it more brief', 'Add more details', 'Make it more formal', 'Use simpler language'..."></textarea>
          <button id="regenerateBtn" class="gorgeous-regenerate-btn"><i class="fa-solid fa-arrows-rotate" style="color:rgb(255, 255, 255);margin-right:4px;"></i> Regenerate</button>
        </div>
        <div id="feedbackChipsRow" style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 8px; max-height: 36px; overflow-y: auto;"></div>
      </div>
      <div class="gorgeous-dialog-footer">
        <button id="cancelBtn" class="gorgeous-footer-btn gorgeous-cancel-btn"><i class="fa-solid fa-times" style="color:#ef4444;margin-right:6px;"></i> Cancel</button>
        <button id="acceptBtn" class="gorgeous-footer-btn gorgeous-accept-btn"><i class="fa-solid fa-check" style="color:rgb(255, 255, 255);margin-right:6px;"></i> Accept Changes</button>
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
      let feedback = dialog.querySelector('#feedbackTextArea').value.trim();
      if (!feedback) {
        feedback = 'Rewrite the email text, paying close attention to the original request.';
      }

      const btn = e.target.closest('button');
      const originalButtonText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin" style="color:rgb(255, 255, 255);margin-right:4px;"></i> Regenerating...';
      btn.disabled = true;

      const rewrittenTextArea = dialog.querySelector('#rewrittenTextArea');
      const previousRewrittenText = rewrittenTextArea.value;
      rewrittenTextArea.value = 'Rewriting...';

      // Also trigger translation
      await this.doTranslate();

      // Append user feedback to the history
      conversationHistory.push({ role: 'user', content: feedback });

      const requestBody = {
        model: 'gpt-4o-mini',
        messages: conversationHistory,
        max_tokens: 1000,
        temperature: 0.3
      };

      try {
        const data = await this.addToQueue(requestBody);
        const newContent = data.choices[0].message.content;

        // Update conversation history with the new assistant response
        conversationHistory.push({ role: 'assistant', content: newContent });

        const newRewrittenText = this.combineEmailContent(newContent, signature, hasSignature);
        rewrittenTextArea.value = newRewrittenText;
        dialog.querySelector('#feedbackTextArea').value = '';
        this.showMessage('Text regenerated successfully!', 'success');
      } catch (error) {
        // If there's an error, pop the last user message to allow retrying
        conversationHistory.pop();
        this.handleApiError(error, rewrittenTextArea);
        rewrittenTextArea.value = previousRewrittenText; // Restore previous text
      } finally {
        btn.innerHTML = originalButtonText;
        btn.disabled = false;
      }
    });

    // Add event listener for Translate button
    setTimeout(() => {
      const translateBtn = dialog.querySelector('#translateBtn');
      const originalTextArea = dialog.querySelector('#originalTextArea');
      // Disable translate button until original text is available
      if (translateBtn) {
        translateBtn.disabled = !originalTextArea.value.trim();
      }
      // Only translate original text
      if (translateBtn && originalTextArea) {
        translateBtn.addEventListener('click', () => this.doTranslate());
        // Enable translate button only if original text is present
        originalTextArea.addEventListener('input', () => {
          translateBtn.disabled = !originalTextArea.value.trim();
        });
      }
      // Auto-translate original text on dialog open
      if (originalTextArea && originalTextArea.value.trim()) {
        this.doTranslate();
      }
    }, 200);

    // Add event listener for Speech Input button
    setTimeout(() => {
      const speechBtn = dialog.querySelector('#speechInputBtn');
      const originalTextArea = dialog.querySelector('#originalTextArea');
      let recognition = null;
      let listening = false;
      let fullTranscript = '';
      if (speechBtn && originalTextArea) {
        speechBtn.addEventListener('click', async () => {
          if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showMessage('Speech recognition is not supported in this browser.', 'error');
            return;
          }
          if (listening) {
            if (recognition) recognition.stop();
            listening = false;
            speechBtn.innerHTML = "<i class='fa-solid fa-microphone' style='color:#a78bfa;font-size:16px;'></i> Speech Input";
            return;
          }
          // Get input language from storage
          let recognitionLang = 'auto';
          try {
            const settings = await new Promise(resolve => {
              chrome.storage.sync.get(['inputLanguage'], resolve);
            });
            if (settings.inputLanguage && settings.inputLanguage !== 'auto' && settings.inputLanguage.code) {
              recognitionLang = settings.inputLanguage.code;
            }
          } catch (e) { }
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          recognition = new SpeechRecognition();
          recognition.lang = recognitionLang;
          recognition.interimResults = true;
          recognition.maxAlternatives = 1;
          listening = true;
          fullTranscript = originalTextArea.value || '';
          speechBtn.innerHTML = "<i class='fa-solid fa-microphone-slash' style='color:#ef4444;font-size:16px;'></i> Listening...";
          recognition.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const result = event.results[i];
              if (result.isFinal) {
                fullTranscript += (fullTranscript && !fullTranscript.endsWith(' ') ? ' ' : '') + result[0].transcript;
              } else {
                interim += result[0].transcript;
              }
            }
            originalTextArea.value = (fullTranscript + (interim ? (fullTranscript && !fullTranscript.endsWith(' ') ? ' ' : '') + interim : '')).trim();
          };
          recognition.onerror = (event) => {
            listening = false;
            speechBtn.innerHTML = "<i class='fa-solid fa-microphone' style='color:#a78bfa;font-size:16px;'></i> Speech Input";
            this.showMessage('Speech recognition error: ' + event.error, 'error');
          };
          recognition.onend = () => {
            if (listening) {
              listening = false;
              speechBtn.innerHTML = "<i class='fa-solid fa-microphone' style='color:#a78bfa;font-size:16px;'></i> Speech Input";
            }
            this.showMessage('Speech input complete!', 'success');
          };
          recognition.start();
        });
      }
    }, 200);

    // Add feedback suggestion buttons
    setTimeout(() => {
      const feedbackAreaContainer = dialog.querySelector('.gorgeous-feedback-area-container');
      const feedbackInput = dialog.querySelector('#feedbackTextArea');
      let chipsRow = dialog.querySelector('#feedbackChipsRow');
      if (!chipsRow) {
        chipsRow = document.createElement('div');
        chipsRow.id = 'feedbackChipsRow';
        chipsRow.style.cssText = 'margin-top: 8px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;';
        feedbackAreaContainer.insertBefore(chipsRow, feedbackInput.nextSibling);
      }
      // Load chips from storage or use defaults
      chrome.storage.sync.get(['feedbackChips'], (result) => {
        let chips = Array.isArray(result.feedbackChips) && result.feedbackChips.length > 0 ? result.feedbackChips : [
          'Make it more simple',
          'Make it more formal',
          'Add more details',
          'Make it more brief',
          'Use friendlier tone',
          'Use simpler language',
          'Make it more polite',
          'Add a call to action'
        ];
        let showInput = false;
        let chipInput = null;
        function saveChips() {
          chrome.storage.sync.set({ feedbackChips: chips });
        }
        function renderChips() {
          chipsRow.innerHTML = '';
          chips.forEach((chip, idx) => {
            const chipEl = document.createElement('span');
            chipEl.style.cssText = `
              background: linear-gradient(135deg, #fbbf24 0%, #f59e42 100%);
              color:rgb(255, 255, 255);
              border-radius: 7px;
              font-size: 14px;
              padding: 4px 10px 4px 10px;
              margin: 0;
              display: flex; align-items: center; gap: 4px;
              border: 1px solid #f59e42;
              cursor: pointer;
              user-select: none;
              box-shadow: 0 1px 4px rgba(251,191,36,0.08);
            `;
            chipEl.textContent = chip;
            chipEl.addEventListener('click', (e) => {
              if (e.target !== chipEl) return;
              if (feedbackInput.value.trim()) {
                feedbackInput.value += 'and ' + chip + ' ';
              } else {
                feedbackInput.value += chip + ' ';
              }
              feedbackInput.focus();
            });
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.innerHTML = '<i class="fa-solid fa-times" style="color:#ef4444;font-size:13px;"></i>';
            removeBtn.style.cssText = 'background: none; border: none; margin-left: 6px; cursor: pointer; padding: 0;';
            removeBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              chips.splice(idx, 1);
              saveChips();
              renderChips();
            });
            chipEl.appendChild(removeBtn);
            chipsRow.appendChild(chipEl);
          });
          // Plus button or input
          if (showInput) {
            chipInput = document.createElement('input');
            chipInput.type = 'text';
            chipInput.placeholder = 'Add feedback...';
            chipInput.style.cssText = `
              font-size: 14px;
              padding: 4px 10px;
              border-radius: 7px;
              border: 1px solid #f59e42;
              outline: none;
              min-width: 90px;
              margin: 0;
            `;
            chipInput.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') {
                const val = chipInput.value.trim();
                if (val && !chips.includes(val)) {
                  chips.push(val);
                  saveChips();
                  showInput = false;
                  renderChips();
                }
              } else if (e.key === 'Escape') {
                showInput = false;
                renderChips();
              }
            });
            chipInput.addEventListener('blur', () => {
              showInput = false;
              renderChips();
            });
            chipsRow.appendChild(chipInput);
            chipInput.focus();
          } else {
            const plusBtn = document.createElement('button');
            plusBtn.type = 'button';
            plusBtn.innerHTML = '<i class="fa-solid fa-plus" style="color:#f59e42;font-size:15px;"></i>';
            plusBtn.style.cssText = 'background: linear-gradient(135deg, #fbbf24 0%, #f59e42 100%); border: 1px solid #f59e42; border-radius: 7px; padding: 4px 10px; margin: 0; cursor: pointer; display: flex; align-items: center; color:rgb(255, 255, 255); font-weight: 500;';
            plusBtn.addEventListener('click', () => {
              showInput = true;
              renderChips();
            });
            chipsRow.appendChild(plusBtn);
          }
        }
        renderChips();
      });
    }, 200);

    overlay.addEventListener('click', e => { if (e.target === overlay) document.body.removeChild(overlay); });
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    setTimeout(() => {
      const textArea = dialog.querySelector('#rewrittenTextArea');
      textArea.focus();
      textArea.setSelectionRange(textArea.value.length, textArea.value.length);
    }, 100);

    // After dialog.innerHTML = ...
    // Render dropdowns for each section
    setTimeout(async () => {
      // Get current settings
      const settings = await new Promise(resolve => {
        chrome.storage.sync.get(['inputLanguage', 'targetLanguage', 'languageVariant'], resolve);
      });
      // --- Input Language Dropdown ---
      const inputLangDropdown = document.createElement('select');
      inputLangDropdown.className = 'gorgeous-dropdown';
      inputLangDropdown.style.cssText = 'padding:4px 10px;border-radius:8px;border:1.5px solid #e2e8f0;font-size:13px;background:white;color:#2563eb;font-weight:600;outline:none;min-width:110px;';
      const detectOption = document.createElement('option');
      detectOption.value = 'auto';
      detectOption.textContent = 'Detect Language';
      inputLangDropdown.appendChild(detectOption);
      supportedLanguages.forEach(lang => {
        const opt = document.createElement('option');
        opt.value = lang.code;
        opt.textContent = lang.name;
        inputLangDropdown.appendChild(opt);
      });
      inputLangDropdown.value = settings.inputLanguage && settings.inputLanguage.code ? settings.inputLanguage.code : 'auto';
      document.getElementById('inputLangDropdownContainer').appendChild(inputLangDropdown);
      // --- Add change event for input language ---
      inputLangDropdown.addEventListener('change', async (e) => {
        const code = e.target.value;
        let langObj = code === 'auto' ? 'auto' : supportedLanguages.find(l => l.code === code);
        try {
          await chrome.storage.sync.set({ inputLanguage: langObj });
        } catch (error) {
          if (error.message.includes('Extension context invalidated')) {
            // This can happen if the dialog is closed while the async operation is pending.
            // It's safe to ignore in this context.
          } else {
            throw error; // Re-throw other errors
          }
        }
      });
      // --- Target Language Dropdown ---
      const targetLangDropdown = document.createElement('select');
      targetLangDropdown.className = 'gorgeous-dropdown';
      targetLangDropdown.style.cssText = 'padding:4px 10px;border-radius:8px;border:1.5px solid #e2e8f0;font-size:13px;background:white;color:#14b8a6;font-weight:600;outline:none;min-width:110px;';
      supportedLanguages.forEach(lang => {
        const opt = document.createElement('option');
        opt.value = lang.code;
        opt.textContent = lang.name;
        targetLangDropdown.appendChild(opt);
      });
      targetLangDropdown.value = settings.targetLanguage && settings.targetLanguage.code ? settings.targetLanguage.code : 'en';
      document.getElementById('targetLangDropdownContainer').appendChild(targetLangDropdown);
      // --- Add change event for target language ---
      targetLangDropdown.addEventListener('change', async (e) => {
        const code = e.target.value;
        let langObj = supportedLanguages.find(l => l.code === code);
        try {
          await chrome.storage.sync.set({ targetLanguage: langObj });
        } catch (error) {
          if (error.message.includes('Extension context invalidated')) {
            // This can happen if the dialog is closed while the async operation is pending.
          } else {
            throw error;
          }
        }
      });
      // --- Language Variant Combo Box in Preview Dialog ---
      const variantInput = document.createElement('input');
      variantInput.type = 'text';
      variantInput.id = 'variantInput';
      variantInput.placeholder = 'Type or select variant...';
      variantInput.className = 'gorgeous-dropdown-input';
      variantInput.autocomplete = 'off';

      const variantDropdown = document.createElement('div');
      variantDropdown.className = 'gorgeous-dropdown-options';

      // Filter function for language variants
      function filterLanguageVariants(query) {
        query = query.trim().toLowerCase();
        if (!query) return languageVariants;
        return languageVariants.filter(v =>
          v.name.toLowerCase().includes(query) ||
          v.code.toLowerCase().includes(query)
        );
      }

      // Show/hide dropdown based on focus
      variantInput.addEventListener('focus', () => {
        variantDropdown.style.display = 'block';
        // Pre-populate with all options if input is empty
        if (!variantInput.value.trim()) {
          const allOptions = languageVariants.map(v =>
            `<div class="gorgeous-dropdown-option" data-code="${v.code}">${v.name}</div>`
          ).join('');
          variantDropdown.innerHTML = allOptions;
        }
      });

      // Filter as user types
      variantInput.addEventListener('input', () => {
        const value = variantInput.value;
        const matches = filterLanguageVariants(value);
        if (matches.length > 0) {
          variantDropdown.innerHTML = matches.map(v =>
            `<div class="gorgeous-dropdown-option" data-code="${v.code}">${v.name}</div>`
          ).join('');
        } else {
          variantDropdown.innerHTML = '<div class="gorgeous-dropdown-option-none">No matches found</div>';
        }
        variantDropdown.style.display = 'block';
      });

      // Handle selection
      variantDropdown.addEventListener('mousedown', async (e) => {
        const option = e.target.closest('.gorgeous-dropdown-option');
        if (option) {
          e.preventDefault();
          const variantName = option.textContent;
          variantInput.value = variantName;
          variantDropdown.style.display = 'none';
          const variant = languageVariants.find(v => v.name === variantName);
          try {
            await chrome.storage.sync.set({ languageVariant: variant ? variant.code : variantName });
          } catch (error) {
            if (!error.message.includes('Extension context invalidated')) {
              throw error;
            }
          }
          variantInput.blur();
        }
      });

      // Hide dropdown on blur (when clicking away)
      variantInput.addEventListener('blur', async (e) => {
        // Use a small delay to allow click on dropdown to register
        setTimeout(async () => {
          if (!variantDropdown.contains(document.activeElement)) {
            variantDropdown.style.display = 'none';
            const value = variantInput.value.trim();
            if (value) {
              const variant = languageVariants.find(v => v.name === value || v.code === value);
              try {
                await chrome.storage.sync.set({ languageVariant: variant ? variant.code : value });
              } catch (error) {
                if (!error.message.includes('Extension context invalidated')) {
                  throw error;
                }
              }
            }
          }
        }, 150);
      });

      // Set initial value
      variantInput.value = settings.languageVariant && languageVariants.find(v => v.code === settings.languageVariant) ? languageVariants.find(v => v.code === settings.languageVariant).name : (settings.languageVariant || '');

      // Attach to container
      const variantContainer = document.getElementById('variantDropdownContainer');
      if (variantContainer) {
        variantContainer.innerHTML = ''; // Clear previous
        variantContainer.appendChild(variantInput);
        variantContainer.appendChild(variantDropdown);
      }
    }, 200);
  }

  showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `native-english-message ${type}`;
    const styles = {
      success: { icon: '<i class="fa-solid fa-check-circle" style="color:#fff;margin-right:6px;"></i>', bg: 'linear-gradient(135deg, #48bb78, #38a169)', shadow: 'rgba(72, 187, 120, 0.4)' },
      info: { icon: '<i class="fa-solid fa-info-circle" style="color:#fff;margin-right:6px;"></i>', bg: 'linear-gradient(135deg, #4299e1, #3182ce)', shadow: 'rgba(66, 153, 225, 0.4)' },
      error: { icon: '<i class="fa-solid fa-times-circle" style="color:#fff;margin-right:6px;"></i>', bg: 'linear-gradient(135deg, #f56565, #e53e3e)', shadow: 'rgba(245, 101, 101, 0.4)' }
    };
    const style = styles[type] || styles.error;
    messageEl.innerHTML = `${style.icon}${message}`;
    // Stack notifications: find existing, offset new ones
    const existing = Array.from(document.querySelectorAll('.native-english-message'));
    let offset = 24;
    if (existing.length > 0) {
      offset += existing.length * 56; // 56px per notification
    }
    messageEl.style.cssText = `position: fixed;top: ${offset}px;right: 24px;padding: 16px 24px;border-radius: 4px;z-index: 11000;font-size: 14px;font-weight: 600;font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;max-width: 400px;backdrop-filter: blur(10px);cursor: pointer;background: ${style.bg};color: white;box-shadow: 0 8px 32px ${style.shadow};transition: top 0.2s;`;
    messageEl.addEventListener('click', () => {
      messageEl.style.animation = 'messageSlideOut 0.3s ease-in forwards';
      setTimeout(() => messageEl.remove(), 300);
      // Re-stack remaining notifications
      setTimeout(() => {
        Array.from(document.querySelectorAll('.native-english-message')).forEach((el, i) => {
          el.style.top = `${24 + i * 56}px`;
        });
      }, 350);
    });
    document.body.appendChild(messageEl);
    // Re-stack all notifications
    Array.from(document.querySelectorAll('.native-english-message')).forEach((el, i) => {
      el.style.top = `${24 + i * 56}px`;
    });
    const dismissTime = type === 'info' ? 2000 : 4000;
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.style.animation = 'messageSlideOut 0.3s ease-in forwards';
        setTimeout(() => messageEl.remove(), 300);
        // Re-stack remaining notifications
        setTimeout(() => {
          Array.from(document.querySelectorAll('.native-english-message')).forEach((el, i) => {
            el.style.top = `${24 + i * 56}px`;
          });
        }, 350);
      }
    }, dismissTime);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.GmailRewriterInstance = new GmailRewriter();
  });
} else {
  window.GmailRewriterInstance = new GmailRewriter();
}

// Listen for refreshRewriteButtons message from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'refreshRewriteButtons') {
    if (window.GmailRewriterInstance && typeof window.GmailRewriterInstance.refreshRewriteButtons === 'function') {
      window.GmailRewriterInstance.refreshRewriteButtons();
    }
  }
});