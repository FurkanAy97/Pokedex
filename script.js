
let currentPokemon;
let pokemonType;

async function loadPokemon(){
    let url = `https://pokeapi.co/api/v2/pokemon/lapras`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    renderPokemonInfo();
    changeColor();
    console.log(currentPokemon);
}


function changeColor(){
    pokemonType = currentPokemon['types'][0]['type']['name'];
    let color = colorMap[0][pokemonType];
    document.getElementById('pokedex').style.backgroundColor = color;
}




function renderPokemonInfo(){
    document.getElementById('pokemonName').innerHTML = currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1);
    document.getElementById('pokemonImg').src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById('pokemonNumber').innerHTML = `#` + currentPokemon['id'];
    document.getElementById('pokemonType').innerHTML = currentPokemon['types'][0]['type']['name'].charAt(0).toUpperCase() + currentPokemon['types'][0]['type']['name'].slice(1);
    secondType();
}


function secondType(){
    if (currentPokemon['types'][1]) {
        document.getElementById('pokemonSecondType').innerHTML = currentPokemon['types'][1]['type']['name'].charAt(0).toUpperCase() + currentPokemon['types'][1]['type']['name'].slice(1);
    } else {
        document.getElementById('pokemonSecondType').style.display = 'none';
    }
}