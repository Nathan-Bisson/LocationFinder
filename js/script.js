// JavaScript Document
//ADD PATH TO FUNCTIONS FOR TOUCH!!!!!!!!!!!!!!!
var pages = [];			
var links = [];
var screenList = [];	
var numLinks =0;
var numPages = 0;

var localLat= [];
var localLong=[];

window.addEventListener("DOMContentLoaded", init);

function init() {
	document.addEventListener("deviceready", setUp);
	
	pages = document.querySelectorAll('[data-role="page"]');
	numPages = pages.length;
	console.log(pages);
  
	links = document.querySelectorAll('[data-role="link"]');
	numLinks = links.length;

	for (var i=0; i<links.length; i++) {
		console.log( links[i].href );
		console.log( links[i].dataset.role );
		console.log( links[i].getAttribute('data-role') );
	}	
	//check for local storage
	if(localStorage.getItem("location") == null){
		setUpLocalStorage();
	}else {
		listData();
	}
	
	setUp();
}

function setUp(ev) {
	var links = document.querySelectorAll('[data-role="link"]');
	
	for(var lnk=0; lnk<numLinks;lnk++ ){
	if( detectTouchSupport() ){
		links[lnk].addEventListener("touchend", handleTouchEnd); 
	}else{
    	links[lnk].addEventListener("click", handleLinkClick); 
	}
  }
}

function setUpLocalStorage(){
	if(navigator.geolocation) {
		var params = {enableHighAccuracy: true, timeout:360000, maximumAge:0};
		navigator.geolocation.getCurrentPosition(watchPosition, gpsError, params);
	}
	else {
		document.querySelector("#map").innerHTML += "<h3>Get a newer broswer.</h3>";
	}
}

function watchPosition(position) {
	var setLat = position.coords.latitude;
	var setLong = position.coords.longitude;
	var latLong = setLat + "|" + setLong;
	
	localStorage.setItem("location", latLong);
}

function listData(){
	var myList = localStorage.getItem("location");
	var breakList= myList.split("&");
	//create the UL
	for(i=0; i<breakList.length; i++){
		var parts = breakList[i].split("|");
		document.querySelector("#storageList").innerHTML += '<li class="locItems">' + parts + '</li>';
	}
}

function handleTouchEnd(ev) {
	//pass the touchend event directly to a click event
	ev.preventDefault();
	var target = ev.currentTarget;
	var newEvt = document.createEvent('Event');
	newEvt.initEvent('tap', true, true);
	target.addEventListener('tap', handleLinkClick);
	target.dispatchEvent(newEvt);
	//this will send a click event from the touched tab to 
}

function handleLinkClick(ev) {
	ev.preventDefault( ); 
	var href = ev.currentTarget.href;
	var parts = href.split("#");	
	loadPage(parts[1]);
	console.log(href);
	
	switch(parts[1]) {
		case "home" :
			doHomeThings();
			break;
		case "map" :
			loadMap();
			break;
		case "past" :
			doPastThings();
			break;
	}
}

function loadPage( pageid ){
	if( pageid == null || pageid == "undefined"){
		//show the home page
		pageid = pages[0].id;
  	}
	if( screenList[ screenList.length - 1] != pageid){
		screenList.push( pageid );  //save the history
		//don't bother saving if it is the same page
	}
	//remove active class from all pages except the one called pageid
	for(var pg=0;pg<numPages;pg++){
		if(pages[pg].id == pageid){
			pages[pg].className = "active";
		}else{
			pages[pg].className = "";	
		}
		//if you ever use other classes on the pages then you need to handle that 
		//scenario and not delete those other classnames
		//there is a property called classList that you can use in all browsers except IE before version 10
	}
	//update the style of the tabs too
	for(var lnk=0; lnk<numLinks; lnk++){
		links[lnk].className = "";
	}
	var currTab = document.querySelector('[href="#' + pageid + '"]').className = "activetab";
}

function loadMap() {
	document.querySelector("#map").innerHTML = ""; //removes previous map
	
	if(navigator.geolocation) {
		var params = {enableHighAccuracy: true, timeout:360000, maximumAge:0};
		navigator.geolocation.getCurrentPosition(userPosition, gpsError, params);
	}
	else {
		document.querySelector("#map").innerHTML += "<h3>Get a newer broswer.</h3>";
	}
}

function userPosition(position) {
	console.log(position.coords.latitude);
  	console.log(position.coords.longitude);
  	console.log(position.coords.accuracy);
  	console.log(position.coords.altitude);
	
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var altitude = position.coords.altitude;
	
	document.querySelector("#storageList").innerHTML += '<li class="locItems">' + latitude + "," + longitude + '</li>';
	
	document.querySelector("#map").innerHTML += '<h1>Maps</h1>';
	document.querySelector("#map").innerHTML += '<p>This displays some maps!</p>';
	document.querySelector("#map").innerHTML += '<div id="theCanvas"></div>';
	document.querySelector("#theCanvas").innerHTML += '<canvas id="myMap" width="200" height="500"></canvas>';
	
	var canvas = document.querySelector('#myMap');
	var context = canvas.getContext('2d');
	var img = document.createElement("img");
		img.onload = function() {
			context.drawImage(img, 0, 0);
		}
	img.src = "http://maps.google.com/maps/api/staticmap?" + latitude + "," + longitude + "&zoom=14&markers=" + latitude + "," + longitude + "&size=250x500&sensor=false";
	
	//localStorage.setItem("Latitude", latitude);
	//localStorage.setItem("Longitude", longitude);
	setLocalStorage(latitude, longitude);
}	

function setLocalStorage(passLat, passLong) {
	var latitude = passLat;
	var longitude = passLong;
	
	var oldValue = localStorage.getItem("location");
	oldValue = oldValue + "&" + latitude + "|" + longitude;
	localStorage.setItem("location", oldValue);
	
}

function gpsError(error) {
	var errors = {
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
}

function doHomeThings() {
	
}

function doPastThings() {
	
}

function failLocalStorage() {
	alert("Your browser does not support local storage. Please upgrade.");
}

function detectTouchSupport( ){
  msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
  touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
  return touchSupport;
}
