import {server} from "../scripts/serverip.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const media = urlParams.get('media');
const season = urlParams.get('s');
const episode = urlParams.get('e');

const version = urlParams.get('v');

const video = document.querySelector('video');

let fullscreenState = false;


function fetchSubtitles(){
    fetch(server+"/subtitles/"+media)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonResponse => {
            if(!jsonResponse.error){
                loadSubtitleTracks(jsonResponse)
            }else{
                console.log(jsonResponse.error);
            }
        })
}

function loadSubtitleTracks(subtitles){
    Object.keys(subtitles).forEach(key => {
        const value = subtitles[key];
        const lang = key;

        
        let blob = new Blob([value], {type: 'text/vtt'});
        const url = URL.createObjectURL(blob);
        


        video.innerHTML += "<track label='"+lang+"' kind='subtitles' srclang='"+lang+"' src='"+url+"'>"
    })
}




window.addEventListener('load', (event) => {
    
    fetchSubtitles();
    
    if (!season){
        document.getElementById("source").src = server+"/movie/"+media+"/"+version;
    }else{
        document.getElementById("source").src = server+"/series/"+media+"/"+season+"/"+episode;
    }
    
    document.querySelector('video').load();

    document.getElementById('fullscreen').addEventListener('click', (event) => {
            toggleFullscreenView();
    })

    document.addEventListener('keypress', (event) => {
        if (event.key === '0'){
            toggleFullscreenView();
        }
    })
    video.focus();
    video.addEventListener('focusout', (event) => {
        video.focus();
    })
    
})

function toggleFullscreenView(){
    fullscreenState = !fullscreenState;
    if (fullscreenState){
        video.requestFullscreen();
    }else{
        document.exitFullscreen();
    }
}



