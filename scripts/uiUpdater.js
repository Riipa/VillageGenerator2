// uiUpdater.js

export const supportedLanguages = ['en', 'de'];

import { speciesList, industryList, interfaceTexts } from './dataLoader.js';

export function updateLanguage() {
    const language = document.getElementById('language').value;
    console.log('Selected language:', language);

    // Update interface texts
    try {
        document.getElementById('title').textContent = interfaceTexts['title'][language] || 'Village Generator';
        document.querySelector('label[for="language"]').innerHTML = `<i class="fas fa-language"></i> ${interfaceTexts['languageLabel'][language] || 'Language:'}`;
        document.querySelector('label[for="species"]').innerHTML = `<i class="fas fa-users"></i> ${interfaceTexts['speciesLabel'][language] || 'Majority Species:'}`;
        document.querySelector('label[for="industry"]').innerHTML = `<i class="fas fa-industry"></i> ${interfaceTexts['industryLabel'][language] || 'Main Industry:'}`;
        document.getElementById('generate').textContent = interfaceTexts['generateButton'][language] || 'Generate Village';
    } catch (error) {
        console.error('Error updating interface texts:', error);
        alert('An error occurred while updating interface texts.');
    }

    // Update options in dropdown menus
    updateSpeciesOptions();
    updateIndustryOptions();
}

function updateSpeciesOptions() {
    const language = document.getElementById('language').value;
    const speciesSelect = document.getElementById('species');

    // Remove all options
    speciesSelect.options.length = 0;

    // Placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.value = 'random';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    placeholderOption.textContent = interfaceTexts['placeholderOption'][language] || 'Please select or Randomize';
    speciesSelect.appendChild(placeholderOption);

    // 'Randomize' option
    const randomOption = document.createElement('option');
    randomOption.value = 'random';
    randomOption.textContent = interfaceTexts['randomOption'][language] || 'Randomize';
    speciesSelect.appendChild(randomOption);

    if (speciesList.length === 0) {
        alert('No species data available.');
        return;
    }

    console.log('Species List Length:', speciesList.length);

    speciesList.forEach((speciesItem, index) => {
        console.log(`speciesItem at index ${index}:`, speciesItem);

        if (!speciesItem) {
            console.error(`speciesItem at index ${index} is undefined or null.`);
            return; // Skip this iteration
        }

        const speciesName = speciesItem[language];
        console.log(`speciesItem[${language}] at index ${index}:`, speciesName);

        if (!speciesName) {
            console.error(`speciesItem[${language}] at index ${index} is undefined.`);
        }

        const option = document.createElement('option');
        option.value = speciesItem['en'] || 'unknown'; // Use English name as value or 'unknown'
        option.textContent = speciesItem[language] || speciesItem['en'] || 'Unknown';
        speciesSelect.appendChild(option);
    });
}




function updateIndustryOptions() {
    const language = document.getElementById('language').value;
    const industrySelect = document.getElementById('industry');

    // Remove all options
    industrySelect.options.length = 0;

    // Placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.value = 'random';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    placeholderOption.textContent = interfaceTexts['placeholderOption'][language] || 'Please select or Randomize';
    industrySelect.appendChild(placeholderOption);

    // 'Randomize' option
    const randomOption = document.createElement('option');
    randomOption.value = 'random';
    randomOption.textContent = interfaceTexts['randomOption'][language] || 'Randomize';
    industrySelect.appendChild(randomOption);

    if (industryList.length === 0) {
        alert('No industry data available.');
        return;
    }

    industryList.forEach(industryItem => {
        const option = document.createElement('option');
        option.value = industryItem['en']; // Use English name as value
        option.textContent = industryItem[language] || industryItem['en'] || 'Unknown';
        industrySelect.appendChild(option);
    });
}