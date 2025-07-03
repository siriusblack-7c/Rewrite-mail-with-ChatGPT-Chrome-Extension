// Popup JavaScript for Native English Email Assistant
document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('settingsForm');
    const apiKeyInput = document.getElementById('apiKey');
    const englishVariantSelect = document.getElementById('englishVariant');
    const saveButton = document.getElementById('saveButton');
    const statusDiv = document.getElementById('status');

    // Load existing settings
    await loadSettings();

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveSettings();
    });

    async function loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['openaiApiKey', 'englishVariant']);
            if (result.openaiApiKey) {
                apiKeyInput.value = result.openaiApiKey;
            }
            if (result.englishVariant) {
                englishVariantSelect.value = result.englishVariant;
            } else {
                // Default to US English
                englishVariantSelect.value = 'US';
            }
        } catch (error) {
            // Settings loading failed
        }
    }

    async function saveSettings() {
        const apiKey = apiKeyInput.value.trim();
        const englishVariant = englishVariantSelect.value;

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

            // Save the API key and English variant
            await chrome.storage.sync.set({
                openaiApiKey: apiKey,
                englishVariant: englishVariant
            });

            showDetailedStatus('Settings Saved Successfully', 'Your API key is working and settings have been saved. The extension is now ready to rewrite your emails!', 'success');

            // Do not close the popup after saving settings
            // setTimeout(() => {
            //     window.close();
            // }, 2000);

        } catch (error) {
            // Handle specific error types with detailed information
            const errorMsg = error.message || 'Unknown error';

            if (errorMsg === 'BILLING_REQUIRED') {
                showBillingRequiredMessage();
            } else if (errorMsg === 'RATE_LIMITED') {
                showDetailedStatus('Rate Limited', 'Your API key works but you\'re making requests too quickly. Please wait a moment and try again.', 'warning');
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
        // Step-by-step help content
        helpPage.innerHTML = `
            <h2 style='margin-bottom: 10px;'>Help & Guide</h2>
            <ol style='font-size: 14px; color: #374151; line-height: 1.7; padding-left: 18px;'>
                <li><b>Get your OpenAI API key:</b><br>
                    <a href='https://platform.openai.com/api-keys' target='_blank'>Go to OpenAI API Keys</a> and click "Create new secret key". Copy the key (starts with <code>sk-</code>).
                </li>
                <li style='margin-top: 10px;'><b>Add credits and set up billing:</b><br>
                    <a href='https://platform.openai.com/settings/organization/billing/overview' target='_blank'>Go to OpenAI Billing</a>.<br>
                    <ul style='margin-left: 18px;'>
                        <li>Add a payment method (credit card, etc.).</li>
                        <li>Purchase credits (required even if you finished the free trial).</li>
                        <li>Check your balance to ensure you have enough credits.</li>
                    </ul>
                </li>
                <li style='margin-top: 10px;'><b>Enter your API key in the extension:</b><br>
                    Paste your API key into the field and select your preferred English variant.<br>
                    Click <b>Save Settings</b>.
                </li>
                <li style='margin-top: 10px;'><b>Troubleshooting:</b>
                    <ul style='margin-left: 18px;'>
                        <li><b>Billing/Credits Warning:</b> Make sure you have added a payment method and purchased credits.</li>
                        <li><b>Network Error:</b> Check your internet connection and try again.</li>
                        <li><b>Authentication Error:</b> Double-check your API key (should start with <code>sk-</code>).</li>
                        <li><b>Still need help?</b> <a href='https://help.openai.com/' target='_blank'>OpenAI Help Center</a></li>
                    </ul>
                </li>
            </ol>
            <button id='returnButton' style='margin-top: 18px; padding: 8px 18px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;'>Back</button>
        `;
        document.getElementById('returnButton').addEventListener('click', showMainPage);
    }

    function showMainPage() {
        helpPage.classList.remove('visible');
        helpPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        mainPage.classList.add('visible');
    }

    // Add a class for thin scrollbar styling (CSS will be updated separately)
}); 