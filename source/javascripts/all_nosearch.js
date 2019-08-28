//= require ./lib/_energize
//= require ./app/_toc
//= require ./app/_lang

$(function() {
  loadToc($('#toc'), '.toc-link', '.toc-list-h2', 10);
  setupLanguages($('body').data('languages'));
  $('.content').imagesLoaded( function() {
    window.recacheHeights();
    window.refreshToc();
  });
});

window.onpopstate = function() {
  activateLanguage(getLanguageFromQueryString());
};


var separator = "/";
var origin = window.location.origin;

var languageCode = getParameterByName("lang","ko");
if(window.location.pathname.indexOf("html") <0){
  changeLanguage(languageCode);  
  setCustomValue("path", window.location.pathname);
}


function getDisplayLanguage(){
  return window.localStorage.getItem('lang');
}

function setCustomValue(name,value){
  window.localStorage.setItem(name,value);
  return;
}

function getCustomValue(name){
  return window.localStorage.getItem(name);
}

function setLanguage() {
  document.getElementById("languageCode").value = getDisplayLanguage();
  document.getElementById("exchange").value = getCustomValue("exchange");
  document.getElementById("apiUrl").innerHTML = getApiHome();
  setLabel();
}

function setLabel(){
  document.getElementById("exchange_title").innerHTML = getDisplayLanguage()=="ko"?"거래소 :: ":"Exchange :: ";
  document.getElementById("language_title").innerHTML = getDisplayLanguage()=="ko"?"언&nbsp;&nbsp;&nbsp;어 :: ":"Language :: ";
}

function changeExchange(exchange){
  setCustomValue("exchange", exchange);
  document.getElementById("apiUrl").innerHTML = getApiHome();
}

function changeLanguage(languageCode){
  if(languageCode != 'ko' && languageCode != 'en' && languageCode != 'id') return;
  var target = "index."+languageCode+".html";

  setCustomValue("lang", languageCode);
    
  if(languageCode == 'ko') target = "";
  var pathName = window.location.pathname;
  var targetUrl = getURL(target);
  var currentUrl = origin+pathName;
  if(targetUrl == currentUrl){            
    return
  }

  window.location = targetUrl;
}

function getURL(target){
  var path = getCustomValue("path")==null?"/":getCustomValue("path");  
  return origin+path+target;
}

function getParameterByName(name, dValue) {
  //if(getLanguage() != null) return getLanguage();
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  if(results == null){
      if(getDisplayLanguage() == null){
        setCustomValue(name, dValue);
      }
      if(getCustomValue("exchange") == null){
        setCustomValue("exchange", dValue);
      }
      return getDisplayLanguage();
  }else{
      setCustomValue(name, decodeURIComponent(results[1].replace(/\+/g, " ")));
      setCustomValue("exchange", decodeURIComponent(results[1].replace(/\+/g, " ")));
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}

function goAPIhistory(param){
  var target = "index."+getDisplayLanguage()+param+".html";
  if(param == "" ){
    changeLanguage(getDisplayLanguage());
    return;
  }else if(param != "" && getDisplayLanguage() =="ko" ) {
    target = "index"+param+".html";
  }
  var separator = "/";
  var pathName = window.location.pathname;  
  var path = getCustomValue("path")==null?"/":getCustomValue("path");
  // var path = pathName.split(separator)[2]!= "" ? separator+pathName.split(separator)[1]+separator:pathName;
  var targetUrl = origin+path+target;
  var currentUrl = origin+pathName;
  if(targetUrl == currentUrl){
    return
  }
  window.location = targetUrl;
}

function apiGitHome(){
  var separator = "/";
  var account = window.location.host.split(".")[0];
  var pathName = window.location.pathname;
  var path = pathName.split(separator)[2]!= "" ? separator+pathName.split(separator)[1]+separator:pathName;
  var targetUrl = "https://github.com/"+account+path;
  openURL(targetUrl);
}

function getApiKey(){
  openURL(getGopaxHomeURL()+"/account");
}

function getApiHome(){
  var path = getCustomValue("exchange");
  
  if(path == "en"){
    return "https://api.gopax.com";
  }else if(path == "id"){
    return "https://api.gopax.co.id";
  }else{
    return "https://api.gopax.co.kr";
  }
  
}

function getGopaxHomeURL(){
  var path = getCustomValue("exchange");
  if(path == "en"){
    return "https://www.gopax.com";
  }else if(path == "id"){
    return "https://www.gopax.co.id";
  }else{
    return "https://www.gopax.co.kr";
  }
}

function goGopaxHome(){
  openURL(getGopaxHomeURL());
}

function openURL(url) {
  var link = document.createElement('a');
  link.target = "_blank";
  link.href = url;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link); // you need to add it to the DOM to get FF working
  link.click();
  link.parentNode.removeChild(link); // link.remove(); doesn't work on IE11
};