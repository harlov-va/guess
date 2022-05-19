import Screen from '../game/screen';
import Application from '../router';

class GameScreen{
    constructor(model){
        this.model = model;
        this.screen = new Screen(this.model);
        this.screen.onAnswer = this.answer.bind(this);
        this._timer = null;
        this.newLevelTime = this.model.state.time;
     }
    get element(){
        return this.screen.element;
    }
    _tick(){
        if(this.model.state.time>0) {
            this.model.tick()
        } else {
            this.endGame();
            return;
        }
        this.screen.updateHeader(this.model.state);
        this.screen.headerClick = () => this.restart();
        this._timer = setTimeout(() => this._tick(), 1000);
    }
    stopGame(){
        clearInterval(this._timer);
    }
    startGame(){
        this._tick();
    }
    _compareArrays(arr1,arr2){
        if(arr1.length !== arr2.length) return false;
        arr1.sort();
        arr2.sort();
        for (let i = 0; i<arr1.length; i++) {
            if(arr1[i] !== arr2[i]) return false;
        };
        return true;
    }
    _stopSounds(){
        const listSounds = document.querySelectorAll(`audio`);
        listSounds.forEach((elem) =>{
            elem.pause();
        })
    }    
    _nextLevel(rightChose) {
        if(rightChose){
            this.model.setAnswer(this.newLevelTime - this.model.state.time);                
        } else {
            this.model.minusLife();
            this.model.setAnswer(-1);
            if(this.model.isDead()){
                this.endGame();
                return false;
            }
        };
        if(this.model.hasNextLevel()) {            
            this.model.nextLevel();
        } else {
            this.endGame();
            return false;
        }
        return true;   
    }
    answer(answers){
        this.stopGame();
        this._stopSounds();
        let correctAnswer = false;
        if (typeof(answers) === `number`) {
            correctAnswer = (this.model.getAnswers === answers);
        } else {
            correctAnswer = (this._compareArrays(answers,this.model.getAnswers));
        }
        if (this._nextLevel(correctAnswer)){    
            this.newLevelTime = this.model.state.time;
            this.startGame();
            this.screen.update();
        }
    }
    restart(){
        Application.showWelcome();
        this.stopGame();
    }
    endGame(){
        this.stopGame();
        Application.showStats(this.model);
    }
}
export default GameScreen;