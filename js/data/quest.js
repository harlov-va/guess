export const INITIAL_GAME = Object.freeze({
    level: 0,
    lives: 3,
    time: 300,
    answers: []
});

export const changeLevel = (game, level) => {
    if(typeof level !== `number`){
        throw new Error(`Level should be of type number`);
    };
    if(level<0){
        throw new Error(`Level should not be negative value`);
    };
    return Object.assign({},game, {level});
}

export const canContinue = (game) => game.lives > 0;

export const die = (game) =>{
    if(!canContinue(game)) {
        throw new Error(`You can't continue anymore`);
    }
    const lives = game.lives-1;
    return Object.assign({},game, {lives});
}