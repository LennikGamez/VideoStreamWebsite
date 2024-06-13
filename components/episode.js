import { server } from "../scripts/serverip.js";


class Episode extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
        
        const template = document.createElement('template');
        template.innerHTML = this.html();
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const style = document.createElement('style');
        style.textContent = this.css();
        this.shadowRoot.appendChild(style);

        this.index;
        this.name;
        this.description;
        this.season;

        this.wrapper = this.shadowRoot.querySelector(".wrapper");

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

    html(){
        return /*html*/`
            <link rel="stylesheet" href="../styles/font.css">
            <div class="wrapper">
                <div class="index">1.</div>
                <div class="name">Der kleine Prinz</div>
                <div class="description">Töf  ggg gggggggggg   ggggggggg</div>
            </div>
        `
    }
    css(){
        return /*css*/` 
            :host{
                width: 75%;
                display: grid;
                place-items: center;
                margin: 10px;
                padding-left: 10px;
                padding-right: 10px;
            }
            .wrapper{
                color: black;
                display: grid;
                place-items: center;
                text-align: center;
                grid-template-columns: 0.1fr 1fr;
                grid-template-rows: 1fr 1fr;

                background-color: gray;
                border-radius: 8px;
                width: 100%;
                padding: 10px;    
            }

            .wrapper:hover{
                background-color: rgb(84, 84, 84);
                cursor: pointer;
            }

            .index{
                font-size: larger;
                font-weight: 900;
                grid-column: 1;
                grid-row: 1/3;
            }

            .name{
                font-weight: 1000;

            }

            .description{
                font-weight: 600;
                min-width: 100px;
                color:rgb(39, 39, 39)
            }

            /* big */
            @media only screen and (min-width: 1100px) {
                .name{
                    font-weight: 1000;
                    font-size: 1.5vw;
                
                }
                
                .description{
                    font-size: 1.2vw;
                    font-weight: 600;
                    min-width: 100px;
                    color:rgb(39, 39, 39)
                }
            }
        `
    }
}



customElements.get('episode-component') || customElements.define('episode-component', Episode);






