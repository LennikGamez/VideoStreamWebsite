
import { server } from "../scripts/serverip.js";
import InactivityTimer from "../scripts/inactivity-timer.js";

class Player extends HTMLElement{
    static observedAttributes = ["video-src", "poster-src"];

    constructor(){
        super();
        this.videoStepSize = 5;
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
        this.videoPlayer = this.shadowRoot.querySelector('.video-player');
        this.currentTimeSpan = this.shadowRoot.querySelector('.current-time');
        this.durationSpan = this.shadowRoot.querySelector('.total-time');

        this.inactivityTimer = new InactivityTimer(()=>this.hideCursor(), ()=>this.showCursor(), 2000);

        this.setupControls();
    }

    hideCursor(){
        this.videoContainer.classList.add('cursor-none');
    }

    showCursor(){
        this.videoContainer.classList.remove('cursor-none');
    }
    formatTime(time){
        if (isNaN(time)) return this.formatTime(0);
        return new Date(time * 1000).toISOString().substr(14, 5);
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
            this.inactivityTimer.restart();
            this.timelineDrag = true;
            this.video.pause();
        });
        timeline.addEventListener('touchstart', ()=>{
            this.inactivityTimer.restart();
            this.timelineDrag = true;
            this.video.pause();
        })

        document.addEventListener('mouseup', (e)=>{
            this.inactivityTimer.restart();
            if(!this.timelineDrag) return;
            this.timelineDrag = false;
            this.video.play();
            this.setTimelineByMouseEvent(e);
        })
        document.addEventListener('touchend', (e)=>{
            this.inactivityTimer.restart();
            if(!this.timelineDrag) return;
            this.timelineDrag = false;
            this.video.play();
        })

        document.addEventListener('mousemove', (event)=>{
            this.inactivityTimer.restart();
            if(!this.timelineDrag) return;
            this.setTimelineByMouseEvent(event);
        });
        document.addEventListener('touchmove', (event)=>{
            this.inactivityTimer.restart();
            if(!this.timelineDrag) return;;
            this.setTimelineByMouseEvent(event.touches[0]);
        })

        // keyboard 
        this.keyboardControls();
    }

    setTimelineByMouseEvent(event){
        const rect = this.shadowRoot.querySelector('.timeline').getBoundingClientRect();
        var x = event.clientX - rect.left;
        const timeToSeek = (x / rect.width) * this.video.duration;
        this.video.currentTime = timeToSeek;
    }

    updateTimeline(){
        const percent = (this.video.currentTime / this.video.duration);
        this.style.setProperty('--progress', percent);

        this.currentTimeSpan.innerHTML = this.formatTime(this.video.currentTime);
        this.durationSpan.innerHTML = this.formatTime(this.video.duration);
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

        document.addEventListener('keydown', (event)=>{
            if (event.key === 'ArrowRight'){
                this.video.currentTime += this.videoStepSize;
            }
            if (event.key === 'ArrowLeft'){
                this.video.currentTime -= this.videoStepSize;;
                
            }
        })
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
            this.videoPlayer.classList.add('fullscreen');
            this.videoContainer.classList.add('fullscreen');
            this.videoPlayer.requestFullscreen();
        }else{
            this.videoPlayer.classList.remove('fullscreen');
            this.videoContainer.classList.remove('fullscreen');
            document.exitFullscreen();
        }
    }

    play(url){
        this.fetchSubtitles();

        this.setAttribute("video-src", url);
        this.videoContainer.focus();
        this.video.load();
        this.shadowRoot.querySelector('img').style.display = 'none';
        this.videoContainer.classList.remove('hidden');
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
            <div class="video-player">
            <img src="" alt="poster">
                <div class="video-container hidden">
                    <div class="video-controls-container">
                        <div class="timeline-container">
                            <div class="timeline">
                                <div class="thumb-indicator"></div>
                            </div>
                        </div>
                        <div class="controls">
                            <div class="left-controls">
                                <button class="control-element play-btn">
                                    <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>
                                    <svg class="pause-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>
                                </button>
                                <div class"time-display">
                                    <span class="current-time">0:00</span>
                                    /
                                    <span class="total-time">0:00</span>
                                </div>
                            </div>
                            <div class="right-controls">
                                <button class="control-element sub"><embed src="../assets/control-icons/subtitles.svg"></button>
                                <button class="control-element fullscreen-btn"><embed src="../assets/control-icons/fullscreen.svg"></button>
                            </div>
                        </div>
                    </div>
                    <video autoplay playsinline>
                        <source id="source" src="">
                    </video>
                </div>
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
            .video-player,
            .video-container{
                width: 100%;
                height: fit-content;
                position: relative;
            }
            .hidden{
                display: none;
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

            .video-container.cursor-none{
                pointer-events: none;
            }
            .video-player:has(.video-container.cursor-none){
                cursor: none;
            }
            .video-container.fullscreen{
                display: flex;
                justify-content: center;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: black;
            }

            .video-container:not(.cursor-none) .video-controls-container,
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

            .left-controls,
            right-controls{
                display: flex;
                gap: 5px;
                align-items: center;
            }
            .time-display{
                display: flex;
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
            }
            .video-container.fullscreen video{
                height: 100%;
                width: auto;;
            }

            img{
                max-width: 100%;
                width: 100%;
            }

            
        `;
    }
}

customElements.define('player-component', Player);