import AbstractView from "./abstract-view";
import { getElementFromTemplate } from "../util";

export default class SplashScreen extends AbstractView{
    constructor(){
        super();
        this.cursor = 0;
        this.symbolsSeq = `/—\\|`;
    }
    get template(){
        return`<div></div>`;
    }
    get element(){
        if(!this._element){
            this._element = this.render();
        }
        return this._element;
    }
    render(){
        return getElementFromTemplate(this.template);
    }
    start(){
        this.cursor = ++this.cursor >= this.symbolsSeq.length ? 0 : this.cursor;
        this._element.textContent = this.symbolsSeq[this.cursor];
        this.timeout = setTimeout(() => this.start(),50);
    }
    stop(){
        clearTimeout(this.timeout);
    }
}