
import { server } from "../scripts/serverip.js";

class Player extends HTMLElement{
    static observedAttributes = ["video-src", "poster-src"];

    constructor(){
        super();
        this.fullscreenState = false;
        this.attachShadow({mode:"open"});
        
        const template = document.createElement('template');
        template.innerHTML = this.html();
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const style = document.createElement('style');
        style.textContent = this.css();
        this.shadowRoot.appendChild(style);

        this.video = this.shadowRoot.querySelector('video');
    }


    fetchSubtitles(){
        const urlParams = new URLSearchParams(window.location.search);
        fetch(server+"/subtitles/"+urlParams.get('media'))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(jsonResponse => {
                if(!jsonResponse.error){
                    this.loadSubtitleTracks(jsonResponse)
                }else{
                    console.log(jsonResponse.error);
                }
            })
    }
    
    loadSubtitleTracks(subtitles){
        Object.keys(subtitles).forEach(key => {
            const value = subtitles[key];
            const lang = key;
    
            
            let blob = new Blob([value], {type: 'text/vtt'});
            const url = URL.createObjectURL(blob);
            
    
    
            this.video.innerHTML += "<track label='"+lang+"' kind='subtitles' srclang='"+lang+"' src='"+url+"'>"
        })
    }

    toggleFullscreenView(){
        if(!(this.getAttribute("video-src"))){
            return;
        }

        this.fullscreenState = !this.fullscreenState;
        if (this.fullscreenState){
            this.video.requestFullscreen();
        }else{
            document.exitFullscreen();
        }
    }

    play(url){
        this.fetchSubtitles();

        this.setAttribute("video-src", url);
        this.video.load();
        this.shadowRoot.querySelector('img').style.display = 'none';
        this.video.style.display = 'block';
        this.scrollIntoView();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name){
            case "video-src":
                this.shadowRoot.querySelector('#source').src = newValue;
                break;
            case "poster-src":
                this.shadowRoot.querySelector('img').src = newValue;
                break;
        }
      }

    html(){
        return /*html*/`
            <img src="" alt="poster">
            <video controls autoplay>
                <source id="source" src="">
            </video>
        `;
    }

    css(){

        return /*css*/`
            :host{
                display: flex;
                position: relative;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                
            }
            video{
                display: none;
                max-width: 100%;
                width: 100%;
                object-fit: contain;
            }
            img{
                max-width: 100%;
                width: 100%;
            }

            
        `;
    }
}

customElements.define('player-component', Player);