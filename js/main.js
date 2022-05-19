(function () {
    'use strict';

    class AbstractView {
        constructor(){
            if(new.target === AbstractView){
                throw new Error(`Can't instantiate AbstractView, only concrete one`)
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

    class AbstactElement{
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

    const playStop = (elem) => {
        elem.classList.toggle(`track__button--play`);
        elem.classList.toggle(`track__button--pause`);
    };
    class AudioElement extends AbstactElement{
        constructor(src) {
            super();
            this.src = src;
            this.play = false;
            this.audio = null;
        }
        get template (){
            return `
        <div class="player-wrapper"> 
                <button class="track__button track__button--play" type="button"></button>
                <div class="track__status">
                    <audio src="${this.src}" preload="auto"></audio>
                </div>
        </div>`
        };
        get element(){
            if(this._element){
                return this._element;
            }        this._element = this.render();
            this.bind(this._element);
            return this._element;
        };
        render (){
            return getElementFromTemplate(this.template);
        }
        bind(element){
            this.audio = element.querySelector(`audio`);
            this.audio.src = this.src;
            const buttonPlay = element.querySelector('.track__button');
            buttonPlay.addEventListener(`click`,() => {
                  this.playTrack();
            });
        }
        playTrack(){   
            const button = this._element.querySelector('.track__button');     
            if(!this.play) {
                this.audio.play();
                this.play = true;
                playStop(button);            
            } else {
                this.audio.pause();
                this.play = false;
                playStop(button);
            }
        }
    }

    class LevelView extends AbstractView{
        constructor(level){
            super();
            this.level = level;
        }
        get element(){
            if(this._element){
                return this._element;
            }
            this._element = this.render();
            this.bind(this._element);
            return this._element;
        }    
        get template(){
            return `<section class="game__screen">
            <h2 class="game__title">Select all songs in the genre <span class="genre-type">${this.level.genre}</span></h2>
            <form class="game__tracks">
                ${[...this.level.answers]
                    .map((variant, index) => `
                        <div class="track">
                        <div class="game__answer">
                            <input class="game__input visually-hidden" type="checkbox" name="answer" value="${index}" id="answer-${index}">
                            <label class="game__check" for="answer-${index}">Cansel</label>
                        </div>
                        </div>`)
                    .join(``)
                    }                
                <button class="game__submit button" type="submit">Reply</button>
            </form>
        </section>`
        }
        render(){
            return getElementFromTemplate(this.template)
        }
        onAnswer(answers){}
        bind(element){
            //добавляю треки
            const tracks = element.querySelectorAll(`.track`);
            tracks.forEach((track,index) => {
                track.prepend((new AudioElement(this.level.answers[index].src)).element);
            });
            //добавляю обработчики на чекбоксы и кнопки
            const buttonSubmit = element.querySelector(`.game__submit`);
            const checkboxes = element.querySelectorAll(`input[type='checkbox']`);
            buttonSubmit.disabled = true;
            buttonSubmit.addEventListener('click',(evt)=>{
                evt.preventDefault();
                const checkedElements = element.querySelectorAll(`input[type='checkbox']:checked`);
                const userAnswers = [];
                checkedElements.forEach((elem) => {
                    userAnswers.push(parseInt(elem.value));
                });
                //надо подписаться на это событие
                this.onAnswer(userAnswers);
            });
            checkboxes.forEach((elem) => {
                elem.addEventListener('click',()=>{        
                    if(element.querySelectorAll(`input[type='checkbox']:checked`).length>0) {
                        buttonSubmit.disabled = false;
                    } else {
                        buttonSubmit.disabled = true;
                    }
                });
            });
        }
    }

    const CIRCLE_RADIUS = 370;
    const START_TIME = 300;
    const TIME_WARNING = 30;
    class Header extends LevelView {
        constructor(state){
            super();
            this.state = state;
            this.propTime = this.state.time / START_TIME;
            this.minute = Math.floor(this.state.time/60);
            this.second = (this.state.time % 60) < 10 ? `0`+ (this.state.time % 60): (this.state.time % 60);
        }
        get template(){
            return `
            <header class="game__header">
            <a class="game__back" href="#">
                <span class="visually-hidden">Play again</span>
                <img class="game__logo" src="./img/melody-logo-ginger.png" alt="Guess the melody">
            </a>

            <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
                <circle class="timer__line" stroke-dasharray="${this._calculateCircle(this.propTime).stroke}" stroke-dashoffset="${this._calculateCircle(this.propTime).offset}" cx="390" cy="390" r="370" style="filter: url(#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center">
            </svg>

            <div class="timer__value" xmlns="http://www.w3.org/1999/xhtml">
                <span class="timer__mins">${this.minute}</span>
                <span class="timer__dots">:</span>
                <span class="timer__secs">${this.second}</span>
            </div>

            <div class="game__mistakes">
                ${new Array(3-this.state.lives)
                .fill(`<div class="wrong"></div>`)
                .join(``)
                }
            </div>
            </header>`
        }
        get element(){
            if(this._element){
                return this._element;
            }
            this._element = this.render();
            this.bind(this._element);
            return this._element;
        }
        _calculateCircle (proportion){
            const stroke = Math.round(2 * Math.PI * CIRCLE_RADIUS);
            const offset = stroke - (stroke * proportion);
            return {stroke, offset};
        }
        render(){
            return getElementFromTemplate(this.template);
        }
        bind(element){
            const buttonNewGame = element.querySelector(`.game__back`);
            buttonNewGame.addEventListener(`click`,this.onClick);
            const timerValue = this.element.querySelector(`.timer__value`);
            const circle = this.element.querySelector(`.timer__line`);
            if (this.state.time < TIME_WARNING) {
                timerValue.classList.add(`timer-expired`);
                circle.classList.add(`timer-expired`);
            }
        }
        onClick(){}
    }

    const getElementFromTemplate = (template) => {
        const wrapper = document.createElement(`div`);
        wrapper.innerHTML = template.trim();    
        return wrapper.firstChild;
    };

    const mainElement = document.querySelector(`.main`);

    const changeScreen = (element) => {
        mainElement.innerHTML = ``;
        mainElement.appendChild(element);
        return mainElement;
    };

    class WelcomeElement extends AbstractView { 
        get template(){
            return `<section class="welcome">
            <div class="welcome__logo"><img src="img/melody-logo.png" alt="Guess the melody" width="186" height="83"></div>
            <button class="welcome__button"><span class="visually-hidden">Start the game</span></button>
            <h2 class="welcome__rules-title">Rules of the game</h2>
            <p class="welcome__text">The rules are simple:</p>
            <ul class="welcome__rules-list">
            <li>All questions need to be answered in 5 minutes.</li>
            <li>3 mistakes can be made.</li>
            </ul>
            <p class="welcome__text">Good luck!</p>
        </section>`;
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
            return getElementFromTemplate(this.template);
        }
        bind(element){
            const buttonPlay = element.querySelector(`.welcome__button`);
            buttonPlay.addEventListener('click',this.onClick);
        }
        onClick(){}
    }

    class WelcomeScreen{
        constructor(){
            this.welcome = new WelcomeElement();
            this.welcome.onClick = () => {
                Application.showGame();
            };
        }
        get element(){
            return this.welcome.element;
        }
    }

    class LevelArtist extends AbstractView{
        constructor(level){
            super();
            this.level = level;
        }
        get template(){
            return `
        <section class="game__screen">
            <h2 class="game__title">Who sings this song?</h2>
            <div class="game__track">
                
            </div>
            <form class="game__artist">
                ${[...this.level.answers]
                .map((variant,index) => `<div class="artist">
                <input class="artist__input visually-hidden" type="radio" name="answer" value=${index} id="answer-${index}">
                <label class="artist__name" for="answer-1">
                    <img class="artist__picture" src="${variant.image}" alt="${variant.title}">
                        ${variant.title}
                </label>
                </div>`)
                .join(``)
                }
            </form>
            </section>
        </section>`;
        }
        get element(){
            if(this._element){
                return this._element;
            }        this._element = this.render();
            this.bind(this._element);
            return this._element;
        }
        render(){
            return getElementFromTemplate(this.template);
        }
        bind(element){
            //добавляю треки
            const track = element.querySelector(`.game__track`);
            let rightAnswer = 0;
            for(let i=0; i<this.level.answers.length; i++){
                if(this.level.answers[i].isCorrect) { 
                    rightAnswer = i;
                    break ;
                }
            }
            const audio = new AudioElement(this.level.answers[rightAnswer].src);
            track.prepend(audio.element);
            audio.playTrack();
            //добавляю обработчики 
            const answers = element.querySelectorAll('.artist');
                answers.forEach((answer) => {
                    answer.addEventListener('click',(evt) => {
                        this.onAnswer(parseInt(evt.currentTarget.querySelector(`.artist__input`).value));
                    });
                });
        }
        onAnswer(answers){}
    }

    class Screen extends AbstractView{
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
            const levelGenre = new LevelView(this.model.getCurrentLevel());
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
            const levelGenre = new LevelView(this.model.getCurrentLevel());
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
                this.model.tick();
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
            }        return true;
        }
        _stopSounds(){
            const listSounds = document.querySelectorAll(`audio`);
            listSounds.forEach((elem) =>{
                elem.pause();
            });
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
            }        if(this.model.hasNextLevel()) {            
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

    const INITIAL_GAME = Object.freeze({
        level: 0,
        lives: 3,
        time: 300,
        answers: []
    });

    const changeLevel = (game, level) => {
        if(typeof level !== `number`){
            throw new Error(`Level should be of type number`);
        }    if(level<0){
            throw new Error(`Level should not be negative value`);
        }    return Object.assign({},game, {level});
    };

    const canContinue = (game) => game.lives > 0;

    const die = (game) =>{
        if(!canContinue(game)) {
            throw new Error(`You can't continue anymore`);
        }
        const lives = game.lives-1;
        return Object.assign({},game, {lives});
    };

    const QUEST = [
      {
        "id": "4",
        "type": "genre",
        "artist_id": null,
        "genre": "electronic",
        "src": null,
        "answers": [
            {
                "title": "Mob Battle",
                "image": "",
                "genre": "alternative",
                "src": "img/Mob_Battle.mp3"
            },
            {
                "title": "Addis Ababa",
                "image": "",
                "genre": "reggae",
                "src": "img/Addis_Ababa.mp3"
            },
            {
                "title": "Acoustic Circles",
                "image": "",
                "genre": "country",
                "src": "img/Acoustic_Circles.mp3"
            },
            {
                "title": "Clean Break",
                "image": "",
                "genre": "electronic",
                "src": "img/Clean_Break.mp3"
            }
        ]
    },
    {
        "id": "15",
        "type": "genre",
        "artist_id": null,
        "genre": "country",
        "src": null,
        "answers": [
            {
                "title": "Skanada",
                "image": "",
                "genre": "reggae",
                "src": "img/Skanada.mp3"
            },
            {
                "title": "Parkside",
                "image": "",
                "genre": "country",
                "src": "img/Parkside.mp3"
            },
            {
                "title": "Dirty Mac",
                "image": "",
                "genre": "country",
                "src": "img/Dirty_Mac.mp3"
            },
            {
                "title": "Acoustic Circles",
                "image": "",
                "genre": "country",
                "src": "img/Acoustic_Circles.mp3"
            }
        ]
    },
    {
        "id": "8",
        "type": "genre",
        "artist_id": "10",
        "genre": "reggae",
        "src": null,
        "answers": [
            {
                "title": "Azure",
                "image": "",
                "genre": "electronic",
                "src": "img/Azure.mp3"
            },
            {
                "title": "Dub_Spirit",
                "image": "",
                "genre": "reggae",
                "src": "img/Dub_Spirit.mp3"
            },
            {
                "title": "Skanada",
                "image": "",
                "genre": "reggae",
                "src": "img/Skanada.mp3"
            },
            {
                "title": "Bark",
                "image": "",
                "genre": "reggae",
                "src": "img/Bark.mp3"
            }
        ]
    },
    {
        "id": "16",
        "type": "artist",
        "artist_id": "27",
        "genre": null,
        "src": "img/Bark.mp3",
        "answers": [
            {
                "title": "John Deley and the 41 Players",
                "image": "img/John_Deley_and_the_41_Players.jpg",
                "genre": "punk-rock",
                "src": "img/Bark.mp3",
                "isCorrect": true
            },
            {
                "title": "Spazz Cardigan",
                "image": "img/Spazz_Cardigan.jpg",
                "genre": "synthpop",
                "src": "",
                "isCorrect": false
            },
            {
                "title": "Jingle Punks",
                "image": "img/Jingle_Punks.jpg",
                "genre": "classic rock",
                "src": "",
                "isCorrect": false
            }
        ]
    },
    {
        "id": "18",
        "type": "genre",
        "artist_id": null,
        "genre": "electronic",
        "src": null,
        "answers": [
            {
                "title": "Clean Break",
                "image": "",
                "genre": "electronic",
                "src": "img/Clean_Break.mp3"
            },
            {
                "title": "Blue Whale",
                "image": "",
                "genre": "alternative",
                "src": "img/Blue_Whale.mp3"
            },
            {
                "title": "Azure",
                "image": "",
                "genre": "electronic",
                "src": "img/Azure.mp3"
            },
            {
                "title": "Weak Knight",
                "image": "",
                "genre": "electronic",
                "src": "img/Weak_Knight.mp3"
            }
        ]
    },
    {
        "id": "6",
        "type": "artist",
        "artist_id": null,
        "genre": "classic rock",
        "src": "img/Renegade_Jubilee.mp3",
        "answers": [
            {
                "title": "Freedom Trail Studio",
                "image": "img/Freedom_Trail_Studio.jpg",
                "genre": "alternative",
                "src": "",
                "isCorrect": false
            },
            {
                "title": "The Whole Other",
                "image": "img/The_Whole_Other.jpg",
                "genre": "synthpop",
                "src": "img/Renegade_Jubilee.mp3",
                "isCorrect": true
            },
            {
                "title": "The Mini Vandals",
                "image": "img/The_Mini_Vandals.jpg",
                "genre": "classic rock",
                "src": "",
                "isCorrect": false
            }
        ]
    },
    {
        "id": "7",
        "type": "artist",
        "artist_id": "7",
        "genre": null,
        "src": "img/Addis_Ababa.mp3",
        "answers": [
            {
                "title": "Spazz Cardigan",
                "image": "img/Spazz_Cardigan.jpg",
                "genre": "alternative",
                "src": "https://guessmelody.anatoly-dolgov.ru/library/Placebo - Meds.mp3",
                "isCorrect": false
            },
            {
                "title": "The Mini Vandals",
                "image": "img/The_Mini_Vandals.jpg",
                "genre": "alternative",
                "src": "img/Addis_Ababa.mp3",
                "isCorrect": true
            },
            {
                "title": "Dan Lebowitz",
                "image": "img/Dan_Lebowitz.jpg",
                "genre": "synthpop",
                "src": "https://guessmelody.anatoly-dolgov.ru/library/Duran Duran - Come Undone.mp3",
                "isCorrect": false
            }
        ]
    },
    {
        "id": "9",
        "type": "genre",
        "artist_id": null,
        "genre": "reggae",
        "src": null,
        "answers": [
            {
                "title": "Parkside",
                "image": "https://guessmelody.anatoly-dolgov.ru/img/logos/sum41.png",
                "genre": "country",
                "src": "img/Parkside.mp3"
            },
            {
                "title": "Bark",
                "image": "https://guessmelody.anatoly-dolgov.ru/img/logos/evanescence.png",
                "genre": "reggae",
                "src": "img/Bark.mp3"
            },
            {
                "title": "Dub Spirit",
                "image": "https://guessmelody.anatoly-dolgov.ru/img/logos/one_republic.jpg",
                "genre": "reggae",
                "src": "img/Dub_Spirit.mp3"
            },
            {
                "title": "Weak Knight",
                "image": "https://guessmelody.anatoly-dolgov.ru/img/logos/eurythmics.png",
                "genre": "electronic",
                "src": "img/Weak_Knight.mp3"
            }
        ]
    },
    {
        "id": "2",
        "type": "artist",
        "artist_id": "1",
        "genre": null,
        "src": "img/Mob_Battle.mp3",
        "answers": [
            {
                "title": "Quincas Moreira",
                "image": "img/Quincas_Moreira.jpg",
                "genre": "alternative",
                "src": "",
                "isCorrect": false
            },
            {
                "title": "John Deley and the 41 Players",
                "image": "img/John_Deley_and_the_41_Players.jpg",
                "genre": "alternative",
                "src": "https://guessmelody.anatoly-dolgov.ru/library/Muse - 08 - Hysteria.mp3",
                "isCorrect": false
            },
            {
                "title": "Silent Partner",
                "image": "img/Silent_Partner.jpg",
                "genre": "pop-rock",
                "src": "img/Mob_Battle.mp3",
                "isCorrect": true
            }
        ]
    },
    {
        "id": "11",
        "type": "artist",
        "artist_id": null,
        "genre": "grunge",
        "src": "img/Nothin_Yet.mp3",
        "answers": [
            {
                "title": "John Deley and the 41 Players",
                "image": "img/John_Deley_and_the_41_Players.jpg",
                "genre": "grunge",
                "src": "",
                "isCorrect": false
            },
            {
                "title": "Spazz Cardigan",
                "image": "img/Spazz_Cardigan.jpg",
                "genre": "grunge",
                "src": "img/Nothin_Yet.mp3",
                "isCorrect": true
            },
            {
                "title": "Freedom Trail Studio",
                "image": "img/Freedom_Trail_Studio.jpg",
                "genre": "metal",
                "src": "",
                "isCorrect": false
            }
        ]
    }
    ];

    //const getLevel = (state) => QUEST[state.level];
    const tick = (state) => Object.assign({},state, {time: state.time-1});

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

    class StatsView extends AbstractView{
        constructor(textScoring){
            super();
            this.text = textScoring;
        }
        get template(){
            return `<section class="result">
            <div class="result__logo"><img src="img/melody-logo.png" alt="Guess the melody" width="186" height="83"></div>
            ${this.text}            
            <button class="result__replay" type="button">Play again</button>
        </section>`
        };
        get element(){
            if(this._element){
                return this._element;
            }        this._element = this.render();
            this.bind(this._element);
            return this._element;
        }
        render(){
            return getElementFromTemplate(this.template);
        }
        onClick(){}
        bind(element){
            const buttonReturn = element.querySelector(`.result__replay`);
            buttonReturn.addEventListener(`click`,this.onClick);
        }
    }

    const scoring = (answers, notes) => {
        if(notes === 3 ) return false;
        let countRight = 0;
        let countTime = 0;
        answers.forEach((elem) => {
            if(elem > 0) {
                countRight++;
                if(elem <30) countTime ++;
            }
        });    
        return countRight + (countTime*2) - (notes)*2;
    };

    const COUNT_NOTES = 3;
    const FULL_TIME = 300;

    const resultGame = (gamers, {time,lives,answers}) => {
        if(time<=0) return `<h2 class="result__title">Alas and ah!</h2><p class="result__total result__total--fail">Time is over! You didn't have time to guess all the tunes</p>`;
        if(lives === 0) return `<h2 class="result__title">What a pity!</h2><p class="result__total result__total--fail">You have run out of all attempts. Nothing, luck next time!</p>`;
        let fastAnswers = 0;
        answers.forEach((item) => {
            if(item<30 && item>-1) fastAnswers++;
        });
        let notesOfGamer = COUNT_NOTES - lives;
        let resultOfGamer = scoring(answers,notesOfGamer);
        const results = [resultOfGamer];
        gamers.forEach((elem) => {
            let notes = 0;
            elem.answers.forEach((item) => {
                if(item === -1) notes++;
            });
            results.push(scoring(elem.answers,notes));
        });    
        results.sort((left, right) => right - left);
        let position = results.lastIndexOf(resultOfGamer) + 1;
        let procentOfSuccess = Math.round(((results.length - position)/results.length)*100);
        return `<h2 class="result__title">You are a real music lover!</h2>
            <p class="result__total">In ${Math.floor((FULL_TIME-time)/60)} minutes and ${((FULL_TIME-time) % 60)} seconds, you scored ${resultOfGamer} points (${fastAnswers} quick), making ${notesOfGamer} mistakes</p>
            <p class="result__text">You finished ${position} out of ${results.length} players. Better than ${procentOfSuccess}% players</p>`
    };

    class StatsPresenter{
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

    const results = [
        {
          answers: [7, 28, 56, 18, 43, 16, 6, 20, 43, 48],
          "points": "13",
          "time": "9",
          "restNotes": "0",
          "mistakes": "1",
          "fast": "6"
        },
        {
          answers: [39, 40, 59, 17, 31, 14, 58, 6, 36, 24],
          "points": "2",
          "time": "287",
          "restNotes": "9",
          "mistakes": "0",
          "fast": "1"
        },
        {
          answers: [31, 41, 21, 46, 31, 28, 35, 50, 12, 2],
          "points": "16",
          "time": "247",
          "restNotes": "0",
          "mistakes": "1",
          "fast": "9"
        },
        {
          answers: [16, 43, 51, 4, 22, 39, 53, 45, 0, 2],
          "points": "16",
          "time": "3",
          "restNotes": "0",
          "mistakes": "0",
          "fast": "6"
        },
        {
          answers: [12, 42, 53, 11, 24, 11, 16, 55, 36, 14],
          "points": "19",
          "time": "13",
          "restNotes": "0",
          "mistakes": "0",
          "fast": "8"
        },
        {
          answers: [25, 40, 57, 7, 47, 27, 33, 38, 37, 2],
          "points": "14",
          "time": "30",
          "restNotes": "0",
          "mistakes": "1",
          "fast": "7"
        },
        {
          answers: [22, 50, 24, 35, 51, 55, 42, 57, 15, 5],
          "points": "16",
          "time": "157",
          "restNotes": "0",
          "mistakes": "1",
          "fast": "9"
        },
        {
          answers: [48, 19, 28, 26, 4, -1, 40, 4, 60, 35],
          "points": "30",
          "time": "216",
          "restNotes": "0",
          "mistakes": "2",
          "fast": "29"
        },
        {
          answers: [53, 3, 7, 13, 44, 27, 27, 37, -1, 43],
          "points": "49",
          "time": "204",
          "restNotes": "0",
          "mistakes": "0",
          "fast": "38"
        },
        {
          answers: [60, 5, 50, 13, 16, 35, 37, 22, 26, 15],
          "points": "12",
          "time": "237",
          "restNotes": "0",
          "mistakes": "2",
          "fast": "8"
        },
        {
          answers: [11, 51, 14, 9, 48, 37, 30, 24, 38, 31],
          "points": "32",
          "time": "245",
          "restNotes": "0",
          "mistakes": "0",
          "fast": "18"
        },
        {
          answers: [57, 4, 18, 45, 39, 59, 44, 22, 17, 13],
          "points": "13",
          "time": "178",
          "restNotes": "0",
          "mistakes": "2",
          "fast": "11"
        },
        {
          answers: [25, 17, 37, 19, 15, 57, 26, 8, 39, 23],
          "points": "16",
          "time": "164",
          "restNotes": "0",
          "mistakes": "1",
          "fast": "9"
        },
        {
          answers: [17, 43, 59, 14, 23, 0, 3, 42, 29, 54],
          "points": "11",
          "time": "157",
          "restNotes": "0",
          "mistakes": "2",
          "fast": "7"
        },
        {
          answers: [7, 49, 1, 34, 27, 19, 25, 17, 29, 10],
          "points": "11",
          "time": "139",
          "restNotes": "0",
          "mistakes": "2",
          "fast": "7"
        },
        {
          answers: [29, 37, 11, 13, 59, 59, 26, 7, 54, 56],
          "points": "15",
          "time": "175",
          "restNotes": "0",
          "mistakes": "1",
          "fast": "8"
        },
        {
          answers: [31, 11, 11, 8, 48, 38, 56, 5, 36, 7],
          "points": "12",
          "time": "225",
          "restNotes": "0",
          "mistakes": "2",
          "fast": "8"
        }
      ];

    const SERVER_URL = `https://guessmelody.anatoly-dolgov.ru/assets/`;
    const checkStatus = (response) => {
        if (response.ok) {
            return response;
        } else {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
    };

    const toJSON = (res) => res.json();

    class Loader {
        static async loadData() {
            let result;
            try {
                const response = checkStatus(await fetch(`${SERVER_URL}get_data.php?questions`));
                result = toJSON(response);
            }
            catch (e) {
                throw new Error(e.message);
            }
            return result;
        }
        static async loadResults() {        
            let result = [...results];
            // try {
            //     // const response = checkStatus(await fetch(`${SERVER_URL}/stats/${APP_ID}`));
            //     const response = checkStatus(await fetch(`${SERVER_URL}get_data.php?results`));
            //     result = toJSON(response);
            // }
            // catch (e) {
            //     throw new Error(e.message);
            // }
            return result;
        }
        static async saveResults(data) {
            const requestSettings = {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': `application/json`
                },
                method: `POST`
            };        
            let response = {
                ok: true
            };
            // try {
            //     // response = checkStatus(await fetch(`${SERVER_URL}/stats/${APP_ID}`, requestSettings));
            //     response = checkStatus(await fetch(`${SERVER_URL}save_result.php`, requestSettings));          
            // }
            // catch (e) {
            //     throw new Error(e.message);
            // }
            return response.ok;
        }
    }

    class ErrorView extends AbstractView{
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

    class ErrorPresenter{
        constructor(error){
            this.error = error;
            this._view = null;
            this.errorView = new ErrorView(this.error);
        }
        get view(){
            if(!this._view){
                this._view = this.errorView.element;
            }        return this._view;
        }
    }

    class SplashScreen extends AbstractView{
        constructor(){
            super();
            this.cursor = 0;
            this.symbolsSeq = `/—\\|`;
        }
        get template(){
            return `<div></div>`;
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

    let gameData;
    class Application {
        //старый вариант с Promise
        // static start(){
        //     const splash = new SplashScreen();
        //     changeScreen(splash.element);
        //     splash.start();
        //     Loader.loadData()
        //     .then((data) => gameData = adapterSeverData(data))
        //     .then(() => Application.showWelcome())
        //     .catch(Application.showError)
        //     .then(() => splash.stop());
        // }
        static start() {
            Application.load().catch(Application.showError);
        }

        static async load() {
            const splash = new SplashScreen();
            changeScreen(splash.element);
            splash.start();
            try {
                gameData = await Loader.loadData();
                Application.showWelcome();
            } finally {
                splash.stop();
            }
        }
        static showWelcome() {
            const welcome = new WelcomeScreen();
            changeScreen(welcome.element);
        }

        static showGame() {
            const gameScreen = new GameScreen(new GameModel(gameData));
            changeScreen(gameScreen.element);
            gameScreen.startGame();
        }
        static async showStats(model) {
            const splash = new SplashScreen();
            if (model.state.time > 0 && model.state.lives > 0) {
                changeScreen(splash.element);
                splash.start();
                try {
                    await Loader.saveResults(model.state);
                    const result = new StatsPresenter(model, await Loader.loadResults());
                    changeScreen(result.element);
                }
                catch (e) {
                    Application.showError(e);
                }
                splash.stop();
            } else {
                const result = new StatsPresenter(model, {});
                changeScreen(result.element);
            }
        }
        static showError(error) {
            const errorPresenter = new ErrorPresenter(error);
            changeScreen(errorPresenter.view);
        };
    }

    Application.showWelcome();

}());

//# sourceMappingURL=main.js.map
