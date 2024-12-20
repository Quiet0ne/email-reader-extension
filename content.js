// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getEmailContent") {
        const emailData = {
            sender: getSender(),
            cc: getCC(),
            subject: getSubject(),
            content: getCleanContent()
        };
        
        sendResponse(emailData);
        return true;
    }
});

function getSender() {
    const senderElement = document.querySelector('span[email]');
    return senderElement ? senderElement.getAttribute('email') : 'No sender found';
}

function getCC() {
    const ccElements = document.querySelectorAll('.aXjCH [email]');
    if (ccElements.length === 0) return null;
    return Array.from(ccElements).map(el => el.getAttribute('email')).join(', ');
}

function getSubject() {
    const subjectElement = document.querySelector('h2.hP');
    return subjectElement ? subjectElement.textContent : 'No subject found';
}

function getCleanContent() {
    const contentElement = document.querySelector('div[role="main"] .a3s.aiL');
    if (!contentElement) return 'No content found';

    // Create a clone to work with
    let cleanContent = contentElement.cloneNode(true);
    
    // Remove images and their containers
    const images = cleanContent.querySelectorAll('img, .gmail_signature');
    images.forEach(img => img.remove());
    
    // Convert HTML to plain text while preserving Polish characters
    let text = cleanContent.innerText;
    
    // Clean up extra whitespace and normalize line breaks
    text = text.replace(/\s+/g, ' ')
              .replace(/\n\s*\n/g, '\n\n')
              .trim();
    
    return text;
}