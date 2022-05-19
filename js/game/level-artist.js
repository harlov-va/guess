import AbstractView from "./abstract-view";
import AudioElement from "./audio-element";
import { getElementFromTemplate } from "../util";


export default class LevelArtist extends AbstractView{
    constructor(level){
        super();
        this.level = level;
    }
    get template(){
        return `
        <section class="game__screen">
            <h2 class="game__title">Who sings this song?</h2>
            <div class="game__track">
                
            </div>
            <form class="game__artist">
                ${[...this.level.answers]
                .map((variant,index) => `<div class="artist">
                <input class="artist__input visually-hidden" type="radio" name="answer" value=${index} id="answer-${index}">
                <label class="artist__name" for="answer-1">
                    <img class="artist__picture" src="${variant.image}" alt="${variant.title}">
                        ${variant.title}
                </label>
                </div>`)
                .join(``)
                }
            </form>
            </section>
        </section>`;
    }
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
    bind(element){
        //добавляю треки
        const track = element.querySelector(`.game__track`);
        let rightAnswer = 0;
        for(let i=0; i<this.level.answers.length; i++){
            if(this.level.answers[i].isCorrect) { 
                rightAnswer = i;
                break ;
            }
        }
        const audio = new AudioElement(this.level.answers[rightAnswer].src);
        track.prepend(audio.element);
        audio.playTrack();
        //добавляю обработчики 
        const answers = element.querySelectorAll('.artist');
            answers.forEach((answer) => {
                answer.addEventListener('click',(evt) => {
                    this.onAnswer(parseInt(evt.currentTarget.querySelector(`.artist__input`).value));
                });
            })
    }
    onAnswer(answers){}
}