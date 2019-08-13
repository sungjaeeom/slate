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

var defaultlanguageCode = getLanguageCode();
var apiPath = getParameterByName("lang","ko");
var languageCode = apiPath != "ko"?"en":apiPath;

//var referrer = document.referrer;
//var tmp = referrer.split(separator);
//if(tmp.length > 1) {
//  for (var i=0;tmp.length>i;i++){
//    if(tmp[i] != "" && tmp[i].split(".").length > 2 && tmp[i].indexOf("gopax") > 0){
//      if(tmp[i].split(".")[tmp[i].split(".").length] != "kr"){
//        languageCode = "en";
//      }else{
//        languageCode = "ko";
//      }
//    }else{
//      languageCode = getLanguage("ko");
//    }
//  }
//}


if(defaultlanguageCode == null && defaultlanguageCode != languageCode ){
  changeLanguage(languageCode);
}

function getLanguage(){
  return window.localStorage.getItem('lang');
}

function getLanguageCode(){
  return window.localStorage.getItem('langCode');
}

function setCustomValue(name,value){
  window.localStorage.setItem(name,value);
  return;
}

function getCustomValue(name){
  return window.localStorage.getItem(name);
}

function removeLanguage(){
  window.localStorage.removeItem('lang');
  return;
}

function setLanguage() {
  document.getElementById("languageCode").value = getLanguageCode();
  document.getElementById("apiUrl").innerHTML = getApiUrl()
}

function changeLanguage(languageCode){
  if(languageCode != 'ko' && languageCode != 'en' && languageCode != 'id') return;
  var target = "index."+languageCode+".html";

  setCustomValue("langCode", languageCode);
    
  if(languageCode == 'ko') target = "";
  
  var pathName = window.location.pathname;
  var path = "/";
  if(pathName.split(separator).length > 2){
    path = pathName.split(separator)[2]!= "" ? separator+pathName.split(separator)[1]+separator:pathName;
  }
  var origin = window.location.origin;
  var targetUrl = origin+path+target;
  var currentUrl = origin+pathName;
  // alert("targetUrl=="+targetUrl);
  // alert("currentUrl=="+currentUrl);
  if(targetUrl == currentUrl){            
    return
  }

  window.location = targetUrl;
}

function getParameterByName(name, dValue) {
  //if(getLanguage() != null) return getLanguage();
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  if(results == null){
      if(getLanguage() == null){
        setCustomValue("lang", dValue);
      }
      return getLanguage();
  }else{
      setCustomValue("lang", decodeURIComponent(results[1].replace(/\+/g, " ")));
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}

function goAPIhistory(target){
  var separator = "/";
  var pathName = window.location.pathname;
  var path = pathName.split(separator)[2]!= "" ? separator+pathName.split(separator)[1]+separator:pathName;
  var origin = window.location.origin;
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
  var path = getLanguage();
  var apiHome = ""
  if(path == "en"){
    apiHome="https://www.gopax.com/account";
  }else if(path == "id"){
    apiHome = "https://www.gopax.co.id/account";
  }else{
    apiHome = "https://www.gopax.co.kr/account";
  }
  openURL(apiHome);
}

function getApiUrl(){
  var path = getLanguage();
  if(path == "en"){
      return "https://api.gopax.com";
  }else if(path == "id"){
      return "https://api.gopax.co.id";
  }else{
      return "https://api.gopax.co.kr";
  }
}


function goGopaxHome(){
  var path = getLanguage();
  var gopaxHome = ""
  if(path == "en"){
    gopaxHome="https://www.gopax.com";
  }else if(path == "id"){
    gopaxHome="https://www.gopax.co.id";
  }else{
    gopaxHome="https://www.gopax.co.kr";
  }
  openURL(gopaxHome);
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