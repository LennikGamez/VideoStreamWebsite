
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
        this.videoContainer = this.shadowRoot.querySelector('.video-container');


        this.setupControls();
    }

    setupControls(){
        const playBtn = this.shadowRoot.querySelector('.play-btn');
        const fullscreenBtn = this.shadowRoot.querySelector('.fullscreen-btn');
        const timeline = this.shadowRoot.querySelector('.timeline-container');
        
        // play / pause
        playBtn.addEventListener('click', this.toggleVideoPlayPause.bind(this));
        this.video.addEventListener('click', this.toggleVideoPlayPause.bind(this));

        this.video.addEventListener("play", ()=>{
            this.videoContainer.classList.remove("paused");
        });
        this.video.addEventListener("pause", ()=>{
            this.videoContainer.classList.add("paused");
        })

        // fullscreen
        fullscreenBtn.addEventListener('click', this.toggleFullscreenView.bind(this));

        // timeline
        this.video.addEventListener('timeupdate', this.updateTimeline.bind(this));;
        timeline.addEventListener('mousedown', ()=>{
            this.timelineDrag = true;
            this.video.pause();
        });
        document.addEventListener('mouseup', (e)=>{
            if(!this.timelineDrag) return;
            this.timelineDrag = false;
            this.video.play();
            this.setTimelineByMouseEvent(e);
        })
        document.addEventListener('mousemove', (event)=>{
            if(!this.timelineDrag) return;
            this.setTimelineByMouseEvent(event);
        });

        // keyboard 
        this.keyboardControls();
    }

    setTimelineByMouseEvent(event){
        const rect = this.shadowRoot.querySelector('.timeline').getBoundingClientRect();
        var x = event.offsetX - rect.left;
        const timeToSeek = (x / rect.width) * this.video.duration;
        this.video.currentTime = timeToSeek;
    }

    updateTimeline(){
        const percent = (this.video.currentTime / this.video.duration);
        this.style.setProperty('--progress', percent);
    }

    keyboardControls(){
        document.addEventListener('keypress', (event) => {
            switch (event.key){
                case ' ':
                case 'k':
                    this.toggleVideoPlayPause();
                    break;
                case 'f':
                case '0':
                    this.toggleFullscreenView();
                    break;
            }
        });
    }

    toggleVideoPlayPause(){
        this.video.paused ? this.video.play() : this.video.pause();
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
            this.videoContainer.requestFullscreen();
        }else{
            document.exitFullscreen();
        }
    }

    play(url){
        this.fetchSubtitles();

        this.setAttribute("video-src", url);
        this.video.load();
        this.shadowRoot.querySelector('img').style.display = 'none';
        this.videoContainer.style.display = 'block';
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
            <div class="video-container">
                <div class="video-controls-container">
                    <div class="timeline-container">
                        <div class="timeline">
                            <div class="thumb-indicator"></div>
                        </div>
                    </div>
                    <div class="controls">
                        <div class="left-controls">
                            <button class="control-element play-btn">
                            <embed class="play-icon" src="../assets/control-icons/play.svg">
                            <embed class="pause-icon" src="../assets/control-icons/pause.svg">
                            </button>
                        </div>
                        <div class="right-controls">
                            <button class="control-element sub"><embed src="../assets/control-icons/subtitles.svg"></button>
                            <button class="control-element fullscreen-btn"><embed src="../assets/control-icons/fullscreen.svg"></button>
                        </div>
                    </div>
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
                --progress: 0.2;
                --timeline-size: 2px;
                --video-control-inset: 8px;
                display: flex;
                position: relative;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                user-select: none;
            }

            embed{
                pointer-events: none;
            }

            .video-container{
                display: none;
                width: 100%;
                height: fit-content;
                position: relative;
            }
            .video-container::before{
                transition: opacity var(--hover-fade-time) ease-in-out;
                content: '';
                position: absolute;
                bottom: 0;
                background: linear-gradient(to top, rgba(0, 0, 0, .75), transparent);
                width: 100%;
                aspect-ratio: 6/1;
                opacity: 0;
                pointer-events:  none;
                z-index: 99;
            }


            .video-container:hover .video-controls-container,
            .video-container:hover:before{
                opacity: 1;
            }

            .video-container.paused .video-controls-container,
            .video-container.paused:before{
                /* if paused controls are always visible */
                opacity: 1;
            }
            .video-container .play-icon,
            .video-container.paused .pause-icon{
                 display:none
            }

            .video-container.paused .play-icon,
            .video-container .pause-icon{
                display: block;
            }

            .video-controls-container{
                transition: opacity var(--hover-fade-time) ease-in-out;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 100;
                opacity: 0;
                display: flex;
                flex-direction: column;
                gap: 5px;
                padding: var(--video-control-inset);

            }

            .controls{
                display: flex;
                justify-content: space-between;
                align-items: center;
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

            .timeline-container{
                padding-block: 12px;
            }

            .timeline{
                position: relative;
                left: 0;
                right: 0;
                height: var(--timeline-size);
                background-color: rgba(255, 255, 255, .5);
                z-index: 101;
                transition: opacity var(--hover-fade-time) ease-in-out;
            }

            .timeline::before{
                content: '';
                position: absolute;
                height: var(--timeline-size);
                left: 0;
                right: calc(100% - var(--progress) * 100%);
                background-color: red;
                z-index: 101;
            }

            .thumb-indicator{
                display: none;
                background-color: red;
                border-radius: 50%;
                position: absolute;
                bottom: 50%;
                transform: translateY(50%) translateX(-50%);
                left: calc(var(--progress) * 100%);
                width: 12px;
                aspect-ratio: 1;

            }

            .timeline-container:hover .thumb-indicator{
                display: block;
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