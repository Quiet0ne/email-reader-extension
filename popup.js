// When popup opens, get the current tab and request email content
document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getEmailContent"}, function(response) {
            const emailContentElement = document.getElementById('emailContent');
            
            if (chrome.runtime.lastError) {
                emailContentElement.textContent = "Error: Please refresh the Gmail page and try again.";
                return;
            }

            if (response) {
                let formattedContent = `Sender: ${response.sender}\n`;
                if (response.cc) {
                    formattedContent += `CC: ${response.cc}\n`;
                }
                formattedContent += `Subject: ${response.subject}\n`;
                formattedContent += `Content:\n${response.content}`;
                
                emailContentElement.textContent = formattedContent;
            } else {
                emailContentElement.textContent = 
                    "Please make sure you're on Gmail and have an email open.";
            }
        });
    });
});