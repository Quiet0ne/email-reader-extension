const responseExamples = [
    {
        name: "Project Meeting Acceptance",
        context: {
            sender: "example@company.com",
            subject: "Project Update Meeting",
            content: "Hi, would you be available for a project status update meeting next week?",
            response: "Hi [Name],\n\nThank you for reaching out. Yes, I would be happy to join the project status update meeting next week.\n\nPlease let me know what times work best for you, and I'll check my calendar.\n\nBest regards,\n[Your name]"
        }
    }
];

export function getTemplates() {
    return responseExamples.map(ex => ({
        name: ex.name,
        response: ex.context.response
    }));
}

export function addResponseExample(emailData, response) {
    responseExamples.push({
        context: {
            sender: emailData.sender,
            subject: emailData.subject,
            content: emailData.content,
            response: response
        }
    });
    
    // Save to chrome.storage
    chrome.storage.local.set({ 'responseExamples': responseExamples });
}

export function getResponseExamples() {
    return responseExamples;
}

// Initialize from storage
chrome.storage.local.get(['responseExamples'], function(result) {
    if (result.responseExamples) {
        responseExamples.push(...result.responseExamples);
    }
}); 