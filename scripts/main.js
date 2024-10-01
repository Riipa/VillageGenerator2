// main.js

import { loadData } from './dataLoader.js';
import { loadCharacterData } from './characterLoader.js';
import { updateLanguage } from './uiUpdater.js';
import { generateVillage } from './utils.js';
import { supportedLanguages } from './uiUpdater.js';

document.addEventListener("DOMContentLoaded", () => {
    // Load all data
    Promise.all([loadData(), loadCharacterData()])
        .then(() => {
            initializeApp();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            alert('An error occurred while loading data.');
        });
});

function initializeApp() {
    // Detect browser language
    const browserLanguage = detectBrowserLanguage();

    // Set the language in the language selector
    const languageSelect = document.getElementById('language');
    languageSelect.value = browserLanguage;

    // Update the interface with the selected language
    updateLanguage();

    // Event listeners
    document.getElementById('generate').addEventListener('click', generateVillage);
    languageSelect.addEventListener('change', updateLanguage);
}

// Function to detect browser language
function detectBrowserLanguage() {
    const defaultLanguage = 'en'; // Fallback language
    const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage];

    // Find the first supported language
    for (let lang of browserLanguages) {
        // Extract the primary language code (e.g., 'en' from 'en-US')
        const primaryLang = lang.split('-')[0];

        if (supportedLanguages.includes(primaryLang)) {
            return primaryLang;
        }
    }

    // If no supported language is found, return default
    return defaultLanguage;
}