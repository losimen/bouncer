const CANVAS = document.getElementById('myCanvas')
const BALL_RADIUS = 69
const BALL_SPEED = 1000
const MAIN_BALL_INDEX = 0

class Game {
    mainBall
    entities = []
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

    rotate (angle) {
        return new V2(
            Math.cos(angle) * this.x - Math.sin(angle) * this.y,
            Math.sin(angle) * this.x + Math.cos(angle) * this.y,
        )
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

    draw() {
        this.context.beginPath();
        this.context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = this.color;
        this.context.fill();
    }

    update (dt) {
        const displacement = this.velocity.scale(dt)
        this.center = this.center.add(displacement)
    }
}


function setCanvasSize() {
    CANVAS.width = window.innerWidth
    CANVAS.height = window.innerHeight
}

function ensureConsistentSpeed(velocity) {
    const currentSpeed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    const scalingFactor = BALL_SPEED / currentSpeed;
    return velocity.scale(scalingFactor)
}

function borderService (entity) {
    const randomAngle = Math.random() * 20 - 10; // Random angle between -10 and 10 degrees

    if (0 > entity.center.x - entity.radius) {
        entity.velocity = entity.velocity.rotate(randomAngle);
        entity.velocity = new V2(Math.abs(entity.velocity.x), entity.velocity.y);
        entity.velocity = ensureConsistentSpeed(entity.velocity);
        return true;
    }
    
    if (CANVAS.width < entity.center.x + entity.radius) {
        entity.velocity = entity.velocity.rotate(randomAngle);
        entity.velocity = new V2(-Math.abs(entity.velocity.x), entity.velocity.y);
        entity.velocity = ensureConsistentSpeed(entity.velocity);
        return true;
    }
    
    if (CANVAS.height < entity.center.y + entity.radius) {
        entity.velocity = entity.velocity.rotate(randomAngle);
        entity.velocity = new V2(entity.velocity.x, -Math.abs(entity.velocity.y));
        entity.velocity = ensureConsistentSpeed(entity.velocity);
        return true;
    }
    
    if (0 > entity.center.y - entity.radius) {
        entity.velocity = entity.velocity.rotate(randomAngle);
        entity.velocity = new V2(entity.velocity.x, Math.abs(entity.velocity.y));
        entity.velocity = ensureConsistentSpeed(entity.velocity);
        return true;
    }
    
    return false;    
}

function update (context, dt) {
    for (const entity of game.entities) {
        entity.update(dt)
    }

    for (const entity of game.entities) {
        const didWork = borderService(entity)
        // if (didWork && entity === game.entities[MAIN_BALL_INDEX]) {
        //     console.log('do this')
        // }
    }

    for (const entity of game.entities) {
        entity.draw();
    }
}

function main () {
    setCanvasSize();

    const context = CANVAS.getContext("2d")
    game.entities.push(new Ball(context, new V2(100, 100), 10, new V2(0, BALL_SPEED)))
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
    // console.log(event.clientX, event.clientY)
    // game.mainBall.center = new V2(event.clientX, event.clientY)
})

main()