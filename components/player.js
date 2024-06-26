
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
        this.fullscreenWrapper = this.shadowRoot.querySelector('.fullscreen-wrapper');
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
        this.fullscreenWrapper.style.display = 'block';
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
            <div class="fullscreen-wrapper">
                <div class="controls">
                    <button class="control-element"><embed src="../assets/control-icons/play.svg"></button>
                    <button class="control-element"><embed src="../assets/control-icons/subtitles.svg"></button>
                    <button class="control-element"><embed src="../assets/control-icons/fullscreen.svg"></button>
                </div>
                <video autoplay>
                    <source id="source" src="">
                </video>
            </div>
        `;
    }

    css(){

        return /*css*/`
            :host{
                --hover-fade-time: .3s;
                display: flex;
                position: relative;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                
            }

            embed{
                pointer-events: none;
            }

            .fullscreen-wrapper{
                display: none;
                width: 100%;
                height: fit-content;
                position: relative;
            }
            .fullscreen-wrapper::before{
                transition: opacity var(--hover-fade-time) ease-in-out;
                content: '';
                position: absolute;
                bottom: 0;
                background: linear-gradient(to top, rgba(0, 0, 0, .75), transparent);
                width: 100%;
                aspect-ratio: 6/1;
                opacity: 0;
                pointer-events:  none;
            }

            .controls{
                transition: opacity var(--hover-fade-time) ease-in-out;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 100;
                opacity: 0;
            }

            .fullscreen-wrapper:hover .controls,
            .fullscreen-wrapper:hover:before{
                opacity: 1;
            }

            .control-element{
                background-color: transparent;
                border-style: none;
                outline: none;
                color: white;
                padding: 0px;        
            }
            .control-element:hover{
                cursor: pointer;
                opacity: .5;
            }

            video{
                display: flex;
                max-width: 100%;
                width: 100%;
                object-fit: contain;
                box-sizing: border-box;
            }
            img{
                max-width: 100%;
                width: 100%;
            }

            
        `;
    }
}

customElements.define('player-component', Player);