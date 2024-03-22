import {server} from "../scripts/serverip.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const season = urlParams.get('s');
const episode = urlParams.get('e');

const version = urlParams.get('v');

if (!season){
    document.getElementById("source").src = server+"/movie/"+urlParams.get('media')+"/"+version;
}else{
    document.getElementById("source").src = server+"/series/"+urlParams.get('media')+"/"+season+"/"+episode;
}

document.querySelector('video').load();



