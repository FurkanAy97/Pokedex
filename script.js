
let currentPokemon;
let speciesInfo
let pokemonType;
let currentPokemonID = 1;

async function loadPokemon(){
    let url = `https://pokeapi.co/api/v2/pokemon/${currentPokemonID}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    renderPokedex();
}


async function renderPokedex(){
    let pokedexContainer = document.getElementById('pokedex');
    let loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'block'; // show the loading screen
    if (currentPokemonID < 151) {
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
    displayLayer();
}
  
 

  
  
function displayLayer(){
    let pokedexCard = document.getElementById('pokedexCard');
    let layer = document.getElementById('layer');
    pokedexCard.style.display = 'block';
    layer.style.display = 'block';
    layer.addEventListener('click', (event) => {
      if (event.target === layer) {
        closePokemonCard();
      }
    });
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
    let height = currentPokemon['height']
    document.getElementById('height').innerHTML = (height / 10) + ' Meter';
    let weight = currentPokemon['weight'];
    document.getElementById('weight').innerHTML = (weight / 10) + ' KG';
    getDesciption(i)
}


async function getDesciption(id){
    let url = `https://pokeapi.co/api/v2/pokemon-species/${id}`
    let response = await fetch(url)
    speciesInfo = await response.json();
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

