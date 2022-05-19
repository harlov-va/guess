import {getElementFromTemplate} from '../util.js';
import Header from './header';
import LevelGenre from './level-genre';
import LevelArtist from './level-artist.js';
import AbstractView from './abstract-view.js';
export default class Screen extends AbstractView{
    constructor(model){
        super();
        this.model = model;
        this.typeGame = ``;
        this.timerId = null;
    }
    get template(){
        return `
        <section class="game game--${this.typeGame}">     
        </section>`
    }
    get element(){
        if(this._element){
            return this._element;
        }
        this._element = this.render();
        return this._element;
    }
    render(){
        const levelGenre = new LevelGenre(this.model.getCurrentLevel());
        const levelArtist = new LevelArtist(this.model.getCurrentLevel());
        const header = new Header(this.model.state);
        header.onClick = () => this.headerClick();
        levelGenre.onAnswer = (answers) => this.onAnswer(answers);
        levelArtist.onAnswer = (answers) => this.onAnswer(answers);       
        const content = (this.model.getCurrentLevel().type === `artist`) ? levelArtist.element : levelGenre.element;
        const currentScreen = getElementFromTemplate(this.template);
        currentScreen.append(header.element);        
        currentScreen.append(content);  
        return currentScreen;
    }
    updateHeader(state){
        let header = this._element.querySelector(`header`);
        const newHeader = new Header(state);
        newHeader.onClick = () => this.headerClick();
        header.replaceWith(newHeader.element); 
    }
    headerClick() {}
    update(){
        const levelGenre = new LevelGenre(this.model.getCurrentLevel());
        const levelArtist = new LevelArtist(this.model.getCurrentLevel());
        const header = new Header(this.model.state);
        header.onClick = () => this.headerClick();
        levelGenre.onAnswer = (answers) => this.onAnswer(answers);
        levelArtist.onAnswer = (answers) => this.onAnswer(answers);
        this._element.textContent = ``;
        const content = (this.model.getCurrentLevel().type === `artist`) ? levelArtist.element : levelGenre.element;
        this._element.append(header.element);        
        this._element.append(content);  
    }
    onAnswer(answers){}
}
