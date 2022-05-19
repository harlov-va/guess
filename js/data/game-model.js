import {
    INITIAL_GAME,
    changeLevel,
    die
} from './quest';
import QUEST from './quest-data';
import { adapterSeverData } from './data-adapter';
//const getLevel = (state) => QUEST[state.level];
const tick = (state) => Object.assign({},state, {time: state.time-1})

class GameModel{
    constructor(data){
        this.restart();
        this.data = data || QUEST;
    }
    get state(){
        return this._state;
    }
    get getAnswers(){
        const curLevel = this.getCurrentLevel();
        if(curLevel.type === `artist`){
            let rightAnswer = 0;
            for(let i=0; i<curLevel.answers.length; i++){
                if(curLevel.answers[i].isCorrect) { 
                    rightAnswer = i;
                    break ;
                }
            }
            return rightAnswer;
        } else {
            const res = [];
            for(let i=0; i<curLevel.answers.length; i++){
                if(curLevel.answers[i].genre === curLevel.genre) { 
                    res.push(i);
                }
            }
            return res;
        }        
    }
    setAnswer(answer){
        if(typeof(answer)!==`number`){
            throw new Error(`Invalid user response data format`);
        }
        this._state.answers.push(answer);
    }
    hasNextLevel(){        
        return this.getLevel(this._state.level +1) !== void 0;
    }
    nextLevel(){
        this._state = changeLevel(this._state , this._state.level + 1);
    }
    die(){
        this._state = die(this._state);
    }
    restart(){
        this._state = Object.assign({},INITIAL_GAME);
        this._state.answers = [];
    }
    minusLife(){
        if(this._state.lives !== 0 ) this._state.lives --;
    }
    isDead(){
        return this._state.lives <= 0;
    }
    getLevel(levelNumber){
        return this.data[levelNumber];
    }
    getCurrentLevel(){
        return this.getLevel(this._state.level);
    }
    tick(){
        this._state = tick(this._state);
    }
}
export default GameModel;