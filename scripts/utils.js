// utils.js

import { speciesList, industryList, villageNamesList } from './dataLoader.js';
import { characterList, characterTraits, physicalTraits } from './characterLoader.js';

export function generateVillage() {
    try {
        // Show spinner
        document.getElementById('spinner').style.display = 'block';

        const speciesSelect = document.getElementById('species');
        const industrySelect = document.getElementById('industry');
        const language = document.getElementById('language').value;

        let selectedSpecies = speciesSelect.value;
        let selectedIndustry = industrySelect.value;

        if (selectedSpecies === 'random') {
            if (speciesList.length === 0) {
                alert('No species data available.');
                document.getElementById('spinner').style.display = 'none';
                return;
            }
            selectedSpecies = speciesList[Math.floor(Math.random() * speciesList.length)]['en'];
        }

        if (selectedIndustry === 'random') {
            if (industryList.length === 0) {
                alert('No industry data available.');
                document.getElementById('spinner').style.display = 'none';
                return;
            }
            selectedIndustry = industryList[Math.floor(Math.random() * industryList.length)]['en'];
        }

        const inhabitants = Math.floor(Math.random() * 1000) + 50;
        const villageName = getVillageName(language);

        const speciesName = getSpeciesName(selectedSpecies, language);
        const industryName = getIndustryName(selectedIndustry, language);

        // Generate notable personalities
        const notablePersonalities = getNotablePersonalities(language);

        // Generate the full village details
        let detailsText = generateVillageDetails(
            villageName,
            speciesName,
            industryName,
            inhabitants,
            notablePersonalities,
            language
        );

        // Update the UI
        document.getElementById('village-name').textContent = villageName;
        document.getElementById('village-details').textContent = detailsText;

        // Hide spinner
        document.getElementById('spinner').style.display = 'none';
    } catch (error) {
        console.error('Error generating village:', error);
        alert('An error occurred while generating the village.');
        document.getElementById('spinner').style.display = 'none';
    }
}

function getSpeciesName(speciesEnName, language) {
    const speciesItem = speciesList.find(item => item['en'] === speciesEnName);
    if (!speciesItem) {
        console.error('Species not found:', speciesEnName);
        return 'Unknown';
    }
    return speciesItem[language] || speciesItem['en'] || 'Unknown';
}

function getIndustryName(industryEnName, language) {
    const industryItem = industryList.find(item => item['en'] === industryEnName);
    if (!industryItem) {
        console.error('Industry not found:', industryEnName);
        return 'Unknown';
    }
    return industryItem[language] || industryItem['en'] || 'Unknown';
}

function getVillageName(language) {
    if (villageNamesList.length === 0) {
        alert('No village names available.');
        return language === 'de' ? 'Unbekanntes Dorf' : 'Unknown Village';
    }

    const randomIndex = Math.floor(Math.random() * villageNamesList.length);
    const villageItem = villageNamesList[randomIndex];
    return villageItem[language] || villageItem['en'] || (language === 'de' ? 'Unbekanntes Dorf' : 'Unknown Village');
}

function getNotablePersonalities(language) {
    if (characterList.length === 0) {
        return '';
    }

    // Randomly select 2 characters
    const selectedCharacters = characterList.sort(() => 0.5 - Math.random()).slice(0, 2);
    let personalitiesText = language === 'de' ? 'Bekannte Persönlichkeiten:\n' : 'Notable Personalities:\n';

    selectedCharacters.forEach(character => {
        // Determine gender based on weighted chances
        const gender = selectGender(character.genderChances);

        // Get role name adjusted for gender
        const role = getRoleName(character.role, gender, language);

        const roleDescription = character.description[language] || character.description['en'] || '';

        // Assign random character trait
        const trait = getRandomTrait(language);

        // Assign random physical trait
        const physicalTrait = getRandomPhysicalTrait(language);

        // Construct the description
        let characterDescription = '';
        if (language === 'de') {
            let article = gender === 'female' ? 'Eine' : 'Ein';
            let adjectiveEnding = gender === 'female' ? 'e' : 'er';

            characterDescription = `${role}: ${article} ${trait}${adjectiveEnding} Person, die ${physicalTrait}. ${roleDescription}`;
        } else {
            let pronoun = 'who';
            characterDescription = `${role}: A ${trait} individual ${pronoun} ${physicalTrait}. ${roleDescription}`;
        }

        personalitiesText += `- ${characterDescription}\n`;
    });
    return personalitiesText;
}

function selectGender(genderChances) {
    const totalChance = genderChances.male + genderChances.female + genderChances.unspecified;
    const randomValue = Math.random() * totalChance;
    if (randomValue < genderChances.male) {
        return 'male';
    } else if (randomValue < genderChances.male + genderChances.female) {
        return 'female';
    } else {
        return 'unspecified';
    }
}

function getRoleName(roleNames, gender, language) {
    let roleName = roleNames[language] || roleNames['en'] || 'Unknown Role';

    if (language === 'de') {
        // Adjust role name for gender in German
        if (gender === 'female') {
            // If the role name includes both forms separated by '/'
            const parts = roleName.split('/');
            if (parts.length > 1) {
                roleName = parts[1]; // Use the female form
            } else if (!roleName.endsWith('in')) {
                roleName += 'in';
            }
        } else if (gender === 'male') {
            const parts = roleName.split('/');
            if (parts.length > 1) {
                roleName = parts[0]; // Use the male form
            }
            // Else, keep the roleName as is
        }
        // For 'unspecified' or other, we can use the default roleName
    }

    // For English and other languages, no adjustment needed
    return roleName;
}

function getRandomTrait(language) {
    if (characterTraits.length === 0) {
        return '';
    }
    const randomTrait = characterTraits[Math.floor(Math.random() * characterTraits.length)];
    const traitName = randomTrait.names[language] || randomTrait.names['en'] || '';
    return traitName;
}

function getRandomPhysicalTrait(language) {
    if (physicalTraits.length === 0) {
        return '';
    }
    const randomTrait = physicalTraits[Math.floor(Math.random() * physicalTraits.length)];
    const traitDescription = randomTrait.descriptions[language] || randomTrait.descriptions['en'] || '';
    return traitDescription;
}

function generateVillageDetails(villageName, speciesName, industryName, inhabitants, notablePersonalities, language) {
    let detailsText = '';
    if (language === 'de') {
        detailsText = `Das Dorf ${villageName} wird hauptsächlich von ${speciesName} bewohnt und seine Hauptindustrie ist ${industryName}. Es hat ungefähr ${inhabitants} Einwohner.`;
    } else {
        detailsText = `The village of ${villageName} is primarily inhabited by ${speciesName}, and its main industry is ${industryName}. It has a population of approximately ${inhabitants} inhabitants.`;
    }
    // Add notable personalities
    if (notablePersonalities) {
        detailsText += `\n\n${notablePersonalities}`;
    }
    return detailsText;
}