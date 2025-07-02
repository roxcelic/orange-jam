// basic config
let today = new Date();

let weatherData = {
    config: {
        color: `rgba(${255 * (today.getMinutes() / 60)}, ${255 * (today.getHours() / 24)}, ${255 * (today.getDay() / 31)}, 1)`,
        backgroundColor: "black",
        delay: 25,
        direction: {
            x: 1,
            y: 12
        },
        amount: 250,
        spawnDelay: 25,
        loop: true
    },
    shapes: {
        line: (ctx, start, end, origin, format) => {
            switch(format) {
                case 0:
                    ctx.beginPath();
                    ctx.moveTo(start.x, start.y);
                    ctx.lineTo(end.x, end.y);
                    ctx.stroke();

                    break;
                case 1:
                    ctx.beginPath();
                    ctx.moveTo(origin.x, origin.y);
                    ctx.lineTo(end.x, end.y);
                    ctx.stroke();
                    
                    break;
            }
        }
    },
    storage: {

    }
};

// this will erase the old shape then draw the new one
let moveShape = (shape, ctx, current, next, origin) => {

    ctx.strokeStyle = weatherData.config.backgroundColor;
    shape(ctx, current.start, current.end, origin, 1);

    ctx.strokeStyle = weatherData.config.color;
    shape(ctx, next.start, next.end, origin, 0);    

    return next;
}

// calculates the next position of the raindrop
let calcNextPosition = (position) => {
    return {
        start: position.end,
        end: {
            x: position.end.x + weatherData.config.direction.x,
            y: position.end.y + weatherData.config.direction.y
        }
    };
};

// this is the function to like spawn the shape and then track it as it moves down the page
let trackShape = (id, shape, ctx, canvas) => {
    // initialise id just to show it exists
    weatherData.storage[id] = {};

    let startx = Math.floor(Math.random() * (canvas.width - 0 + 1)) + 0;

    weatherData.storage[id].currentPosition = {
        start: {x: startx, y: 0},
        end : { x: startx + 0, y: 0,}
    }

    weatherData.storage[id].startingPosition = weatherData.storage[id].currentPosition.start;

    // start id loop
    weatherData.storage[id].interval = setInterval(() => {
        
        weatherData.storage[id].currentPosition = moveShape(
            shape, ctx, 
            weatherData.storage[id].currentPosition, 
            calcNextPosition(weatherData.storage[id].currentPosition),
            weatherData.storage[id].startingPosition
        );

        if (
            weatherData.storage[id].currentPosition.start.x > canvas.width + 10|| weatherData.storage[id].currentPosition.start.x < -10 ||
            weatherData.storage[id].currentPosition.start.y > canvas.height || weatherData.storage[id].currentPosition.start.y < 0
        ) {
            ctx.strokeStyle = weatherData.config.backgroundColor;

            clearInterval(weatherData.storage[id].interval);
            
            if(weatherData.config.loop) trackShape(id, shape, ctx, canvas);
        }

    }, weatherData.config.delay);
};

// this is the start function
let drawOnWeather = () => {
    let canvas = document.getElementById("mainCNV");
    let ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 1.25;

    console.log(weatherData.config.color);

    // spawn them all yayyyy
    function delayedDraw(i) {
        if (i <= 0) return;
        trackShape(weatherData.config.amount, weatherData.shapes.line, ctx, canvas);
        weatherData.config.amount--;
    
        setTimeout(() => {
            delayedDraw(i - 1);
        }, weatherData.config.spawnDelay);
    }
    delayedDraw(weatherData.config.amount);
};

export {drawOnWeather};