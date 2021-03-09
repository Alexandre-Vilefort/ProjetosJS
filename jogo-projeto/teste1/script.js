

var myGameObject1;
var myGameObject2;
var myGameObject3;
var myGameObject4;
var myGameObject5;
var ObjectsList = []
var FPS = 0.5*8.35;
var RAIO = 10;
var teste = 0;
var time1 = performance.now();
var timeCounter = 0;
var fpsCounter = 0;
function startGame() {
    myGameArea.start();
    //myGameObject1 = new retangle(75, 75, "red", 100, 120);
    /*
    myGameObject1 = new circle(RAIO, "red", 395, 600, 0, 2);
    myGameObject11 = new circle(RAIO, "red", 305, 600, 0, 2);
    myGameObject2 = new circle(RAIO, "blue", 395, 80, 0, -2);
    myGameObject22 = new circle(RAIO, "blue", 305, 80, 0, -2);
    myGameObject3 = new circle(RAIO, "purple", 700, 180, 1, 3);
    myGameObject4 = new circle(RAIO, "green", 700, 280, 4, -2);
    myGameObject44 = new circle(RAIO, "green", 790, 280, 4, -2);
    myGameObject5 = new circle(RAIO, "blue", 700, 380, -2, 1);
    myGameObject55 = new circle(RAIO, "blue", 790, 380, -2, 1);
    myGameObject6 = new circle(RAIO, "yellow", 700, 480, -6, -5);
    myGameObject66 = new circle(RAIO, "yellow", 790, 480, -6, -5);
    */
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
        //let timeInterval = 16.7;
        this.interval = setInterval(updateGameArea, timeInterval);
        this.fps = 1/timeInterval*1000
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
            var myGameObjectCreator = new circle(RAIO, "#" + ((1<<24)*Math.random() | 0).toString(16), myGameArea.x, myGameArea.y, 0, 10);
            myGameObjectCreator.dx+=11;
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
function retangle(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.radius = width / 2;
    this.x = x;
    this.y = y;
    this.center = [this.x, this.y]; // posição (x,y) do centro
    this.mass = 1;
    this.color = color;
    this.dx = Math.floor(Math.random() * 11) * 60 / myGameArea.fps;
    this.dy = Math.floor(Math.random() * 11) * 60 / myGameArea.fps;;
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

        this.x += this.dx * 60 / myGameArea.fps;
        this.y += this.dy * 60 / myGameArea.fps;
        this.center = [this.x, this.y];
    }
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
    this.center = [this.x, this.y]; //posição (x,y) do centro
    this.mass = 1;
    this.color = color;
    this.dx = dx * 60 / myGameArea.fps;
    this.dy = dy * 60 / myGameArea.fps;
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
        if (this.y < 0 + this.radius || this.y > cheidth - this.radius) {
            this.dy *= -1;
            this.isInside = false;
            if (this.y < 0 + this.radius) { this.y = this.radius } else if (this.y > cheidth - this.radius) { this.y = cheidth - this.radius }
        }
        this.x += this.dx * 60 / myGameArea.fps;
        this.y += this.dy * 60 / myGameArea.fps;
        this.center = [this.x, this.y];
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
    let vel = Math.log(dist*3/2);

    if (Math.abs(distx) > 5 && anyobject.isInside) {
        anyobject.dx = vel * distx / dist;
    } else {
        anyobject.dx = 0;
    }
    if (Math.abs(disty) > 3 && anyobject.isInside) {
        anyobject.dy = vel * disty / dist;
    } else {
        anyobject.dy = 0;
    }
    
    document.getElementById("dist").innerHTML = `distancia mouse e object ${dist.toFixed(2)}`
    //document.getElementById("bluepos").innerHTML = `posicao do obj ${anyobject.x.toFixed(2)}  ${anyobject.y.toFixed(2)}`
    //document.getElementById("bluepos1").innerHTML = `posicao do obj ${anyobject.center[0].toFixed(2)}  ${anyobject.center[1].toFixed(2)}`
}
function collisionDetection(item, list) {
    let colidedPar = [];
    for (i = 0; i <= list.length - 1; i++) {
        let dis_x = list[i].center[0] - item.center[0];
        let dis_y = list[i].center[1] - item.center[1];
        let dist = Math.sqrt(dis_x ** 2 + dis_y ** 2);
        let dis_r = item.radius + list[i].radius - dist
        let par = [item, list[i]]
        let pari = [list[i], item]
        if (dis_r > 0 && item !== list[i] && !(colidedPar.includes(par) || colidedPar.includes(pari))) {

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

            item.dx = v1 * cos - vp1 * sin;
            item.dy = v1 * sin + vp1 * cos;

            list[i].dx = v2 * cos - vp2 * sin;
            list[i].dy = v2 * sin + vp2 * cos;

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

            colidedPar.push([item, list[i]])

            /*var tag = document.createElement("p");
            var linebreak = document.createElement('br');
            var text = document.createTextNode("Colisão " + (cos.toFixed(2)).toString() +"  "+(sin.toFixed(2)).toString());
            tag.appendChild(text);
            tag.appendChild(linebreak);
            text = document.createTextNode( item.color+" "+ (item.y.toFixed(2)).toString() +list[i].color+" "+  (list[i].y.toFixed(2)).toString());
            tag.appendChild(text);
            var element = document.getElementById("debug");
            element.appendChild(tag);*/
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
    document.getElementById("fpsCounter").innerHTML = `O A FPS é ${myGameArea.fps.toFixed(2)}`
    document.getElementById("showmousepos").innerHTML = `A posição do mouse é ${myGameArea.x}  ${myGameArea.y}`
    document.getElementById("debug1").innerHTML = `O tamanho de ObjectList é ${ObjectsList.length}`
}

function updateGameArea() {
    myGameArea.clear();
    //moveobject_keyboard(myGameObject3);
    //moveobject_mouse(myGameObject3);
    for (let i = 0; i <= ObjectsList.length - 1; i++) {
        ObjectsList[i].update();
        collisionDetection(ObjectsList[i], ObjectsList);
    }
    fpsCalculator();
    textDraw();
}
