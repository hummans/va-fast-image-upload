/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
/// <reference path='../custom.d.ts'/>
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from './components/app/app.component';

const APP_NAME = 'vafastimageupload';
declare global {
    interface Window { vafastimageupload: any; }
}
const rootElement = document.getElementById(APP_NAME)
const defaultLang = {
  choiceTitle: 'Choice the upload option',
  takeFoto: 'Take a picture',
  sendFoto: 'Send picture',
  sendData: 'Data is sent',
  screenButtonTitle: 'Send Foto',
  titleSelectDevice: 'Select device',
  titlePermissonFailed: 'Permission failed',
  contentPermissonFailed: 'Your browser has no permission for the camera. Please activate the permission.',
  titleWaitPermission: 'Wait for your permission'
}
const defaultSettings = {
  uploadUrl: location.href,
  disableTakePhoto: false,
  disableButton: false,
}

if(window.hasOwnProperty(APP_NAME)){
  window[APP_NAME].lang = Object.assign(defaultLang, window[APP_NAME].lang);
  window[APP_NAME].settings = Object.assign(defaultSettings, window[APP_NAME].settings);
}else{
  window[APP_NAME] = {
    lang: defaultLang,
    settings: defaultSettings
  }
}
window[APP_NAME].app_name = APP_NAME;


ReactDOM.render(
    <App compiler="TypeScript" framework="React" />, rootElement
);
