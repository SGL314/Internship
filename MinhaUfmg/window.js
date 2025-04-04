function openBrWindow(theURL,winName,features) {
    w = window.open(theURL,winName,features);
    if (window.focus) w.focus();
  }
  
  function openFullWindow(theURL,winName) {
    openBrWindow(theURL,winName,'toolbar=yes,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes');
  }
  
  function openDefaultWindow(theURL,winName) {
    openFullWindow(theURL,winName);
  }
  