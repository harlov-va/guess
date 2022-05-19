import AbstactView from './abstract-view';
import { getElementFromTemplate } from "../util";
export default class ErrorView extends AbstactView{
    constructor(error){
        super();
        this._element = null;
        this.error = error;
    }
    get template(){
        return `
        <div class="end">
            <p>An error has occurred: ${this.error.message}</p>
        </div>`;
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

}