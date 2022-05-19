import {getElementFromTemplate} from '../util.js';
import AbstractView from './abstract-view.js';

export default class WelcomeElement extends AbstractView { 
    get template(){
        return `<section class="welcome">
            <div class="welcome__logo"><img src="img/melody-logo.png" alt="Guess the melody" width="186" height="83"></div>
            <button class="welcome__button"><span class="visually-hidden">Start the game</span></button>
            <h2 class="welcome__rules-title">Rules of the game</h2>
            <p class="welcome__text">The rules are simple:</p>
            <ul class="welcome__rules-list">
            <li>All questions need to be answered in 5 minutes.</li>
            <li>3 mistakes can be made.</li>
            </ul>
            <p class="welcome__text">Good luck!</p>
        </section>`;
    }
    get element(){
        if(this._element){
            return this._element;
        }
        this._element = this.render();
        this.bind(this._element);
        return this._element;
    }
    render(){
        return getElementFromTemplate(this.template);
    }
    bind(element){
        const buttonPlay = element.querySelector(`.welcome__button`);
        buttonPlay.addEventListener('click',this.onClick);
    }
    onClick(){}
}