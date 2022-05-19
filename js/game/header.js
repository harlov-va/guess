import { getElementFromTemplate, returnWelcome } from "../util";
import LevelView from "./level-genre";
const CIRCLE_RADIUS = 370;
const START_TIME = 300;
const TIME_WARNING = 30;
export default class Header extends LevelView {
    constructor(state){
        super();
        this.state = state;
        this.propTime = this.state.time / START_TIME;
        this.minute = Math.floor(this.state.time/60);
        this.second = (this.state.time % 60) < 10 ? `0`+ (this.state.time % 60): (this.state.time % 60);
    }
    get template(){
        return`
            <header class="game__header">
            <a class="game__back" href="#">
                <span class="visually-hidden">Play again</span>
                <img class="game__logo" src="./img/melody-logo-ginger.png" alt="Guess the melody">
            </a>

            <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
                <circle class="timer__line" stroke-dasharray="${this._calculateCircle(this.propTime).stroke}" stroke-dashoffset="${this._calculateCircle(this.propTime).offset}" cx="390" cy="390" r="370" style="filter: url(#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center">
            </svg>

            <div class="timer__value" xmlns="http://www.w3.org/1999/xhtml">
                <span class="timer__mins">${this.minute}</span>
                <span class="timer__dots">:</span>
                <span class="timer__secs">${this.second}</span>
            </div>

            <div class="game__mistakes">
                ${new Array(3-this.state.lives)
                .fill(`<div class="wrong"></div>`)
                .join(``)
                }
            </div>
            </header>`
    }
    get element(){
        if(this._element){
            return this._element;
        }
        this._element = this.render();
        this.bind(this._element);
        return this._element;
    }
    _calculateCircle (proportion){
        const stroke = Math.round(2 * Math.PI * CIRCLE_RADIUS);
        const offset = stroke - (stroke * proportion);
        return {stroke, offset};
    }
    render(){
        return getElementFromTemplate(this.template);
    }
    bind(element){
        const buttonNewGame = element.querySelector(`.game__back`)
        buttonNewGame.addEventListener(`click`,this.onClick);
        const timerValue = this.element.querySelector(`.timer__value`);
        const circle = this.element.querySelector(`.timer__line`);
        if (this.state.time < TIME_WARNING) {
            timerValue.classList.add(`timer-expired`);
            circle.classList.add(`timer-expired`);
        }
    }
    onClick(){}
}