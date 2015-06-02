var current_lat,current_lon,map1;window.onload=function(){getLocation();initiated=!1;document.getElementById("mapButton").onclick=function(){controlMap(40.807536,-73.962573,"map");initiated=!0};document.getElementById("locationSelectorButton").onclick=function(){drawmap(current_lat,current_lon)}};
var createMap=function(a,b,c){initiated&&map.remove();map=(new L.Map("map")).setView(new L.LatLng(a,b),17);L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'}).addTo(map);"mapPost"===c&&L.Control.geocoder().addTo(map);L.marker([a,b]).addTo(map).setLatLng(map.getCenter())},controlMap=function(a,b,c){var e=$("#mapPost");e.fadeIn(200);createMap(a,b,c);window.onkeyup=function(a){27==a.keyCode&&e.fadeOut(200)};window.onmouseup=
function(a){(!e.is(a.target)&&0===e.has(a.target).length||a.target===document.getElementById("close_map"))&&e.fadeOut(200)}};function getLocation(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(showPosition)}function showPosition(a){current_lat=a.coords.latitude;current_lon=a.coords.longitude}
function drawmap(a,b){controlMap(a,b,"mapPost");initiated=!0;map.on("GeoCoder_getLatLonName",function(a){document.getElementById("display_name").innerHTML=a.result.display_name;document.getElementById("coordinates").innerHTML=a.result.lat+" "+a.result.lon})}var socket=io(),userID;$(window).load(function(){manipulate_elements();socket_handling()});
var manipulate_elements=function(){control_sidebar();control_main_body_load()},control_sidebar=function(){document.getElementById("eventBar");var a=document.getElementById("bringButton"),b=function(){$("#body, #menuSelector").velocity("stop").velocity({opacity:1},{duration:350});$("#eventBar").velocity("stop").velocity({translateX:"-24%"},{duration:350});a.style.paddingBottom="0";$("#bringButton").velocity("stop").velocity({"padding-left":"0"},{duration:300});$("#blank, #eventBarMenu, #calendarView").css({display:"none"});
a.innerHTML="Events &nbsp;<i class='fa fa-chevron-right'></i>"};$("#bringButton, #eventBar, #calendarView, #blank").hover(function(){$("#body, #menuSelector").velocity("stop").velocity({opacity:"0.4"},{duration:300});$("#eventBar").velocity("stop").velocity({translateX:"104.3%"},{duration:300});a.style.paddingBottom="30px";$("#bringButton").velocity("stop").velocity({"padding-left":"3%"},{duration:300});$("#blank, #eventBarMenu, #calendarView").css({display:"block"});a.innerHTML="<i class='fa fa-chevron-left'></i>&nbsp; Events "},
b);document.getElementById("post_event").onclick=function(){$("#eventPostArea").velocity({opacity:1},{display:"block"},{duration:200});b();close_event_posting()}},close_event_posting=function(){var a=$("#eventPostArea");window.onkeyup=function(b){$("#map").is(":visible")||27!=b.keyCode||a.velocity({opacity:0},{display:"none"},{duration:200})};document.getElementById("closePosting").onclick=function(){a.velocity({opacity:0},{display:"none"},{duration:200})}},control_main_body_load=function(){var a=
document.getElementById("bringThread"),b=document.getElementById("bringChat"),c=document.getElementById("threadArea"),e=document.getElementById("chatArea"),m=function(){$("#bringMessages, #inputBar").css("display","none");e.style.zIndex="-1";c.style.zIndex="0"},g=function(){e.style.zIndex="0";c.style.zIndex="-1"};a.onclick=function(){b.style.color="#000000";e.style.zIndex="-2";a.style.color="#00BCD4";c.style.zIndex="-1";$("#threadArea").velocity({"margin-left":"40%",width:"60%"},{duration:200});$("#chatArea").velocity({"margin-left":"100%",
width:"0"},{duration:1,delay:200});setTimeout(m,200)};b.onclick=function(){e.style.zIndex="-1";b.style.color="#E91E63";c.style.zIndex="-2";a.style.color="#000000";$("#bringMessages, #inputBar").delay(50).queue(function(a){$(this).css("display","block");a()});$("#chatArea").velocity({"margin-left":"40%",width:"60%"},{duration:200});$("#threadArea").velocity({"margin-left":"100%",width:"0"},{duration:1,delay:200});setTimeout(g,200)}},socket_handling=function(){document.getElementById("title").onclick=
function(){window.location="/home"};var a=new Date,b=document.getElementById("messageInput"),c=document.getElementById("userName").value;b.addEventListener("keydown",function(e){13===e.which&&!1===e.shiftKey&&(socket.emit("send chat message",{name:c,time:a,message:this.value}),e.preventDefault())});document.getElementById("submit").onclick=function(){var a=document.getElementById("Name").value,b=document.getElementById("Time").value,g=document.getElementById("locDescript").value,d=document.getElementById("Description").value,
c=!0,f=document.getElementById("alert");if(null===a||""===a)f.innerHTML="Please enter event name",f.style.display="block",c=!1;else if(null===g||""===g)f.innerHTML="Please enter location of your event",f.style.display="block",c=!1;else if(null===b||""===b)f.innerHTML="Please enter time of your event",f.style.display="block",c=!1;else if(null===d||""===d)f.innerHTML="Please describe your event",f.style.display="block",c=!1;c&&(socket.emit("post event",{title:a,location:g,time:b,description:d}),$("#eventPostArea").velocity({opacity:0},
{display:"none"},{duration:300}));document.getElementById("Name").value="";document.getElementById("Time").value="";document.getElementById("locDescript").value="";document.getElementById("Description").value=""};document.getElementById("closePosting").onclick=function(){$("#eventPostArea").velocity({opacity:0},{display:"none"},{duration:300})};socket.on("send chat message",function(a,m){var g=document.getElementById("messages"),d=document.createElement("li");d.innerText=a;d.className=c==m?"user":
"other";g.appendChild(d);$("#messages").velocity({scrollTop:$("#messages").prop("scrollHeight")+$("#messages").height()},10);b.value=""});socket.on("new event",function(a){var b=document.getElementById("eventStream"),c=document.createElement("LI");c.className="event";var d,h=document.createElement("div");h.className=h;d=document.createTextNode(a.title);h.appendChild(d);var f=document.createElement("div");f.className=f;d=document.createTextNode(a.location);f.appendChild(d);var k=document.createElement("div");
k.className=k;d=document.createTextNode(a.time);k.appendChild(d);var l=document.createElement("div");l.className=l;d=document.createTextNode(a.description);l.appendChild(d);c.appendChild(h);c.appendChild(f);c.appendChild(k);c.appendChild(l);"noEventFiller"===b.childNodes[0].id?b.replaceChild(c,b.childNodes[0]):b.appendChild(c)});socket.on("disconnect",function(){console.log("User disconnected")})};
