import { getElementFromTemplate } from "../util";
import AbstractElement from './abstract-element';
const playStop = (elem) => {
    elem.classList.toggle(`track__button--play`);
    elem.classList.toggle(`track__button--pause`);
}
export default class AudioElement extends AbstractElement{
    constructor(src) {
        super();
        this.src = src;
        this.play = false;
        this.audio = null;
    }
    get template (){
        return `
        <div class="player-wrapper"> 
                <button class="track__button track__button--play" type="button"></button>
                <div class="track__status">
                    <audio src="${this.src}" preload="auto"></audio>
                </div>
        </div>`
    };
    get element(){
        if(this._element){
            return this._element;
        };
        this._element = this.render();
        this.bind(this._element);
        return this._element;
    };
    render (){
        return getElementFromTemplate(this.template);
    }
    bind(element){
        this.audio = element.querySelector(`audio`);
        this.audio.src = this.src;
        const buttonPlay = element.querySelector('.track__button');
        buttonPlay.addEventListener(`click`,() => {
              this.playTrack();
        });
    }
    playTrack(){   
        const button = this._element.querySelector('.track__button');     
        if(!this.play) {
            this.audio.play();
            this.play = true;
            playStop(button);            
        } else {
            this.audio.pause();
            this.play = false;
            playStop(button);
        }
    }
}