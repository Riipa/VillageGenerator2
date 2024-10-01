// characterLoader.js

export let characterList = [];
export let characterTraits = [];
export let physicalTraits = [];

export function loadCharacterData() {
    return Promise.all([
        loadXML('../data/characters.xml', populateCharacters),
        loadXML('../data/characterTraits.xml', populateCharacterTraits),
        loadXML('../data/physicalTraits.xml', populatePhysicalTraits)
    ]);
}

// Function to load and parse XML files
function loadXML(filename, callback) {
    return fetch(filename)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} while loading ${filename}`);
            }
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "application/xml");
            const parserErrors = xml.getElementsByTagName("parsererror");
            if (parserErrors.length > 0) {
                throw new Error(`Error parsing XML file: ${filename}`);
            }
            callback(xml);
        })
        .catch(error => {
            console.error(`Error loading ${filename}:`, error);
            alert(`An error occurred while loading ${filename}: ${error.message}`);
            throw error;
        });
}

// Function to process character data
function populateCharacters(xml) {
    try {
        const characters = xml.getElementsByTagName('character');
        characterList.length = 0; // Clear the array
        for (let i = 0; i < characters.length; i++) {
            const character = {};
            // Process role
            const roleNames = characters[i].getElementsByTagName('role')[0].getElementsByTagName('name');
            character.role = {};
            for (let j = 0; j < roleNames.length; j++) {
                const lang = roleNames[j].getAttribute('lang');
                character.role[lang] = roleNames[j].textContent;
            }

            // Process gender chances
            const gendersElement = characters[i].getElementsByTagName('genders')[0];
            character.genderChances = {};
            if (gendersElement) {
                const maleChance = gendersElement.getElementsByTagName('maleChance')[0];
                const femaleChance = gendersElement.getElementsByTagName('femaleChance')[0];
                const unspecifiedChance = gendersElement.getElementsByTagName('unspecifiedChance')[0];

                character.genderChances.male = maleChance ? parseInt(maleChance.textContent) : 0;
                character.genderChances.female = femaleChance ? parseInt(femaleChance.textContent) : 0;
                character.genderChances.unspecified = unspecifiedChance ? parseInt(unspecifiedChance.textContent) : 0;
            } else {
                // Default chances if not specified
                character.genderChances = { male: 50, female: 50, unspecified: 0 };
            }

            // Process description
            const descriptions = characters[i].getElementsByTagName('description')[0].getElementsByTagName('text');
            character.description = {};
            for (let j = 0; j < descriptions.length; j++) {
                const lang = descriptions[j].getAttribute('lang');
                character.description[lang] = descriptions[j].textContent;
            }
            characterList.push(character);
        }
    } catch (error) {
        console.error('Error processing character data:', error);
        alert('An error occurred while processing character data.');
        throw error;
    }
}

// Function to process character traits
function populateCharacterTraits(xml) {
    try {
        characterTraits.length = 0; // Clear the array
        const positiveTraits = xml.getElementsByTagName('positiveTraits')[0].getElementsByTagName('trait');
        const negativeTraits = xml.getElementsByTagName('negativeTraits')[0].getElementsByTagName('trait');

        // Process positive traits
        for (let i = 0; i < positiveTraits.length; i++) {
            const trait = {};
            const names = positiveTraits[i].getElementsByTagName('name');
            trait.type = 'positive';
            trait.names = {};
            for (let j = 0; j < names.length; j++) {
                const lang = names[j].getAttribute('lang');
                trait.names[lang] = names[j].textContent;
            }
            characterTraits.push(trait);
        }

        // Process negative traits
        for (let i = 0; i < negativeTraits.length; i++) {
            const trait = {};
            const names = negativeTraits[i].getElementsByTagName('name');
            trait.type = 'negative';
            trait.names = {};
            for (let j = 0; j < names.length; j++) {
                const lang = names[j].getAttribute('lang');
                trait.names[lang] = names[j].textContent;
            }
            characterTraits.push(trait);
        }
    } catch (error) {
        console.error('Error processing character traits:', error);
        alert('An error occurred while processing character traits.');
        throw error;
    }
}

// Function to process physical traits
function populatePhysicalTraits(xml) {
    try {
        physicalTraits.length = 0; // Clear the array
        const traits = xml.getElementsByTagName('trait');
        for (let i = 0; i < traits.length; i++) {
            const trait = {};
            const descriptions = traits[i].getElementsByTagName('description');
            trait.descriptions = {};
            for (let j = 0; j < descriptions.length; j++) {
                const lang = descriptions[j].getAttribute('lang');
                trait.descriptions[lang] = descriptions[j].textContent;
            }
            physicalTraits.push(trait);
        }
    } catch (error) {
        console.error('Error processing physical traits:', error);
        alert('An error occurred while processing physical traits.');
        throw error;
    }
}