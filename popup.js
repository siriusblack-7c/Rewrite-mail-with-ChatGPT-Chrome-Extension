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
            // Test the API key by making a simple request
            const testResponse = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (!testResponse.ok) {
                throw new Error('Invalid API key');
            }

            // Save the API key and English variant
            await chrome.storage.sync.set({
                openaiApiKey: apiKey,
                englishVariant: englishVariant
            });

            showStatus('Settings saved successfully!', 'success');

            // Close popup after a short delay
            setTimeout(() => {
                window.close();
            }, 1500);

        } catch (error) {
            console.error('Error testing API key:', error);
            showStatus('Invalid API key. Please check and try again.', 'error');
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

        // Hide status after 3 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
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