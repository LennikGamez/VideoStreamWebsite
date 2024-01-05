

fetch("../components/media/media.html")
    .then(stream => stream.text())
    .then(text => defineMedia(text));


function defineMedia(html){
    class Media extends HTMLElement{
        constructor(){
            super();
            const shadowRoot = this.attachShadow({mode:"open"});
            shadowRoot.innerHTML = html;

            this.id;
            this.type;


            this.wrapper = shadowRoot.querySelector(".wrapper");

            this.wrapper.addEventListener('click', (event)=>{
                window.location.href = `../views/${this.type}.html`+`?media=${this.id}`;
            })

        }
        setTitle(name){
            this.wrapper.querySelector('h4').innerHTML = name;
        }

        setImg(img){
            this.wrapper.querySelector('img').src = img;
        }
        setID(id){
            this.id = id;
        }
        setType(type){
            this.type = type;
        }

        getDetails(){
            alert(this.id)
            // window.location.href = 
        }

    }
    customElements.get('media-component') || customElements.define('media-component', Media);
}





