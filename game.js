var gamecanvas = document.getElementById("game");
var gamectx = gamecanvas.getContext("2d");
var ctrlcanvas = document.getElementById("control");
var ctrlctx = ctrlcanvas.getContext("2d");
var menu = document.getElementById("menu");
var isshowdamage = document.getElementById("subshowdamage");
var level = 1;
var bosslevel = 0;
var bossbuff = [];
var bufftext = "";
const bossbufflist = ["神盾", "狂熱", "暴力", "堅韌"];
var chalist = [0];
var enemyCD = 0;
var f1CT = 0, f2CT = 0, f3CT = 0, f4CT = 0, f5CT = 0, f6CT = 0; //5, 10, 10, 15, 15, 30
var tower_hp = 25*(level+1);
var my_tower_hp = tower_hp, enemy_tower_hp = tower_hp;
var my_tower_hp_temp = my_tower_hp, enemy_tower_hp_temp = enemy_tower_hp;
var damages = [0, 0];
var mydamages = [0, 0, 0, 0, 0, 0];
var dmg_numbers = [];
var isgame = false;
var myfighters = [], enemyfighters = [];
var my_frontest = [], enemy_frontest = [];
var myfront = 350, enemyfront = 2475;
var enemysummonpoint = 2525;
var is_dmg_visual = "On";
var window_x_scroll = 0, scroll_counter = 0;
var L7BOSS_name_time = 0;
var start_time, end_time;

var maxlevel = window.localStorage.getItem("maxlevel");
if ((maxlevel > 0) != true) {maxlevel = 0;}
if (maxlevel > 0) {document.getElementById('submenu').innerHTML = '<p id="gametitle">crash the tower</p><button onclick="startgame()" id="startbutton2"><p>PLAY</p></button><button onclick="hardgame()" id="startbutton3"><p>挑戰模式</p></button><p id="hardmodetext">LV</p><input type="number" value="'+maxlevel+'" min="0" max="'+maxlevel+'" step="1" id="inputframe">';}
let x_percentage_difference = window.innerWidth/1366, y_percentage_difference = window.innerHeight/695;
let percentage_reflesh = Math.min(x_percentage_difference, y_percentage_difference);
document.querySelector('meta[name="viewport"]').setAttribute("content", "width=device-width, initial-scale="+percentage_reflesh+", maximum-scale="+percentage_reflesh+", user-scalable=0");

ctrlcanvas.addEventListener("click", function(event){
    let mousePos = getMousePos(ctrlcanvas, event);
    control(mousePos.x, mousePos.y);
});

function getMousePos(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

document.getElementById("showdamage").addEventListener("click", function(){switchdmgvisual();});

function switchdmgvisual(){
    if (is_dmg_visual == "Off") {
        is_dmg_visual = "On";
        isshowdamage.style.backgroundColor = "green";
        isshowdamage.innerHTML = is_dmg_visual
    }
    else {
        is_dmg_visual = "Off";
        isshowdamage.style.backgroundColor = "red";
        isshowdamage.innerHTML = is_dmg_visual
    }
}

gamectx.lineWidth = 5;
ctrlctx.lineWidth = 5;
gamectx.font = "30px serif";
ctrlctx.font = "75px serif";
var lingrad = gamectx.createLinearGradient(0, 0, 0, 150);
lingrad.addColorStop(0, "#00ABEB");
lingrad.addColorStop(1, "#ffffff");

class damagevisual{
    constructor(x, number, direction) {
        this.x = x-15-direction*15;
        this.y = 160+Math.random()*30;
        this.number = -number;
        this.direction = direction;
        this.time = 10;
        if (number == 0) {this.fontcolor = "rgba(100, 100, 100, "}
        else {this.fontcolor = "rgba(255, 0, 0, "}
        
    }
    run(){
        let rgbacolor = this.fontcolor+(0.5+(20-this.time)*0.025)+")";
        gamectx.beginPath();
        gamectx.fillStyle = rgbacolor;
        gamectx.fillText(this.number, this.x-this.direction*(20-this.time)*1.5, this.y);
        gamectx.closePath();
        this.time--;
    }
}

class fighter1{
    constructor(x, team) {
        this.x = x;
        this.team = team;
        if (this.team == "M") {
            this.direction = 1;
            this.weapon_color = "#0080FF";
        }
        else {
            this.direction = -1;
            this.weapon_color = "#FF0000";
        }
        this.hp = 5;
        this.block = 4;
        this.taken = 0;
        this.damage = 1;
        this.armor = 0;
        this.action = 0;
        this.time = 0;
    }
    run(){
        if (this.taken >= this.block) {
            this.action = -2;
            this.taken = 0;
            this.time = 30;
        }
        if (this.action == -2) {
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.arc(this.x+this.direction*(-30), 235-56.25+((this.time-15)/2)**2, 30, 0, Math.PI*2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.moveTo(this.x+this.direction*(-30), 265-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-30), 305-56.25+((this.time-15)/2)**2);
            gamectx.moveTo(this.x, 300-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-20), 290-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-30), 280-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-50), 300-56.25+((this.time-15)/2)**2);
            gamectx.moveTo(this.x+this.direction*(-25), 350-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-28), 320-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-30), 305-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-32), 320-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-35), 350-56.25+((this.time-15)/2)**2);
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.weapon_color;
            gamectx.moveTo(this.x+this.direction*(-50), 300-1.5);
            gamectx.lineTo(this.x+this.direction*(-40), 300-1.5);
            gamectx.lineTo(this.x+this.direction*(-55), 340-1.5);
            gamectx.lineTo(this.x+this.direction*(-60), 300-1.5);
            gamectx.lineTo(this.x+this.direction*(-50), 300-1.5);
            gamectx.fill();
            gamectx.lineTo(this.x+this.direction*(-48), 280-1.5);
            gamectx.stroke();
            gamectx.closePath();
            this.x -= this.direction*2;
            this.time--;
            if (this.time <= 0) {this.action = 0;}
        }
        else if (this.action == -1) {
            if (this.time >= 90) {
                gamectx.beginPath();
                gamectx.fillStyle = "#ffffff";
                gamectx.arc(this.x+this.direction*(-30+((120-this.time)/4)**2), 232, 30, 0, Math.PI*2);
                gamectx.fill();
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.moveTo(this.x+this.direction*(-30+((120-this.time)/4)**2), 265-3);
                gamectx.lineTo(this.x+this.direction*(-30+((120-this.time)/4)**2), 305-3);
                gamectx.moveTo(this.x+this.direction*(((120-this.time)/4)**2/1.5), 300-10);
                gamectx.lineTo(this.x+this.direction*(-20+((120-this.time)/4)**2/1.5), 290-7.5);
                gamectx.lineTo(this.x+this.direction*(-30+((120-this.time)/4)**2), 280-3);
                gamectx.lineTo(this.x+this.direction*(-50+((120-this.time)/4)**2*2), 300-1.5);
                gamectx.moveTo(this.x+this.direction*(-25-8+((120-this.time)/4)**2*1.2), 350);
                gamectx.lineTo(this.x+this.direction*(-28-2+((120-this.time)/4)**2*1.25), 320);
                gamectx.lineTo(this.x+this.direction*(-30+((120-this.time)/4)**2), 305-3);
                gamectx.lineTo(this.x+this.direction*(-35+8), 350);
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.fillStyle = this.weapon_color;
                gamectx.moveTo(this.x+this.direction*(-50+((120-this.time)/4)**2*2), 300-1.5);
                gamectx.lineTo(this.x+this.direction*(-50+((120-this.time)/4)**2*2), 290-1.5);
                gamectx.lineTo(this.x+this.direction*(-10+((120-this.time)/4)**2*2), 300-1.5);
                gamectx.lineTo(this.x+this.direction*(-50+((120-this.time)/4)**2*2), 310-1.5);
                gamectx.lineTo(this.x+this.direction*(-50+((120-this.time)/4)**2*2), 300-1.5);
                gamectx.fill();
                gamectx.lineTo(this.x+this.direction*(-70+((120-this.time)/4)**2*2), 300-1.5);
                gamectx.stroke();
                gamectx.closePath();
            }
            else if (this.time >= 60) {
                if (this.time == 60) {
                    if (this.team == "M") {if (enemyfront-this.x <= 90) {
                        send_a_damage(this.damage, enemy_frontest, enemyfighters);
                        mydamages[0] += this.damage;
                    }}
                    else {if (this.x-myfront <= 90) {send_a_damage(this.damage, my_frontest, myfighters);}}
                }
                gamectx.beginPath();
                gamectx.fillStyle = "#ffffff";
                gamectx.arc(this.x+this.direction*(-30+56.25), 232, 30, 0, Math.PI*2);
                gamectx.fill();
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.moveTo(this.x+this.direction*(-30+56.25), 265-3);
                gamectx.lineTo(this.x+this.direction*(-30+56.25), 305-3);
                gamectx.moveTo(this.x+this.direction*(+37.5), 300-10);
                gamectx.lineTo(this.x+this.direction*(-20+37.5), 290-7.5);
                gamectx.lineTo(this.x+this.direction*(-30+56.25), 280-3);
                gamectx.lineTo(this.x+this.direction*(-50+56.25*2), 300-1.5);
                gamectx.moveTo(this.x+this.direction*(-25-8+56.25*1.2), 350);
                gamectx.lineTo(this.x+this.direction*(-28-2+56.25*1.25), 320);
                gamectx.lineTo(this.x+this.direction*(-30+56.25), 305-3);
                gamectx.lineTo(this.x+this.direction*(-35+8), 350);
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.fillStyle = this.weapon_color;
                gamectx.moveTo(this.x+this.direction*(-50+56.25*2), 300-1.5);
                gamectx.lineTo(this.x+this.direction*(-50+56.25*2), 290-1.5);
                gamectx.lineTo(this.x+this.direction*(-10+56.25*2), 300-1.5);
                gamectx.lineTo(this.x+this.direction*(-50+56.25*2), 310-1.5);
                gamectx.lineTo(this.x+this.direction*(-50+56.25*2), 300-1.5);
                gamectx.fill();
                gamectx.lineTo(this.x+this.direction*(-70+56.25*2), 300-1.5);
                gamectx.stroke();
                gamectx.closePath();
            }
            else {
                gamectx.beginPath();
                gamectx.fillStyle = "#ffffff";
                gamectx.arc(this.x+this.direction*(-30), 232, 30, 0, Math.PI*2);
                gamectx.fill();
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.moveTo(this.x+this.direction*(-30), 265-3);
                gamectx.lineTo(this.x+this.direction*(-30), 305-3);
                gamectx.moveTo(this.x, 300-10);
                gamectx.lineTo(this.x+this.direction*(-20), 290-7.5);
                gamectx.lineTo(this.x+this.direction*(-30), 280-3);
                gamectx.lineTo(this.x+this.direction*(-50), 300-1.5);
                gamectx.moveTo(this.x+this.direction*(-25-8), 350);
                gamectx.lineTo(this.x+this.direction*(-28-2), 320);
                gamectx.lineTo(this.x+this.direction*(-30), 305-3);
                gamectx.lineTo(this.x+this.direction*(-32+2), 320);
                gamectx.lineTo(this.x+this.direction*(-35+8), 350);
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.fillStyle = this.weapon_color;
                gamectx.moveTo(this.x+this.direction*(-50), 300-1.5);
                gamectx.lineTo(this.x+this.direction*(-40), 300-1.5);
                gamectx.lineTo(this.x+this.direction*(-55), 340-1.5);
                gamectx.lineTo(this.x+this.direction*(-60), 300-1.5);
                gamectx.lineTo(this.x+this.direction*(-50), 300-1.5);
                gamectx.fill();
                gamectx.lineTo(this.x+this.direction*(-48), 280-1.5);
                gamectx.stroke();
                gamectx.closePath();
            }
            this.time--;
            if (this.time <= 0) {this.action = 0;}
        }
        else {
            this.action++;
            if (this.action > 60) {this.action = 0;}
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.arc(this.x+this.direction*(-30), 235-Math.abs(this.action-30)/10, 30, 0, Math.PI*2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.moveTo(this.x+this.direction*(-30), 265-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-30), 305-Math.abs(this.action-30)/10);
            gamectx.moveTo(this.x, 300-Math.abs(this.action-30)/3);
            gamectx.lineTo(this.x+this.direction*(-20), 290-Math.abs(this.action-30)/4);
            gamectx.lineTo(this.x+this.direction*(-30), 280-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-50), 300-Math.abs(this.action-30)/20);
            gamectx.moveTo(this.x+this.direction*(-25-Math.cos(Math.PI*this.action/30)*8), 350);
            gamectx.lineTo(this.x+this.direction*(-28-Math.cos(Math.PI*this.action/30)*2), 320);
            gamectx.lineTo(this.x+this.direction*(-30), 305-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-32+Math.cos(Math.PI*this.action/30)*2), 320);
            gamectx.lineTo(this.x+this.direction*(-35+Math.cos(Math.PI*this.action/30)*8), 350);
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.weapon_color;
            gamectx.moveTo(this.x+this.direction*(-50), 300-Math.abs(this.action-30)/20);
            gamectx.lineTo(this.x+this.direction*(-40), 300-Math.abs(this.action-30)/20);
            gamectx.lineTo(this.x+this.direction*(-55), 340-Math.abs(this.action-30)/20);
            gamectx.lineTo(this.x+this.direction*(-60), 300-Math.abs(this.action-30)/20);
            gamectx.lineTo(this.x+this.direction*(-50), 300-Math.abs(this.action-30)/20);
            gamectx.fill();
            gamectx.lineTo(this.x+this.direction*(-48), 280-Math.abs(this.action-30)/20);
            gamectx.stroke();
            gamectx.closePath();
            if (this.team == "M") {
                if (enemyfront-this.x <= 90) {this.action = -1, this.time = 120;}
                else {this.x += 1.2;}
            }
            else {
                if (this.x-myfront <= 90) {this.action = -1, this.time = 120;}
                else {this.x -= 1.2;}
            }
        }
    }
    takedamage(take){
        this.hp -= take;
        this.taken += take;
        if (is_dmg_visual == "On") {dmg_numbers.push(new damagevisual(this.x, take, this.direction));}
    }
}

class fighter2{
    constructor(x, team) {
        this.x = x;
        this.team = team;
        if (this.team == "M") {
            this.direction = 1;
            this.weapon_color = "#0080FF";
        }
        else {
            this.direction = -1;
            this.weapon_color = "#FF0000";
        }
        this.hp = 3;
        this.block = 1;
        this.taken = 0;
        this.damage = 0.05;
        this.armor = 0;
        this.action = 0;
        this.time = 0;
    }
    run(){
        if (this.taken >= this.block) {
            this.action = -2;
            this.taken = 0;
            this.time = 30;
        }
        if (this.action == -2) {
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.arc(this.x+this.direction*(-30), 235-56.25+((this.time-15)/2)**2, 30, 0, Math.PI*2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.moveTo(this.x+this.direction*(-30), 265-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-30), 305-56.25+((this.time-15)/2)**2);
            gamectx.moveTo(this.x+this.direction*(-25-8), 350-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-28-2), 320-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-30), 305-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-32+2), 320-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-35+8), 350-56.25+((this.time-15)/2)**2);
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.weapon_color;
            gamectx.moveTo(this.x+this.direction*(-60), 280-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(20), 280-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(20), 290-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-35), 290-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-35), 305-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-45), 305-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-45), 295-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-50), 290-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-50), 280-56.25+((this.time-15)/2)**2);
            gamectx.fill();
            gamectx.moveTo(this.x+this.direction*(-53), 290-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-48), 298-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-30), 295-56.25+((this.time-15)/2)**2);
            gamectx.moveTo(this.x+this.direction*(-5), 294-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(5), 285-56.25+((this.time-15)/2)**2);
            gamectx.stroke();
            this.x -= this.direction*2;
            this.time--;
            if (this.time <= 0) {this.action = 0;}
        }
        else if (this.action == -1) {
            if (this.time%2 == 0) {
                if (this.team == "M") {if (enemyfront-this.x <= 200) {
                    send_a_damage(this.damage, enemy_frontest, enemyfighters);
                    mydamages[1] += this.damage;
                }}
                else {if (this.x-myfront <= 200) {send_a_damage(this.damage, my_frontest, myfighters);}}
                gamectx.beginPath();
                gamectx.fillStyle = "#ffffff";
                gamectx.arc(this.x+this.direction*(-30), 235-3, 30, 0, Math.PI*2);
                gamectx.fill();
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.moveTo(this.x+this.direction*(-30), 265-3);
                gamectx.lineTo(this.x+this.direction*(-30), 305-3);
                gamectx.moveTo(this.x+this.direction*(-25-8), 350);
                gamectx.lineTo(this.x+this.direction*(-28-2), 320);
                gamectx.lineTo(this.x+this.direction*(-30), 305-3);
                gamectx.lineTo(this.x+this.direction*(-32+2), 320);
                gamectx.lineTo(this.x+this.direction*(-35+8), 350);
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.fillStyle = this.weapon_color;
                gamectx.moveTo(this.x+this.direction*(-60), 280-6);
                gamectx.lineTo(this.x+this.direction*(20), 280-6);
                gamectx.lineTo(this.x+this.direction*(20), 290-6);
                gamectx.lineTo(this.x+this.direction*(-35), 290-6);
                gamectx.lineTo(this.x+this.direction*(-35), 305-6);
                gamectx.lineTo(this.x+this.direction*(-45), 305-6);
                gamectx.lineTo(this.x+this.direction*(-45), 295-6);
                gamectx.lineTo(this.x+this.direction*(-50), 290-6);
                gamectx.lineTo(this.x+this.direction*(-50), 280-6);
                gamectx.fill();
                gamectx.moveTo(this.x+this.direction*(-53), 290-6);
                gamectx.lineTo(this.x+this.direction*(-48), 298-6);
                gamectx.lineTo(this.x+this.direction*(-30), 295-6);
                gamectx.moveTo(this.x+this.direction*(-5), 294-6);
                gamectx.lineTo(this.x+this.direction*(5), 285-6);
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.beginPath();
                gamectx.fillStyle = "#FFFF37";
                gamectx.moveTo(this.x+this.direction*(25), 280-6);
                gamectx.lineTo(this.x+this.direction*(35), 270-6);
                gamectx.lineTo(this.x+this.direction*(30), 280-6);
                gamectx.lineTo(this.x+this.direction*(32), 285-6);
                gamectx.lineTo(this.x+this.direction*(30), 290-6);
                gamectx.lineTo(this.x+this.direction*(35), 300-6);
                gamectx.lineTo(this.x+this.direction*(25), 290-6);
                gamectx.fill();
                gamectx.closePath();
            }
            else {
                gamectx.beginPath();
                gamectx.fillStyle = "#ffffff";
                gamectx.arc(this.x+this.direction*(-30), 235-3, 30, 0, Math.PI*2);
                gamectx.fill();
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.moveTo(this.x+this.direction*(-30), 265-3);
                gamectx.lineTo(this.x+this.direction*(-30), 305-3);
                gamectx.moveTo(this.x+this.direction*(-25-8), 350);
                gamectx.lineTo(this.x+this.direction*(-28-2), 320);
                gamectx.lineTo(this.x+this.direction*(-30), 305-3);
                gamectx.lineTo(this.x+this.direction*(-32+2), 320);
                gamectx.lineTo(this.x+this.direction*(-35+8), 350);
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.fillStyle = this.weapon_color;
                gamectx.moveTo(this.x+this.direction*(-60), 280-6);
                gamectx.lineTo(this.x+this.direction*(20), 280-6);
                gamectx.lineTo(this.x+this.direction*(20), 290-6);
                gamectx.lineTo(this.x+this.direction*(-35), 290-6);
                gamectx.lineTo(this.x+this.direction*(-35), 305-6);
                gamectx.lineTo(this.x+this.direction*(-45), 305-6);
                gamectx.lineTo(this.x+this.direction*(-45), 295-6);
                gamectx.lineTo(this.x+this.direction*(-50), 290-6);
                gamectx.lineTo(this.x+this.direction*(-50), 280-6);
                gamectx.fill();
                gamectx.moveTo(this.x+this.direction*(-53), 290-6);
                gamectx.lineTo(this.x+this.direction*(-48), 298-6);
                gamectx.lineTo(this.x+this.direction*(-30), 295-6);
                gamectx.moveTo(this.x+this.direction*(-5), 294-6);
                gamectx.lineTo(this.x+this.direction*(5), 285-6);
                gamectx.stroke();
                gamectx.closePath();
            }
            this.time--;
            if (this.time <= 0) {this.action = 0;}
        }
        else {
            this.action++;
            if (this.action > 60) {this.action = 0;}
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.arc(this.x+this.direction*(-30), 235-Math.abs(this.action-30)/10, 30, 0, Math.PI*2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.moveTo(this.x+this.direction*(-30), 265-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-30), 305-Math.abs(this.action-30)/10);
            gamectx.moveTo(this.x+this.direction*(-25-Math.cos(Math.PI*this.action/30)*8), 350);
            gamectx.lineTo(this.x+this.direction*(-28-Math.cos(Math.PI*this.action/30)*2), 320);
            gamectx.lineTo(this.x+this.direction*(-30), 305-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-32+Math.cos(Math.PI*this.action/30)*2), 320);
            gamectx.lineTo(this.x+this.direction*(-35+Math.cos(Math.PI*this.action/30)*8), 350);
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.weapon_color;
            gamectx.moveTo(this.x+this.direction*(-60), 280-Math.abs(this.action-30)/6);
            gamectx.lineTo(this.x+this.direction*(20), 280-Math.abs(this.action-30)/6);
            gamectx.lineTo(this.x+this.direction*(20), 290-Math.abs(this.action-30)/6);
            gamectx.lineTo(this.x+this.direction*(-35), 290-Math.abs(this.action-30)/6);
            gamectx.lineTo(this.x+this.direction*(-35), 305-Math.abs(this.action-30)/6);
            gamectx.lineTo(this.x+this.direction*(-45), 305-Math.abs(this.action-30)/6);
            gamectx.lineTo(this.x+this.direction*(-45), 295-Math.abs(this.action-30)/6);
            gamectx.lineTo(this.x+this.direction*(-50), 290-Math.abs(this.action-30)/6);
            gamectx.lineTo(this.x+this.direction*(-50), 280-Math.abs(this.action-30)/6);
            gamectx.fill();
            gamectx.moveTo(this.x+this.direction*(-53), 290-Math.abs(this.action-30)/6);
            gamectx.lineTo(this.x+this.direction*(-48), 298-Math.abs(this.action-30)/6);
            gamectx.lineTo(this.x+this.direction*(-30), 295-Math.abs(this.action-30)/6);
            gamectx.moveTo(this.x+this.direction*(-5), 294-Math.abs(this.action-30)/6);
            gamectx.lineTo(this.x+this.direction*(5), 285-Math.abs(this.action-30)/6);
            gamectx.stroke();
            gamectx.closePath();
            if (this.team == "M") {
                if (enemyfront-this.x <= 180) {this.action = -1, this.time = 120;}
                else {this.x += 0.8;}
            }
            else {
                if (this.x-myfront <= 180) {this.action = -1, this.time = 120;}
                else {this.x -= 0.8;}
            }
        }
    }
    takedamage(take){
        this.hp -= take;
        this.taken += take;
        if (is_dmg_visual == "On") {dmg_numbers.push(new damagevisual(this.x, take, this.direction));}
    }
}

class fighter3{
    constructor(x, team) {
        this.x = x;
        this.team = team;
        if (this.team == "M") {
            this.direction = 1;
            this.weapon_color = "#0080FF";
        }
        else {
            this.direction = -1;
            this.weapon_color = "#FF0000";
        }
        this.hp = 19.8;
        this.block = 19.8;
        this.taken = 0;
        this.damage = 0.001;
        this.armor = 0.1;
        this.action = 0;
        this.time = 0;
    }
    run(){
        if (this.taken >= this.block) {
            this.action = -2;
            this.taken = 0;
            this.time = 30;
        }
        if (this.action == -2) {
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.arc(this.x+this.direction*(-30), 235, 30, 0, Math.PI*2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.moveTo(this.x, 285);
            gamectx.lineTo(this.x+this.direction*(-30), 285);
            gamectx.lineTo(this.x+this.direction*(-40), 290);
            gamectx.stroke();
            gamectx.lineTo(this.x+this.direction*(-10), 290);
            gamectx.fill();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.moveTo(this.x+this.direction*(-30), 265);
            gamectx.lineTo(this.x+this.direction*(-30), 305);
            gamectx.moveTo(this.x+this.direction*(-20), 290);
            gamectx.lineTo(this.x+this.direction*(-30), 280);
            gamectx.lineTo(this.x+this.direction*(-35), 290);
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.weapon_color;
            gamectx.moveTo(this.x+this.direction*(-50), 290);
            gamectx.lineTo(this.x+this.direction*(-10), 290);
            gamectx.lineTo(this.x, 285);
            gamectx.lineTo(this.x, 345);
            gamectx.lineTo(this.x+this.direction*(-10), 350);
            gamectx.lineTo(this.x+this.direction*(-50), 350);
            gamectx.lineTo(this.x+this.direction*(-50), 290);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.moveTo(this.x+this.direction*(-10), 297);
            gamectx.lineTo(this.x+this.direction*(5), 307);
            gamectx.lineTo(this.x+this.direction*(-10), 317);
            gamectx.moveTo(this.x+this.direction*(-10), 322);
            gamectx.lineTo(this.x+this.direction*(5), 332);
            gamectx.lineTo(this.x+this.direction*(-10), 342);
            gamectx.fill();
            gamectx.moveTo(this.x+this.direction*(-25), 296);
            gamectx.lineTo(this.x+this.direction*(-10), 306);
            gamectx.lineTo(this.x+this.direction*(-25), 316);
            gamectx.moveTo(this.x+this.direction*(-25), 321);
            gamectx.lineTo(this.x+this.direction*(-10), 331);
            gamectx.lineTo(this.x+this.direction*(-25), 341);
            gamectx.fill();
            gamectx.moveTo(this.x+this.direction*(-40), 295);
            gamectx.lineTo(this.x+this.direction*(-25), 305);
            gamectx.lineTo(this.x+this.direction*(-40), 315);
            gamectx.moveTo(this.x+this.direction*(-40), 320);
            gamectx.lineTo(this.x+this.direction*(-25), 330);
            gamectx.lineTo(this.x+this.direction*(-40), 340);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            this.x -= this.direction*2;
            this.time--;
            if (this.time <= 0) {this.action = 0;}
        }
        else {
            this.action++;
            if (this.action > 60) {this.action = 0;}
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.arc(this.x+this.direction*(-30), 235-Math.abs(this.action-30)/25, 30, 0, Math.PI*2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.moveTo(this.x, 285);
            gamectx.lineTo(this.x+this.direction*(-30), 285);
            gamectx.lineTo(this.x+this.direction*(-40), 290);
            gamectx.stroke();
            gamectx.lineTo(this.x+this.direction*(-10), 290);
            gamectx.fill();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.moveTo(this.x+this.direction*(-30), 265-Math.abs(this.action-30)/25);
            gamectx.lineTo(this.x+this.direction*(-30), 305-Math.abs(this.action-30)/25);
            gamectx.moveTo(this.x+this.direction*(-20), 290-Math.abs(this.action-30)/25);
            gamectx.lineTo(this.x+this.direction*(-30), 280-Math.abs(this.action-30)/25);
            gamectx.lineTo(this.x+this.direction*(-35), 290-Math.abs(this.action-30)/25);
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.weapon_color;
            gamectx.moveTo(this.x+this.direction*(-50), 290);
            gamectx.lineTo(this.x+this.direction*(-10), 290);
            gamectx.lineTo(this.x, 285);
            gamectx.lineTo(this.x, 345);
            gamectx.lineTo(this.x+this.direction*(-10), 350);
            gamectx.lineTo(this.x+this.direction*(-50), 350);
            gamectx.lineTo(this.x+this.direction*(-50), 290);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.moveTo(this.x+this.direction*(-10), 297);
            gamectx.lineTo(this.x+this.direction*(5), 307);
            gamectx.lineTo(this.x+this.direction*(-10), 317);
            gamectx.moveTo(this.x+this.direction*(-10), 322);
            gamectx.lineTo(this.x+this.direction*(5), 332);
            gamectx.lineTo(this.x+this.direction*(-10), 342);
            gamectx.fill();
            gamectx.moveTo(this.x+this.direction*(-25), 296);
            gamectx.lineTo(this.x+this.direction*(-10), 306);
            gamectx.lineTo(this.x+this.direction*(-25), 316);
            gamectx.moveTo(this.x+this.direction*(-25), 321);
            gamectx.lineTo(this.x+this.direction*(-10), 331);
            gamectx.lineTo(this.x+this.direction*(-25), 341);
            gamectx.fill();
            gamectx.moveTo(this.x+this.direction*(-40), 295);
            gamectx.lineTo(this.x+this.direction*(-25), 305);
            gamectx.lineTo(this.x+this.direction*(-40), 315);
            gamectx.moveTo(this.x+this.direction*(-40), 320);
            gamectx.lineTo(this.x+this.direction*(-25), 330);
            gamectx.lineTo(this.x+this.direction*(-40), 340);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            if (this.team == "M") {
                if (enemyfront-this.x <= 10) {
                    this.action = 0;
                    send_a_damage(this.damage, enemy_frontest, enemyfighters);
                    mydamages[2] += this.damage;
                }
                else {
                    if (this.hp == 19.8) {this.x += 1.5;}
                    else {this.x += 0.2;}
                }
            }
            else {
                if (this.x-myfront <= 10) {
                    this.action = 0;
                    send_a_damage(this.damage, my_frontest, myfighters);
                }
                else {
                    if (this.hp == 19.8) {this.x -= 1.5;}
                    else {this.x -= 0.2;}
                }
            }
        }
    }
    takedamage(take){
        this.hp -= take;
        this.taken += take;
        if (is_dmg_visual == "On") {dmg_numbers.push(new damagevisual(this.x, take, this.direction));}
    }
}

class fighter4{
    constructor(x, team) {
        this.x = x;
        this.team = team;
        if (this.team == "M") {
            this.direction = 1;
            this.weapon_color = "#0080FF";
            this.fire_color = "#FF8000";
        }
        else {
            this.direction = -1;
            this.weapon_color = "#FF0000";
            this.fire_color = "#3A006F";
        }
        this.hp = 5;
        this.block = 0.02;
        this.taken = 0;
        this.damage = 20;
        this.armor = 0;
        this.action = 0;
        this.time = 0;
    }
    run(){
        if ((this.taken >= this.block)&&(this.action != -1)) {
            this.action = -2;
            this.taken = 0;
            this.time = 30;
        }
        if (this.action == -2) {
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.arc(this.x+this.direction*(-30), 225-112.5+((this.time-15)/2)**2*2, 30, 0, Math.PI*2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.weapon_color;
            gamectx.moveTo(this.x+this.direction*(-60), 295-112.5+((this.time-15)/2)**2*2);
            gamectx.lineTo(this.x, 295-112.5+((this.time-15)/2)**2*2);
            gamectx.lineTo(this.x+this.direction*(5), 310-112.5+((this.time-15)/2)**2*2);
            gamectx.lineTo(this.x, 325-112.5+((this.time-15)/2)**2*2);
            gamectx.lineTo(this.x+this.direction*(-60), 325-112.5+((this.time-15)/2)**2*2);
            gamectx.lineTo(this.x+this.direction*(-65), 330-112.5+((this.time-15)/2)**2*2);
            gamectx.lineTo(this.x+this.direction*(-65), 290-112.5+((this.time-15)/2)**2*2);
            gamectx.lineTo(this.x+this.direction*(-60), 295-112.5+((this.time-15)/2)**2*2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.moveTo(this.x+this.direction*(-30), 255-112.5+((this.time-15)/2)**2*2);
            gamectx.lineTo(this.x+this.direction*(-30), 295-112.5+((this.time-15)/2)**2*2);
            gamectx.lineTo(this.x+this.direction*(-15), 305-112.5+((this.time-15)/2)**2*2);
            gamectx.lineTo(this.x+this.direction*(-20), 315-112.5+((this.time-15)/2)**2*2);
            gamectx.moveTo(this.x+this.direction*(-15), 295-112.5+((this.time-15)/2)**2*2);
            gamectx.lineTo(this.x+this.direction*(-30), 270-112.5+((this.time-15)/2)**2*2);
            gamectx.lineTo(this.x+this.direction*(-20), 295-112.5+((this.time-15)/2)**2*2);
            gamectx.stroke();
            gamectx.closePath();
            this.x -= this.direction*0.1;
            this.time--;
            if (this.time <= 0) {this.action = -1;}
        }
        else if (this.action == -1) {
            this.hp = my_tower_hp;
            if (this.time == 30) {
                if (this.team == "M") {
                    send_AoE_dmg(this.damage, this.x, 100, this.team, 3);
                    send_AoE_dmg(this.damage/2, this.x, 100, this.enemyteam);
                }
                else {
                    send_AoE_dmg(this.damage, this.x, 100, this.team);
                    send_AoE_dmg(this.damage/2, this.x, 100, this.enemyteam);
                }
            }
            gamectx.beginPath();
            gamectx.fillStyle = this.fire_color;
            gamectx.moveTo(this.x+this.time/2, 320+this.time);
            gamectx.bezierCurveTo(this.x+this.time*1.5, 300, this.x, 300, this.x, 170+this.time);
            gamectx.bezierCurveTo(this.x, 300, this.x-this.time*1.5, 300, this.x-this.time/2, 320+this.time);
            gamectx.lineTo(this.x, 335+this.time/2);
            gamectx.fill();
            gamectx.closePath();
            this.time--;
            if (this.time <= 0) {this.hp = 0;}
        }
        else {
            this.action++;
            if (this.action > 60) {this.action = 0;}
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.arc(this.x+this.direction*(-30), 225-Math.abs(this.action-30)/10, 30, 0, Math.PI*2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.weapon_color;
            gamectx.moveTo(this.x+this.direction*(-60), 295-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x, 295-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(5), 310-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x, 325-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-60), 325-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-65), 330-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-65), 290-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-60), 295-Math.abs(this.action-30)/10);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.moveTo(this.x+this.direction*(-30), 255-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-30), 295-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-15), 305-Math.abs(this.action-30)/8);
            gamectx.lineTo(this.x+this.direction*(-20), 315-Math.abs(this.action-30)/8);
            gamectx.moveTo(this.x+this.direction*(-15), 295-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-30), 270-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-20), 295-Math.abs(this.action-30)/10);
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.fire_color;
            gamectx.moveTo(this.x+this.direction*(-65), 310-Math.abs(this.action-30)/10);
            gamectx.bezierCurveTo(this.x+this.direction*(-70), 290, this.x+this.direction*(-70), 300+Math.sin(Math.PI*this.action/30)*5, this.x+this.direction*(-90), 310-Math.abs(this.action-30)/10);
            gamectx.bezierCurveTo(this.x+this.direction*(-70), 320-Math.sin(Math.PI*this.action/30)*5, this.x+this.direction*(-70), 330, this.x+this.direction*(-65), 310-Math.abs(this.action-30)/10);
            gamectx.fill();
            gamectx.closePath();
            if (this.team == "M") {
                if (enemyfront-this.x <= 30) {this.action = -1, this.time = 30;}
                else {this.x += 5;}
            }
            else {
                if (this.x-myfront <= 30) {this.action = -1, this.time = 30;}
                else {this.x -= 5;}
            }
        }
    }
    takedamage(take){
        this.hp -= take;
        this.taken += take;
        if (is_dmg_visual == "On") {dmg_numbers.push(new damagevisual(this.x, take, this.direction));}
    }
}

class fighter5{
    constructor(x, team) {
        this.x = x;
        this.team = team;
        if (this.team == "M") {
            this.direction = 1;
            this.weapon_color = "#0080FF";
        }
        else {
            this.direction = -1;
            this.weapon_color = "#FF0000";
        }
        this.hp = 1.5;
        this.block = 1.5;
        this.taken = 0;
        this.damage = 0;
        this.armor = 0;
        this.action = 0;
        this.time = 0;
    }
    run(){
        if (this.taken >= this.block) {
            if (this.action = -3) {this.hp =0;}
            else {
                this.action = -2;
                this.taken = 0;
                this.time = 30;
            }
        }
        if (this.action == -3) {
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff"
            gamectx.fillRect(this.x+this.direction*(-230), 175, this.direction*230, 175);
            gamectx.strokeRect(this.x+this.direction*(-230), 175, this.direction*230, 175);
            gamectx.fillStyle = "#272727";
            gamectx.fillRect(this.x+this.direction*(-145), 200, this.direction*120, 150);
            gamectx.strokeRect(this.x+this.direction*(-145), 200, this.direction*120, 150);
            gamectx.closePath();
            this.time--;
            if (this.time <= 0) {
                if (this.team == "M") {myfighters.push(new fighter1(this.x-25, "M"));}
                else {enemyfighters.push(new fighter1(this.x+25, "E"));}
                this.time = 300+Math.floor(Math.random()*201);
            }
        }
        else if (this.action == -2) {
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.arc(this.x+this.direction*(-30), 235-56.25+((this.time-15)/2)**2, 30, 0, Math.PI*2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.weapon_color;
            gamectx.moveTo(this.x+this.direction*(-65), 240-56.25+((this.time-15)/2)**2);
            gamectx.bezierCurveTo(this.x+this.direction*(-80), 185-56.25+((this.time-15)/2)**2, this.x+this.direction*(20), 185-56.25+((this.time-15)/2)**2, this.x+this.direction*(5), 240-56.25+((this.time-15)/2)**2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.moveTo(this.x+this.direction*(-30), 265-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-30), 305-56.25+((this.time-15)/2)**2);
            gamectx.moveTo(this.x+this.direction*(-10), 300-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-20), 290-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-30), 280-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-40), 300-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-30), 310-56.25+((this.time-15)/2)**2);
            gamectx.moveTo(this.x+this.direction*(-90), 340-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(80), 255-56.25+((this.time-15)/2)**2);
            gamectx.moveTo(this.x+this.direction*(60), 240-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(80), 280-56.25+((this.time-15)/2)**2);
            gamectx.moveTo(this.x+this.direction*(40), 240-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(70), 300-56.25+((this.time-15)/2)**2);
            gamectx.moveTo(this.x+this.direction*(-25-8), 350-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-28-2), 320-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-30), 305-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-32+2), 320-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-35+8), 350-56.25+((this.time-15)/2)**2);
            gamectx.stroke();
            gamectx.closePath();
            this.x -= this.direction*2;
            this.time--;
            if (this.time <= 0) {this.action = 0;}
        }
        else if (this.action == -1) {
            if (this.time >= 120) {
                gamectx.beginPath();
                gamectx.fillStyle = "#ffffff";
                gamectx.arc(this.x+this.direction*(-30), 235-3, 30, 0, Math.PI*2);
                gamectx.fill();
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.fillStyle = this.weapon_color;
                gamectx.moveTo(this.x+this.direction*(-65), 240-3);
                gamectx.bezierCurveTo(this.x+this.direction*(-80), 185-3, this.x+this.direction*(20), 185-3, this.x+this.direction*(5), 240-3);
                gamectx.fill();
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.moveTo(this.x+this.direction*(-30), 265-3);
                gamectx.lineTo(this.x+this.direction*(-30), 305-3);
                gamectx.moveTo(this.x+this.direction*(10), 300-20-36+((this.time-180)/10)**2);
                gamectx.lineTo(this.x+this.direction*(-20), 290-7.5-18+((this.time-180)/10)**2/2);
                gamectx.lineTo(this.x+this.direction*(-30), 280-3);
                gamectx.lineTo(this.x+this.direction*(-20), 300-7.5-18+((this.time-180)/10)**2/2);
                gamectx.lineTo(this.x+this.direction*(10), 310-10-36+((this.time-180)/10)**2);
                gamectx.moveTo(this.x+this.direction*(10), 350-36+((this.time-180)/10)**2);
                gamectx.lineTo(this.x+this.direction*(10), 200-36+((this.time-180)/10)**2);
                gamectx.moveTo(this.x+this.direction*(-10), 210-36+((this.time-180)/10)**2);
                gamectx.lineTo(this.x+this.direction*(30), 210-36+((this.time-180)/10)**2);
                gamectx.moveTo(this.x+this.direction*(-25), 230-36+((this.time-180)/10)**2);
                gamectx.lineTo(this.x+this.direction*(45), 230-36+((this.time-180)/10)**2);
                gamectx.moveTo(this.x+this.direction*(-25-8), 350);
                gamectx.lineTo(this.x+this.direction*(-28-2), 320);
                gamectx.lineTo(this.x+this.direction*(-30), 305-3);
                gamectx.lineTo(this.x+this.direction*(-32+2), 320);
                gamectx.lineTo(this.x+this.direction*(-35+8), 350);
                gamectx.stroke();
                gamectx.closePath();
            }
            else {
                gamectx.beginPath();
                gamectx.fillStyle = "#ffffff";
                gamectx.arc(this.x+this.direction*(-30), 235-3, 30, 0, Math.PI*2);
                gamectx.fill();
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.fillStyle = this.weapon_color;
                gamectx.moveTo(this.x+this.direction*(-65), 240-3);
                gamectx.bezierCurveTo(this.x+this.direction*(-80), 185-3, this.x+this.direction*(20), 185-3, this.x+this.direction*(5), 240-3);
                gamectx.fill();
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.moveTo(this.x+this.direction*(-30), 265-3);
                gamectx.lineTo(this.x+this.direction*(-30), 305-3);
                gamectx.moveTo(this.x+this.direction*(10), 300-20);
                gamectx.lineTo(this.x+this.direction*(-20), 290-7.5);
                gamectx.lineTo(this.x+this.direction*(-30), 280-3);
                gamectx.lineTo(this.x+this.direction*(-20), 300-7.5);
                gamectx.lineTo(this.x+this.direction*(10), 310-10);
                gamectx.moveTo(this.x+this.direction*(10), 350);
                gamectx.lineTo(this.x+this.direction*(10), 200);
                gamectx.moveTo(this.x+this.direction*(-10), 210);
                gamectx.lineTo(this.x+this.direction*(30), 210);
                gamectx.moveTo(this.x+this.direction*(-25), 230);
                gamectx.lineTo(this.x+this.direction*(45), 230);
                gamectx.moveTo(this.x+this.direction*(-25-8), 350);
                gamectx.lineTo(this.x+this.direction*(-28-2), 320);
                gamectx.lineTo(this.x+this.direction*(-30), 305-3);
                gamectx.lineTo(this.x+this.direction*(-32+2), 320);
                gamectx.lineTo(this.x+this.direction*(-35+8), 350);
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.fillStyle = this.weapon_color;
                gamectx.fillRect(this.x+this.direction*(9), 0, 2, 200);
                gamectx.closePath();
                if (this.time <= 40) {
                    gamectx.beginPath();
                    gamectx.fillStyle = "#ffffff"
                    gamectx.fillRect(this.x+this.direction*(-230), 175-this.time*8.75, this.direction*230, 175);
                    gamectx.strokeRect(this.x+this.direction*(-230), 175-this.time*8.75, this.direction*230, 175);
                    gamectx.fillStyle = "#272727";
                    gamectx.fillRect(this.x+this.direction*(-145), 200-this.time*8.75, this.direction*120, 150);
                    gamectx.strokeRect(this.x+this.direction*(-145), 200-this.time*8.75, this.direction*120, 150);
                    gamectx.closePath();
                }
            }
            this.time--;
            if (this.time <= 0) {this.action = -3, this.time = 0, this.hp = 2, this.block = 2, this.taken = 0, this.armor = 0.5;}
        }
        else {
            this.action++;
            if (this.action > 60) {this.action = 0;}
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff";
            gamectx.arc(this.x+this.direction*(-30), 235-Math.abs(this.action-30)/10, 30, 0, Math.PI*2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.weapon_color;
            gamectx.moveTo(this.x+this.direction*(-65), 240-Math.abs(this.action-30)/10);
            gamectx.bezierCurveTo(this.x+this.direction*(-80), 185-Math.abs(this.action-30)/10, this.x+this.direction*(20), 185-Math.abs(this.action-30)/10, this.x+this.direction*(5), 240-Math.abs(this.action-30)/10);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.moveTo(this.x+this.direction*(-30), 265-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-30), 305-Math.abs(this.action-30)/10);
            gamectx.moveTo(this.x+this.direction*(-10), 300-Math.abs(this.action-30)/3);
            gamectx.lineTo(this.x+this.direction*(-20), 290-Math.abs(this.action-30)/4);
            gamectx.lineTo(this.x+this.direction*(-30), 280-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-40), 300-Math.abs(this.action-30)/4);
            gamectx.lineTo(this.x+this.direction*(-30), 310-Math.abs(this.action-30)/3);
            gamectx.moveTo(this.x+this.direction*(-90), 340-Math.abs(this.action-30)/3);
            gamectx.lineTo(this.x+this.direction*(80), 255-Math.abs(this.action-30)/3);
            gamectx.moveTo(this.x+this.direction*(60), 240-Math.abs(this.action-30)/3);
            gamectx.lineTo(this.x+this.direction*(80), 280-Math.abs(this.action-30)/3);
            gamectx.moveTo(this.x+this.direction*(40), 240-Math.abs(this.action-30)/3);
            gamectx.lineTo(this.x+this.direction*(70), 300-Math.abs(this.action-30)/3);
            gamectx.moveTo(this.x+this.direction*(-25-Math.cos(Math.PI*this.action/30)*8), 350);
            gamectx.lineTo(this.x+this.direction*(-28-Math.cos(Math.PI*this.action/30)*2), 320);
            gamectx.lineTo(this.x+this.direction*(-30), 305-Math.abs(this.action-30)/10);
            gamectx.lineTo(this.x+this.direction*(-32+Math.cos(Math.PI*this.action/30)*2), 320);
            gamectx.lineTo(this.x+this.direction*(-35+Math.cos(Math.PI*this.action/30)*8), 350);
            gamectx.stroke();
            gamectx.closePath();
            if (this.team == "M") {
                if (enemyfront-this.x <= 500) {this.action = -1, this.time = 180;}
                else {this.x += 1.2;}
            }
            else {
                if (this.x-myfront <= 500) {this.action = -1, this.time = 180;}
                else {this.x -= 1.2;}
            }
        }
    }
    takedamage(take){
        this.hp -= take;
        this.taken += take;
        if (is_dmg_visual == "On") {dmg_numbers.push(new damagevisual(this.x, take, this.direction));}
    }
}

class fighter6{
    constructor(x, team) {
        this.x = x;
        this.xprime = x;
        this.team = team;
        if (this.team == "M") {
            this.direction = 1;
            this.weapon_color = "#0080FF";
            this.body_color = "#9F5000";
        }
        else {
            this.direction = -1;
            this.weapon_color = "#FF0000";
            this.body_color = "#28004D";
        }
        this.hp = 6;
        this.block = 6;
        this.taken = 0;
        this.damage = 2.9;
        this.armor = 0;
        this.action = 0;
        this.time = 0;
        this.timeprime = 0;
    }
    run(){
        if (this.taken >= this.block) {
            this.action = -2;
            this.taken = 0;
            this.time = 30;
        }
        if (this.action == -2) {
            gamectx.beginPath();
            gamectx.fillStyle = this.body_color;
            gamectx.moveTo(this.x+this.direction*(-80), 250-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-60), 240-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(10), 300-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(15), 330-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(5+Math.cos(Math.PI*this.action/30)), 350-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-30+Math.cos(Math.PI*this.action/30)), 350-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-30), 330-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-20), 310-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-50), 310-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-50-Math.cos(Math.PI*this.action/30)), 350-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-80-Math.cos(Math.PI*this.action/30)), 350-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-80), 330-56.25+((this.time-15)/2)**2);
            gamectx.moveTo(this.x+this.direction*(-75), 320-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-90+Math.cos(Math.PI*this.action/30)*2), 350-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-120+Math.cos(Math.PI*this.action/30)*2), 350-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-120), 300-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-90), 255-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-80), 250-56.25+((this.time-15)/2)**2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.body_color;
            gamectx.moveTo(this.x+this.direction*(-80), 255-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-55), 215-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-15), 215-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(10), 245-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-15), 275-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-55), 275-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-80), 255-56.25+((this.time-15)/2)**2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.weapon_color;
            gamectx.moveTo(this.x+this.direction*(-30), 230-56.25+((this.time-15)/2)**2);
            gamectx.bezierCurveTo(this.x+this.direction*(-20), 245-56.25+((this.time-15)/2)**2, this.x+this.direction*(-20), 245-56.25+((this.time-15)/2)**2, this.x, 245-56.25+((this.time-15)/2)**2);
            gamectx.bezierCurveTo(this.x+this.direction*(-10), 230-56.25+((this.time-15)/2)**2, this.x+this.direction*(-20), 225-56.25+((this.time-15)/2)**2, this.x+this.direction*(-30), 230-56.25+((this.time-15)/2)**2);
            gamectx.fill();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.body_color;
            gamectx.moveTo(this.x+this.direction*(-65), 300-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-70-Math.cos(Math.PI*this.action/30)*2), 350-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-40-Math.cos(Math.PI*this.action/30)*2), 350-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-25), 330-56.25+((this.time-15)/2)**2);
            gamectx.lineTo(this.x+this.direction*(-30), 295-56.25+((this.time-15)/2)**2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            this.x -= this.direction*0.1;
            this.time--;
            if (this.time <= 0) {this.action = 0;}
        }
        else if (this.action == -1) {
            gamectx.beginPath();
            gamectx.fillStyle = this.body_color;
            gamectx.arc(this.x+this.direction*(-50), 290, 60, 0, Math.PI*2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            if (this.team == "M") {
                if (enemyfront-this.x <= 20) {
                    send_AoE_dmg(this.damage, this.x, 250, this.team, 5);
                    send_AoE_kb(this.x, 250, this.team);
                    this.timeprime = 500;
                    this.action = 0;
                }
                else {this.x += 7.5;}
            }
            else {
                if (this.x-myfront <= 20) {
                    send_AoE_dmg(this.damage, this.x, 250, this.team);
                    send_AoE_kb(this.x, 250, this.team);
                    this.timeprime = 500;
                    this.action = 0;
                }
                else {this.x -= 7.5;}
            }
        }
        else {
            this.action++;
            if (this.action > 60) {this.action = 0;}
            gamectx.beginPath();
            gamectx.fillStyle = this.body_color;
            gamectx.moveTo(this.x+this.direction*(-80), 250-Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-60), 240-Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(10), 300-Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(15), 330-Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(5+Math.cos(Math.PI*this.action/30)), 350);
            gamectx.lineTo(this.x+this.direction*(-30+Math.cos(Math.PI*this.action/30)), 350);
            gamectx.lineTo(this.x+this.direction*(-30), 330-Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-20), 310-Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-50), 310-Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-50-Math.cos(Math.PI*this.action/30)), 350);
            gamectx.lineTo(this.x+this.direction*(-80-Math.cos(Math.PI*this.action/30)), 350);
            gamectx.lineTo(this.x+this.direction*(-80), 330-Math.abs(this.action-30)/40);
            gamectx.moveTo(this.x+this.direction*(-75), 320-Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-90+Math.cos(Math.PI*this.action/30)*2), 350);
            gamectx.lineTo(this.x+this.direction*(-120+Math.cos(Math.PI*this.action/30)*2), 350);
            gamectx.lineTo(this.x+this.direction*(-120), 300-Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-90), 255-Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-80), 250-Math.abs(this.action-30)/40);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.body_color;
            gamectx.moveTo(this.x+this.direction*(-80), 255+Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-55), 215+Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-15), 215+Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(10), 245+Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-15), 275+Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-55), 275+Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-80), 255+Math.abs(this.action-30)/40);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.weapon_color;
            gamectx.moveTo(this.x+this.direction*(-30), 230+Math.abs(this.action-30)/40);
            gamectx.bezierCurveTo(this.x+this.direction*(-20), 245+Math.abs(this.action-30)/40, this.x+this.direction*(-20), 245+Math.abs(this.action-30)/40, this.x, 245+Math.abs(this.action-30)/40);
            gamectx.bezierCurveTo(this.x+this.direction*(-10), 230+Math.abs(this.action-30)/40, this.x+this.direction*(-20), 225+Math.abs(this.action-30)/40, this.x+this.direction*(-30), 230+Math.abs(this.action-30)/40);
            gamectx.fill();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = this.body_color;
            gamectx.moveTo(this.x+this.direction*(-65), 300-Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-70-Math.cos(Math.PI*this.action/30)*2), 350);
            gamectx.lineTo(this.x+this.direction*(-40-Math.cos(Math.PI*this.action/30)*2), 350);
            gamectx.lineTo(this.x+this.direction*(-25), 330-Math.abs(this.action-30)/40);
            gamectx.lineTo(this.x+this.direction*(-30), 295-Math.abs(this.action-30)/40);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            this.timeprime--;
            if (this.timeprime <= 0) {this.action = -1;}
            else {
                if (this.team == "M") {
                    if (enemyfront-this.x <= 20) {this.action = 0;}
                    else {this.x += 0.1;}
                }
                else {
                    if (this.x-myfront <= 20) {this.action = 0;}
                    else {this.x -= 0.1;}
                }
            }
        }
    }
    takedamage(take){
        this.hp -= take/10;
        this.taken += take/10;
        if (is_dmg_visual == "On") {dmg_numbers.push(new damagevisual(this.x, take/10, this.direction));}
    }
}

class boss{
    constructor() {this.remake()}
    remake(){
        this.final_hp = 200;
        this.second_hp = 200;
        this.first_hp = 200;
        this.block = 100;
        this.taken = 0;
        this.armor = 25;
        this.shield = 200;
        this.action = 0;
        this.attackcount = 0;
        this.time = 0;
        this.kbtime = 0;
        this.timeprime = 0;
        this.stairs = 0;
    }
    run(){
        let x = enemysummonpoint-50;
        if (this.shield > 0) {
            if (bossbuff.find(buff => buff == "神盾")) {this.shield += (200-this.shield)*0.005;}
            this.shield += 0.2;
            if (this.shield > 200) {this.shield = 200;}
        }
        if (this.taken >= this.block) {
            this.taken = 0;
            this.kbtime = 30;
        }
        if (this.stairs == 0) {
            window.scrollTo(x, 0);
            this.timeprime++;
            gamectx.beginPath();
            let ramdcol = Math.floor(Math.random()*10)
            gamectx.fillStyle = "#FF"+ramdcol+ramdcol+ramdcol+ramdcol;
            gamectx.fillRect(x-150-this.timeprime*1.2, 0, 300+this.timeprime*2.4, 350);
            gamectx.closePath();
            if (this.timeprime >= 150) {
                this.stairs = 1, this.timeprime = 0;
                if (bossbuff.find(buff => buff == "堅韌")) {this.armor = 0.1;}
                else {this.armor = 0;}
            }
        }
        else if (this.stairs == 1) {
            window.scrollTo(x, 0);
            this.timeprime++;
            gamectx.beginPath();
            let ramdcol = Math.floor(Math.random()*10)
            gamectx.fillStyle = "#FF"+ramdcol+ramdcol+ramdcol+ramdcol;
            gamectx.fillRect(x-330, 0, 660, 350);
            gamectx.closePath();
            send_AoE_dmg(50, x, 330, "E");
            if (this.timeprime >= 100) {this.stairs = 2, this.timeprime = 0;}
        }
        else {
            if (this.kbtime > 0) {
                this.kbtime--;
                enemysummonpoint++;
            }
            else {
                this.timeprime--;
                if (this.timeprime <= 0) {
                    enemyfighters.push(new bossattack1(enemysummonpoint, "E"));
                    this.timeprime = 50+Math.floor(Math.random()*400)*(6-this.stairs);
                    if (bossbuff.find(buff => buff == "狂熱")) {
                        this.timeprime *= Math.random();
                        if (this.first_hp == 0) {this.timeprime *= Math.random();}
                        if (this.second_hp == 0) {this.timeprime *= Math.random();}
                    }
                }
            }
            this.action++;
            if (this.action > 150) {this.action = 0;}
            for (i = 0; i < 30; i++) {
                gamectx.beginPath();
                gamectx.fillStyle = "#FFFFFF";
                gamectx.moveTo(x+700-30*i, 190+Math.sin(i+Math.PI*this.action/75)*20);
                gamectx.lineTo(x+700-30*i-10, 170+Math.sin(i+Math.PI*this.action/75)*20);
                gamectx.lineTo(x+700-30*i-30-Math.abs(this.action-75)/5, 165+Math.sin(i+Math.PI*this.action/75)*20);
                gamectx.lineTo(x+700-30*i-20, 180+Math.sin(i+Math.PI*this.action/75)*20);
                gamectx.lineTo(x+700-30*i-5, 220+Math.sin(i+Math.PI*this.action/75)*20);
                gamectx.lineTo(x+700-30*i-20, 260+Math.sin(i+Math.PI*this.action/75)*20);
                gamectx.lineTo(x+700-30*i-30-Math.abs(this.action-75)/5, 275+Math.sin(i+Math.PI*this.action/75)*20);
                gamectx.lineTo(x+700-30*i-10, 270+Math.sin(i+Math.PI*this.action/75)*20);
                gamectx.lineTo(x+700-30*i, 250+Math.sin(i+Math.PI*this.action/75)*20);
                gamectx.fill();
                gamectx.stroke();
                gamectx.closePath();
                gamectx.beginPath();
                gamectx.fillStyle = "#FF0000";
                gamectx.arc(x+700-30*i, 220+Math.sin(i+Math.PI*this.action/75)*20, 30, 0, Math.PI*2);
                gamectx.fill();
                gamectx.stroke();
                gamectx.closePath();
            }
            gamectx.beginPath();
            gamectx.fillStyle = "#28004D";
            gamectx.moveTo(x+20, 50-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+500, -50-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+500, 100-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+530, 140-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+160, 210-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+130, 220-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+40, 150-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+110, 140-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+270, 70-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+150, 125-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+20, 50-Math.abs(this.action-75)/75);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = "#FFFFFF";
            gamectx.moveTo(x+700, 350);
            gamectx.lineTo(x+650, 200-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+500, 100-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+500, -Math.abs(this.action-75)/75);
            gamectx.lineTo(x+550, 20-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+650, 80-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+760, 200-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+800, 350);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = "#FFFFFF";
            gamectx.moveTo(x+700, 260-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+530, 250-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+300, 340-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+500, 160-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+680, 180-Math.abs(this.action-75)/75);
            gamectx.moveTo(x+750, 320-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+600, 315-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+500, 340-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+600, 275-Math.abs(this.action-75)/75);
            gamectx.lineTo(x+730, 280-Math.abs(this.action-75)/75);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = "#4DFFFF"
            gamectx.moveTo(x+320, 275+Math.abs(this.action-75)/50);
            gamectx.bezierCurveTo(x+350, 195, x+350, 235+Math.sin(Math.PI*this.action/75)*10, x+500, 275-Math.abs(this.action-75)/50);
            gamectx.bezierCurveTo(x+350, 315-Math.sin(Math.PI*this.action/75)*10, x+350, 355, x+320, 275-Math.abs(this.action-75)/50);
            gamectx.fill();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = "#3A006F";
            gamectx.moveTo(x+300, 200+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+250, 190+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+190, 190+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+150, 180+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+90, 200+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+60, 220+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+130, 230+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+140, 225+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+150, 225+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+150, 250+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+100, 235+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+30, 250+Math.abs(this.action-75)/50);
            gamectx.lineTo(x, 275+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+30, 300+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+100, 285+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+150, 300+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+150, 325+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+140, 325+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+130, 320+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+70, 310+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+90, 350+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+150, 370+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+190, 360+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+250, 360+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+300, 350+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+320, 330+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+320, 210+Math.abs(this.action-75)/50);
            gamectx.lineTo(x+300, 200+Math.abs(this.action-75)/50);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = "#FFFFFF";
            gamectx.arc(x+230, 275+Math.abs(this.action-75)/50, 50, 0, Math.PI*2);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = "#FF0000";
            gamectx.arc(x+230, 275+Math.abs(this.action-75)/50, 10, 0, Math.PI*2);
            gamectx.fill();
            gamectx.closePath();
            gamectx.beginPath();
            gamectx.fillStyle = "#000000";
            gamectx.arc(x+230, 275+Math.abs(this.action-75)/50, 50, 0, Math.PI*2);
            gamectx.moveTo(x+230, 235-Math.abs(this.action-75)/75);
            gamectx.bezierCurveTo(x+210+Math.cos(Math.PI*this.action/75)*10, 275-Math.abs(this.action-75)/75, x+210+Math.cos(Math.PI*this.action/75)*10, 275-Math.abs(this.action-75)/75, x+230, 315-Math.abs(this.action-75)/75);
            gamectx.bezierCurveTo(x+250-Math.cos(Math.PI*this.action/75)*10, 275-Math.abs(this.action-75)/75, x+250-Math.cos(Math.PI*this.action/75)*10, 275-Math.abs(this.action-75)/75, x+230, 235-Math.abs(this.action-75)/75);
            gamectx.fill();
            gamectx.stroke();
            gamectx.closePath();
            if (enemysummonpoint > 350) {enemysummonpoint -= 0.1;}
            if (bossbuff.find(buff => buff == "暴力")) {send_AoE_dmg(50, x, 1, "E");}
            else {send_AoE_dmg(0.2, x, 1, "E");}
            send_AoE_kb(x, 1, "E");
        }
    }
    takedamage(take){
        if (this.shield > 0) {this.shield -= take;}
        else {
            if (this.first_hp > 0) {
                this.first_hp -= take;
                if (this.first_hp <= 0) {this.shield = 200, this.timeprime = 0;}
            }
            else if (this.second_hp > 0) {
                this.second_hp -= take;
                if (this.second_hp <= 0) {this.shield = 200, this.timeprime = 0;}
            }
            else {this.final_hp -= take;}
            this.taken += take;
        }
        if (is_dmg_visual == "On") {dmg_numbers.push(new damagevisual(enemysummonpoint-50, take/10, -1));}
    }
}

class bossattack1{
    constructor(x, team) {
        this.x = x;
        this.team = team;
        if (this.team == "M") {
            this.direction = 1;
            this.weapon_color = "#0080FF";
        }
        else {
            this.direction = -1;
            this.weapon_color = "#FF0000";
        }
        this.hp = 100;
        this.block = 100;
        this.taken = 0;
        if (bossbuff.find(buff => buff == "暴力")) {this.damage = 12;}
        else {this.damage = 1;}
        this.armor = 0;
        this.action = 0;
        this.time = 0;
    }
    run(){
        this.action++;
        if (this.action > 60) {this.action = 0;}
        gamectx.beginPath();
        gamectx.fillStyle = "#4DFFFF";
        gamectx.arc(this.x+this.direction*(-72.5)+Math.cos(Math.PI*this.action/30)*5, 277.5+Math.sin(Math.PI*this.action/30)*5, 72.5, 0, Math.PI*2);
        gamectx.fill();
        gamectx.closePath();
        gamectx.beginPath();
        gamectx.fillStyle = this.weapon_color;
        gamectx.arc(this.x+this.direction*(-72.5), 277.5, 72.5-Math.abs(this.action-30)/20, 0, Math.PI*2);
        gamectx.fill();
        gamectx.closePath();
        gamectx.beginPath();
        gamectx.fillStyle = "#4DFFFF";
        gamectx.arc(this.x+this.direction*(-72.5), 277.5, 50-Math.abs(this.action-30)/20, 0, Math.PI*2);
        gamectx.fill();
        gamectx.closePath();
        if (this.team == "M") {
            if (enemyfront-this.x <= 1) {
                send_AoE_dmg(this.damage, this.x, 2, this.team);
                send_AoE_kb(this.x, 1, "M");
            }
            this.x += 2;
            if (this.x > 2872.5) {this.hp = 0;}
        }
        else {
            if (this.x-myfront <= 1) {
                send_AoE_dmg(this.damage, this.x, 2, this.team);
                send_AoE_kb(this.x, 1, "E");
            }
            this.x -= 2;
            if (this.x <-72.5) {this.hp = 0;}
        }
    }
    takedamage(take){
        this.hp -= take*10;
        this.taken += take*10;
        if (is_dmg_visual == "On") {dmg_numbers.push(new damagevisual(this.x, take*10, this.direction));}
    }
}

var finaleboss = new boss();

function send_a_damage(damage, frontenemy, enemys) {
    let selecrandom = frontenemy[Math.floor(Math.random()*frontenemy.length)];
    if (selecrandom == "MT") {
        my_tower_hp -= damage;
        if (is_dmg_visual == "On") {dmg_numbers.push(new damagevisual(myfront, damage, -1));}
        if (my_tower_hp <= 0) {
            my_tower_hp = 0;
            isgame = false;
        }
    }
    else if (selecrandom == "ET") {
        if (level == 7) {
            let real_damage = damage - finaleboss.armor;
            if (real_damage < 0) {real_damage = 0;}
            finaleboss.takedamage(real_damage);
            if (finaleboss.final_hp <= 0) {
                finaleboss.final_hp = 0;
                isgame = false;
            }
        }
        else {
            enemy_tower_hp -= damage;
            if (is_dmg_visual == "On") {dmg_numbers.push(new damagevisual(enemyfront, damage, 1));}
            if (enemy_tower_hp <= 0) {
                enemy_tower_hp = 0;
                isgame = false;
            }
        }
    }
    else {
        let real_damage = damage - enemys[selecrandom].armor;
        if (real_damage < 0) {real_damage = 0;}
        enemys[selecrandom].takedamage(real_damage);
    }
}

function send_AoE_dmg(damage, x, range, team, counter = false) {
    if (team == "M") {
        for (i = 0; i < enemyfighters.length; i++) {
            if (Math.abs(enemyfighters[i].x-x) <= range) {
                let real_damage = damage - enemyfighters[i].armor;
                if (real_damage < 0) {real_damage = 0;}
                enemyfighters[i].takedamage(real_damage);
                if (counter != false) {mydamages[counter] += real_damage;}
            }
        }
        if (Math.abs(enemysummonpoint-x) <= range) {
            if (level == 7) {
                let real_damage = damage - finaleboss.armor;
                if (real_damage < 0) {real_damage = 0;}
                if (counter != false) {mydamages[counter] += real_damage;}
                finaleboss.takedamage(real_damage);
                if (finaleboss.final_hp <= 0) {
                    finaleboss.final_hp = 0;
                    isgame = false;
                }
            }
            else {
                enemy_tower_hp -= damage;
                if (counter != false) {mydamages[counter] += damage;}
                if (is_dmg_visual == "On") {dmg_numbers.push(new damagevisual(enemyfront, damage, 1));}
                if (enemy_tower_hp <= 0) {
                    enemy_tower_hp = 0;
                    isgame = false;
                }
            }
        }
    }
    else {
        for (i = 0; i < myfighters.length; i++) {
            if (Math.abs(myfighters[i].x-x) <= range) {
                let real_damage = damage - myfighters[i].armor;
                if (real_damage < 0) {real_damage = 0;}
                myfighters[i].takedamage(real_damage);
            }
        }
        if (Math.abs(350-x) <= range) {
            my_tower_hp -= damage;
            if (is_dmg_visual == "On") {dmg_numbers.push(new damagevisual(myfront, damage, -1));}
            if (my_tower_hp <= 0) {
                my_tower_hp = 0;
                isgame = false;
            }
        }
    }
}

function send_AoE_kb(x, range, team){
    if (team == "M") {
        for (i = 0; i < enemyfighters.length; i++) {if (Math.abs(enemyfighters[i].x-x) <= range) {enemyfighters[i].taken = enemyfighters[i].block;}}}
    else {for (i = 0; i < myfighters.length; i++) {if (Math.abs(myfighters[i].x-x) <= range) {myfighters[i].taken = myfighters[i].block;}}}
}

function frontest() {
    my_frontest = [], enemy_frontest = [];
    myfront = 350, enemyfront = enemysummonpoint-50;
    for (i = 0; i < myfighters.length; i++) {
        if (myfighters[i].x > myfront) {myfront = myfighters[i].x, my_frontest = [i];}
        else if (myfighters[i].x == myfront) {my_frontest.push(i);}
    }
    if (myfront == 350) {my_frontest.push("MT");}

    for (i = 0; i < enemyfighters.length; i++) {
        if (enemyfighters[i].x < enemyfront) {enemyfront = enemyfighters[i].x, enemy_frontest = [i];}
        else if (enemyfighters[i].x == enemyfront) {enemy_frontest.push(i);}
    }
    if (enemyfront == enemysummonpoint-50) {enemy_frontest.push("ET");}
}

function cleanfighters() {
    let fighterscount = myfighters.length-1;
    for (i = fighterscount; i >= 0; i--) {if (myfighters[i].hp <= 0) {myfighters.splice(i, 1)}}
    fighterscount = enemyfighters.length-1;
    for (i = fighterscount; i >= 0; i--) {if (enemyfighters[i].hp <= 0) {enemyfighters.splice(i, 1)}}
    fighterscount = dmg_numbers.length-1;
    for (i = fighterscount; i >= 0; i--) {if (dmg_numbers[i].time <= 0) {dmg_numbers.splice(i, 1)}}
}

function control(x, y) {
    if ((x >= 10)&&(x <= 226)&&(y >= 10)&&(y <= 266)) {f1CT++;}
    if ((x >= 236)&&(x <= 452)&&(y >= 10)&&(y <= 266)&&(level >= 2)) {f2CT++;}
    if ((x >= 462)&&(x <= 678)&&(y >= 10)&&(y <= 266)&&(level >= 3)) {f3CT++;}
    if ((x >= 688)&&(x <= 904)&&(y >= 10)&&(y <= 266)&&(level >= 4)) {f4CT++;}
    if ((x >= 914)&&(x <= 1130)&&(y >= 10)&&(y <= 266)&&(level >= 5)) {f5CT++;}
    if ((x >= 1140)&&(x <= 1356)&&(y >= 10)&&(y <= 266)&&(level >= 6)) {f6CT++;}
}

function summon_my_fighter() {
    if (f1CT >= 5) {
        myfighters.push(new fighter1(300, "M"));
        f1CT = 0;
    }
    if (f2CT >= 10) {
        myfighters.push(new fighter2(300, "M"));
        f2CT = 0;
    }
    if (f3CT >= 10) {
        myfighters.push(new fighter3(300, "M"));
        f3CT = 0;
    }
    if (f4CT >= 15) {
        myfighters.push(new fighter4(300, "M"));
        f4CT = 0;
    }
    if (f5CT >= 15) {
        myfighters.push(new fighter5(300, "M"));
        f5CT = 0;
    }
    if (f6CT >= 30) {
        myfighters.push(new fighter6(300, "M"));
        f6CT = 0;
    }
}

function draw_tower() {
    if (my_tower_hp_temp != my_tower_hp) {
        gamectx.beginPath();
        gamectx.fillStyle = "#FF8000";
        gamectx.fillRect(40, 150, 300, 200);
        gamectx.strokeRect(40, 150, 300, 200);
        gamectx.fillStyle = "#9F5000";
        gamectx.fillRect(80, 100, 200, 50);
        gamectx.strokeRect(80, 100, 200, 50);
        gamectx.fillStyle = "#272727";
        gamectx.fillRect(125, 200, 200, 150);
        gamectx.strokeRect(125, 200, 200, 150);
        gamectx.closePath();
        my_tower_hp_temp = my_tower_hp;
    }
    else {
        gamectx.beginPath();
        gamectx.fillStyle = "#FF8000";
        gamectx.fillRect(50, 150, 300, 200);
        gamectx.strokeRect(50, 150, 300, 200);
        gamectx.fillStyle = "#9F5000";
        gamectx.fillRect(80, 100, 200, 50);
        gamectx.strokeRect(80, 100, 200, 50);
        gamectx.fillStyle = "#272727";
        gamectx.fillRect(125, 200, 200, 150);
        gamectx.strokeRect(125, 200, 200, 150);
        gamectx.closePath();
    }
    gamectx.beginPath();
    gamectx.fillStyle = "#FF0000";
    gamectx.fillRect(40, 50, 320, 20);
    gamectx.fillStyle = "#00EC00";
    gamectx.fillRect(40, 50, 320*Math.max(my_tower_hp/tower_hp, 0), 20);
    gamectx.closePath();

    if (level == 7) {
        finaleboss.run();
        L7BOSS_name_time++;
        if (L7BOSS_name_time > 120) {L7BOSS_name_time = 0;}
        gamectx.beginPath();
        for (i = 0; i <= 1; i += 0.01) {
            gamectx.fillStyle = "RGBA(255, 0, 0, "+i/10+")";
            gamectx.fillText("BOSS-「跟不上節奏的龍脊巨怪」"+bufftext, window.scrollX+window.innerWidth*0.5-220+10*(1-i)-Math.sin(Math.PI*L7BOSS_name_time/120), 375+Math.sin(Math.PI*L7BOSS_name_time/60)-10*(1-i));
        }
        gamectx.closePath();
        gamectx.beginPath();
        gamectx.fillStyle = "#000000";
        gamectx.fillText("BOSS-「跟不上節奏的龍脊巨怪」", window.scrollX+window.innerWidth*0.5-220, 375);
        gamectx.fillRect(window.scrollX+window.innerWidth*0.0625, 380, window.innerWidth*0.29, 20);
        gamectx.fillRect(window.scrollX+window.innerWidth*0.355, 380, window.innerWidth*0.29, 20);
        gamectx.fillRect(window.scrollX+window.innerWidth*0.6475, 380, window.innerWidth*0.29, 20);
        gamectx.fillStyle = "#FF0000";
        gamectx.fillRect(window.scrollX+window.innerWidth*0.0625, 380, Math.max(window.innerWidth*finaleboss.final_hp*0.00145, 0), 20);
        gamectx.fillRect(window.scrollX+window.innerWidth*0.355, 380, Math.max(window.innerWidth*finaleboss.second_hp*0.00145, 0), 20);
        gamectx.fillRect(window.scrollX+window.innerWidth*0.6475, 380, Math.max(window.innerWidth*finaleboss.first_hp*0.00145, 0), 20);
        gamectx.fillStyle = "#ffffff";
        gamectx.fillRect(window.scrollX+window.innerWidth*0.0625+Math.max(window.innerWidth*(200-finaleboss.shield)*0.0021875, 0), 400, Math.max(window.innerWidth*finaleboss.shield*0.004375, 0), 10);
        gamectx.closePath();
    }
    else {
        if (enemy_tower_hp_temp != enemy_tower_hp) {
            gamectx.beginPath();
            gamectx.fillStyle = "#3A006F";
            gamectx.fillRect(2460, 150, 300, 200);
            gamectx.strokeRect(2460, 150, 300, 200);
            gamectx.fillStyle = "#28004D";
            gamectx.fillRect(2520, 100, 200, 50);
            gamectx.strokeRect(2520, 100, 200, 50);
            gamectx.fillStyle = "#272727";
            gamectx.fillRect(2475, 200, 200, 150);
            gamectx.strokeRect(2475, 200, 200, 150);
            gamectx.closePath();
            enemy_tower_hp_temp = enemy_tower_hp;
        }
        else {
            gamectx.beginPath();
            gamectx.fillStyle = "#3A006F";
            gamectx.fillRect(2450, 150, 300, 200);
            gamectx.strokeRect(2450, 150, 300, 200);
            gamectx.fillStyle = "#28004D";
            gamectx.fillRect(2520, 100, 200, 50);
            gamectx.strokeRect(2520, 100, 200, 50);
            gamectx.fillStyle = "#272727";
            gamectx.fillRect(2475, 200, 200, 150);
            gamectx.strokeRect(2475, 200, 200, 150);
            gamectx.closePath();
        }
        gamectx.beginPath();
        gamectx.fillStyle = "#FF0000";
        gamectx.fillRect(2440, 50, 320, 20);
        gamectx.fillStyle = "#00EC00";
        gamectx.fillRect(2440, 50, 320*Math.max(enemy_tower_hp/tower_hp, 0), 20);
        gamectx.closePath();
    }
}

function drawgamecanvas() {
    gamectx.clearRect(0, 0, 2800, 417);
    gamectx.beginPath();
    gamectx.fillStyle = "#A6FFA6";
    gamectx.fillRect(0, 350, 2800, 67);
    gamectx.strokeRect(0, 350, 2800, 67);
    gamectx.closePath();
    gamectx.fillStyle = lingrad;
    gamectx.beginPath();
    gamectx.fillRect(0, 0, 2800, 350);
    gamectx.closePath();
    draw_tower();
    cleanfighters();
    frontest();
    myfighters.forEach(fighter => {fighter.run()})
    enemyfighters.forEach(fighter => {fighter.run()})
    dmg_numbers.forEach(number => {number.run()})
}

function drawctrlcanvas() {
    ctrlctx.beginPath();
    ctrlctx.fillStyle = "#000000"
    ctrlctx.fillRect(0, 0, 1366, 276);
    ctrlctx.closePath();
    ctrlctx.beginPath();
    ctrlctx.fillStyle = "#ffffff"
    ctrlctx.fillRect(10, 10, 216, 256);
    ctrlctx.fillRect(236, 10, 216, 256);
    ctrlctx.fillRect(462, 10, 216, 256);
    ctrlctx.fillRect(688, 10, 216, 256);
    ctrlctx.fillRect(914, 10, 216, 256);
    ctrlctx.fillRect(1140, 10, 216, 256);
    ctrlctx.closePath();

    ctrlctx.beginPath();
    ctrlctx.arc(100, 130, 60, 0, Math.PI*2);
    ctrlctx.moveTo(100, 190);
    ctrlctx.lineTo(95, 266);
    ctrlctx.moveTo(70, 266);
    ctrlctx.lineTo(98, 220);
    ctrlctx.lineTo(115, 255);
    ctrlctx.lineTo(130, 266);
    ctrlctx.stroke();
    ctrlctx.closePath();
    ctrlctx.beginPath();
    ctrlctx.fillStyle = "#0080FF";
    ctrlctx.moveTo(145, 266);
    ctrlctx.lineTo(182, 240);
    ctrlctx.lineTo(180, 266);
    ctrlctx.fill();
    ctrlctx.stroke();
    ctrlctx.closePath();
    if (level >= 2) {
        ctrlctx.beginPath();
        ctrlctx.arc(236, 266, 100, 0, Math.PI*3/2, true);
        ctrlctx.stroke();
        ctrlctx.closePath();
        ctrlctx.beginPath();
        ctrlctx.fillStyle = "#0080FF";
        ctrlctx.rect(350, 130, 80, 136);
        ctrlctx.fill();
        ctrlctx.stroke();
        ctrlctx.closePath();
        ctrlctx.beginPath();
        ctrlctx.fillStyle = "#FFFF37";
        ctrlctx.moveTo(350, 100);
        ctrlctx.lineTo(330, 55);
        ctrlctx.lineTo(360, 70);
        ctrlctx.lineTo(390, 50);
        ctrlctx.lineTo(420, 70);
        ctrlctx.lineTo(450, 55);
        ctrlctx.lineTo(430, 100);
        ctrlctx.fill();
        ctrlctx.closePath();
    }
    else {
        ctrlctx.beginPath();
        ctrlctx.fillStyle = "#FF0000";
        ctrlctx.fillText("LOCK", 241, 158);
        ctrlctx.strokeText("LOCK", 241, 158);
        ctrlctx.closePath();
    }
    if (level >= 3) {
        ctrlctx.beginPath();
        ctrlctx.arc(570, 10, 100, 0, Math.PI*3/2);
        ctrlctx.moveTo(570, 110);
        ctrlctx.lineTo(570, 140);
        ctrlctx.moveTo(470, 130);
        ctrlctx.lineTo(515, 115);
        ctrlctx.lineTo(570, 120);
        ctrlctx.lineTo(625, 115);
        ctrlctx.lineTo(670, 130);
        ctrlctx.stroke();
        ctrlctx.closePath();
        ctrlctx.beginPath();
        ctrlctx.fillStyle = "#0080FF";
        ctrlctx.moveTo(462, 266);
        ctrlctx.lineTo(462, 120);
        ctrlctx.lineTo(480, 140);
        ctrlctx.lineTo(660, 140);
        ctrlctx.lineTo(678, 120);
        ctrlctx.lineTo(678, 266);
        ctrlctx.fill();
        ctrlctx.closePath();
        ctrlctx.beginPath();
        ctrlctx.fillStyle = "#ffffff";
        ctrlctx.moveTo(475, 160);
        ctrlctx.lineTo(520, 205);
        ctrlctx.lineTo(565, 160);
        ctrlctx.moveTo(575, 160);
        ctrlctx.lineTo(620, 205);
        ctrlctx.lineTo(665, 160);
        ctrlctx.moveTo(475, 215);
        ctrlctx.lineTo(520, 260);
        ctrlctx.lineTo(565, 215);
        ctrlctx.moveTo(575, 215);
        ctrlctx.lineTo(620, 260);
        ctrlctx.lineTo(665, 215);
        ctrlctx.fill();
        ctrlctx.moveTo(462, 120);
        ctrlctx.lineTo(480, 140);
        ctrlctx.lineTo(660, 140);
        ctrlctx.lineTo(678, 120);
        ctrlctx.stroke();
        ctrlctx.closePath();
    }
    else {
        ctrlctx.beginPath();
        ctrlctx.fillStyle = "#FF0000";
        ctrlctx.fillText("LOCK", 467, 158);
        ctrlctx.strokeText("LOCK", 467, 158);
        ctrlctx.closePath();
    }
    if (level >= 4) {
        ctrlctx.beginPath();
        ctrlctx.arc(688, 10, 100, 0, Math.PI*1/2);
        ctrlctx.moveTo(715, 106);
        ctrlctx.lineTo(775, 176);
        ctrlctx.moveTo(735, 130);
        ctrlctx.lineTo(800, 65);
        ctrlctx.moveTo(735, 130);
        ctrlctx.lineTo(770, 145);
        ctrlctx.lineTo(820, 145);
        ctrlctx.stroke();
        ctrlctx.closePath();
        ctrlctx.beginPath();
        ctrlctx.fillStyle = "#0080FF";
        ctrlctx.moveTo(700, 266);
        ctrlctx.lineTo(688, 256);
        ctrlctx.lineTo(688, 236);
        ctrlctx.lineTo(718, 236);
        ctrlctx.lineTo(851, 103);
        ctrlctx.lineTo(904, 119);
        ctrlctx.lineTo(904, 221);
        ctrlctx.lineTo(860, 266);
        ctrlctx.fill();
        ctrlctx.closePath();
        ctrlctx.beginPath();
        ctrlctx.moveTo(700, 266);
        ctrlctx.lineTo(688, 256);
        ctrlctx.moveTo(688, 236);
        ctrlctx.lineTo(718, 236);
        ctrlctx.lineTo(851, 103);
        ctrlctx.lineTo(904, 119);
        ctrlctx.moveTo(904, 221);
        ctrlctx.lineTo(860, 266);
        ctrlctx.moveTo(775, 176);
        ctrlctx.lineTo(840, 176);
        ctrlctx.lineTo(825, 250);
        ctrlctx.stroke();
        ctrlctx.closePath();
    }
    else {
        ctrlctx.beginPath();
        ctrlctx.fillStyle = "#FF0000";
        ctrlctx.fillText("LOCK", 693, 158);
        ctrlctx.strokeText("LOCK", 693, 158);
        ctrlctx.closePath();
    }
    if (level >= 5) {
        ctrlctx.beginPath();
        ctrlctx.fillStyle = "#272727";
        ctrlctx.fillRect(914, 60, 136, 206);
        ctrlctx.closePath();
        ctrlctx.beginPath();
        ctrlctx.moveTo(1100, 10);
        ctrlctx.lineTo(1100, 266);
        ctrlctx.moveTo(914, 60);
        ctrlctx.lineTo(1050, 60);
        ctrlctx.lineTo(1050, 266);
        ctrlctx.stroke();
        ctrlctx.closePath();
    }
    else {
        ctrlctx.beginPath();
        ctrlctx.fillStyle = "#FF0000";
        ctrlctx.fillText("LOCK", 919, 158);
        ctrlctx.strokeText("LOCK", 919, 158);
        ctrlctx.closePath();
    }
    if (level >= 6) {
        ctrlctx.beginPath();
        ctrlctx.fillStyle = "#9F5000";
        ctrlctx.moveTo(1140, 70);
        ctrlctx.lineTo(1250, 70);
        ctrlctx.lineTo(1340, 180);
        ctrlctx.lineTo(1300, 266);
        ctrlctx.lineTo(1140, 266);
        ctrlctx.fill();
        ctrlctx.closePath();
        ctrlctx.beginPath();
        ctrlctx.moveTo(1140, 70);
        ctrlctx.lineTo(1250, 70);
        ctrlctx.lineTo(1340, 180);
        ctrlctx.lineTo(1300, 266);
        ctrlctx.stroke();
        ctrlctx.closePath();
        ctrlctx.beginPath();
        ctrlctx.fillStyle = "#0080FF";
        ctrlctx.moveTo(1200, 120);
        ctrlctx.bezierCurveTo(1220, 180, 1220, 180, 1290, 180);
        ctrlctx.bezierCurveTo(1300, 100, 1220, 110, 1200, 120);
        ctrlctx.fill();
        ctrlctx.closePath();
    }
    else {
        ctrlctx.beginPath();
        ctrlctx.fillStyle = "#FF0000";
        ctrlctx.fillText("LOCK", 1145, 158);
        ctrlctx.strokeText("LOCK", 1145, 158);
        ctrlctx.closePath();
    }

    if (level == 7) {f1CT += 0.001, f2CT += 0.001, f3CT += 0.001, f4CT += 0.001, f5CT += 0.001, f6CT += 0.001;}
    else {f1CT -= 0.01, f2CT -= 0.01, f3CT -= 0.01, f4CT -= 0.01, f5CT -= 0.01, f6CT -= 0.01;}
    if (f1CT < 0) {f1CT = 0;}
    if (f2CT < 0) {f2CT = 0;}
    if (f3CT < 0) {f3CT = 0;}
    if (f4CT < 0) {f4CT = 0;}
    if (f5CT < 0) {f5CT = 0;}
    if (f6CT < 0) {f6CT = 0;}
    summon_my_fighter();

    ctrlctx.beginPath();
    ctrlctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctrlctx.fillRect(10, 10, 216, 256-256*f1CT/5);
    ctrlctx.fillRect(236, 10, 216, 256-256*f2CT/10);
    ctrlctx.fillRect(462, 10, 216, 256-256*f3CT/10);
    ctrlctx.fillRect(688, 10, 216, 256-256*f4CT/15);
    ctrlctx.fillRect(914, 10, 216, 256-256*f5CT/15);
    ctrlctx.fillRect(1140, 10, 216, 256-256*f6CT/30);
    ctrlctx.closePath();
}

function scrollfix() {
    scroll_counter++;
    if ((window.scrollX == window_x_scroll)) {
        if (scroll_counter >= 1000) {
            window.scrollBy((myfront-(window.scrollX+window.innerWidth/2))/30, 0);
            window_x_scroll = window.scrollX;
            if (Math.abs(myfront-(window.scrollX+window.innerWidth/2)) < 1) {scroll_counter = 500;}
        }
    }
    else {
        scroll_counter = 0;
        window_x_scroll = window.scrollX;
    }

}

function rungame() {
    if (level != 7) {reflashsummonenemy();}
    drawgamecanvas();
    drawctrlcanvas();
    scrollfix();
    if (isgame == true) {setTimeout(function() {rungame();}, 10)}
    else {
        if ((level == 6)&&(enemy_tower_hp == 0)) {nextlevel();}
        else {showmenu();}
    }
}

function reflashsummonenemy() {
    enemyCD--;
    if (enemyCD <= 0) {
        enemyCD = Math.floor(40+level*10+Math.random()*(level+4)*50);
        if (level >= 5) {enemyCD -= Math.random()*(6-level)*50}
        let randenemyFL = Math.floor(Math.random()*(level+1)+1);
        if (randenemyFL > level) {randenemyFL = level;}
        if (randenemyFL == 1) {enemyfighters.push(new fighter1(2525, "E"));}
        else if (randenemyFL == 2) {enemyfighters.push(new fighter2(enemysummonpoint, "E"));}
        else if (randenemyFL == 3) {enemyfighters.push(new fighter3(enemysummonpoint, "E"));}
        else if (randenemyFL == 4) {enemyfighters.push(new fighter4(enemysummonpoint, "E"));}
        else if (randenemyFL == 5) {enemyfighters.push(new fighter5(enemysummonpoint, "E"));}
        else if (randenemyFL == 6) {enemyfighters.push(new fighter6(enemysummonpoint, "E"));}
        else {for (i = 0; i < (2+Math.random()*8); i++) {enemyfighters.push(new fighter1(enemysummonpoint+(Math.random()-0.5)*10, "E"));}}
    }
}

function showmenu() {
    let inner_interact = undefined;
    if (my_tower_hp == 0) {
        if (level == 7) {inner_interact = '<button onclick="retry()" style="margin: auto; width: 15%; height: 15%; font-size: 3vh; position: absolute; left: 80%; top: 80%; z-index: 11; background-color: #FF8000"><p>復仇</p></button>';}
        else {inner_interact = '<button onclick="retry()" style="margin: auto; width: 15%; height: 15%; font-size: 3vh; position: absolute; left: 80%; top: 80%; z-index: 11; background-color: #FF8000"><p>再試一次</p></button>';}
    }
    else {
        if (level == 7) {
            end_time = new Date();
            let used_time = end_time.getTime()-start_time.getTime();
            let time_str = Math.floor(used_time/3600000)+'時'+Math.floor((used_time%3600000)/60000)+"分"+(used_time%60000)/1000+'秒';
            inner_interact = '<div style="margin: auto; width: 15%; height: 15%; font-size: 3vh; position: absolute; left: 80%; top: 80%; z-index: 11; background-color: #FF8000"><p>通關時間：'+time_str+'</p></div>';
            if ((bosslevel == maxlevel)&&(maxlevel < bossbufflist.length)) {maxlevel = (bosslevel+1);}
            window.localStorage.setItem("maxlevel", maxlevel);
        }
        else {inner_interact = '<button onclick="nextlevel()" style="margin: auto; width: 15%; height: 15%; font-size: 3vh; position: absolute; left: 80%; top: 80%; z-index: 11; background-color: #FF8000"><p>下一關</p></button>';}
    }
    menu.innerHTML = '<div id="submenu"></div>'+inner_interact;
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(drawBasic);
    menu.style.display = "block";
}

function drawBasic() {
    var data = new google.visualization.arrayToDataTable([
        ['Name', 'Value'],
        ['大劍', mydamages[0]], ['突突突',  mydamages[1]], ['勢不可擋',  mydamages[2]], ['碰己雷金大聲',  mydamages[3]], ['地球水電工',  mydamages[4]],['睿智的化身',  mydamages[5]]]);
    var options = {
        title: '角色傷害表',
        hAxis: { title: 'Name'},
        vAxis: {title: 'Damages'}
    };
    var chart = new google.visualization.ColumnChart(document.getElementById('submenu'));
    chart.draw(data, options);
}

function nextlevel() {
    menu.style.display = "none";
    level += 1;
    if (level == 7) {
        finaleboss.remake();
        L7BOSS_name_time = 0;
    }
    else {
        enemyCD = 0;
        damages = [0, 0];
        mydamages = [0, 0, 0, 0, 0, 0];
        dmg_numbers = [];
        myfighters = [];
        my_frontest = [], enemy_frontest = [];
        scroll_counter = 1000;
        window_x_scroll = window.scrollX;
    }
    enemyfighters = [];
    f1CT = 0, f2CT = 0, f3CT = 0, f4CT = 0, f5CT = 0, f6CT = 0;
    tower_hp = 25*(level+1);
    my_tower_hp = tower_hp, enemy_tower_hp = tower_hp;
    my_tower_hp_temp = my_tower_hp, enemy_tower_hp_temp = enemy_tower_hp;
    isgame = true;
    rungame();
}

function retry() {
    level--;
    if (level == 6) {level--;}
    if (level < 1) {level = 0;}
    enemysummonpoint = 2525;
    nextlevel();
}

function startgame() {
    level = 1;
    bosslevel = 0;
    bossbuff = [];
    bufftext = "";
    start_time = new Date();
    menu.style.display = "none";
    scroll_counter = 1000;
    window_x_scroll = window.scrollX;
    isgame = true;
    rungame();
}

function hardgame() {
    bosslevel = parseInt(document.getElementById("inputframe").value);
    if ((bosslevel >= 0)&&(bosslevel <= maxlevel)) {
        bufftext = " (";
        let temp_bufflist = bossbufflist.map((x) => x);
        for (let i = 0;i < bosslevel;i++) {
            let picker = Math.floor(Math.random()*temp_bufflist.length);
            bossbuff.push(temp_bufflist[picker]);
            bufftext += temp_bufflist[picker];
            if (i+1 < bosslevel) {bufftext += " ";}
            temp_bufflist.splice(picker, 1);
        }
        bufftext += ")";
        level = 6;
        tower_hp = 25*(level+1);
        my_tower_hp = tower_hp, enemy_tower_hp = tower_hp;
        my_tower_hp_temp = my_tower_hp, enemy_tower_hp_temp = enemy_tower_hp;
        start_time = new Date();
        menu.style.display = "none";
        scroll_counter = 1000;
        window_x_scroll = window.scrollX;
        isgame = true;
        rungame();
    }
    else {alert("現在能挑戰的難度為LV0~LV"+maxlevel)}
}
