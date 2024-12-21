import CONFIG, { initializeConfig } from './config.js';
import { getResponseExamples, addResponseExample, getTemplates } from './responseDatabase.js';
import { setTheme, initializeTheme } from './themeManager.js';

document.addEventListener('DOMContentLoaded', async function() {
    const emailContentElement = document.getElementById('emailContent');
    const suggestButton = document.getElementById('suggestResponse');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const suggestedResponseDiv = document.getElementById('suggestedResponse');
    const createDraftButton = document.getElementById('createDraft');
    const saveAsExampleButton = document.getElementById('saveAsExample');
    const templateSelect = document.getElementById('templateSelect');
    const themeToggle = document.getElementById('themeToggle');
    
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
        
        const templates = getTemplates();
        templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.response;
            option.textContent = template.name;
            templateSelect.appendChild(option);
        });

        templateSelect.addEventListener('change', function() {
            if (this.value) {
                suggestedResponseDiv.textContent = this.value;
                suggestedResponseDiv.style.display = 'block';
                createDraftButton.style.display = 'block';
            } else {
                suggestedResponseDiv.textContent = '';
                suggestedResponseDiv.style.display = 'none';
                createDraftButton.style.display = 'none';
            }
        });

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
                createDraftButton.style.display = 'block';
                saveAsExampleButton.style.display = 'block';
            } catch (error) {
                showError('Error generating response: ' + error.message);
            } finally {
                hideLoader();
            }
        });

        createDraftButton.addEventListener('click', function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: "createDraft",
                        response: suggestedResponseDiv.textContent
                    },
                    function(response) {
                        if (chrome.runtime.lastError) {
                            showError("Error: Please refresh the Gmail page and try again.");
                            return;
                        }
                        if (response && response.success) {
                            window.close();
                        }
                    }
                );
            });
        });

        saveAsExampleButton.addEventListener('click', function() {
            addResponseExample(currentEmailData, suggestedResponseDiv.textContent);
            showError('Response saved as example!');
            saveAsExampleButton.style.display = 'none';
        });

        initializeTheme();

        themeToggle.addEventListener('click', function() {
            chrome.storage.local.get(['theme'], function(result) {
                const currentTheme = result.theme || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
            });
        });
    } catch (error) {
        showError('Failed to initialize: ' + error.message);
    }
});

async function generateEmailResponse(emailData, config) {
    const prompt = `Please write a professional response to this email:
    
From: ${emailData.sender}
Subject: ${emailData.subject}
Content: ${emailData.content}

Please write a concise and professional response that:
1. Is properly formatted for Gmail
2. Uses appropriate line breaks and spacing
3. Includes a professional greeting
4. Has a clear signature line at the end
5. Maintains proper paragraph spacing
6. Does not include any markdown or special formatting characters

Format the response exactly as it should appear in Gmail, with no additional instructions or explanations.`;

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
                system: "You are a professional email writer. Format responses in a clean, Gmail-compatible style with appropriate spacing and line breaks. Do not include any special formatting or markdown."
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