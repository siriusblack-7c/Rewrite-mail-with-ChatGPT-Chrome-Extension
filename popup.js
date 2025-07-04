// Popup JavaScript for Native English Email Assistant
document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('settingsForm');
    const apiKeyInput = document.getElementById('apiKey');
    const englishVariantSelect = document.getElementById('englishVariant');
    const saveButton = document.getElementById('saveButton');
    const statusDiv = document.getElementById('status');
    const googleTranslateApiKeyInput = document.getElementById('googleTranslateApiKey');
    const languageSearchInput = document.getElementById('languageSearch');
    const languageDropdown = document.getElementById('languageDropdown');

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
    let selectedLanguage = null;

    // Load existing settings
    await loadSettings();

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveSettings();
    });

    async function loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['openaiApiKey', 'englishVariant', 'googleTranslateApiKey', 'targetLanguage']);
            if (result.openaiApiKey) {
                apiKeyInput.value = result.openaiApiKey;
            }
            if (result.englishVariant) {
                englishVariantSelect.value = result.englishVariant;
            } else {
                // Default to US English
                englishVariantSelect.value = 'US';
            }
            if (result.googleTranslateApiKey) {
                googleTranslateApiKeyInput.value = result.googleTranslateApiKey;
            }
            if (result.targetLanguage) {
                const lang = supportedLanguages.find(l => l.code === result.targetLanguage.code || l.name === result.targetLanguage.name);
                if (lang) {
                    languageSearchInput.value = lang.name;
                    selectedLanguage = lang;
                }
            }
        } catch (error) {
            // Settings loading failed
        }
    }

    async function saveSettings() {
        const apiKey = apiKeyInput.value.trim();
        const englishVariant = englishVariantSelect.value;
        const googleTranslateApiKey = googleTranslateApiKeyInput.value.trim();
        const targetLanguage = selectedLanguage;

        if (!apiKey) {
            showStatus('Please enter your OpenAI API key', 'error');
            return;
        }

        if (!apiKey.startsWith('sk-')) {
            showStatus('Invalid API key format. Should start with "sk-"', 'error');
            return;
        }

        if (!englishVariant) {
            showStatus('Please select an English variant', 'error');
            return;
        }

        if (!googleTranslateApiKey) {
            showStatus('Please enter your Google Translate API key', 'error');
            return;
        }

        if (!targetLanguage) {
            showStatus('Please select a target language', 'error');
            return;
        }

        // Show loading state
        saveButton.textContent = 'Saving...';
        saveButton.disabled = true;

        try {
            // Step 1: Test API key validity
            showStatus('Validating API key...', 'info');

            let modelsResponse;
            try {
                modelsResponse = await fetch('https://api.openai.com/v1/models', {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
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

            // Step 2: Test actual functionality with a minimal request
            showStatus('Testing API functionality...', 'info');

            let testRequestResponse;
            try {
                testRequestResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
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
                    } catch (e) {
                        // If we can't parse the error, still assume billing issue
                    }
                    throw new Error('BILLING_REQUIRED');
                }
                throw new Error(`FUNCTIONAL_TEST_FAILED: HTTP ${testRequestResponse.status} - ${testRequestResponse.statusText}`);
            }

            // If we get here, the functional test passed
            showDetailedStatus('Functional Test Passed', 'Your API key successfully completed both validation steps and is working properly!', 'info');

            // Save all settings
            await chrome.storage.sync.set({
                openaiApiKey: apiKey,
                englishVariant: englishVariant,
                googleTranslateApiKey: googleTranslateApiKey,
                targetLanguage: targetLanguage
            });

            showDetailedStatus('Settings Saved Successfully', 'Your API keys and language settings have been saved.', 'success');

            // Notify all tabs to refresh rewrite buttons immediately
            chrome.tabs && chrome.tabs.query && chrome.tabs.sendMessage && chrome.tabs.query({}, function (tabs) {
                for (let tab of tabs) {
                    chrome.tabs.sendMessage(tab.id, { action: "refreshRewriteButtons" });
                }
            });

        } catch (error) {
            // Handle specific error types with detailed information
            const errorMsg = error.message || 'Unknown error';

            if (errorMsg === 'BILLING_REQUIRED') {
                showBillingRequiredMessage();
            } else if (errorMsg === 'RATE_LIMITED') {
                showDetailedStatus('Rate Limited', 'Your API key works but you\'re making requests too quickly. Please wait a moment and try again. Or you don\'t have enough credits to process requests. You can upgrade to a paid plan to avoid rate limiting. ', 'warning');
            } else if (errorMsg.startsWith('NETWORK_ERROR_STEP1')) {
                showDetailedStatus('Network Error (Step 1)', `Failed to connect to OpenAI for initial validation. ${errorMsg.split(': ')[1] || 'Check your internet connection.'}`, 'error');
            } else if (errorMsg.startsWith('NETWORK_ERROR_STEP2')) {
                showDetailedStatus('Network Error (Step 2)', `Failed to connect to OpenAI for functional testing. ${errorMsg.split(': ')[1] || 'Check your internet connection.'}`, 'error');
            } else if (errorMsg.startsWith('INVALID_KEY_STEP1')) {
                showDetailedStatus('Authentication Failed (Step 1)', `Your API key was rejected during initial validation. Details: ${errorMsg.split(': ')[1] || 'Invalid credentials.'}`, 'error');
            } else if (errorMsg.startsWith('INVALID_KEY_STEP2')) {
                showDetailedStatus('Authentication Failed (Step 2)', `Your API key was rejected during functional testing. Details: ${errorMsg.split(': ')[1] || 'Invalid credentials.'}`, 'error');
            } else if (errorMsg.startsWith('VALIDATION_FAILED_STEP1')) {
                showDetailedStatus('Validation Failed (Step 1)', `OpenAI endpoint returned an error during initial validation. Details: ${errorMsg.split(': ')[1] || 'Server error.'}`, 'error');
            } else if (errorMsg.startsWith('FUNCTIONAL_TEST_FAILED')) {
                showDetailedStatus('Functional Test Failed', `OpenAI rejected the test request. Details: ${errorMsg.split(': ')[1] || 'Server error.'} This usually indicates a billing or quota issue.`, 'error');
            } else if (errorMsg.includes('Invalid API key')) {
                showDetailedStatus('Invalid API Key Format', 'Please ensure your API key starts with "sk-" and is copied correctly from your OpenAI dashboard.', 'error');
            } else {
                showDetailedStatus('Unexpected Error', `An unexpected error occurred: ${errorMsg}. Please try again or contact support if the issue persists.`, 'error');
            }
        } finally {
            // Restore button state
            saveButton.textContent = 'Save Settings';
            saveButton.disabled = false;
        }
    }

    function showDetailedStatus(title, message, type) {
        const typeEmojis = {
            'error': '✖',
            'warning': '⚠',
            'success': '✔',
            'info': 'ℹ'
        };

        const typeColors = {
            'error': '#ffffff',
            'warning': '#ffffff',
            'success': '#00ff00',
            'info': '#ffffff'
        };

        // Add helpful link to all warning messages
        let extraLink = '';
        if (type === 'warning') {
            extraLink = `<div style="margin-top: 6px;"><a href='https://platform.openai.com/settings/organization/billing/overview' target='_blank' style='color:rgb(255, 255, 255); text-decoration: underline; font-size: 12px;'>Go to OpenAI Billing & Help</a></div>`;
        }

        statusDiv.innerHTML = `
            <div style="text-align: left; line-height: 1.4;">
                <div style="font-weight: 600; color: ${typeColors[type]}; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                    <span>${typeEmojis[type]}</span>
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
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';
        // No auto-hide for any message type
    }

    function showBillingRequiredMessage() {
        // Create a detailed billing guidance message (persistent, does not auto-hide)
        statusDiv.innerHTML = `
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
        statusDiv.className = 'status warning';
        statusDiv.style.display = 'block';
        // Do NOT auto-hide this message. It will refresh/disappear on next Save Settings attempt.
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';
        // No auto-hide for any message type
    }

    // Handle API key input formatting
    apiKeyInput.addEventListener('input', (e) => {
        // Hide status when user starts typing
        statusDiv.style.display = 'none';
    });

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

    // Add a class for thin scrollbar styling (CSS will be updated separately)
}); 