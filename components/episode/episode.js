

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

            this.wrapper.addEventListener('click', (event)=>{
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                
                const e = Number(this.index) - 1;
                window.location.href = "../views/player.html"+"?media="+urlParams.get('media')+"&s="+this.season+"&e="+e;
            })

        }
        setData(index, name, descr, season){
            this.index = index;
            this.name = name;
            this.description = descr;
            this.season = season;

            this.shadowRoot.querySelector('.index').innerHTML = this.index;
            this.shadowRoot.querySelector('.name').innerHTML = this.name;
            this.shadowRoot.querySelector('.description').innerHTML = this.description;


        }

    }
    customElements.get('episode-component') || customElements.define('episode-component', Episode);
}





