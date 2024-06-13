import { server } from "../../scripts/serverip.js";


fetch("../components/episode/episode.html")
    .then(stream => stream.text())
    .then(text => defineEpisode(text));


function defineEpisode(html){
    class Episode extends HTMLElement{
        constructor(){
            super();
            const shadowRoot = this.attachShadow({mode:"open"});
            shadowRoot.innerHTML = html;

            this.index;
            this.name;
            this.description;
            this.season;

            this.wrapper = shadowRoot.querySelector(".wrapper");

            this.addEventListener('click', (event)=>{
                this.playOnPlayer();
            })

        }

        setPlayer(player){
            this.player = player;
        }

        setData(index, show, name, descr, season){
            this.show = show;
            this.index = index;
            this.name = name;
            this.description = descr;
            this.season = season;

            this.shadowRoot.querySelector('.index').innerHTML = this.index;
            this.shadowRoot.querySelector('.name').innerHTML = this.name;
            this.shadowRoot.querySelector('.description').innerHTML = this.description;


        }

        playOnPlayer(){
            const e = Number(this.index) - 1;
            this.player.play(server+"/series/"+this.show+"/"+this.season+"/"+e+"/");
        }

    }
    customElements.get('episode-component') || customElements.define('episode-component', Episode);
}





