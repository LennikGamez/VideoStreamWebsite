
const server = "http://192.168.178.83:8000";
const main = document.getElementsByTagName('main')[0];


const allMediaTags = [];

let filter = '';

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