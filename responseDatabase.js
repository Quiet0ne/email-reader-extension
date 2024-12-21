const responseExamples = [
    {
        name: "Project Meeting Acceptance",
        context: {
            sender: "example@company.com",
            subject: "Project Update Meeting",
            content: "Hi, would you be available for a project status update meeting next week?",
            response: "Hi [Name],\n\nThank you for reaching out. Yes, I would be happy to join the project status update meeting next week.\n\nPlease let me know what times work best for you, and I'll check my calendar.\n\nBest regards,\n Wojciech Kleszcz"
        }
    },
    {
        name: "SUCCES WPŁATA",
        context: {
            sender: "example@company.com",
            subject: "SUCCES WPŁATA",
            content: "Dzień dobry, w załączniku potwierdzenie wpłaty",
            response: "Dzień dobry, \n\nOdnotowaliśmy Państwa wpłatę. Powiadomienie o opłacie powinno zniknąć w ciągu kilkunastu minut. W razie pytań pozostajemy do dyspozycji :) \n\nMasz pytanie związane z fakturą? Kliknij tutaj i znajdź odpowiedź -> Faktury FAQ \n\nSerdecznie pozdrawiamy i cieszymy się że są Państwo z nami, \n\nWojciech Kleszcz \n\nBilling Specialist \n\ntel.: +48 694 830 608 \nwww.livekid.com"
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