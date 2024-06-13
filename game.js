var gamecanvas = document.getElementById("game");
var gamectx = gamecanvas.getContext("2d");
var ctrlcanvas = document.getElementById("control");
var ctrlctx = ctrlcanvas.getContext("2d");
var menu = document.getElementById("menu");
var level = 1;
var chalist = [0];
var enemyCD = 0;
var f1CT = 0, f2CT = 0, f3CT = 0, f4CT = 0, f5CT = 0, f6CT = 0; //5, 10, 15, 20, 25, 30
var tower_hp = 50;
var my_tower_hp = tower_hp, enemy_tower_hp = tower_hp;
var my_tower_hp_temp = my_tower_hp, enemy_tower_hp_temp = enemy_tower_hp;
var isgame = false;
var myfighters = [], enemyfighters = [];
var my_frontest = [], enemy_frontest = [];
var myfront = 350, enemyfront = 2475;
var controlvalue = "none";

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

gamectx.lineWidth = 5;
ctrlctx.lineWidth = 5;
ctrlctx.font = "75px serif";
var lingrad = gamectx.createLinearGradient(0, 0, 0, 150);
lingrad.addColorStop(0, "#00ABEB");
lingrad.addColorStop(1, "#ffffff");

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
        this.action = 0;
        this.time = 0;
    }
    run(){
        console.log(this.team)
        if (this.taken >= this.block) {
            this.action = -2;
            this.taken = 0;
            this.time = 30;
        }
        if (this.action == -2) {
            gamectx.beginPath();
            gamectx.fillStyle = "#ffffff"
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
                gamectx.fillStyle = "#ffffff"
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
                    if (this.team == "M") {if (enemyfront-this.x <= 90) {send_a_damage(this.damage, enemy_frontest, enemyfighters);}}
                    else {if (this.x-myfront <= 90) {send_a_damage(this.damage, my_frontest, myfighters);}}
                }
                gamectx.beginPath();
                gamectx.fillStyle = "#ffffff"
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
                gamectx.closePath();}
            else {
                gamectx.beginPath();
                gamectx.fillStyle = "#ffffff"
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
            gamectx.fillStyle = "#ffffff"
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
}

function send_a_damage(damage, frontenemy, enemys) {
    let selecrandom = frontenemy[Math.floor(Math.random()*frontenemy.length)];
    if (selecrandom == "MT") {
        my_tower_hp -= damage;
        if (my_tower_hp <= 0) {
            my_tower_hp = 0;
            isgame = false;
        }
    }
    else if (selecrandom == "ET") {
        enemy_tower_hp -= damage;
        if (enemy_tower_hp <= 0) {
            enemy_tower_hp = 0;
            isgame = false;
        }
    }
    else {
        enemys[selecrandom].hp -= damage;
        enemys[selecrandom].taken += damage;
    }
}

function frontest() {
    my_frontest = [], enemy_frontest = [];
    myfront = 350, enemyfront = 2475;
    for (i = 0; i<myfighters.length; i++) {
        if (myfighters[i].x > myfront) {myfront = myfighters[i].x, my_frontest = [i];}
        else if (myfighters[i].x == myfront) {my_frontest.push(i);}
    }
    if (myfront == 350) {my_frontest.push("MT");}

    for (i = 0; i<enemyfighters.length; i++) {
        if (enemyfighters[i].x < enemyfront) {enemyfront = enemyfighters[i].x, enemy_frontest = [i];}
        else if (enemyfighters[i].x == enemyfront) {enemy_frontest.push(i);}
    }
    if (enemyfront == 2475) {enemy_frontest.push("ET");}
}

function cleanfighters() {
    let fighterscount = myfighters.length-1;
    for (i = fighterscount; i>=0; i--) {if (myfighters[i].hp <= 0) {myfighters.splice(i, 1)}}
    fighterscount = enemyfighters.length-1;
    for (i = fighterscount; i>=0; i--) {if (enemyfighters[i].hp <= 0) {enemyfighters.splice(i, 1)}}
}

function control(x, y) {
    if ((x >= 10)&&(x <= 226)&&(y >= 10)&&(y <= 266)) {
        f1CT++;
        if (f1CT >= 5) {
            myfighters.push(new fighter1(300, "M"));
            f1CT = 0;
        }
    }
    if ((x >= 236)&&(x <= 452)&&(y >= 10)&&(y <= 266)&&(level >= 2)) {
        f2CT++;
        if (f2CT >= 10) {
            myfighters.push(new fighter1(300, "M"));
            f2CT = 0;
        }
    }
    if ((x >= 462)&&(x <= 678)&&(y >= 10)&&(y <= 266)&&(level >= 3)) {
        f3CT++;
        if (f3CT >= 15) {
            myfighters.push(new fighter1(300, "M"));
            f3CT = 0;
        }
    }
    if ((x >= 688)&&(x <= 904)&&(y >= 10)&&(y <= 266)&&(level >= 4)) {
        f4CT++;
        if (f4CT >= 20) {
            myfighters.push(new fighter1(300, "M"));
            f4CT = 0;
        }
    }
    if ((x >= 914)&&(x <= 1130)&&(y >= 10)&&(y <= 266)&&(level >= 5)) {
        f5CT++;
        if (f5CT >= 25) {
            myfighters.push(new fighter1(300, "M"));
            f5CT = 0;
        }
    }
    if ((x >= 1140)&&(x <= 1356)&&(y >= 10)&&(y <= 266)&&(level >= 6)) {
        f6CT++;
        if (f6CT >= 30) {
            myfighters.push(new fighter1(300, "M"));
            f6CT = 0;
        }
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
    gamectx.fillRect(40, 50, 320*Math.max(my_tower_hp/tower_hp||0), 20);
    gamectx.closePath();

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
    gamectx.fillRect(2440, 50, 320*Math.max(enemy_tower_hp/tower_hp||0), 20);
    gamectx.closePath();
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
    ctrlctx.fillStyle = "#0080FF"
    ctrlctx.moveTo(145, 266);
    ctrlctx.lineTo(182, 240);
    ctrlctx.lineTo(180, 266);
    ctrlctx.fill();
    ctrlctx.stroke();
    ctrlctx.closePath();
    ctrlctx.beginPath();
    ctrlctx.fillStyle = "#FF0000"
    if (level >= 2) {}
    else {
        ctrlctx.fillText("LOCK", 241, 158);
        ctrlctx.strokeText("LOCK", 241, 158);
    }
    if (level >= 3) {}
    else {
        ctrlctx.fillText("LOCK", 467, 158);
        ctrlctx.strokeText("LOCK", 467, 158);
    }
    if (level >= 4) {}
    else {
        ctrlctx.fillText("LOCK", 693, 158);
        ctrlctx.strokeText("LOCK", 693, 158);
    }
    if (level >= 5) {}
    else {
        ctrlctx.fillText("LOCK", 919, 158);
        ctrlctx.strokeText("LOCK", 919, 158);
    }
    if (level >= 6) {}
    else {
        ctrlctx.fillText("LOCK", 1145, 158);
        ctrlctx.strokeText("LOCK", 1145, 158);
    }
    ctrlctx.closePath();

    ctrlctx.beginPath();
    ctrlctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctrlctx.fillRect(10, 10, 216, 256-256*f1CT/5);
    ctrlctx.fillRect(236, 10, 216, 256-256*f2CT/10);
    ctrlctx.fillRect(462, 10, 216, 256-256*f3CT/15);
    ctrlctx.fillRect(688, 10, 216, 256-256*f4CT/20);
    ctrlctx.fillRect(914, 10, 216, 256-256*f5CT/25);
    ctrlctx.fillRect(1140, 10, 216, 256-256*f6CT/30);
    ctrlctx.closePath();
    f1CT -= 0.01, f2CT -= 0.01, f3CT -= 0.01, f4CT -= 0.01, f5CT -= 0.01, f6CT -= 0.01;
    if (f1CT < 0) {f1CT = 0;}
    if (f2CT < 0) {f2CT = 0;}
    if (f3CT < 0) {f3CT = 0;}
    if (f4CT < 0) {f4CT = 0;}
    if (f5CT < 0) {f5CT = 0;}
    if (f6CT < 0) {f6CT = 0;}
}

function rungame() {
    enemyCD--;
    if (enemyCD <= 0) {
        enemyCD = Math.floor(50+Math.random()*200);
        enemyfighters.push(new fighter1(2525, "E"));
    }
    drawgamecanvas();
    drawctrlcanvas();
    if (isgame == true) {setTimeout(function() {rungame();}, 10)}
    else {
        drawgamecanvas();
    }
}

function startgame() {
    menu.style.display = "none";
    isgame = true;
    rungame();
}