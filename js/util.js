import WelcomeElement from "./game/welcome";
import Header from "./game/header";

export const getElementFromTemplate = (template) => {
    const wrapper = document.createElement(`div`);
    wrapper.innerHTML = template.trim();    
    return wrapper.firstChild;
};

const mainElement = document.querySelector(`.main`);

export const changeScreen = (element) => {
    mainElement.innerHTML = ``;
    mainElement.appendChild(element);
    return mainElement;
};
export const returnWelcome = (elem) => {
    elem.addEventListener('click', () => {
        changeScreen((new WelcomeElement()).element);
    });
};
export const updateHeader = (state) => {
    let header = mainElement.querySelector(`header`);
    header.replaceWith((new Header(state)).element); 
}