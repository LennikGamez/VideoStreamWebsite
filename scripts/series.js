import {server} from "../scripts/serverip.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const player = document.querySelector('player-component');
const title = document.getElementById('title');
const descr = document.getElementById('description');
const play_btn = document.getElementById('play-btn');

let selectedIndex = -1;

function play(){
    player.play(server+"/series/"+urlParams.get('media')+"/1/0");

}




function loadData(){
    fetch(server+"/media")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonResponse => {
            handleData(jsonResponse);
            setBasicInformation(jsonResponse);
        })

}

function handleData(media){
    const data = media[urlParams.get('media')];
    const seasons = data['seasons'];
    const keys = Object.keys(seasons);

    keys.forEach(key => {
        const episodes = seasons[key]['episodes'];

        for(let i=0; i<episodes.length; i++){
            const ep = episodes[i];
            const name = ep['name'];
            const season = key;
            const description = ep['description'];
            addEpisodeToPage(i+1, name, description, season);
        }
    });

    window.addEventListener('keyup', (event) => {
        const elements = document.querySelectorAll('.focusable');
        if (event.key === 'ArrowUp'){
            selectedIndex = (selectedIndex - 1 + elements.length) % elements.length;
            elements[selectedIndex].focus();
            
        }
        if (event.key === 'ArrowDown'){
            selectedIndex = (selectedIndex + 1) % elements.length;
            elements[selectedIndex].focus();
            
        }

        if (event.key === '0'){
            player.toggleFullscreenView();
        }
            
        if(event.key === 'Enter'){
            elements[selectedIndex].click();
        }
        
    });
}


function addEpisodeToPage(index, name, description, season){
    const episode = document.createElement('episode-component');
    episode.setPlayer(player);
    episode.setData(index, urlParams.get('media'), name, description, season);
    episode.classList.add('focusable');
    episode.setAttribute('tabindex', '0');
    document.getElementById('episodes').appendChild(episode);
}


function setBasicInformation(json){
    const media = urlParams.get('media');
    const data = json[media];
    player.setAttribute('poster-src', server+"/poster/"+media);
    title.innerHTML = data['name'];
    document.title = data['name'];
    descr.innerHTML = data['description'];
}


loadData();
play_btn.addEventListener('click', play);