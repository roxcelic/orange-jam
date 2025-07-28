// basic config
let weatherData = {
    config: {
        color: (opacity = 1) => {
            return `red`
        },
        extend: {
            distance: 0.5,
            color: (opacity = 1) => {
                return ``
            }
        },
        backgroundColor: "#0000000a",
        delay: 50,
        direction: {
            x: 0,
            y: 4
        },
        clearExtra: {
            distance: 7,
            x: (distance = weatherData.config.clearExtra.distance) => {return weatherData.config.direction.x * distance},
            y: (distance = weatherData.config.clearExtra.distance) => {return weatherData.config.direction.y * distance}
        },
        amount: 100,
        spawnDelay: 75,
        loop: true,
        stroke: {
            min: 1,
            max: 3
        },
        spawnRain: true
    },
    shapes: {
        line: (ctx, start, end, origin, format) => {
            let draw = {
                open(startPOS = start, endPOS = end, color = weatherData.config.color()) {
                    ctx.strokeStyle = color;
                    ctx.beginPath();
                    ctx.moveTo(startPOS.x, startPOS.y);
                    ctx.lineTo(endPOS.x, endPOS.y);
                    ctx.stroke();
                },
                close() {
                    ctx.strokeStyle = weatherData.config.backgroundColor;
                    ctx.beginPath();
                    ctx.moveTo(origin.x, origin.y);
                    ctx.lineTo(end.x + weatherData.config.clearExtra.x(), end.y + weatherData.config.clearExtra.y());
                    ctx.stroke();
                }
            };

            switch(format) {
                case 0:
                    draw.open(
                        {
                            x: start.x - weatherData.config.clearExtra.x(weatherData.config.extend.distance),
                            y: start.y - weatherData.config.clearExtra.y(weatherData.config.extend.distance),
                        },
                        start,
                        weatherData.config.extend.color()
                    );
                    draw.open();

                    break;
                case 1:
                    draw.close();
                    
                    break;
            }
        },
        snow: (ctx, start, end, origin, format) => {
            switch(format) {
                case 0:
                    ctx.strokeStyle = "white";
                    ctx.beginPath();
                    ctx.arc(start.x, start.y, 2.5, 0, 2 * Math.PI);
                    ctx.fillStyle = "white";
                    ctx.fill();
                    ctx.stroke();

                    break;
                case 1:
                    ctx.strokeStyle = weatherData.config.backgroundColor;
                    ctx.beginPath();
                    ctx.arc(end.x, end.y, 15, 0, 2 * Math.PI);
                    ctx.fillStyle = weatherData.config.backgroundColor;
                    ctx.fill();
                    ctx.stroke();
                    
                    break;
            }
        }
    },
    storage: {

    },
    run: {
        reset: () => {
            Object.keys(weatherData.storage).forEach(item => {
                console.log(`clearing: ${item}`);
                clearInterval(weatherData.storage[item].interval);
            });

            weatherData.storage.data.ctx.reset();

            weatherData.storage = {};
            weatherData.config.spawnRain = false;
        }
    }
};

// this will erase the old shape then draw the new one
let moveShape = (shape, ctx, current, next, origin, id) => {

    ctx.lineWidth = weatherData.storage[id].size;

    // remove shape
    shape(ctx, current.start, current.end, origin, 1);

    // draw shape
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
    // if cant spawn rain then stop
    if (!weatherData.config.spawnRain) return;

    // initialise id just to show it exists
    weatherData.storage[id] = {};

    let sizes = {
        min: -canvas.width * 1.5,
        max: canvas.width * 1.5
    }

    let startx = Math.random() * (sizes.max - sizes.min) + sizes.min;

    weatherData.storage[id].currentPosition = {
        start: {x: startx, y: 0},
        end : { x: startx + 0, y: 0,}
    }

    weatherData.storage[id].size = Math.floor(Math.random() * (weatherData.config.stroke.min + weatherData.config.stroke.max)) + weatherData.config.stroke.min;

    weatherData.storage[id].startingPosition = weatherData.storage[id].currentPosition.start;

    // start id loop
    weatherData.storage[id].interval = setInterval(() => {
        
        weatherData.storage[id].currentPosition = moveShape(
            shape, ctx, 
            weatherData.storage[id].currentPosition, 
            calcNextPosition(weatherData.storage[id].currentPosition),
            weatherData.storage[id].startingPosition,
            id
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
    let canvas = document.getElementById("banner");
    if (canvas.style.backgroundImage != 'url("undefined")' || canvas.style.display == "none") return;

    let ctx = canvas.getContext("2d");

    // store these values
    weatherData.storage.data = {
        canvas,
        ctx
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 1.25;

    // spawn them all yayyyy
    function delayedDraw(i) {
        if (i <= 0) return;
        if (!weatherData.config.spawnRain) return;

        let shape = weatherData.shapes.line;

        let today = (new Date()).getMonth();
        if (today < 2 || today >= 10) shape = weatherData.shapes.snow;

        trackShape(weatherData.config.amount, shape, ctx, canvas);
        weatherData.config.amount--;
    
        setTimeout(() => {
            delayedDraw(i - 1);
        }, weatherData.config.spawnDelay);
    }

    delayedDraw(weatherData.config.amount);
};

export {drawOnWeather, weatherData};