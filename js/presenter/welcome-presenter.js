import WelcomeElement from "../game/welcome";
import Application from "../router";

export default class WelcomeScreen{
    constructor(){
        this.welcome = new WelcomeElement();
        this.welcome.onClick = () => {
            Application.showGame();
        }
    }
    get element(){
        return this.welcome.element;
    }
}