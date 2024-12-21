# Gmail Email Reader with Claude AI Response Generator

## Overview
A Chrome/Brave browser extension that reads Gmail email content and generates AI-powered response suggestions using Claude API.

CONFIGURE THE .env FILE WITH YOUR CLAUDE_API_KEY BEFORE RUNNING THE PROJECT PLEASE.

## Technical Architecture

### Core Components

1. **Popup Interface** (`popup.html`, `popup.js`)
   - Mainrface for the extension
  - Handles email content display and AI response generation
  - Reference: 
  ```html:email-reader-extension/popup.html
  startLine: 1
  endLine: 89
  ```
2. **Content Script** (`content.js`)
  - Extracts email data from Gmail interface
  - Handles DOM manipulation and data cleaning
  - Reference:
  ```javascript:email-reader-extension/content.js
  startLine: 1
  endLine: 52
  ```
3. **Configuration Management** (`config.js`, `env.js`)
  - Manages API configuration and environment variables
  - Securely loads API keys from .env file
  - Reference:
  ```javascript:email-reader-extension/config.js
  startLine: 1
  endLine: 18
  ```
### Key Features
1. **Email Content Extraction**
  - Extracts sender, CC, subject, and content
  - Cleans HTML formatting and preserves special characters
  - Removes images and signatures
2. **Claude API Integration**
  - Direct browser-to-API communication
  - Handles authentication and error states
  - Generates contextual email responses
3. **User Interface**
  - Loading states and error handling
  - Responsive design
  - Clear content presentation
## Technical Implementation Details
### Environment Configuration
 Uses .env file for API key storage
 Implements secure environment variable loading
 Gitignore protection for sensitive data
### API Communication