
let currentPokemon;
let pokemonType;
let currentPokemonID = 1;
let progressValue = 50;

async function loadPokemon(){
    let url = `https://pokeapi.co/api/v2/pokemon/${currentPokemonID}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    renderPokedex();
}


async function renderPokedex(){
    let pokedexContainer = document.getElementById('pokedex');
    const pokemonCards = document.querySelectorAll('.pokemonCard');
    if (currentPokemonID < 152) {
        let url = `https://pokeapi.co/api/v2/pokemon/${currentPokemonID}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        pokedexContainer.innerHTML += pokemonCardHTML(currentPokemonID);
        currentPokemonID++;
        changeColor(`pokemonCard${currentPokemonID - 1}`);
        loadPokemon();
    } else {
        pokemonCards.forEach((pokemonCard) => {
            pokemonCard.addEventListener('mouseenter', () => {
                pokemonCard.style.boxShadow = '0 0 11px rgba(99, 99, 99, .8)';
            });
            pokemonCard.addEventListener('mouseleave', () => {
                pokemonCard.style.boxShadow = 'none';
            });
        });
    } 
}


function pokemonCardHTML(i){
    let secondCardTypeHTML = '';
    let imgSrc = currentPokemon['sprites']['other']['official-artwork']['front_default']
    if (typeof currentPokemon['types'][1] !== 'undefined') {
        secondCardTypeHTML = `<div class="pokemonType cardType" id="secondCardType">${currentPokemon['types'][1]['type']['name'].charAt(0).toUpperCase() + currentPokemon['types'][1]['type']['name'].slice(1)}</div>`;
    }
    return `
        <div id="pokemonCard${i}" class="pokemonCard" onclick="openPokemonCard(${i})">
            <h3 class="cardHeader">${currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1)}</h3>
            <div class="pokemonType cardType">${currentPokemon['types'][0]['type']['name'].charAt(0).toUpperCase() + currentPokemon['types'][0]['type']['name'].slice(1)}</div>
            ${secondCardTypeHTML}
            <img src="${imgSrc}" class="pokemonImg">
            <img src="img/pokeball.png" class="pokemonImgBackground">
        </div>
    `;
}


async function openPokemonCard(i) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    changeColor('pokedexCard');
    renderPokemonInfo();
    renderAbout();
    renderStats();
    displayLayer();
    renderAbilities(i);
    getDesciption(i);
}
  
 
function displayLayer(){
    let pokedexCard = document.getElementById('pokedexCard');
    let layer = document.getElementById('layer');
    pokedexCard.style.display = 'block';
    layer.style.display = 'block';
    if (window.innerWidth >= 701) {
        layer.addEventListener('click', (event) => {
          if (event.target === layer) {
            closePokemonCard();
          }
        });
    }
}


function closePokemonCard() {
    let pokedexCard = document.getElementById('pokedexCard');
    let layer = document.getElementById('layer');
    pokedexCard.style.display = 'none';
    layer.style.display = 'none';
    layer.removeEventListener('click', closePokemonCard);
}


function changeColor(container){
    if (currentPokemon && currentPokemon['types']) {
        pokemonType = currentPokemon['types'][0]['type']['name'];
        let color = colorMap[0][pokemonType];
        document.getElementById(container).style.backgroundColor = color;
    }
}


function renderPokemonInfo(){
    document.getElementById('pokemonName').innerHTML = currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1);
    document.getElementById('pokemonImg').src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById('pokemonNumber').innerHTML = `#` + currentPokemon['id'];
    document.getElementById('pokemonType').innerHTML = currentPokemon['types'][0]['type']['name'].charAt(0).toUpperCase() + currentPokemon['types'][0]['type']['name'].slice(1);
    secondType();
}


function showContainer(containerToShow, menuLinkToHighlight) {
    const aboutContainer = document.getElementById('aboutContainer');
    const statsContainer = document.getElementById('statsContainer');
    const abilitiesContainer = document.getElementById('abilitiesContainer');
   
    document.getElementById('menuLink1').style.fontWeight = '400';
    document.getElementById('menuLink2').style.fontWeight = '400';
    document.getElementById('menuLink3').style.fontWeight = '400';
    
    aboutContainer.style.display = 'none';
    statsContainer.style.display = 'none';
    abilitiesContainer.style.display = 'none';
  
    containerToShow.style.display = 'block'; /* display the active container */
    menuLinkToHighlight.style.fontWeight = 'bold'; /* highlight the active link */
    getSize();  
  }
  
  function renderAbout() {
    const aboutContainer = document.getElementById('aboutContainer');
    const menuLink = document.getElementById('menuLink1');
    showContainer(aboutContainer, menuLink);
  }
  
  function showStats() {
    const statsContainer = document.getElementById('statsContainer');
    const menuLink = document.getElementById('menuLink2');
    showContainer(statsContainer, menuLink);
  }
  
  function showAbilities() {
    const abilitiesContainer = document.getElementById('abilitiesContainer');
    const menuLink = document.getElementById('menuLink3');
    showContainer(abilitiesContainer, menuLink);
  }


function renderStats(){
    const stats = currentPokemon['stats'];
    renderStat('hp', stats[0]['base_stat']);
    renderStat('attack', stats[1]['base_stat']);
    renderStat('defense', stats[2]['base_stat']);
    renderStat('spAtk', stats[3]['base_stat']);
    renderStat('spDef', stats[4]['base_stat']);
    renderStat('speed', stats[5]['base_stat']);
}
  
  function renderStat(statId, baseStat) {
    const statElement = document.getElementById(statId);
    statElement.innerHTML = baseStat;
    statElement.style.width = `${(baseStat/150)*100}%`;
}
  

async function renderAbilities(i){
    let abilitiesContainer = document.getElementById('abilitiesContainer');
    abilitiesContainer.innerHTML = '';
    for (let i = 0; i < currentPokemon['abilities'].length; i++) {
        const abilityName = currentPokemon['abilities'][i]['ability']['name'];
        let url = `https://pokeapi.co/api/v2/ability/${abilityName}/`;
        let response = await fetch(url);
        let abilityDescriptionContainer = await response.json();
        const abilityDescription = abilityDescriptionContainer['effect_entries'][1]['short_effect']
        abilitiesContainer.innerHTML += abilitiesHTML(abilityName, abilityDescription);
    }
}


function abilitiesHTML(abilityName, abilityDescription){
    return `
        <div class="ability-container">
            <div id="abilityName"><b>${abilityName.charAt(0).toUpperCase() + abilityName.slice(1)}</b></div>
            <div id="abilityDescription">${abilityDescription}</div>
        </div>
    `;
} 


function getSize(){
    let height = currentPokemon['height']
    document.getElementById('height').innerHTML = (height / 10) + ' Meter';
    let weight = currentPokemon['weight'];
    document.getElementById('weight').innerHTML = (weight / 10) + ' KG';
}


async function getDesciption(id){
    let url = `https://pokeapi.co/api/v2/pokemon-species/${id}`
    let response = await fetch(url)
    let speciesInfo = await response.json();
    document.getElementById('description').innerHTML = speciesInfo['flavor_text_entries'][9]['flavor_text'];
}


function secondType(){
    if (currentPokemon['types'][1]) {
        document.getElementById('pokemonSecondType').innerHTML = currentPokemon['types'][1]['type']['name'].charAt(0).toUpperCase() + currentPokemon['types'][1]['type']['name'].slice(1);
    } else {
        document.getElementById('pokemonSecondType').style.display = 'none';
    }
}


function secondCardType(){
    if (currentPokemon['types'][1]) {
        return currentPokemon['types'][1]['type']['name'].charAt(0).toUpperCase() + currentPokemon['types'][1]['type']['name'].slice(1)
    } 
}

