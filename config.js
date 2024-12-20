import loadEnvironmentConfig from './env.js';

const CONFIG = {
    CLAUDE_API_URL: 'https://api.anthropic.com/v1/messages'
};

export async function initializeConfig() {
    try {
        const envConfig = await loadEnvironmentConfig();
        CONFIG.CLAUDE_API_KEY = envConfig.CLAUDE_API_KEY;
        return CONFIG;
    } catch (error) {
        console.error('Failed to initialize config:', error);
        throw error;
    }
}

export default CONFIG; 