import {getElementFromTemplate} from '../util';
import AbstractView from './abstract-view';

export default class StatsView extends AbstractView{
    constructor(textScoring){
        super();
        this.text = textScoring;
    }
    get template(){
        return `<section class="result">
            <div class="result__logo"><img src="img/melody-logo.png" alt="Guess the melody" width="186" height="83"></div>
            ${this.text}            
            <button class="result__replay" type="button">Play again</button>
        </section>`
    };
    get element(){
        if(this._element){
            return this._element;
        };
        this._element = this.render();
        this.bind(this._element);
        return this._element;
    }
    render(){
        return getElementFromTemplate(this.template);
    }
    onClick(){}
    bind(element){
        const buttonReturn = element.querySelector(`.result__replay`);
        buttonReturn.addEventListener(`click`,this.onClick);
    }
}