import {server} from "../scripts/serverip.js";




const poster = document.getElementById('poster');
const title = document.getElementById('title');
const length = document.getElementById('duration');
const descr = document.getElementById('description');
const versions = document.getElementById('version-btn');


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const media = urlParams.get('media');


function play(){
    window.location.href = "../views/player.html"+"?media="+media+"&v="+versions.value;
}

function back(){
    window.history.go(-1);
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
    poster.src = server+"/poster/"+media;
    title.innerHTML = data['name'];
    length.innerHTML = data['length'];
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



loadData();