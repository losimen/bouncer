const CANVAS = document.getElementById('myCanvas')
const BALL_RADIUS = 69
const BALL_SPEED = 400
const MAIN_BALL_INDEX = 0
const TAIL_LENGTH = 100
let ghostIteration = 0

class Game {
    mainBallPositions = []
    entities = []
}

class RGB {
    r = 0
    g = 0
    b = 0 
}

function randRange (math, min) {
    return Math.random() * math - min
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
        return new V2(this.x - oth.x, this.y - oth.y)
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

    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
        const len = this.length();
        if (len === 0) {
            return new V2(0, 0);  // to avoid division by zero
        }
        return new V2(this.x / len, this.y / len);
    }

    lerp(oth, t) {
        return new V2(
            this.x + t * (oth.x - this.x),
            this.y + t * (oth.y - this.y)
        );
    }
}

class MainBall {
    alpha = 1

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


class GhostBall {
    alpha = 1

    constructor (context, center, radius, velocity, ghostIndex, color = "green") {
        this.context = context
        this.center = center
        this.radius = radius
        this.velocity = velocity
        this.color = color
        this.ghostIndex = ghostIndex
    }

    draw() {
        this.context.beginPath();
        this.context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);

        this.context.fillStyle = this.color;

        this.context.fill();
        this.alpha -= 0.01
        if (ghostIteration % TAIL_LENGTH === this.ghostIndex) {
            this.alpha = 1
        }   
    }

    update(dt) {
        if (game.mainBallPositions[this.ghostIndex] === undefined) {
            return
        }

        this.center = new V2(game.mainBallPositions[this.ghostIndex].center.x, game.mainBallPositions[this.ghostIndex].center.y)
    }
}

function ensureConsistentSpeed(velocity) {
    const currentSpeed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    const scalingFactor = BALL_SPEED / currentSpeed;
    return velocity.scale(scalingFactor)
}

function borderService (entity) {
    const randomAngle = randRange(20, 10)

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
        if (entity === game.entities[MAIN_BALL_INDEX]) {
            const didWork = borderService(entity)
            if (didWork) {
                for (const entity of game.entities) {
                    const r = randRange(0, 255)
                    const g = randRange(0, 255)
                    const b = randRange(0, 255)

                    this.color = `${r} ${g} ${b} ${entity.alpha}`
                }
            }
        }
    }

    for (const entity of game.entities) {
        entity.draw();
    }

    game.mainBallPositions[ghostIteration%TAIL_LENGTH] = {
        center: new V2(
            game.entities[MAIN_BALL_INDEX].center.x, 
            game.entities[MAIN_BALL_INDEX].center.y
        )
    }

    ghostIteration += 1
}

function main () {
    CANVAS.width = window.innerWidth
    CANVAS.height = window.innerHeight

    const context = CANVAS.getContext("2d")
    game.entities.push(new MainBall(context, new V2(100, 100), 10, new V2(0, BALL_SPEED), 'rgb(255, 0, 0)'))

    for (let i = 0; i < TAIL_LENGTH; ++i) {
        game.entities.push(new GhostBall(context, new V2(100, 100), 10, new V2(0, 0), i))
    }

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