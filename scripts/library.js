import {server} from "../scripts/serverip.js";

const main = document.getElementsByTagName('main')[0];


const allMediaTags = [];

let filter = '';
let selectedMediaIndex = 0;

const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', (event)=>{
    filter = searchBar.value;
    clearMedia();
    
    allMediaTags.forEach(element => {
        if (element.id.toLowerCase().includes(filter.toLowerCase())){
            main.appendChild(element);
        }
    })


})

function clearMedia(){
    main.innerHTML = '';
}


function loadMedia(){
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

function handleData(media){
    const keys = Object.keys(media);
    keys.forEach(key => {

        const element = media[key];
        const title = element['name'];
        const img = server+"/poster/"+key;
        const type = element['type'];


        addMediaToPage(title, img, key, type);
    });
}


function addMediaToPage(title, img, name, type){
    let media = document.createElement('media-component');
    media.setImg(img);
    media.setTitle(title);
    media.setID(name);
    media.setType(type);

    allMediaTags.push(media);
    main.appendChild(media);
}



window.onload = function(){
    loadMedia();
}

function focusCurrentMedia(){
    const element = main.children[selectedMediaIndex].wrapper
    element.focus();
}

function calculateElementsInOneLine(){
    const mainWidth = main.getBoundingClientRect().width - 10 - 20; // length - gap - margin
    const mediaElementWidth = main.children[0].getBoundingClientRect().width;
    return Math.floor(mainWidth/mediaElementWidth);
}

window.addEventListener('keyup', (event) => {
    if(selectedMediaIndex == -1){
        selectedMediaIndex = 0;
        focusCurrentMedia();
        return;
    }
    switch (event.key) {
        case 'ArrowRight':
            selectedMediaIndex = (selectedMediaIndex + 1) % main.children.length;
            focusCurrentMedia();
            break;
        case 'ArrowLeft':
            selectedMediaIndex = (selectedMediaIndex - 1 + main.children.length) % main.children.length;
            focusCurrentMedia();
            break;
        case 'ArrowUp':
            selectedMediaIndex = (selectedMediaIndex - calculateElementsInOneLine() + main.children.length) % main.children.length;
            focusCurrentMedia();
            break;
        case 'ArrowDown':
            selectedMediaIndex = (selectedMediaIndex + calculateElementsInOneLine()) % main.children.length;
            focusCurrentMedia();
            break;
    }

    if(event.key == 'Enter'){
        main.children[selectedMediaIndex].wrapper.click();
    }
})