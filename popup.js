import CONFIG, { initializeConfig } from './config.js';

document.addEventListener('DOMContentLoaded', async function() {
    const emailContentElement = document.getElementById('emailContent');
    const suggestButton = document.getElementById('suggestResponse');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const suggestedResponseDiv = document.getElementById('suggestedResponse');
    
    let currentEmailData = null;
    let configData = null;

    function showLoader() {
        loader.style.display = 'block';
        suggestButton.disabled = true;
    }

    function hideLoader() {
        loader.style.display = 'none';
        suggestButton.disabled = false;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    try {
        configData = await initializeConfig();
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "getEmailContent"}, function(response) {
                if (chrome.runtime.lastError) {
                    showError("Error: Please refresh the Gmail page and try again.");
                    return;
                }

                if (response) {
                    currentEmailData = response;
                    let formattedContent = `Sender: ${response.sender}\n`;
                    if (response.cc) {
                        formattedContent += `CC: ${response.cc}\n`;
                    }
                    formattedContent += `Subject: ${response.subject}\n`;
                    formattedContent += `Content:\n${response.content}`;
                    
                    emailContentElement.textContent = formattedContent;
                } else {
                    showError("Please make sure you're on Gmail and have an email open.");
                }
            });
        });

        suggestButton.addEventListener('click', async function() {
            if (!currentEmailData) {
                showError('Please wait for email content to load');
                return;
            }

            if (!configData || !configData.CLAUDE_API_KEY) {
                showError('API configuration is missing');
                return;
            }

            errorMessage.style.display = 'none';
            suggestedResponseDiv.style.display = 'none';
            showLoader();

            try {
                const response = await generateEmailResponse(currentEmailData, configData);
                suggestedResponseDiv.textContent = response;
                suggestedResponseDiv.style.display = 'block';
            } catch (error) {
                showError('Error generating response: ' + error.message);
            } finally {
                hideLoader();
            }
        });
    } catch (error) {
        showError('Failed to initialize: ' + error.message);
    }
});

async function generateEmailResponse(emailData, config) {
    const prompt = `Please suggest a professional response to this email:
    
From: ${emailData.sender}
Subject: ${emailData.subject}
Content: ${emailData.content}

Please write a concise and professional response that addresses the main points of the email.`;

    try {
        const response = await fetch(config.CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'x-api-key': config.CLAUDE_API_KEY,
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: "claude-3-sonnet-20240229",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 1024,
                system: "You are a helpful assistant that writes professional email responses."
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API request failed: ${errorData.error?.message || response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
    } catch (error) {
        console.error('Error calling Claude API:', error);
        throw error;
    }
}