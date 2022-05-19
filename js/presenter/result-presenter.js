import StatsView from '../game/stats-view';
import { resultGame } from '../result-game';
import Application from '../router';

export default class StatsPresenter{
    constructor(model,data){
        this.state = Object.assign({},model.state);
        this._element = null;
        this.data = data;
    }
    get element() {
        this._element = new StatsView(resultGame(this.data,this.state));            
        this._element.onClick = () => {Application.showWelcome();};
        return this._element.element;
    }
}