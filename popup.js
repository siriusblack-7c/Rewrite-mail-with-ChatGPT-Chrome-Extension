// Popup JavaScript for Native English Email Assistant
document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('settingsForm');
    const apiKeyInput = document.getElementById('apiKey');
    const englishVariantInput = document.getElementById('englishVariantInput');
    const englishVariantDropdown = document.getElementById('englishVariantDropdown');
    const saveOpenAIBtn = document.getElementById('saveOpenAIBtn');
    const saveGoogleBtn = document.getElementById('saveGoogleBtn');
    const openaiStatusDiv = document.getElementById('openaiStatus');
    const googleStatusDiv = document.getElementById('googleStatus');
    const googleTranslateApiKeyInput = document.getElementById('googleTranslateApiKey');
    const languageSearchInput = document.getElementById('languageSearch');
    const languageDropdown = document.getElementById('languageDropdown');
    const inputLanguageSearchInput = document.getElementById('inputLanguageSearch');
    const inputLanguageDropdown = document.getElementById('inputLanguageDropdown');
    const detectLanguageBtn = document.getElementById('detectLanguageBtn');
    let selectedLanguage = null;
    let selectedInputLanguage = null;

    // List of supported languages (name/code pairs)
    const supportedLanguages = [
        { name: 'Abkhaz', code: 'ab' },
        { name: 'Acehnese', code: 'ace' },
        { name: 'Acholi', code: 'ach' },
        { name: 'Afrikaans', code: 'af' },
        { name: 'Albanian', code: 'sq' },
        { name: 'Amharic', code: 'am' },
        { name: 'Arabic', code: 'ar' },
        { name: 'Armenian', code: 'hy' },
        { name: 'Assamese', code: 'as' },
        { name: 'Aymara', code: 'ay' },
        { name: 'Azerbaijani', code: 'az' },
        { name: 'Bambara', code: 'bm' },
        { name: 'Bashkir', code: 'ba' },
        { name: 'Basque', code: 'eu' },
        { name: 'Belarusian', code: 'be' },
        { name: 'Bengali', code: 'bn' },
        { name: 'Bhojpuri', code: 'bho' },
        { name: 'Bosnian', code: 'bs' },
        { name: 'Bulgarian', code: 'bg' },
        { name: 'Burmese', code: 'my' },
        { name: 'Catalan', code: 'ca' },
        { name: 'Cebuano', code: 'ceb' },
        { name: 'Chichewa', code: 'ny' },
        { name: 'Chinese (Simplified)', code: 'zh-CN' },
        { name: 'Chinese (Traditional)', code: 'zh-TW' },
        { name: 'Corsican', code: 'co' },
        { name: 'Croatian', code: 'hr' },
        { name: 'Czech', code: 'cs' },
        { name: 'Danish', code: 'da' },
        { name: 'Dutch', code: 'nl' },
        { name: 'English', code: 'en' },
        { name: 'Esperanto', code: 'eo' },
        { name: 'Estonian', code: 'et' },
        { name: 'Ewe', code: 'ee' },
        { name: 'Filipino', code: 'fil' },
        { name: 'Finnish', code: 'fi' },
        { name: 'French', code: 'fr' },
        { name: 'Frisian', code: 'fy' },
        { name: 'Galician', code: 'gl' },
        { name: 'Georgian', code: 'ka' },
        { name: 'German', code: 'de' },
        { name: 'Greek', code: 'el' },
        { name: 'Guarani', code: 'gn' },
        { name: 'Gujarati', code: 'gu' },
        { name: 'Haitian Creole', code: 'ht' },
        { name: 'Hausa', code: 'ha' },
        { name: 'Hawaiian', code: 'haw' },
        { name: 'Hebrew', code: 'he' },
        { name: 'Hindi', code: 'hi' },
        { name: 'Hmong', code: 'hmn' },
        { name: 'Hungarian', code: 'hu' },
        { name: 'Icelandic', code: 'is' },
        { name: 'Igbo', code: 'ig' },
        { name: 'Indonesian', code: 'id' },
        { name: 'Irish', code: 'ga' },
        { name: 'Italian', code: 'it' },
        { name: 'Japanese', code: 'ja' },
        { name: 'Javanese', code: 'jv' },
        { name: 'Kannada', code: 'kn' },
        { name: 'Kazakh', code: 'kk' },
        { name: 'Khmer', code: 'km' },
        { name: 'Kinyarwanda', code: 'rw' },
        { name: 'Korean', code: 'ko' },
        { name: 'Kurdish (Kurmanji)', code: 'ku' },
        { name: 'Kyrgyz', code: 'ky' },
        { name: 'Lao', code: 'lo' },
        { name: 'Latin', code: 'la' },
        { name: 'Latvian', code: 'lv' },
        { name: 'Lithuanian', code: 'lt' },
        { name: 'Luxembourgish', code: 'lb' },
        { name: 'Macedonian', code: 'mk' },
        { name: 'Malagasy', code: 'mg' },
        { name: 'Malay', code: 'ms' },
        { name: 'Malayalam', code: 'ml' },
        { name: 'Maltese', code: 'mt' },
        { name: 'Maori', code: 'mi' },
        { name: 'Marathi', code: 'mr' },
        { name: 'Mongolian', code: 'mn' },
        { name: 'Nepali', code: 'ne' },
        { name: 'Norwegian', code: 'no' },
        { name: 'Nyanja', code: 'ny' },
        { name: 'Odia (Oriya)', code: 'or' },
        { name: 'Pashto', code: 'ps' },
        { name: 'Persian', code: 'fa' },
        { name: 'Polish', code: 'pl' },
        { name: 'Portuguese', code: 'pt' },
        { name: 'Punjabi', code: 'pa' },
        { name: 'Quechua', code: 'qu' },
        { name: 'Romanian', code: 'ro' },
        { name: 'Russian', code: 'ru' },
        { name: 'Samoan', code: 'sm' },
        { name: 'Scots Gaelic', code: 'gd' },
        { name: 'Serbian', code: 'sr' },
        { name: 'Sesotho', code: 'st' },
        { name: 'Shona', code: 'sn' },
        { name: 'Sindhi', code: 'sd' },
        { name: 'Sinhala', code: 'si' },
        { name: 'Slovak', code: 'sk' },
        { name: 'Slovenian', code: 'sl' },
        { name: 'Somali', code: 'so' },
        { name: 'Spanish', code: 'es' },
        { name: 'Sundanese', code: 'su' },
        { name: 'Swahili', code: 'sw' },
        { name: 'Swedish', code: 'sv' },
        { name: 'Tajik', code: 'tg' },
        { name: 'Tamil', code: 'ta' },
        { name: 'Tatar', code: 'tt' },
        { name: 'Telugu', code: 'te' },
        { name: 'Thai', code: 'th' },
        { name: 'Turkish', code: 'tr' },
        { name: 'Ukrainian', code: 'uk' },
        { name: 'Urdu', code: 'ur' },
        { name: 'Uyghur', code: 'ug' },
        { name: 'Uzbek', code: 'uz' },
        { name: 'Vietnamese', code: 'vi' },
        { name: 'Welsh', code: 'cy' },
        { name: 'Xhosa', code: 'xh' },
        { name: 'Yiddish', code: 'yi' },
        { name: 'Yoruba', code: 'yo' },
        { name: 'Zulu', code: 'zu' }
    ];

    const englishVariants = [
        { code: 'US', name: 'United States (American English)' },
        { code: 'UK', name: 'United Kingdom (British English)' },
        { code: 'AU', name: 'Australia (Australian English)' },
        { code: 'CA', name: 'Canada (Canadian English)' },
        { code: 'NZ', name: 'New Zealand (New Zealand English)' },
        { code: 'ZA', name: 'South Africa (South African English)' }
    ];

    // Load existing settings
    await loadSettings();

    // Handle button clicks
    saveOpenAIBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await saveOpenAISettings();
    });

    saveGoogleBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await saveGoogleTranslateSettings();
    });

    async function loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['openaiApiKey', 'englishVariant', 'googleTranslateApiKey', 'targetLanguage', 'inputLanguage']);
            // Always leave the input fields empty
            apiKeyInput.value = '';
            googleTranslateApiKeyInput.value = '';
            // Show status for OpenAI key
            const openaiKeyStatus = document.getElementById('openaiKeyStatus');
            if (result.openaiApiKey) {
                openaiKeyStatus.innerHTML = '<i class="fa-solid fa-check-circle" style="color:#22c55e;"></i> Saved';
                openaiKeyStatus.style.color = '#22c55e';
            } else {
                openaiKeyStatus.innerHTML = '<i class="fa-solid fa-times-circle" style="color:#ef4444;"></i> Not set';
                openaiKeyStatus.style.color = '#ef4444';
            }
            // Show status for Google key
            const googleKeyStatus = document.getElementById('googleKeyStatus');
            if (result.googleTranslateApiKey) {
                googleKeyStatus.innerHTML = '<i class="fa-solid fa-check-circle" style="color:#22c55e;"></i> Saved';
                googleKeyStatus.style.color = '#22c55e';
            } else {
                googleKeyStatus.innerHTML = '<i class="fa-solid fa-times-circle" style="color:#ef4444;"></i> Not set';
                googleKeyStatus.style.color = '#ef4444';
            }
            if (result.englishVariant) {
                // If it's a known code, show the name; else, show the custom value
                const variant = englishVariants.find(v => v.code === result.englishVariant || v.name === result.englishVariant);
                englishVariantInput.value = variant ? variant.name : result.englishVariant;
            } else {
                englishVariantInput.value = '';
            }
            if (result.targetLanguage) {
                const lang = supportedLanguages.find(l => l.code === result.targetLanguage.code || l.name === result.targetLanguage.name);
                if (lang) {
                    languageSearchInput.value = lang.name;
                    selectedLanguage = lang;
                }
            }
            if (result.inputLanguage) {
                if (result.inputLanguage === 'auto') {
                    inputLanguageSearchInput.value = 'Detect Language';
                    selectedInputLanguage = 'auto';
                } else {
                    const lang = supportedLanguages.find(l => l.code === result.inputLanguage.code || l.name === result.inputLanguage.name);
                    if (lang) {
                        inputLanguageSearchInput.value = lang.name;
                        selectedInputLanguage = lang;
                    }
                }
            } else {
                inputLanguageSearchInput.value = 'Detect Language';
                selectedInputLanguage = 'auto';
            }
        } catch (error) {
            // Settings loading failed
        }
    }

    // Clear status when user types a new value
    apiKeyInput.addEventListener('input', () => {
        document.getElementById('openaiKeyStatus').textContent = '';
    });
    googleTranslateApiKeyInput.addEventListener('input', () => {
        document.getElementById('googleKeyStatus').textContent = '';
    });

    async function saveOpenAISettings() {
        const apiKey = apiKeyInput.value.trim();
        const englishVariant = englishVariantInput.value;
        let keyToUse = apiKey;
        // Allow language-only change if key is empty but one exists
        if (!apiKey) {
            const result = await chrome.storage.sync.get(['openaiApiKey']);
            if (result.openaiApiKey) {
                keyToUse = result.openaiApiKey;
            } else {
                showStatus('Please enter your OpenAI API key', 'error', 'openai');
                return;
            }
        }
        if (!keyToUse.startsWith('sk-')) {
            showStatus('Invalid API key format. Should start with "sk-"', 'error', 'openai');
            return;
        }
        if (!englishVariant) {
            showStatus('Please select an English variant', 'error', 'openai');
            return;
        }
        saveOpenAIBtn.textContent = 'Saving...';
        saveOpenAIBtn.disabled = true;
        try {
            if (apiKey) {
                showStatus('Validating OpenAI API key...', 'info', 'openai');
                let modelsResponse;
                try {
                    modelsResponse = await fetch('https://api.openai.com/v1/models', {
                        headers: {
                            'Authorization': `Bearer ${keyToUse}`
                        }
                    });
                } catch (fetchError) {
                    throw new Error(`NETWORK_ERROR_STEP1: ${fetchError.message}`);
                }
                if (!modelsResponse.ok) {
                    if (modelsResponse.status === 401 || modelsResponse.status === 403) {
                        throw new Error(`INVALID_KEY_STEP1: HTTP ${modelsResponse.status} - ${modelsResponse.statusText}`);
                    }
                    throw new Error(`VALIDATION_FAILED_STEP1: HTTP ${modelsResponse.status} - ${modelsResponse.statusText}`);
                }
                showStatus('Testing OpenAI API functionality...', 'info', 'openai');
                let testRequestResponse;
                try {
                    testRequestResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${keyToUse}`
                        },
                        body: JSON.stringify({
                            model: 'gpt-4o-mini',
                            messages: [
                                { role: 'user', content: 'Test' }
                            ],
                            max_tokens: 5,
                            temperature: 0
                        })
                    });
                } catch (fetchError) {
                    throw new Error(`NETWORK_ERROR_STEP2: ${fetchError.message}`);
                }
                if (!testRequestResponse.ok) {
                    if (testRequestResponse.status === 401 || testRequestResponse.status === 403) {
                        throw new Error(`INVALID_KEY_STEP2: HTTP ${testRequestResponse.status} - ${testRequestResponse.statusText}`);
                    } else if (testRequestResponse.status === 429) {
                        throw new Error('RATE_LIMITED');
                    } else if (testRequestResponse.status === 402 || testRequestResponse.status === 400) {
                        let errorDetails = '';
                        try {
                            const errorData = await testRequestResponse.json();
                            errorDetails = errorData.error?.message || errorData.error?.code || 'Unknown billing error';
                            if (errorData.error?.code === 'insufficient_quota' ||
                                errorData.error?.message?.includes('quota') ||
                                errorData.error?.message?.includes('billing')) {
                                throw new Error('BILLING_REQUIRED');
                            }
                        } catch (e) { }
                        throw new Error('BILLING_REQUIRED');
                    }
                    throw new Error(`FUNCTIONAL_TEST_FAILED: HTTP ${testRequestResponse.status} - ${testRequestResponse.statusText}`);
                }
                showDetailedStatus('OpenAI API Test Passed', 'Your OpenAI API key successfully completed both validation steps and is working properly!', 'success', 'openai');
            }
            await chrome.storage.sync.set({
                openaiApiKey: keyToUse,
                englishVariant: englishVariant
            });
            showDetailedStatus('OpenAI Settings Saved', 'Your OpenAI API key and English variant have been saved successfully.', 'success', 'openai');
            document.getElementById('openaiKeyStatus').innerHTML = '<i class="fa-solid fa-check-circle" style="color:#22c55e;"></i> Saved';
            document.getElementById('openaiKeyStatus').style.color = '#22c55e';
            chrome.tabs && chrome.tabs.query && chrome.tabs.sendMessage && chrome.tabs.query({}, function (tabs) {
                for (let tab of tabs) {
                    chrome.tabs.sendMessage(tab.id, { action: "refreshRewriteButtons" });
                }
            });
        } catch (error) {
            const errorMsg = error.message || 'Unknown error';
            if (errorMsg === 'BILLING_REQUIRED') {
                showBillingRequiredMessage('openai');
            } else if (errorMsg === 'RATE_LIMITED') {
                showDetailedStatus('Rate Limited', 'Your API key works but you\'re making requests too quickly. Please wait a moment and try again. Or you don\'t have enough credits to process requests. You can upgrade to a paid plan to avoid rate limiting. ', 'warning', 'openai');
            } else if (errorMsg.startsWith('NETWORK_ERROR_STEP1')) {
                showDetailedStatus('Network Error (Step 1)', `Failed to connect to OpenAI for initial validation. ${errorMsg.split(': ')[1] || 'Check your internet connection.'}`, 'error', 'openai');
            } else if (errorMsg.startsWith('NETWORK_ERROR_STEP2')) {
                showDetailedStatus('Network Error (Step 2)', `Failed to connect to OpenAI for functional testing. ${errorMsg.split(': ')[1] || 'Check your internet connection.'}`, 'error', 'openai');
            } else if (errorMsg.startsWith('INVALID_KEY_STEP1')) {
                showDetailedStatus('Authentication Failed (Step 1)', `Your API key was rejected during initial validation. Details: ${errorMsg.split(': ')[1] || 'Invalid credentials.'}`, 'error', 'openai');
            } else if (errorMsg.startsWith('INVALID_KEY_STEP2')) {
                showDetailedStatus('Authentication Failed (Step 2)', `Your API key was rejected during functional testing. Details: ${errorMsg.split(': ')[1] || 'Invalid credentials.'}`, 'error', 'openai');
            } else if (errorMsg.startsWith('VALIDATION_FAILED_STEP1')) {
                showDetailedStatus('Validation Failed (Step 1)', `OpenAI endpoint returned an error during initial validation. Details: ${errorMsg.split(': ')[1] || 'Server error.'}`, 'error', 'openai');
            } else if (errorMsg.startsWith('FUNCTIONAL_TEST_FAILED')) {
                showDetailedStatus('Functional Test Failed', `OpenAI rejected the test request. Details: ${errorMsg.split(': ')[1] || 'Server error.'} This usually indicates a billing or quota issue.`, 'error', 'openai');
            } else if (errorMsg.includes('Invalid API key')) {
                showDetailedStatus('Invalid API Key Format', 'Please ensure your API key starts with "sk-" and is copied correctly from your OpenAI dashboard.', 'error', 'openai');
            } else {
                showDetailedStatus('Unexpected Error', `An unexpected error occurred: ${errorMsg}. Please try again or contact support if the issue persists.`, 'error', 'openai');
            }
        } finally {
            saveOpenAIBtn.textContent = '💾 Save OpenAI Settings';
            saveOpenAIBtn.disabled = false;
        }
    }

    async function saveGoogleTranslateSettings() {
        const googleTranslateApiKey = googleTranslateApiKeyInput.value.trim();
        const targetLanguage = selectedLanguage;
        const inputLanguage = selectedInputLanguage;
        let keyToUse = googleTranslateApiKey;
        if (!googleTranslateApiKey) {
            const result = await chrome.storage.sync.get(['googleTranslateApiKey']);
            if (result.googleTranslateApiKey) {
                keyToUse = result.googleTranslateApiKey;
            } else {
                showStatus('Please enter your Google Translate API key', 'error', 'google');
                return;
            }
        }
        if (!targetLanguage) {
            showStatus('Please select a target language', 'error', 'google');
            return;
        }
        if (!inputLanguage) {
            showStatus('Please select an input language or Detect Language', 'error', 'google');
            return;
        }
        saveGoogleBtn.textContent = 'Saving...';
        saveGoogleBtn.disabled = true;
        try {
            if (googleTranslateApiKey) {
                showStatus('Testing Google Translate API key...', 'info', 'google');
                let testResponse;
                try {
                    testResponse = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(keyToUse)}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            q: 'Hello world',
                            target: 'es',
                            source: inputLanguage && inputLanguage !== 'auto' ? inputLanguage.code : undefined
                        })
                    });
                } catch (fetchError) {
                    throw new Error(`NETWORK_ERROR: ${fetchError.message}`);
                }
                if (!testResponse.ok) {
                    if (testResponse.status === 400) {
                        const errorData = await testResponse.json();
                        if (errorData.error?.message?.includes('API key')) {
                            throw new Error('INVALID_API_KEY');
                        } else if (errorData.error?.message?.includes('quota') || errorData.error?.message?.includes('billing')) {
                            throw new Error('QUOTA_EXCEEDED');
                        } else {
                            throw new Error(`API_ERROR: ${errorData.error?.message || 'Unknown API error'}`);
                        }
                    } else if (testResponse.status === 403) {
                        throw new Error('INVALID_API_KEY');
                    } else {
                        throw new Error(`HTTP_ERROR: ${testResponse.status} - ${testResponse.statusText}`);
                    }
                }
                const testData = await testResponse.json();
                if (testData && testData.data && testData.data.translations && testData.data.translations[0]) {
                    const translatedText = testData.data.translations[0].translatedText;
                    showDetailedStatus('Google Translate API Test Passed', `Your Google Translate API key is working correctly! Test translation: "Hello world" → "${translatedText}"`, 'success', 'google');
                } else {
                    throw new Error('INVALID_RESPONSE');
                }
            }
            await chrome.storage.sync.set({
                googleTranslateApiKey: keyToUse,
                targetLanguage: targetLanguage,
                inputLanguage: inputLanguage
            });
            showDetailedStatus('Google Translate Settings Saved', 'Your Google Translate API key, input language, and target language have been saved successfully.', 'success', 'google');
            document.getElementById('googleKeyStatus').innerHTML = '<i class="fa-solid fa-check-circle" style="color:#22c55e;"></i> Saved';
            document.getElementById('googleKeyStatus').style.color = '#22c55e';
        } catch (error) {
            const errorMsg = error.message || 'Unknown error';
            if (errorMsg === 'INVALID_API_KEY') {
                showDetailedStatus('Invalid Google Translate API Key', 'The API key you provided is invalid or not authorized for Google Translate API. Please check your key and ensure it has the necessary permissions.', 'error', 'google');
            } else if (errorMsg === 'QUOTA_EXCEEDED') {
                showDetailedStatus('Quota Exceeded', 'Your Google Translate API quota has been exceeded. Please check your Google Cloud Console billing and quota settings.', 'warning', 'google');
            } else if (errorMsg.startsWith('NETWORK_ERROR')) {
                showDetailedStatus('Network Error', `Failed to connect to Google Translate API. ${errorMsg.split(': ')[1] || 'Check your internet connection.'}`, 'error', 'google');
            } else if (errorMsg.startsWith('API_ERROR')) {
                showDetailedStatus('API Error', `Google Translate API returned an error: ${errorMsg.split(': ')[1] || 'Unknown API error'}`, 'error', 'google');
            } else if (errorMsg.startsWith('HTTP_ERROR')) {
                showDetailedStatus('HTTP Error', `Google Translate API returned HTTP error: ${errorMsg.split(': ')[1] || 'Unknown HTTP error'}`, 'error', 'google');
            } else if (errorMsg === 'INVALID_RESPONSE') {
                showDetailedStatus('Invalid Response', 'Google Translate API returned an unexpected response format. Please try again.', 'error', 'google');
            } else {
                showDetailedStatus('Unexpected Error', `An unexpected error occurred: ${errorMsg}. Please try again or contact support if the issue persists.`, 'error', 'google');
            }
        } finally {
            saveGoogleBtn.textContent = '💾 Save Google Translate Settings';
            saveGoogleBtn.disabled = false;
        }
    }

    function showDetailedStatus(title, message, type, which) {
        const div = which === 'google' ? googleStatusDiv : openaiStatusDiv;
        const typeIcons = {
            'error': '<i class="fa-solid fa-times-circle" style="color:#fff;"></i>',
            'warning': '<i class="fa-solid fa-exclamation-triangle" style="color:#fff;"></i>',
            'success': '<i class="fa-solid fa-check-circle" style="color:#00ff00;"></i>',
            'info': '<i class="fa-solid fa-info-circle" style="color:#fff;"></i>'
        };
        const typeColors = {
            'error': '#ffffff',
            'warning': '#ffffff',
            'success': '#00ff00',
            'info': '#ffffff'
        };
        let extraLink = '';
        if (type === 'warning') {
            if (title.includes('OpenAI') || message.includes('OpenAI')) {
                extraLink = `<div style="margin-top: 6px;"><a href='https://platform.openai.com/settings/organization/billing/overview' target='_blank' style='color:rgb(255, 255, 255); text-decoration: underline; font-size: 12px;'>Go to OpenAI Billing & Help</a></div>`;
            } else if (title.includes('Google') || message.includes('Google')) {
                extraLink = `<div style="margin-top: 6px;"><a href='https://console.cloud.google.com/billing' target='_blank' style='color:rgb(255, 255, 255); text-decoration: underline; font-size: 12px;'>Go to Google Cloud Billing</a></div>`;
            }
        }
        div.innerHTML = `
            <div style="text-align: left; line-height: 1.4;">
                <div style="font-weight: 600; color: ${typeColors[type]}; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                    ${typeIcons[type]}
                    <span>${title}</span>
                </div>
                <div style="font-size: 13px; color: #4a5568; margin-bottom: 8px;">
                    ${message}
                </div>
                ${extraLink}
                <div style="font-size: 11px; color: #6b7280; font-style: italic;">
                    Timestamp: ${new Date().toLocaleTimeString()}
                </div>
            </div>
        `;
        div.className = `status ${type}`;
        div.style.display = 'block';
    }

    function showBillingRequiredMessage(which) {
        const div = which === 'google' ? googleStatusDiv : openaiStatusDiv;
        div.innerHTML = `
            <div style="text-align: left; line-height: 1.4;">
                <div style="font-weight: 600; color: #d97706; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                    <span>⚠️</span>
                    <span>Insufficient Credits</span>
                </div>
                <div style="font-size: 13px; color: #4a5568; margin-bottom: 12px;">
                    Your API key works but you don't have enough credits to process requests. Please <a href=\"https://platform.openai.com/settings/organization/billing/overview\" target=\"_blank\" style=\"color: #d97706; text-decoration: underline; font-weight: 500;\">navigate to billing</a> and ensure you're not in a Free Trial by adding a payment method and purchasing credits.
                </div>
                <div style="font-size: 11px; color: #6b7280; font-style: italic; margin-top: 8px; text-align: center;">
                    Detected at: ${new Date().toLocaleTimeString()}
                </div>
            </div>
        `;
        div.className = 'status warning';
        div.style.display = 'block';
    }

    function showStatus(message, type, which) {
        const div = which === 'google' ? googleStatusDiv : openaiStatusDiv;
        div.textContent = message;
        div.className = `status ${type}`;
        div.style.display = 'block';
    }

    // Page navigation functionality
    const helpToggle = document.getElementById('helpToggle');
    const returnButton = document.getElementById('returnButton');
    const mainPage = document.getElementById('mainPage');
    const helpPage = document.getElementById('helpPage');

    // Show help page when help button is clicked
    helpToggle.addEventListener('click', (e) => {
        e.preventDefault();
        showHelpPage();
    });

    // Return to main page when return button is clicked
    returnButton.addEventListener('click', (e) => {
        e.preventDefault();
        showMainPage();
    });

    function showHelpPage() {
        mainPage.classList.remove('visible');
        mainPage.classList.add('hidden');
        helpPage.classList.remove('hidden');
        helpPage.classList.add('visible');
        // Just wire up the return button for the static help content
        document.getElementById('returnButton').onclick = showMainPage;
    }

    function showMainPage() {
        helpPage.classList.remove('visible');
        helpPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        mainPage.classList.add('visible');
    }

    // --- Language dropdown logic ---
    function filterLanguages(query) {
        query = query.trim().toLowerCase();
        if (!query) return supportedLanguages;
        return supportedLanguages.filter(lang =>
            lang.name.toLowerCase().includes(query) ||
            lang.code.toLowerCase().includes(query)
        );
    }

    languageSearchInput.addEventListener('input', (e) => {
        const value = e.target.value;
        const matches = filterLanguages(value);
        if (matches.length > 0) {
            languageDropdown.innerHTML = matches.map(lang =>
                `<div class="language-option" data-code="${lang.code}" style="padding:8px 12px; cursor:pointer;">${lang.name}</div>`
            ).join('');
            languageDropdown.style.display = 'block';
        } else {
            languageDropdown.innerHTML = '<div style="padding:8px 12px; color:#aaa;">No matches found</div>';
            languageDropdown.style.display = 'block';
        }
    });

    languageDropdown.addEventListener('mousedown', (e) => {
        const option = e.target.closest('.language-option');
        if (option) {
            const langName = option.textContent;
            const langCode = option.getAttribute('data-code');
            languageSearchInput.value = langName;
            selectedLanguage = { name: langName, code: langCode };
            languageDropdown.style.display = 'none';
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (!languageDropdown.contains(e.target) && e.target !== languageSearchInput) {
            languageDropdown.style.display = 'none';
        }
    });

    // --- Input Language dropdown logic ---
    function filterInputLanguages(query) {
        query = query.trim().toLowerCase();
        if (!query) return supportedLanguages;
        return supportedLanguages.filter(lang =>
            lang.name.toLowerCase().includes(query) ||
            lang.code.toLowerCase().includes(query)
        );
    }
    inputLanguageSearchInput.addEventListener('input', (e) => {
        const value = e.target.value;
        const matches = filterInputLanguages(value);
        if (matches.length > 0) {
            inputLanguageDropdown.innerHTML = matches.map(lang =>
                `<div class="language-option" data-code="${lang.code}" style="padding:8px 12px; cursor:pointer;">${lang.name}</div>`
            ).join('');
            inputLanguageDropdown.style.display = 'block';
        } else {
            inputLanguageDropdown.innerHTML = '<div style="padding:8px 12px; color:#aaa;">No matches found</div>';
            inputLanguageDropdown.style.display = 'block';
        }
    });
    inputLanguageDropdown.addEventListener('mousedown', (e) => {
        const option = e.target.closest('.language-option');
        if (option) {
            const langName = option.textContent;
            const langCode = option.getAttribute('data-code');
            inputLanguageSearchInput.value = langName;
            selectedInputLanguage = { name: langName, code: langCode };
            inputLanguageDropdown.style.display = 'none';
        }
    });
    document.addEventListener('mousedown', (e) => {
        if (!inputLanguageDropdown.contains(e.target) && e.target !== inputLanguageSearchInput) {
            inputLanguageDropdown.style.display = 'none';
        }
    });
    detectLanguageBtn.addEventListener('click', () => {
        inputLanguageSearchInput.value = 'Detect Language';
        selectedInputLanguage = 'auto';
        inputLanguageDropdown.style.display = 'none';
    });

    // --- English Variant Combo Box Logic ---
    function filterEnglishVariants(query) {
        query = query.trim().toLowerCase();
        if (!query) return englishVariants;
        return englishVariants.filter(v =>
            v.name.toLowerCase().includes(query) ||
            v.code.toLowerCase().includes(query)
        );
    }
    englishVariantInput.addEventListener('input', (e) => {
        const value = e.target.value;
        const matches = filterEnglishVariants(value);
        if (matches.length > 0) {
            englishVariantDropdown.innerHTML = matches.map(v =>
                `<div class="language-option" data-code="${v.code}" style="padding:8px 12px; cursor:pointer;">${v.name}</div>`
            ).join('');
            englishVariantDropdown.style.display = 'block';
        } else {
            englishVariantDropdown.innerHTML = '<div style="padding:8px 12px; color:#aaa;">No matches found</div>';
            englishVariantDropdown.style.display = 'block';
        }
    });
    englishVariantDropdown.addEventListener('mousedown', (e) => {
        const option = e.target.closest('.language-option');
        if (option) {
            const variantName = option.textContent;
            englishVariantInput.value = variantName;
            englishVariantDropdown.style.display = 'none';
            // Save as code if known, else as name
            const variant = englishVariants.find(v => v.name === variantName);
            chrome.storage.sync.set({ englishVariant: variant ? variant.code : variantName });
        }
    });
    document.addEventListener('mousedown', (e) => {
        if (!englishVariantDropdown.contains(e.target) && e.target !== englishVariantInput) {
            englishVariantDropdown.style.display = 'none';
        }
    });
    // Save custom value on blur
    englishVariantInput.addEventListener('blur', () => {
        const value = englishVariantInput.value.trim();
        if (value) {
            const variant = englishVariants.find(v => v.name === value || v.code === value);
            chrome.storage.sync.set({ englishVariant: variant ? variant.code : value });
        }
    });

    // Add a class for thin scrollbar styling (CSS will be updated separately)
}); 