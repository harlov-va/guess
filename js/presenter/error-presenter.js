import ErrorView from "../game/error-view";

export default class ErrorPresenter{
    constructor(error){
        this.error = error;
        this._view = null;
        this.errorView = new ErrorView(this.error);
    }
    get view(){
        if(!this._view){
            this._view = this.errorView.element;
        };
        return this._view;
    }
}