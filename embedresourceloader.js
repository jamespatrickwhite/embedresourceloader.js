/*
 * Embed Resource Loader - Not a great name, but that's mostly what this does
 * Copyright 2019 James White
 * https://github.com/jamespatrickwhite/embedresourceloader.js
 * v0.1.0 - 2019/05/12
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/
 */

/*
 * Given a CMS, LMS, or similar system that forcibly whitelist restricts Javascript and/or CSS resources
 * from being used, and re-used, implement a bootstrapping global script that allows page designers to
 * use the embed HTML element to trigger external resource loading into the page.
 * This library processes both existing, as well as later dynamically added, embed elements on the page.
 *
 * For Javascript:           <embed src="[url to file]" type="javascript">
 * For Javascript module:    <embed src="[url to file]" type="javascript;module">
 * For Javascript no-module: <embed src="[url to file]" type="javascript:nomodule">
 * For CSS:                  <embed src="[url to file]" type="css">
 *
 * To require the browser to not use a cached copy (required for Chrome at times to recognize changed files)
 * Append ";nocache" to the type value: ie:
 * <embed src="[url to file]" type="javascript;nocache">
 * OR
 * <embed src="[url to file]" type="javascript;module;nocache">
 */
(() => {
// Added no cache option due to observed random behavior between Chrome (as of 20190512) and other browsers
function toNoCacheURL(url) {
  const rand = `${Math.random()}${Date.now()}`;
  if (url.includes('?'))
    return `${url}&__nocache__=${rand}`;
  return `${url}?__nocache__=${rand}`;
}

function loadJavascriptResource(type, src) {
  const typeModifiers = type.split(';');
  typeModifiers.shift();

  if (typeModifiers.includes('nocache'))
    src = toNoCacheURL(src);

  const scriptElem = document.createElement('script');
  scriptElem.src = src;

  if (typeModifiers.includes('module'))
    scriptElem.type = 'module';
  else
    scriptElem.type = 'text/javascript';

  if (typeModifiers.includes('nomodule'))
    scriptElem.setAttribute('nomodule','');

  document.head.appendChild(scriptElem);
}
function loadCSSResource(type, src) {
  const typeModifiers = type.split(';');
  typeModifiers.shift();

  if (typeModifiers.includes('nocache'))
    src = toNoCacheURL(src);

  const cssElem = document.createElement('link');
  cssElem.rel = 'stylesheet';
  cssElem.type = 'text/css';
  cssElem.href = src;
  document.head.appendChild(cssElem);
}

function processEmbed(embed) {
  if (!embed.src)
    return;
  switch(embed.type.split(';')[0].toLowerCase()) {
    case 'javascript':
      loadJavascriptResource(embed.type, embed.src);
      embed.parentNode.removeChild(embed);
      break;
    case 'css':
      loadCSSResource(embed.type, embed.src);
      embed.parentNode.removeChild(embed);
      break;
  }
}

function initialScan() {
  const elems = document.querySelectorAll('embed');
  for(const embed of elems)
    processEmbed(embed);
}

function addListener() {
  const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
      if (mutation.type !== 'childList')
        return;
      for(const newNode of mutation.addedNodes)
        if (newNode.nodeName === 'EMBED')
          processEmbed(newNode);
    }
  });
  observer.observe(document.body, { childList:true, subtree: true, attributes: false });
}

function bootstrap() {
  initialScan();
  addListener();
}
if (document.body)
  bootstrap();
else
  window.addEventListener('DOMContentLoaded',bootstrap,false);
})();
