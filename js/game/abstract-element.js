export default class AbstactElement{
    constructor(){
        if(new.target === AbstactElement){
            throw new Error(`Can't instantiate AbstactElement, only concrete one`)
        }
    }
    get template () {
        throw new Error(`Template is required`);
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
        return render(this.template);
    }
    bind(element){
        
    }
}