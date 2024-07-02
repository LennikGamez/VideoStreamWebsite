
export default class BackButton extends HTMLElement{
    shadowRoot;
    constructor(){
        super();
        this.shadowRoot = this.attachShadow({mode:"open"});
        this.html();
        this.css();
    }

    html(){
        this.shadowRoot.innerHTML = /*html*/`
        <button id="exit">X</button>
        `
    }

    css(){
        this.shadowRoot.innerHTML += "<style>" + /*css*/`
        :host{
            z-index: 99;
        }
        button#exit{
            position: fixed;
            top: 5px;
            left: 5px;
            width: 35px;

            padding: 4px;

            color: white;

            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 20px;
            border-style: none;
        }

        button{
            outline: none;
        }
        button:hover{
            cursor: pointer;
        }
    `+"</style>"
    }

    connectedCallback(){
        const exit = this.shadowRoot.getElementById('exit');
        exit.addEventListener('click', this.back);
    }

    back(){
        window.history.go(-1);
    }
}

customElements.define('back-btn', BackButton)