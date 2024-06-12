var gamecanvas = document.getElementById("game");
var gamectx = gamecanvas.getContext("2d");
var ctrlcanvas = document.getElementById("control");
var ctrlctx = ctrlcanvas.getContext("2d");
var menu = document.getElementById("menu");
var level = 1;
var chalist = [0];
var coint = 0;
var tower_hp = 50;
var my_tower_hp = tower_hp, enemy_tower_hp = tower_hp;
var my_tower_hp_temp = my_tower_hp, enemy_tower_hp_temp = enemy_tower_hp;
var isgame = false;
var myfighters = [], enemyfighters = [];

class fighter1{
    constructor(x) {
        this.x = x;
        this.hp = 5;
        this.block = 4;
        this.taken = 0;
        this.damage = 1;
        this.action = 0;
        this.time = 0;
    }
    run(){
        if (this.taken >= this.block) {
            this.taken = 0;
            this.action = -1;
            this.time = 30;
        }
        if (this.action == -1) {}
        else if ((this.action == 0)&&(this.time>0)) {}
        else {}
    }
}

function cleanfighters() {
    let fighterscount = myfighters.length-1;
    for (i = fighterscount; i>=0; i--) {if (myfighters[i].hp == 0) {myfighters.splice(i, 1)}}
    fighterscount = enemyfighters.length-1;
    for (i = fighterscount; i>=0; i--) {if (enemyfighters[i].hp == 0) {enemyfighters.splice(i, 1)}}
}

function draw_tower() {
    if (my_tower_hp_temp != my_tower_hp) {
        gamectx.fillStyle = "#FF8000";
        gamectx.beginPath();
        gamectx.fillRect(40, 150, 300, 200);
        gamectx.strokeRect(40, 150, 300, 200);
        gamectx.fillStyle = "#9F5000";
        gamectx.fillRect(80, 100, 200, 50);
        gamectx.strokeRect(80, 100, 200, 50);
        gamectx.fillStyle = "#272727";
        gamectx.fillRect(125, 200, 200, 150);
        gamectx.closePath();
        my_tower_hp_temp = my_tower_hp;
    }
    else {
        gamectx.fillStyle = "#FF8000";
        gamectx.beginPath();
        gamectx.fillRect(50, 150, 300, 200);
        gamectx.strokeRect(50, 150, 300, 200);
        gamectx.fillStyle = "#9F5000";
        gamectx.fillRect(80, 100, 200, 50);
        gamectx.strokeRect(80, 100, 200, 50);
        gamectx.fillStyle = "#272727";
        gamectx.fillRect(125, 200, 200, 150);
        gamectx.closePath();
    }
    if (enemy_tower_hp_temp != enemy_tower_hp) {
        gamectx.fillStyle = "#3A006F";
        gamectx.beginPath();
        gamectx.fillRect(2460, 150, 300, 200);
        gamectx.strokeRect(2460, 150, 300, 200);
        gamectx.fillStyle = "#28004D";
        gamectx.fillRect(2520, 100, 200, 50);
        gamectx.strokeRect(2520, 100, 200, 50);
        gamectx.fillStyle = "#272727";
        gamectx.fillRect(2475, 200, 200, 150);
        gamectx.closePath();
        enemy_tower_hp_temp = enemy_tower_hp;
    }
    else {
        gamectx.fillStyle = "#3A006F";
        gamectx.beginPath();
        gamectx.fillRect(2450, 150, 300, 200);
        gamectx.strokeRect(2450, 150, 300, 200);
        gamectx.fillStyle = "#28004D";
        gamectx.fillRect(2520, 100, 200, 50);
        gamectx.strokeRect(2520, 100, 200, 50);
        gamectx.fillStyle = "#272727";
        gamectx.fillRect(2475, 200, 200, 150);
        gamectx.closePath();
    }
}

function drawgamecanvas() {
    gamectx.clearRect(0, 0, 2800, 417);
    gamectx.fillStyle = "#A6FFA6";
    gamectx.beginPath();
    gamectx.fillRect(0, 350, 2800, 67);
    gamectx.strokeRect(0, 350, 2800, 67);
    gamectx.closePath();
    draw_tower();
}

function drawctrlcanvas() {
    ctrlctx.beginPath();
    ctrlctx.fillRect(0, 0, 1366, 276);
    ctrlctx.fillStyle = "#000000"
    ctrlctx.closePath();
}

function rungame() {
    drawgamecanvas();
    drawctrlcanvas();
    if (isgame == true) {setTimeout(function() {rungame();}, 10)}
}

function startgame() {
    menu.style.display = "none";
    isgame = true;
    rungame();
}