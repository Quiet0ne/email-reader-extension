// When popup opens, get the current tab and request email content
document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "getEmailContent"}, function(response) {
        if (response && response.content) {
          document.getElementById('emailContent').textContent = response.content;
        } else {
          document.getElementById('emailContent').textContent = 
            "Couldn't get email content. Make sure you're on Gmail and viewing an email.";
        }
      });
    });
  });