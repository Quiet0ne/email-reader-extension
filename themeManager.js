const themes = {
    light: {
        background: '#ffffff',
        text: '#000000',
        border: '#e0e0e0',
        buttonPrimary: '#4285f4',
        buttonSecondary: '#34A853',
        buttonWarning: '#fbbc04',
        error: '#d93025',
        cardBackground: '#f8f9fa'
    },
    dark: {
        background: '#202124',
        text: '#ffffff',
        border: '#5f6368',
        buttonPrimary: '#8ab4f8',
        buttonSecondary: '#81c995',
        buttonWarning: '#fdd663',
        error: '#f28b82',
        cardBackground: '#303134'
    }
};

export function setTheme(themeName) {
    const theme = themes[themeName];
    document.documentElement.style.setProperty('--background-color', theme.background);
    document.documentElement.style.setProperty('--text-color', theme.text);
    document.documentElement.style.setProperty('--border-color', theme.border);
    document.documentElement.style.setProperty('--button-primary', theme.buttonPrimary);
    document.documentElement.style.setProperty('--button-secondary', theme.buttonSecondary);
    document.documentElement.style.setProperty('--button-warning', theme.buttonWarning);
    document.documentElement.style.setProperty('--error-color', theme.error);
    document.documentElement.style.setProperty('--card-background', theme.cardBackground);
    
    // Update theme toggle icon
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = `<span style="font-size: 16px;">${themeName === 'light' ? '☀️' : '🌙'}</span>`;
    }
    
    // Save theme preference
    chrome.storage.local.set({ theme: themeName });
}

export function initializeTheme() {
    chrome.storage.local.get(['theme'], function(result) {
        const savedTheme = result.theme || 'light';
        setTheme(savedTheme);
    });
} 