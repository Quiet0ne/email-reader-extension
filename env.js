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
        
        return config;
    } catch (error) {
        console.error('Error loading environment config:', error);
        throw error;
    }
}

export default loadEnvironmentConfig; 