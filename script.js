
let currentPokemon;
let pokemonType;
let currentPokemonID = 1;
let progressValue = 50;

async function loadPokemon(){
    let url = `https://pokeapi.co/api/v2/pokemon/${currentPokemonID}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    renderPokedex();
    console.log(currentPokemon);
}


async function renderPokedex(){
    let pokedexContainer = document.getElementById('pokedex');
    let loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'block'; // show the loading screen
    if (currentPokemonID < 50) {
        let url = `https://pokeapi.co/api/v2/pokemon/${currentPokemonID}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        pokedexContainer.innerHTML += pokemonCardHTML(currentPokemonID);
        currentPokemonID++;
        changeCardColor(currentPokemonID);
        loadPokemon();
    } else {
        loadingScreen.style.display = 'none'; // hide the loading screen
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
    changeColor();
    renderPokemonInfo();
    await renderAbout(i);
    renderStats();
    displayLayer();
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


function changeColor(){
    pokemonType = currentPokemon['types'][0]['type']['name'];
    let color = colorMap[0][pokemonType];
    document.getElementById('pokedexCard').style.backgroundColor = color;
}


function changeCardColor(currentPokemonID){
    pokemonType = currentPokemon['types'][0]['type']['name'];
    let color = colorMap[0][pokemonType];
    document.getElementById(`pokemonCard${currentPokemonID - 1}`).style.backgroundColor = color;
}


function renderPokemonInfo(){
    document.getElementById('pokemonName').innerHTML = currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1);
    document.getElementById('pokemonImg').src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById('pokemonNumber').innerHTML = `#` + currentPokemon['id'];
    document.getElementById('pokemonType').innerHTML = currentPokemon['types'][0]['type']['name'].charAt(0).toUpperCase() + currentPokemon['types'][0]['type']['name'].slice(1);
    secondType();
}


async function renderAbout(i){
    let aboutContainer = document.getElementById('aboutContainer');
    let statsContainer = document.getElementById('statsContainer');
    let evolutionsContainer = document.getElementById('evolutionsContainer');
    document.getElementById('menuLink1').style.fontWeight = 'bold'
    document.getElementById('menuLink2').style.fontWeight = '400'
    document.getElementById('menuLink3').style.fontWeight = '400'
    aboutContainer.style.display = 'block';
    statsContainer.style.display = 'none';
    evolutionsContainer.style.display = 'none';
    getSize();
    getDesciption(i);
}


function showStats(){
    let aboutContainer = document.getElementById('aboutContainer');
    let statsContainer = document.getElementById('statsContainer');
    let evolutionsContainer = document.getElementById('evolutionsContainer');
    document.getElementById('menuLink1').style.fontWeight = '400'
    document.getElementById('menuLink2').style.fontWeight = 'bold'
    document.getElementById('menuLink3').style.fontWeight = '400'
    aboutContainer.style.display = 'none';
    statsContainer.style.display = 'block';
    evolutionsContainer.style.display = 'none';
}


function showEvolutions(){
    let aboutContainer = document.getElementById('aboutContainer');
    let statsContainer = document.getElementById('statsContainer');
    let evolutionsContainer = document.getElementById('evolutionsContainer');
    document.getElementById('menuLink1').style.fontWeight = '400'
    document.getElementById('menuLink2').style.fontWeight = '400'
    document.getElementById('menuLink3').style.fontWeight = 'bold'
    aboutContainer.style.display = 'none';
    statsContainer.style.display = 'none';
    evolutionsContainer.style.display = 'block';
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

