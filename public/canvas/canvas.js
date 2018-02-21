// creating a class for blobby, a rectangle that will be our character
let Blobby = class Blobby{
    constructor(){
        // x, y coordinates
        this.x = 0;
        this.y = 0;
        // width, height
        this.width = 25;
        this.height = 25;
        // fill and stroke styles
        this.fillStyle = "blue";
        this.strokeStyle = "black";
        // movement speeds
        this.speedX = 1;
        this.speedY = 1;
    }

    // draws the object to the canvas of the context
    draw(context){
        context.save();
        context.fillStyle = this.fillStyle;
        context.strokeStyle = this.strokeStyle;
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.fillRect(this.x, this.y, this.width, this.height);
        context.restore();
    }

    move(){
        // move x and y
        this.x += this.speedX;
        this.y += this.speedY;

        // too far right? (x + width = right)
        if(this.x + this.width > canvas.width){
            this.x = canvas.width - this.width;
            this.speedX *= -1; // reverses the speed, moves left instead of right
        }
        // too far left?
        else if(this.x < 0){
            this.x = 0;
            this.speedX *= -1;
        }

        // too far down>? (y + height = bottom)
        if(this.y + this.height > canvas.height){
            this.y = canvas.height - this.height;
            this.speedY *= -1;
        }
        // too far up? 
        else if(this.y < 0){
            this.y = 0;
            this.speedY *= -1;
        }
       
    }
};

// create the canvas element (its the html <canvas></canvas> in javascript)
let canvas = document.createElement("canvas");
canvas.width = 550;
canvas.height = 400;

// gets the context object, it has all the drawing methods for the canvas
let context = canvas.getContext("2d");

// array of all the objects to be drawn
let drawList = [];

// game loop function is the main function for the game
let gameLoop = () => {
    // clear the canvas 
    context.clearRect(0, 0, canvas.width, canvas.height);

     // iterate over the draw list...
     for(let object of drawList){
        // draw each element
        object.draw(context);

        // move each element
        object.move();
    }

    // repeat when the next frame is ready to be drawn
    window.requestAnimationFrame(gameLoop);
};

let spawnBlob = () => {
    let blob = new Blobby();

    // random x & y (0 - canvas bound)
    blob.x = Math.random() * canvas.width;
    blob.y = Math.random() * canvas.height;
    
    // random speed (1-3)
    blob.speedX = Math.random() * (3-1) + 1;
    blob.speedY = blob.speedX; // x & y are same speed

    // random color
    let color = Math.round(Math.random() * 2);
    if(color === 0){
        blob.fillStyle = "blue"
    }
    if(color === 1){
        blob.fillStyle = "green";
    }
    else if(color === 2){
        blob.fillStyle = "red";
    }

    // store in draw list
    drawList.push(blob);
};


// event handler for when the webpage finishes loading
window.addEventListener("load", evt => {
    // this is a callback, a function executed when an event happens (in this case, page loaded)
    
    // place our canvas into the HTML
    document.body.appendChild(canvas);
    //document.querySelector("css-selector-here").appendChild(canvas);

    // generate blobs
    for(let i = 0; i < 20; i++){
        spawnBlob();
    }

    // calls the game loop function when a frame is ready to be drawn
    window.requestAnimationFrame(gameLoop);
});
