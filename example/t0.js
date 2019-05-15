(() => { 
  let x = document.createElement('div');
  x.textContent = `Example #0 nomodule script: ${(new Date()).toString()}`;
  document.body.appendChild(x);
})();
