

class Media extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
        
        const template = document.createElement('template');
        template.innerHTML = this.html();
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const style = document.createElement('style');
        style.textContent = this.css();
        this.shadowRoot.appendChild(style);

        this.id;
        this.type;


        this.wrapper = this.shadowRoot.querySelector(".wrapper");

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

    html(){
        return /*html*/`
            <link rel="stylesheet" href="../styles/font.css">

            <div class="wrapper" tabindex="0">
                <img src="" alt="poster">
                <div class="ontop"></div>
                <h4>NAME</h4>
            </div>
        `
    }
    css(){
        return /*css*/` 
            .wrapper{
                --hover-shadow: 0%;
                --default-shadow: 60%;
                --border-radius: 15px;

                position: relative;
                width: 300px;
            }
            .wrapper:hover{
                cursor: pointer;
            }

            .wrapper:focus{
                outline-color: rgb(62, 62, 250);
                border-radius: var(--border-radius);
                outline-style: solid;
                outline-width: 8px;
            }

            img{
                width: 100%;
                border-radius: var(--border-radius);
            }

            .ontop{
                border-radius: var(--border-radius);
                position: absolute;
                width: 100%;
                height: 100%;
                bottom: 2.5px;

                background: -moz-linear-gradient(top, rgba(255, 255, 255, 0) var(--default-shadow),rgba(0,0,0,1) 100%);
                background: linear-gradient(top, rgba(255, 255, 255, 0) var(--default-shadow),rgba(0,0,0,1) 10%);
                background: -webkit-linear-gradient(top, rgba(255, 255, 255, 0) var(--default-shadow),rgba(0,0,0,1) 100%);

            }

            .ontop:hover{
                background: -moz-linear-gradient(top, rgba(255, 255, 255, 0) var(--hover-shadow),rgba(0,0,0,1) 100%);
                background: linear-gradient(top, rgba(255, 255, 255, 0) var(--hover-shadow),rgba(0,0,0,1) 10%);
                background: -webkit-linear-gradient(top, rgba(255, 255, 255, 0) var(--hover-shadow),rgba(0,0,0,1) 100%);

            }

            .ontop:hover + h4{
                font-size: 1.85rem;
            }


            h4{
                color: white;
                position: absolute;
                bottom: 0;
                padding: 5px;
                margin: 10px;
                font-size: 1.5rem;
                pointer-events: none;
                transition: font-size 0.2s;
            }
        `
    }

}
    
customElements.get('media-component') || customElements.define('media-component', Media);





