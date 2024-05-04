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
        return new V2(this.x + oth.x, this.y + oth.y)
    }

    sub (oth) {
        return new V2(this.x + oth.x, this.y + oth.y)
    }

    scale (s) {
        return new V2(this.x * s, this.y * s)
    }
}

class Ball {
    constructor (context, center, radius, velocity, color = "green") {
        this.context = context
        this.center = center
        this.radius = radius
        this.velocity = velocity
        this.color = color
    }

    drawCircle() {
        this.context.beginPath();
        this.context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = this.color;
        this.context.fill();
    }

    move (dt) {
        const displacement = this.velocity.scale(dt)
        this.center = this.center.add(displacement)
    }
}


function setCanvasSize() {
    CANVAS.width = window.innerWidth
    CANVAS.height = window.innerHeight
}

function update (context, dt) {
    game.mainBall.move(dt)

    if (0 > game.mainBall.center.x - game.mainBall.radius) {
        game.mainBall.velocity = new V2(-game.mainBall.velocity.x, game.mainBall.velocity.y)
    }

    if (CANVAS.width < game.mainBall.center.x + game.mainBall.radius) {
        game.mainBall.velocity = new V2(-game.mainBall.velocity.x, game.mainBall.velocity.y)
    }

    if (CANVAS.height < game.mainBall.center.y + game.mainBall.radius) {
        game.mainBall.velocity = new V2(game.mainBall.velocity.x, -game.mainBall.velocity.y)
    }

    if (0 > game.mainBall.center.y - game.mainBall.radius) {
        game.mainBall.velocity = new V2(game.mainBall.velocity.x, -game.mainBall.velocity.y)
    }

    game.mainBall.drawCircle();
}

function main () {
    setCanvasSize();

    const context = CANVAS.getContext("2d")
    game.mainBall = new Ball(context, new V2(100, 100), 10, new V2(0, 500))
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

window.addEventListener('mousemove', function (event) {
    console.log(event.clientX, event.clientY)
    // game.mainBall.center = new V2(event.clientX, event.clientY)
})

main()