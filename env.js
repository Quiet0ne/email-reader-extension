async function loadEnvironmentConfig() {
    try {
        const response = await fetch(chrome.runtime.getURL('.env'));
        const text = await response.text();
        
        // Parse the .env file
        const config = {};
        text.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                config[key.trim()] = value.trim();
            }
        });
        
        // Add Google client ID from manifest
        config.GOOGLE_CLIENT_ID = '383687008437-jn2hr3356l9bn1l33bsfb63a2jc5mdl5.apps.googleusercontent.com';
        
        return config;
    } catch (error) {
        console.error('Error loading environment config:', error);
        throw error;
    }
}

export default loadEnvironmentConfig; 