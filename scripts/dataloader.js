// dataLoader.js

// Exported variables
export let speciesList = [];
export let industryList = [];
export let interfaceTexts = {};
export let villageNamesList = [];

// Data loading function

export function loadData() {
    return Promise.all([
        loadXML('../data/species.xml', populateSpecies),
        loadXML('../data/industries.xml', populateIndustries),
        loadXML('../data/interface.xml', loadInterfaceTexts),
        loadXML('../data/villagenames.xml', populateVillageNames)
    ]).then(() => {
        console.log('speciesList:', speciesList);
        console.log('industryList:', industryList);
        console.log('interfaceTexts:', interfaceTexts);
        console.log('villageNamesList:', villageNamesList);
    }).catch(error => {
        console.error('Error loading data:', error);
    });
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

// Functions to process each data type

function populateSpecies(xml) {
    try {
        const species = xml.getElementsByTagName('species');
        speciesList.length = 0; // Clear the list
        for (let i = 0; i < species.length; i++) {
            const names = species[i].getElementsByTagName('name');
            let speciesItem = {};
            for (let j = 0; j < names.length; j++) {
                const lang = names[j].getAttribute('lang');
                speciesItem[lang] = names[j].textContent;
            }
            speciesList.push(speciesItem);
        }
        console.log('Loaded species:', speciesList);
    } catch (error) {
        console.error('Error processing species data:', error);
        alert('An error occurred while processing species data.');
        throw error;
    }
}

function populateIndustries(xml) {
    try {
        const industries = xml.getElementsByTagName('industry');
        industryList.length = 0; // Clear the list
        for (let i = 0; i < industries.length; i++) {
            const names = industries[i].getElementsByTagName('name');
            let industryItem = {};
            for (let j = 0; j < names.length; j++) {
                const lang = names[j].getAttribute('lang');
                industryItem[lang] = names[j].textContent;
            }
            industryList.push(industryItem);
        }
    } catch (error) {
        console.error('Error processing industry data:', error);
        alert('An error occurred while processing industry data.');
        throw error;
    }
}

function loadInterfaceTexts(xml) {
    try {
        const texts = xml.getElementsByTagName('text');
        interfaceTexts = {}; // Clear the object
        for (let i = 0; i < texts.length; i++) {
            const id = texts[i].getAttribute('id');
            const values = texts[i].getElementsByTagName('value');
            interfaceTexts[id] = {};
            for (let j = 0; j < values.length; j++) {
                const lang = values[j].getAttribute('lang');
                interfaceTexts[id][lang] = values[j].textContent;
            }
        }
    } catch (error) {
        console.error('Error processing interface texts:', error);
        alert('An error occurred while processing interface texts.');
        throw error;
    }
}

function populateVillageNames(xml) {
    try {
        const villages = xml.getElementsByTagName('village');
        villageNamesList.length = 0; // Clear the list
        for (let i = 0; i < villages.length; i++) {
            const names = villages[i].getElementsByTagName('name');
            let villageItem = {};
            for (let j = 0; j < names.length; j++) {
                const lang = names[j].getAttribute('lang');
                villageItem[lang] = names[j].textContent;
            }
            villageNamesList.push(villageItem);
        }
    } catch (error) {
        console.error('Error processing village names:', error);
        alert('An error occurred while processing village names.');
        throw error;
    }
}