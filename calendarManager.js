export async function authenticateWithGoogle() {
    return new Promise((resolve, reject) => {
        console.log('Starting Google authentication...');
        chrome.identity.getAuthToken({ 
            interactive: true,
            scopes: [
                "https://www.googleapis.com/auth/calendar",
                "https://www.googleapis.com/auth/calendar.events"
            ]
        }, (token) => {
            if (chrome.runtime.lastError) {
                console.error('Auth error:', chrome.runtime.lastError);
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            if (!token) {
                console.error('No token received');
                reject(new Error('Failed to get auth token'));
                return;
            }
            console.log('Authentication successful, token received');
            resolve(token);
        });
    });
}

export async function createCalendarEvent(eventDetails) {
    try {
        console.log('Starting calendar event creation with details:', {
            title: eventDetails.title,
            start: eventDetails.startDateTime,
            end: eventDetails.endDateTime
        });

        const token = await authenticateWithGoogle();
        
        const event = {
            summary: eventDetails.title,
            start: {
                dateTime: eventDetails.startDateTime,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: eventDetails.endDateTime,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            description: eventDetails.description
        };

        console.log('Sending request to Google Calendar API...');
        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            console.error('Calendar API error response:', responseData);
            throw new Error(responseData.error?.message || 'Failed to create calendar event');
        }

        console.log('Calendar event created successfully:', responseData);
        return responseData;
    } catch (error) {
        console.error('Calendar event creation error:', error);
        throw new Error(`Calendar API error: ${error.message}`);
    }
} 