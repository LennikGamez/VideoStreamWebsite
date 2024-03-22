import {server} from "../scripts/serverip.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const poster = document.getElementById('poster');
const title = document.getElementById('title');
const descr = document.getElementById('description');



function play(){
    window.location.href = "../views/player.html"+"?media="+urlParams.get('media')+"&s=1&e=0";

}

function back(){
    window.history.go(-1);
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
    })


}


function addEpisodeToPage(index, name, description, season){
    const episode = document.createElement('episode-component');
    episode.setData(index, name, description, season);

    document.getElementById('episodes').appendChild(episode);
}


function setBasicInformation(json){
    const media = urlParams.get('media');
    const data = json[media];
    poster.src = server+"/poster/"+media;
    title.innerHTML = data['name'];
    descr.innerHTML = data['description'];
}


loadData();