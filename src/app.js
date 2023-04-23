import axios from "axios";

// performs 1 API call before storing the result in countriesPromise
async function buildLocalCache() {
    try {
       return (await axios.get('https://restcountries.com/v3.1/all')).data;
    } catch (e) {
        console.log(e);
    }
}

async function fetchCountry(requestedCountry) {
    // receives the promise from the cache
    const countryArray = await countriesPromise
    // loops through seeking out the requested country and returns its object
    for (let i = 0; i < countryArray.length; i++) {
        if (countryArray[i].name.common === requestedCountry) {
            return countryArray[i]
        }
    }
}

async function constructCountryTile(country) {
    // fills the array with countries from the promise
    const fetchedCountry = await fetchCountry(country)
    // destructures the needed components from the requested country
    const { name: {common: commonName},  flags: {png: flagPng, alt} ,  region, population }
        = await fetchedCountry;
    
    // creates a bunch of html elements for all the info to be stored in
    const countryTile = document.createElement('div')
    const countryName = document.createElement('h3')
    const flagWrapper = document.createElement('div')
    const countryFlag = document.createElement('img')
    const nameFlagContainer = document.createElement('div')
    const countryPopulation = document.createElement('p')

    // fills the elements
    countryName.textContent = commonName
    countryPopulation.textContent = `Has a population of ${population} people`
    // sets the source and the alt for the flag
    countryFlag.setAttribute('src', flagPng)
    countryFlag.setAttribute('alt', alt)

    // sets classes for styling
    countryTile.setAttribute('class', 'country-tile')
    countryName.setAttribute('class', `country-name ${region.toLowerCase()}`)
    flagWrapper.setAttribute('class', 'flag-wrapper')
    countryFlag.setAttribute('class', 'flag')
    nameFlagContainer.setAttribute('class', 'name-container')
    countryPopulation.setAttribute('class', population)

    // fills the wrappers and containers with the elements
    flagWrapper.appendChild(countryFlag)
    nameFlagContainer.appendChild(flagWrapper)
    nameFlagContainer.appendChild(countryName)
    // fills the tile div with the elements and containers
    countryTile.appendChild(nameFlagContainer)
    countryTile.appendChild(countryPopulation)
    // gets the location it needs to be output too
    const countryTileContainer = document.getElementById('countries')
    // appends the tile to the container with all countries
    countryTileContainer.appendChild(countryTile)


}

async function displayAllCountriesSorted(promise) {
    // fills the array with countries from the promise
    const countryArray = await promise
    countryArray.sort((a, b) => {
        return b.population - a.population
    })
    countryArray.forEach((country) => {
        let { common: countryName } =  country.name
        constructCountryTile(countryName)
    })
}

// makes a single api call storing the returned promise in a variable
const countriesPromise = buildLocalCache()
// const test = fetchCountry('Albania')
displayAllCountriesSorted(countriesPromise)
