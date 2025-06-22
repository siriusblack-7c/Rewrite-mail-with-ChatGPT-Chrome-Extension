// Background Service Worker for Native English Email Assistant

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // Open the popup to set up API key on first install
        chrome.action.openPopup();
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Check if we're on Gmail
    if (tab.url && tab.url.includes('mail.google.com')) {
        // Show a notification that the extension is active
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: showExtensionActiveMessage
        });
    } else {
        // Open Gmail in a new tab
        chrome.tabs.create({
            url: 'https://mail.google.com'
        });
    }
});

function showExtensionActiveMessage() {
    // This function runs in the content script context
    const message = document.createElement('div');
    message.textContent = 'Native English Email Assistant is active! Look for the "Rewrite for English" button when composing emails.';
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.right = '20px';
    message.style.padding = '12px 16px';
    message.style.backgroundColor = '#4CAF50';
    message.style.color = 'white';
    message.style.borderRadius = '4px';
    message.style.zIndex = '10000';
    message.style.fontSize = '14px';
    message.style.fontWeight = '500';
    message.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    message.style.maxWidth = '300px';
    message.style.lineHeight = '1.4';

    document.body.appendChild(message);

    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 4000);
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openPopup') {
        chrome.action.openPopup();
    }
}); 