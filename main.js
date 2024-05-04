const CANVAS = document.getElementById('myCanvas')
const BALL_RADIUS = 69
const BALL_SPEED = 30


class Game {
    mainBall
}

const game =  new Game()

class V2 {
    constructor (x, y) {
        this.x = x
        this.y = y
    }

    add (oth) {
        return new V2(this.x + oth.x, this.y + oth.x)
    }

    sub (oth) {
        return new V2(this.x + oth.x, this.y + oth.x)
    }

    scale (s) {
        return new V2(this.x * s, this.y * s)
    }
}

class Ball {
    constructor (context, center, radius, color = "green") {
        this.context = context
        this.center = center
        this.radius = radius
        this.color = color
    }

    drawCircle() {
        this.context.beginPath();
        this.context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = this.color;
        this.context.fill();
    }

    move (dt, velocity) {
        const displacement = velocity.scale(dt);
        this.center = this.center.add(displacement);
    }
}


function setCanvasSize() {
    CANVAS.width = window.innerWidth
    CANVAS.height = window.innerHeight
}

let vel = new V2(100, 100)
function update (context, dt) {
    vel = vel.add(new V2(10, 10))
    game.mainBall.move(dt, vel)
    game.mainBall.drawCircle();
}

function main () {
    setCanvasSize();

    const context = CANVAS.getContext("2d")
    game.mainBall = new Ball(context, new V2(0, 0), 69)
    let start

    function gameLoop (timestamp) {
        if (start === undefined) {
            start = timestamp;
        }
        const dt = (timestamp - start) * 0.001;
        start = timestamp;

        window.requestAnimationFrame(gameLoop)
        const context = CANVAS.getContext("2d")
    
        context.clearRect(0, 0, window.innerWidth, window.innerHeight)
        update(context, dt)
    }

    window.requestAnimationFrame(gameLoop)
}

main()