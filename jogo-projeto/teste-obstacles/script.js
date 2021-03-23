

var myGameObject1;
var myGameObject2;
var myGameObject3;
var myGameObject4;
var myGameObject5;
var ObjectsList = [];
var TargetsList = [];
var FPS = 0.5 * 8.35;
var RAIO = 10;
var teste = 0;
var time1 = performance.now();
var timeCounter = 0;
var fpsCounter = 0;
var setColors = ["red", "green", "blue","Orange"];//["red","green","blue","Orange","black","gray"];
var colisionCounter = 0;

function startGame() {
    myGameArea.start();
    createTargets();
    playeyBase = new semiCircle(4 * RAIO, "SlateBlue", 395, 700, 0, 2);
    //myGameObject1 = new retangle(75, 75, "red", 100, 120);
    myGameObject1 = new circle(RAIO * 2 / 3, "red", 400, 450, 0, 4);
    //myGameObjectText = new canvasText(30, testeteset, 0, 0);
}
var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 840;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        let timeInterval = FPS;
        this.interval = setInterval(updateGameArea, timeInterval);
        this.fps = 1 / timeInterval * 1000
        window.addEventListener('keydown', function (event) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[event.keyCode] = true;
        })
        window.addEventListener('keyup', function (event) {
            myGameArea.keys[event.keyCode] = false;
        })
        window.addEventListener('mousemove', function (event) {
            let bound = myGameArea.canvas.getBoundingClientRect();
            myGameArea.isInside = true;
            myGameArea.x = event.pageX - bound.left;
            myGameArea.y = event.pageY - bound.top;
            if (myGameArea.x <= 0 + RAIO || myGameArea.x >= myGameArea.canvas.width - RAIO) {
                myGameArea.isInside = false;
            } else if (myGameArea.y <= 0 + RAIO || myGameArea.y >= myGameArea.canvas.height - RAIO) {
                myGameArea.isInside = false;
            }
        })
        window.addEventListener('mousedown', function () {
            let myGameObjectCreator = new circle(RAIO * 2 / 3, setColors[Math.floor(Math.random() * setColors.length)], myGameArea.x, myGameArea.y, 0, 8);
            myGameObjectCreator.dx = myGameObjectCreator.dx;
            //ObjectsList.push(myGameObjectCreator);    
        })
        //window.addEventListener('mouseup', function (event) {
        //    myGameArea.x = false;
        //    myGameArea.y = false;
        //})
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
function createTargets() {
    for (let i = 1; i <= 20; i++) {
        for (let j = 1; j <= 4; j++) {
            let myGameObjectCreator = new retangle(20, 20, setColors[Math.floor(Math.random() * setColors.length)], 30 * i + 100, 30 * j + 50);
        }
    }
}
function retangle(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.radius = width / 2;
    this.x = x;
    this.y = y;
    this.mass = 50;
    this.life = 5;
    this.color = color;
    this.type = "retangle";
    this.dx = 0;
    this.dy = 0;
    //this.dx = Math.floor(Math.random() * 11) * 60 / myGameArea.fps;
    //this.dy = Math.floor(Math.random() * 11) * 60 / myGameArea.fps;;
    this.update = function () {
        let ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x - width / 2, this.y - height / 2, this.width, this.height);

        if (this.x - width / 2 < 0 || this.x - width / 2 > myGameArea.canvas.width - this.width) {
            this.dx *= -1;
        }
        if (this.y - height / 2 < 0 || this.y - height / 2 > myGameArea.canvas.height - this.height) {
            this.dy *= -1;
        }
        if (this.life == 0 && TargetsList.includes(this)) {
            TargetsList.splice(TargetsList.indexOf(this), 1);
            ObjectsList.splice(ObjectsList.indexOf(this), 1);
            this.x = 300;
            this.y = 300;
        }
        this.x += this.dx * 60 / myGameArea.fps;
        this.y += this.dy * 60 / myGameArea.fps;
    }
    TargetsList.push(this);
    ObjectsList.push(this);
}
function canvasText(fontSize, text, x, y) {
    this.font = fontSize;
    this.text = text;
    this.x = x;
    this.y = y;
    this.update = function () {
        let ctx = myGameArea.context;
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Hello World", this.x, this.y);
    }
}
function circle(radius, color, x, y, dx, dy) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.mass = 1;
    this.life = -1;
    this.color = color;
    this.type = "circle"
    this.dx = dx //* 60 / myGameArea.fps;
    this.dy = dy //* 60 / myGameArea.fps;
    //this.dx = Math.floor(Math.random() * 11);
    //this.dy = Math.floor(Math.random() * 11);
    this.isInside;
    this.update = function () {
        let ctx = myGameArea.context;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        this._boundery();
    }
    this._boundery = function () {
        let cwidth = myGameArea.canvas.width;
        let cheidth = myGameArea.canvas.height;
        this.isInside = true;
        if (this.x < 0 + this.radius || this.x > cwidth - this.radius) {
            this.dx *= -1
            this.isInside = false;
            if (this.x < 0 + this.radius) { this.x = this.radius } else if (this.x > cwidth - this.radius) { this.x = cwidth - this.radius }

        }
        if (this.y < 0 + this.radius) {
            this.dy *= -1;
            this.isInside = false;
            if (this.y < 0 + this.radius) { this.y = this.radius }
        }
        if (this.y > cheidth + 50 && ObjectsList.includes(this)) {
            ObjectsList.splice(ObjectsList.indexOf(this), 1);
            this.x = 300;
            this.y = 300;
        }
        //if ( this.life = 0 && ObjectsList.includes(this) ) {
        //    ObjectsList.splice(ObjectsList.indexOf(this), 1);
        //    this.x = 300;
        //    this.y = 300;
        //}
        /*if (this.y < 0 + this.radius || this.y > cheidth - this.radius) {
            this.dy *= -1;
            this.isInside = false;
            if (this.y < 0 + this.radius) { this.y = this.radius } else if (this.y > cheidth - this.radius) { this.y = cheidth - this.radius }
        }*/
        this.x += this.dx * 60 / myGameArea.fps;
        this.y += this.dy * 60 / myGameArea.fps;
    }
    ObjectsList.push(this);
}
function semiCircle(radius, color, x, y, dx, dy) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.mass = 3;
    this.life = -1;
    this.color = color;
    this.type = "semi-circle";
    this.dx = 0;
    this.dy = 0;
    this.isInside;
    this.update = function () {
        let ctx = myGameArea.context;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, Math.PI, 0);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        this._boundery();
    }
    this._boundery = function () {
        let cwidth = myGameArea.canvas.width;
        let cheidth = myGameArea.canvas.height;
        this.isInside = true;
        if (this.x < 0 + this.radius || this.x > cwidth - this.radius) {
            this.dx *= -1
            this.isInside = false;
            if (this.x < 0 + this.radius) { this.x = this.radius } else if (this.x > cwidth - this.radius) { this.x = cwidth - this.radius }
        }
        /*if (this.y < 0 + this.radius || this.y > cheidth - this.radius) {
            this.dy *= -1;
            this.isInside = false;
            if (this.y < 0 + this.radius) { this.y = this.radius } else if (this.y > cheidth - this.radius) { this.y = cheidth - this.radius }
        }*/
        this.x += this.dx * 60 / myGameArea.fps;
        this.y += this.dy * 60 / myGameArea.fps;
    }
    ObjectsList.push(this);
}
function moveobject_keyboard(anyobject) {
    if (myGameArea.keys && myGameArea.keys[37]) { anyobject.dx += -1; }
    if (myGameArea.keys && myGameArea.keys[39]) { anyobject.dx += 1; }
    if (myGameArea.keys && myGameArea.keys[38]) { anyobject.dy += -1; }
    if (myGameArea.keys && myGameArea.keys[40]) { anyobject.dy += 1; }
}
function moveobject_mouse(anyobject) {
    let distx = myGameArea.x - (anyobject.x);
    let disty = myGameArea.y - (anyobject.y);
    let dist = Math.sqrt(distx ** 2 + disty ** 2);
    let vel = Math.log(dist * 3 / 2);

    if (Math.abs(distx) > 5 && anyobject.isInside) {
        anyobject.dx = vel * distx / dist;
    } else {
        anyobject.dx = 0;
    }
    if (Math.abs(disty) > 5 && anyobject.isInside) {
        anyobject.dy = vel * disty / dist;
    } else {
        anyobject.dy = 0;
    }

    document.getElementById("dist").innerHTML = `distancia mouse e object ${dist.toFixed(2)}`
    //document.getElementById("bluepos").innerHTML = `posicao do obj ${anyobject.x.toFixed(2)}  ${anyobject.y.toFixed(2)}`
    //document.getElementById("bluepos1").innerHTML = `posicao do obj ${anyobject.center[0].toFixed(2)}  ${anyobject.center[1].toFixed(2)}`
}
function movePlayerBase_mouse(anyobject) {
    let distx = myGameArea.x - (anyobject.x);
    //let disty = myGameArea.y - (anyobject.y);
    let disty = 700 - (anyobject.y); //Travar base numa altura de y
    let dist = Math.sqrt(distx ** 2 + disty ** 2);
    let vel = 3 * Math.log(dist);

    if (Math.abs(distx) > 5 && anyobject.isInside) {
        anyobject.dx = vel * distx / Math.abs(distx);
    } else {
        anyobject.dx += anyobject.dx / (-3);
    }
    if (Math.abs(disty) > 5 && anyobject.isInside) {
        anyobject.dy = vel * disty / Math.abs(disty);
    } else {
        anyobject.dy += anyobject.dy / (-3);
    }

    document.getElementById("dist").innerHTML = `PlayerBase x: ${anyobject.x.toFixed(2)} -- y: ${anyobject.y.toFixed(2)}`
    //document.getElementById("bluepos").innerHTML = `posicao do obj ${anyobject.x.toFixed(2)}  ${anyobject.y.toFixed(2)}`
    //document.getElementById("bluepos1").innerHTML = `posicao do obj ${anyobject.center[0].toFixed(2)}  ${anyobject.center[1].toFixed(2)}`
}
function collisionDetection(item, list) {
    let colidedPar = [];
    for (i = 0; i <= list.length - 1; i++) {
        let dis_x = list[i].x - item.x;
        let dis_y = list[i].y - item.y;
        //let dis_x = list[i].center[0] - item.center[0];
        //let dis_y = list[i].center[1] - item.center[1];
        let dist = Math.sqrt(dis_x ** 2 + dis_y ** 2);
        let dis_r = item.radius + list[i].radius - dist
        let par = [item, list[i]]
        let pari = [list[i], item]
        if ((dis_r > 0 && item !== list[i]) && !(colidedPar.includes(par) || colidedPar.includes(pari))) {
            colisionCounter++;
            let a = 2;
            let mangle = Math.atan2(dis_y, dis_x);
            let sin = Math.sin(mangle);
            let cos = Math.cos(mangle);

            //Conservação de momento                    
            sin = Math.sin(mangle);
            cos = Math.cos(mangle);
            //vli velocidade na linha de choque
            let vl1 = item.dx * cos + item.dy * sin;
            let vl2 = list[i].dx * cos + list[i].dy * sin;
            //vpi velocidade perpendicualr da linha de choque
            let vp1 = - item.dx * sin + item.dy * cos;
            let vp2 = - list[i].dx * sin + list[i].dy * cos;

            let v1 = ((item.mass - list[i].mass) * vl1 + 2 * list[i].mass * vl2) / (item.mass + list[i].mass);
            let v2 = ((list[i].mass - item.mass) * vl2 + 2 * item.mass * vl1) / (item.mass + list[i].mass);

            /*
            var tag = document.createElement("p");
            var linebreak = document.createElement('br');
            var text = document.createTextNode(`Colisão: sin - ${(cos.toFixed(2)).toString()}, cos - ${(sin.toFixed(2)).toString()}, Frame: ${fpsCounter}`);
            tag.appendChild(text);
            tag.appendChild(linebreak);
            text = document.createTextNode( `${item.color} , ${list[i].color}: --- ${dist}`);
            tag.appendChild(text);
            var element = document.getElementById("debug");
            element.appendChild(tag);

            var tag = document.createElement("p");
            var linebreak = document.createElement('br');
            var text = document.createTextNode(`item vel ante: vx ${item.dx} -- vy ${item.dy}`);
            tag.appendChild(text);
            tag.appendChild(linebreak);
            text = document.createTextNode( `list vel ante: vx ${list[i].dx} -- vy ${list[i].dy}`);
            tag.appendChild(text);
            var element = document.getElementById("debug");
            element.appendChild(tag);*/

            item.dx = v1 * cos - vp1 * sin;
            item.dy = v1 * sin + vp1 * cos;

            list[i].dx = v2 * cos - vp2 * sin;
            list[i].dy = v2 * sin + vp2 * cos;

            //document.getElementById("debug4").innerHTML = `item vel depois: vx ${item.dx} -- vy ${item.dy}`
            //document.getElementById("debug5").innerHTML = `list vel depois: vx ${list[i].dx} -- vy ${list[i].dy}`

            /*
            var tag = document.createElement("p");
            var linebreak = document.createElement('br');
            var text = document.createTextNode(`item vel depois: vx ${item.dx} -- vy ${item.dy}`);
            tag.appendChild(text);
            tag.appendChild(linebreak);
            text = document.createTextNode( `list vel depois: vx ${list[i].dx} -- vy ${list[i].dy}`);
            tag.appendChild(text);
            var element = document.getElementById("debug");
            element.appendChild(tag);
            */

            if (item.mass > list[i].mass) {
                list[i].x += (dis_r + a) * cos;
                list[i].y += (dis_r + a) * sin;
            } else if (item.mass < list[i].mass) {
                item.x -= (dis_r + a) * cos;
                item.y -= (dis_r + a) * sin;
            } else {
                list[i].x += (dis_r + a / 2) * cos;
                list[i].y += (dis_r + a / 2) * sin;
                item.x -= (dis_r + a / 2) * cos;
                item.y -= (dis_r + a / 2) * sin;
            }

            if (item.type != list[i].type) {
                if (item.color == list[i].color) {

                    let myGameObjectCreator = new circle(RAIO * 2 / 3, setColors[Math.floor(Math.random() * setColors.length)], myGameArea.x, 350, 0 , 8);
                    myGameObjectCreator.dx = myGameObjectCreator.dx;

                }
                if (item.type == "retangle") { item.life += -1 };
                if (list[i].type == "retangle") { list[i].life += -1 };
            }

            colidedPar.push([item, list[i]])
        }
    }
}
function fpsCalculator() {
    let time2 = performance.now();
    let dif = time2 - time1;
    fpsCounter += 1;
    timeCounter += dif;
    myGameArea.fps = 1 / dif * 1000;
    time1 = time2;
}
function textDraw() {
    document.getElementById("fpsCounter").innerHTML = `O FPS é ${myGameArea.fps.toFixed(2)}`
    document.getElementById("showmousepos").innerHTML = `A posição do mouse é ${myGameArea.x}  ${myGameArea.y}`
    document.getElementById("debug1").innerHTML = `O tamanho de ObjectsList é ${ObjectsList.length}`
    //document.getElementById("debug2").innerHTML = `O tamanho de TargetsList é ${TargetsList.length}`
    document.getElementById("debug3").innerHTML = `O número de colisões é ${colisionCounter}`
}
function updateGameArea() {
    myGameArea.clear();
    //moveobject_keyboard(myGameObject3);
    movePlayerBase_mouse(playeyBase);
    for (let i = 0; i < ObjectsList.length; i++) {
        collisionDetection(ObjectsList[i], ObjectsList);
    }

    for (let i = 0; i < ObjectsList.length; i++) {
        ObjectsList[i].update();
    }
    fpsCalculator();
    textDraw();
}
