import {server} from "../scripts/serverip.js";



const player = document.querySelector('player-component');
const title = document.getElementById('title');
const length = document.getElementById('duration');
const descr = document.getElementById('description');
const versions = document.getElementById('version-btn');
const play_btn = document.getElementById('play-btn');


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const media = urlParams.get('media');

let selectedIndex = -1;


function play(){
    // window.location.href = "../views/player.html"+"?media="+media+"&v="+versions.value;
    player.play(server+"/movie/"+media+"/"+versions.value);
}



// get details about movie


function loadData(){
    fetch(server+"/media")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonResponse => {
            handleData(jsonResponse)
        })

}


// display them

function handleData(json){
    const data = json[media];
    player.setAttribute('poster-src', server+"/poster/"+media);
    title.innerHTML = data['name'];
    length.innerHTML = data['length'];
    document.title = data['name'];
    descr.innerHTML = data['description'];
    
    addVersions(data)
}


function addVersions(data){
    const v = data['versions'];
    

    for(let i=0; i < v.length; i++){
        const ver = v[i];
        const element = document.createElement('option');
        element.innerHTML = ver.substring(1,ver.length-4);
        element.value = i;

        versions.appendChild(element);
    }

}

window.addEventListener('keyup', (event) => {
    const elements = document.querySelectorAll('.focusable');
    if (event.key === 'ArrowUp'){
        selectedIndex = (selectedIndex - 1 + elements.length) % elements.length;
    }
    if (event.key === 'ArrowDown'){
        selectedIndex = (selectedIndex + 1) % elements.length;
    }

    if (event.key === '0'){
        player.toggleFullscreenView();
    }

})
versions.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter'){
        event.preventDefault();
    }
})


loadData();
play_btn.addEventListener('click', play);