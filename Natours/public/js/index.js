/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from "./login";

const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form'); 
const logOutBtn = document.querySelector('.nav__el--logout');

    

if(mapbox)
{
    const locations = JSON.parse(mapbox.dataset.locations);
    displayMap(locations);
}

if(loginForm){
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
    login(email, password);
  });
}

if(logOutBtn) logOutBtn.addEventListener('click', logout);