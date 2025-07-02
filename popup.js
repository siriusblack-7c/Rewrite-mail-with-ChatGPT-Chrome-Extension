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
            console.error('Error loading settings:', error);
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
            // Test the API key and check billing/credits
            showStatus('Validating API key and checking account...', 'info');

            const testResponse = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (!testResponse.ok) {
                if (testResponse.status === 401 || testResponse.status === 403) {
                    throw new Error('Invalid API key. Please check your key and try again.');
                }
                throw new Error('API key validation failed. Please try again.');
            }

            // Check billing and credits
            let billingStatus = { hasCredits: 'unknown', hasBilling: 'unknown' };
            try {
                const billingResponse = await fetch('https://api.openai.com/v1/dashboard/billing/credit_grants', {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                });

                if (billingResponse.ok) {
                    const billingData = await billingResponse.json();

                    const hasActiveCredits = billingData.grants && billingData.grants.some(grant =>
                        grant.effective_at * 1000 <= Date.now() &&
                        grant.expires_at * 1000 > Date.now() &&
                        grant.used_amount < grant.granted_amount
                    );

                    // Check if billing is set up
                    let hasBillingSetup = false;
                    if (!hasActiveCredits) {
                        try {
                            const usageResponse = await fetch('https://api.openai.com/v1/dashboard/billing/usage', {
                                headers: {
                                    'Authorization': `Bearer ${apiKey}`
                                }
                            });
                            hasBillingSetup = usageResponse.ok;
                        } catch (e) {
                            // Ignore billing check errors
                        }
                    }

                    billingStatus = {
                        hasCredits: hasActiveCredits,
                        hasBilling: hasBillingSetup || hasActiveCredits
                    };
                }
            } catch (e) {
                // Billing check is optional, continue if it fails
            }

            // Save the API key and English variant
            await chrome.storage.sync.set({
                openaiApiKey: apiKey,
                englishVariant: englishVariant
            });

            // Show appropriate success message based on billing status
            if (billingStatus.hasCredits === false && billingStatus.hasBilling === false) {
                showStatus('⚠️ API key valid, but no billing setup detected. You may need to add a payment method and credits to use the extension.', 'warning');
                // Don't auto-close, let user read the warning
            } else if (billingStatus.hasCredits === false && billingStatus.hasBilling === true) {
                showStatus('⚠️ API key valid, but credits may be exhausted. Check your OpenAI dashboard if the extension doesn\'t work.', 'warning');
                // Don't auto-close, let user read the warning
            } else {
                showStatus('Settings saved successfully!', 'success');
                // Close popup after a short delay
                setTimeout(() => {
                    window.close();
                }, 1500);
            }

        } catch (error) {
            console.error('Error testing API key:', error);
            showStatus(error.message || 'Invalid API key. Please check and try again.', 'error');
        } finally {
            // Restore button state
            saveButton.textContent = 'Save Settings';
            saveButton.disabled = false;
        }
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';

        // Auto-hide based on message type
        let hideDelay = 0;
        switch (type) {
            case 'success':
                hideDelay = 3000;
                break;
            case 'info':
                hideDelay = 2000;
                break;
            case 'warning':
                hideDelay = 8000; // Longer for important warnings
                break;
            case 'error':
                // Don't auto-hide errors
                hideDelay = 0;
                break;
        }

        if (hideDelay > 0) {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, hideDelay);
        }
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
    }

    function showMainPage() {
        helpPage.classList.remove('visible');
        helpPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        mainPage.classList.add('visible');
    }
}); 