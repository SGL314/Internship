function checkrename() {
    with (document.formRename) {
      if (uP_target_name.value == "" || uP_target_name.value.substring(0,1) == " ") {
        alert("Favor digitar um nome para a aba.");
        uP_target_name.focus();
        return false;
      }
      submit();
    }
  }
  
  function getCookieData(labelName) {
    var labelLen = labelName.length;
    var cookieData = document.cookie;
    var cLen = cookieData.length;
    var i = 0;
    var cEnd;
    while (i < cLen) {
      var j = i + labelLen;
      if (cookieData.substring(i,j) == labelName) {
        cEnd = cookieData.indexOf(";",j);
        if (cEnd == -1) {
          cEnd = cookieData.length;
        }
        var s = unescape(cookieData.substring(j+1, cEnd));
        var sLen = s.length;
        return s.substring(1,sLen);
      }
      i++;
    }
    return "";
  }
  
  function load() {
    var div = document.getElementById("mapdiv");
    if (div != null)
      onLoadMap(div);
  }
  
  function unload() {
    var div = document.getElementById("mapdiv");
    if (div != null)
      onUnloadMap();
  }
  