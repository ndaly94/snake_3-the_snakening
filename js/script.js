// add modal and add high score board. add ability to enter name for players - still need to do
// add a drop down menu for difficuluty (change speed based on difficulty) -- added but not working to liunk out yet

// constants
const board_border = 'black';
const board_background = 'white';
const snake_col = 'red';
const snake_border = 'darkred';

//setting a starting point for the snake, each coordinate cooresponds to one piece of the snake, 4 in this case.
let snake = [ {x: 200, y: 200}, {x: 190, y: 200}, {x:180, y:200}, {x: 170, y:200}, {x:160, y:200},];

//initialize score at 0
let score = 0;
// stops snake from changing direction
let changing_direction= false;

//dx is horizontal velocity dy is vertical velocity
let food_x;
let food_y;
let dx = 20;
let dy = 0;


//this grabs the board using the canvas element in the HTML
const snakeboard = document.getElementById("snakeboard");
//tells javascrtipt to make the board 2d
const snakeboard_ctx = snakeboard.getContext("2d");

//starts the game
init();

render_food();

document.addEventListener('keydown', change_direction);
//set Timout functions to create a pause between moves so the snake does not "jump" from place to place on the board but instead move incrementally.
function init() {
   if (has_game_ended())
   return;

    changing_direction = false;
    setTimeout(function onTick(){
    clearBoard();
    drawFood();
    move_snake();
    drawSnake();
    //callback to itself so it is always refreshed;
    init();
    }, 100)
}

//create the boarder of the canvas (basically makes the board in appearance)
function clearBoard() {
    //sets inside color
    snakeboard_ctx.fillStyle = board_background;
    //sets border colors
    snakeboard_ctx.strokeStyle = board_border;
    //makes the space to be filled
    snakeboard_ctx.fillRect(0,0, snakeboard.clientWidth, snakeboard.height);
    //tells the js to draw the boarder
    snakeboard_ctx.strokeRect(0, 0, snakeboard.clientWidth, snakeboard.height);
}


//function that prints the snake itself
function drawSnake() {
    snake.forEach(drawSnakePart);
}    

//create a function to style the food in the voard
function drawFood(){
    snakeboard_ctx.fillStyle='lightgreen';
    snakeboard_ctx.strokeStyle='darkgreen';
    snakeboard_ctx.fillRect(food_x, food_y, 20, 20);
    snakeboard_ctx.strokeRect(food_x, food_y, 20, 20);
}

function drawSnakePart(snakePart) {
//function to style the the snake on canvas
    snakeboard_ctx.fillStyle= snake_col;
    snakeboard_ctx.strokeStyle=snake_border;
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
}    

//the function that lets the snake move horizontally and vertically, dx and dy determine those directions
//we are basically removing the head and moving it foward incrementally
//dx is ythe horizontal velocity
// the if-else is in place to check if the snake has eaten, in that case the snake moves one but the tail is not cut off.
function move_snake() {
    const head = {x: snake[0].x + dx, y: snake[0].y +dy};
    //add new head point to snake based on position
    snake.unshift(head);
    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
   //when we eat food we need to update the score and score display then rendererate new food 
    if (has_eaten_food) {
        score += 10;
        document.getElementById('score').innerHTML = `Score: ${score}`;
        render_food();
    } else {
    //remove the tail from last position    
    snake.pop();
    }
}

//check if the game is over by hitting itself or if the snake hit a wall.
function has_game_ended () {
    for(let i = 4; i< snake.length; i++){
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }    
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - 20;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.height- 20;
    return hitLeftWall || hitRightWall || hitBottomWall || hitTopWall;
}    

//function to let our arrow keys control the snake
function change_direction(event) {
    //these numbers are the key codes for arrow key event listener
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
// stops snake from reversing
    if(changing_direction) return;
    changing_direction=true;
    const keypressed = event.keyCode;
    const goingUp = dy === -20;
    const goingDown = dy === -20;
    const goingRight = dx === -20;
    const goingLeft = dx === 20;
//checks to make sure we are not already traveling in oposite direction. prevents snake from going in reverse (kill itself)    
    if (keypressed === LEFT_KEY && !goingRight) {
        dx = -20;
        dy = 0;
    }    

    if (keypressed === UP_KEY && !goingDown) {
        dx=0;
        dy=-20;
    }    
    if (keypressed === RIGHT_KEY && !goingLeft){
        dx=20;
        dy=0;
    }    
    if (keypressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 20;
    }    
}    

//create random food to level up the snake
function random_food(min, max){
    return Math.round((Math.random() * (max-min) + min) /20) *20;
}    

function render_food(){
    food_x= random_food(0, snakeboard.width - 20);
    food_y= random_food(0, snakeboard.height - 20);
    snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
      //if the food is eaten we run the function to regenerate new food  
        if(has_eaten) render_food();
    });    
}
