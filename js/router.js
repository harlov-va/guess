import WelcomeScreen from './presenter/welcome-presenter';
import GameScreen from './presenter/game-presenter';
import GameModel from './data/game-model';
import StatsPresenter from './presenter/result-presenter';
import { changeScreen } from './util';
import Loader from './data/loader';
import ErrorPresenter from './presenter/error-presenter';
import SplashScreen from './game/splash-screen';
import { adapterSeverData } from './data/data-adapter';
let gameData;
export default class Application {
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