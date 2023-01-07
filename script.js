let allLoadedPokemons = [];
let filteredPokemons = [];
let noPokemonsFound = false;
let swipePokemon;
let offset = 1;
let limit = 20;
const loadingStep = 20;


window.addEventListener("resize", function () {
    let links = document.getElementById('links');
    let search = document.getElementById('search');
    let container = document.getElementById('responsive-bg');
    if (this.window.innerWidth > 750) {
        links.style.display = "block";
        search.style.display = "block";
    } else {
        links.style.display = "none";
        search.style.display = "none";
        container.style.display = 'none';
    }
})


async function init() {
    await loadPokemons();
    renderPokemonCards();
}


async function loadPokemons() {
    for (let i = offset; i <= limit; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        allLoadedPokemons.push(currentPokemon);
    }
}


async function loadMore() {
    offset = limit + 1;
    if (limit > 898) {
        limit = 898;
        setLoadMoreButtonText(false);
    } else {
        setLoadMoreButtonText(true);
    }
    limit = offset + (loadingStep - 1);
    await loadPokemons();
    renderPokemonCards();
}


function setLoadMoreButtonText(value) {
    let loadingText = document.getElementById('load');
    if (value) {
        loadingText.innerText = 'Loading...';
    } else {
        loadingText.innerText = 'All Pokemons loaded';
    }
    loadingText.classList.add('loading-text');
}


function renderPokemonCards() {
    let container = document.getElementById('card-container');
    container.innerHTML = '';
    let renderArray;
    if (filteredPokemons.length > 0 ? renderArray = filteredPokemons :  renderArray = allLoadedPokemons);  
    if (!noPokemonsFound) {
        for (let i = 0; i < renderArray.length; i++) {
            let currentPokemon = renderArray[i];
            let cssStyle = getCssStyle(currentPokemon);
            container.innerHTML += renderPokemonCardsHtmlTop(i, cssStyle, currentPokemon);
        }
        container.innerHTML += renderPokemonCardsHtmlBottom();
    }
}


function renderPokemonCardsHtmlTop(i, cssStyle, currentPokemon) {
    return /*html*/ `
    <div onclick="showDetailsCard(${i}, '${cssStyle}')" class="card ${cssStyle}">
        <span>${formattingId(currentPokemon['id'])}</span>
        <h2>${currentPokemon['name']}</h2>
        <div class="type-cont">
            ${getTypes(currentPokemon)}
        </div>  
        <img class="pokemon-image" src="${currentPokemon['sprites']['other']['home']['front_default']}">
    </div>`;
}


function renderPokemonCardsHtmlBottom() {
    return /*html*/ `
        <div id="load-more">
            <a href="#title"><img src="images/arrow-up.png" class="arrow-up"></a>
            <span id="load" class="load" onclick="loadMore()">Load more</span>
            <a id="arrow-up-right" href="#title"><img src="images/arrow-up.png" class="arrow-up"></a>
        </div>`;
}


function getTypes(currentPokemon) {
    let types = '';
    for (let i = 0; i < currentPokemon['types'].length; i++) {
        types += /*html*/ `<span class="type">${currentPokemon['types'][i]['type']['name']}</span>`;

    }
    return types;
}


function getValue(value, currentPokemon) {
    let unity;
    if (value == 'weight') {
        unity = "Kg";
    } else {
        unity = "m";
    }
    value = /*html*/ `<span class="type">${currentPokemon[value] / 10} ${unity}</span>`;
    return value;
}


function switchPokemonCard(id, direction) {
    document.getElementById('card-header').removeAttribute('class');
    if (direction == 'right') {
        id++;
        if (id == allLoadedPokemons.length) {
            id = 0;
        }
    } else {
        id--;
        if (id < 0) {
            id = allLoadedPokemons.length - 1;
        }
    }
    let currentPokemon = allLoadedPokemons[id];
    let cssStyle = getCssStyle(currentPokemon);
    showDetailsCard(id, cssStyle);
}


function getCssStyle(currentPokemon) {
    let type = currentPokemon['types'][0]['type']['name'];
    return type;
}


function showDetailsCard(id, cssStyle) {
    document.getElementById('details').classList.remove('d-none');
    document.getElementById('details-card').classList.remove('d-none');
    document.getElementById('card-container').classList.add('make-transparent');
    document.getElementById('header').classList.add('make-transparent');
    document.getElementById('card-header').classList.add(cssStyle);
    renderDetailsCard(id);
}


function closeDetailsCard() {
    document.getElementById('details').classList.add('d-none');
    document.getElementById('details-card').classList.add('d-none');
    document.getElementById('card-container').classList.remove('make-transparent');
    document.getElementById('header').classList.remove('make-transparent');
    document.getElementById('details-card').classList.remove('d-flex');
    document.getElementById('card-header').removeAttribute('class');
}


function renderDetailsCard(id) {
    renderCardHeader(id);
    renderCardBody(id);
}


function renderCardHeader(id) {
    let currentPokemon = allLoadedPokemons[id];
    let content = document.getElementById('card-header');
    content.innerHTML = '';
    content.innerHTML += renderCardHeaderHtml(currentPokemon, id);
}


function renderCardHeaderHtml(currentPokemon, id) {
    return /*html*/`
        <div id="header-top">
            <div id="header-left">
                <span class="id">${formattingId(currentPokemon['id'])}</span>
                <h2>${currentPokemon['name']}</h2>
                <div class="types">
                    <h3 class="type-hidden">Types:</h3> 
                    <div class="type-cont">
                        ${getTypes(currentPokemon)}
                    </div>
                </div>
            </div>
            <div id="header-right">
                <div class="types">
                    <h3>Weight:</h3> 
                    <div class="type-cont">
                        ${getValue('weight', currentPokemon)}
                    </div>
                </div>
                <div class="types">
                    <h3>Height:</h3> 
                    <div class="type-cont">
                        ${getValue('height', currentPokemon)}
                    </div>
                </div>
                <img onclick="closeDetailsCard()" src="images/close-window.png" id="close-window">
            </div>
        </div>
        <div id="header-bottom">
            <div onclick="switchPokemonCard(${id}, 'left')" id="arror-left"><img src="images/arrow-left.png" class="arrows"></div>
            <div onclick="switchPokemonCard(${id}, 'right')" id="arrow-right"><img src="images/arrow-right.png" class="arrows"></div>
        </div>`
}


function renderCardBody(id) {
    let currentPokemon = allLoadedPokemons[id];
    let content = document.getElementById('card-body');
    content.innerHTML = '';
    content.innerHTML += '<h2>Base Stats</h2>'
    renderStats(currentPokemon, content);
    content.innerHTML += `<img class="pokemon-image-details" src="${currentPokemon['sprites']['other']['home']['front_default']}">`;
}


function renderStats(currentPokemon, content) {
    for (let i = 0; i < currentPokemon['stats'].length; i++) {
        content.innerHTML += renderBaseStats(currentPokemon, i);
    }
    content.innerHTML += renderTotalStats(currentPokemon);
}


function renderBaseStats(currentPokemon, i) {
    let content = `
        <div class="stats">
            <div class="stats-name">${currentPokemon['stats'][i]['stat']['name']}</div>
            <div class="stats-value">${currentPokemon['stats'][i]['base_stat']}</div>
            <div class=progress-bar>
             <div class="progress">${getProgress(`${currentPokemon['stats'][i]['base_stat']}`, false)}</div>
            </div>
        </div>`;
    return content;
}


function renderTotalStats(currentPokemon) {
    let content = /*html*/ `
    <div class="stats">
        <div class="stats-name">Total</div>
        <div class="stats-value">${getStatsTotal(currentPokemon)}</div>
        <div class=progress-bar>
            <div class="progress">${getProgress(getStatsTotal(currentPokemon), true)}</div>
        </div>
    </div>`;
    return content;
}


function getStatsTotal(currentPokemon) {
    let total = 0;
    for (i = 0; i < currentPokemon['stats'].length; i++) {
        total += +currentPokemon['stats'][i]['base_stat']
    }
    return total;
}


function getProgress(statValue, progressTotal) {
    let progressBg;
    if (progressTotal) {
        statValue = (statValue / 600) * 100;
    }
    if (statValue > 100) {
        statValue = 100;
        progressBg = 'progress-red'
    } else {
        progressBg = 'progress-normal';
    }
    let content = `<div class="${progressBg}" style="width: ${statValue}%">&nbsp;</div>`;
    return content;
}


function formattingId(id) {
    if (id < 10) {
        return `# 00${id}`;
    } else if (id < 100) {
        return `# 0${id}`;
    } else {
        return `# ${id}`;
    }
}


function openResponsiveMenu() {
    let links = document.getElementById('links');
    let search = document.getElementById('search');
    let container = document.getElementById('responsive-bg');
    if (links.style.display === 'block') {
        closeResposiveMenu(links, search, container);
    } else {
        showResponsiveMenu(links, search, container);
    }
}


function closeResposiveMenu(links, search, container) {
    links.classList.remove('links-responsive');
    search.classList.remove('search-responsive');
    container.classList.remove('responsive-bg');
    links.style.display = 'none';
    search.style.display = 'none';
    container.style.display = 'none';
}


function showResponsiveMenu(links, search, container) {
    container.classList.add('responsive-bg');
    links.classList.add('links-responsive');
    search.classList.add('search-responsive');
    links.style.display = "block";
    search.style.display = "block";
    container.style.display = 'block';
}


function searchPokemons() {
    let searchValue = document.getElementById('search-value').value.toLowerCase();
    allLoadedPokemons.forEach((pokemon) => {
        if (pokemon.name.startsWith(searchValue)) {
            filteredPokemons.push(pokemon);
            noPokemonsFound = false;
        }
    })
    if (filteredPokemons.length < 1) {
        noPokemonsFound = true;
    }
    renderPokemonCards();
    filteredPokemons = [];
}
