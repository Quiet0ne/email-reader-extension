// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getEmailContent") {
      // Get the email content from Gmail's interface
      const emailContent = document.querySelector('div[role="main"] div[data-message-id]');
      
      if (emailContent) {
        // Send back the text content
        sendResponse({ content: emailContent.textContent.trim() });
      } else {
        sendResponse({ content: "No email content found. Please make sure you're viewing an email." });
      }
    }
    return true; // Required for async response
  });