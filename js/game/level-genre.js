import AbstractView from './abstract-view';
import AudioElement from "./audio-element";
import { getElementFromTemplate } from '../util';
export default class LevelView extends AbstractView{
    constructor(level){
        super();
        this.level = level;
    }
    get element(){
        if(this._element){
            return this._element;
        }
        this._element = this.render();
        this.bind(this._element);
        return this._element;
    }    
    get template(){
        return `<section class="game__screen">
            <h2 class="game__title">Select all songs in the genre <span class="genre-type">${this.level.genre}</span></h2>
            <form class="game__tracks">
                ${[...this.level.answers]
                    .map((variant, index) => `
                        <div class="track">
                        <div class="game__answer">
                            <input class="game__input visually-hidden" type="checkbox" name="answer" value="${index}" id="answer-${index}">
                            <label class="game__check" for="answer-${index}">Cansel</label>
                        </div>
                        </div>`)
                    .join(``)
                    }                
                <button class="game__submit button" type="submit">Reply</button>
            </form>
        </section>`
    }
    render(){
        return getElementFromTemplate(this.template)
    }
    onAnswer(answers){}
    bind(element){
        //добавляю треки
        const tracks = element.querySelectorAll(`.track`);
        tracks.forEach((track,index) => {
            track.prepend((new AudioElement(this.level.answers[index].src)).element);
        });
        //добавляю обработчики на чекбоксы и кнопки
        const buttonSubmit = element.querySelector(`.game__submit`);
        const checkboxes = element.querySelectorAll(`input[type='checkbox']`);
        buttonSubmit.disabled = true;
        buttonSubmit.addEventListener('click',(evt)=>{
            evt.preventDefault();
            const checkedElements = element.querySelectorAll(`input[type='checkbox']:checked`)
            const userAnswers = [];
            checkedElements.forEach((elem) => {
                userAnswers.push(parseInt(elem.value));
            });
            //надо подписаться на это событие
            this.onAnswer(userAnswers);
        });
        checkboxes.forEach((elem) => {
            elem.addEventListener('click',()=>{        
                if(element.querySelectorAll(`input[type='checkbox']:checked`).length>0) {
                    buttonSubmit.disabled = false;
                } else {
                    buttonSubmit.disabled = true;
                }
            });
        });
    }
}