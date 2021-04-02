let canvas = document.getElementById("pingpong");
const ctx=canvas.getContext("2d");
let upArrowPressed = false;
let downArrowPressed = false;
const user = {
    x:0,
    y:canvas.height/2-100/2,
    width:10,
    height:100,
    color:"white",
    score: 0
}
const comp = {
    x:canvas.width-10,
    y:canvas.height/2-100/2,
    width:10,
    height:100,
    color:"white",
    score: 0
}
const ball={
    x:canvas.width/2,
    y:canvas.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color:"WHITE"
}
function drawRect(x,y,w,h,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}
const net = {
    x: canvas.width/2,
    y:0,
    width:2,
    height:10,
    color:"white"
}
function drawNet(){
    for(let i=0; i<=canvas.height;i+=15){
        drawRect(net.x,net.y +i,net.width,net.height,net.color);
    }
}
function drawCircle(x,y,r,color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}
function drawText(text,x,y,color){
    ctx.fillStyle = color;
    ctx.font = "45px sans-serif";
    ctx.fillText(text,x,y);
}
function render(){
    drawRect(0,0,canvas.width,canvas.height,"black");
    drawNet();
    drawText(user.score,canvas.width/4,canvas.height/5,"white");
    drawText(comp.score,3*canvas.width/4,canvas.height/5,"white");
    drawRect(user.x,user.y,user.width,user.height,user.color);
    drawRect(comp.x,comp.y,comp.width,comp.height,comp.color);
    drawCircle(ball.x,ball.y,ball.radius,ball.color);
}
document.addEventListener("keydown",keyDownHandler);
document.addEventListener("keyup",keyUpHandler);
function keyDownHandler(event){
    switch (event.keyCode){
        case 38: upArrowPressed = true;
            console.log(upArrowPressed);
            break;
        case 40: downArrowPressed = true;
            console.log(downArrowPressed);
            break;
    }
}
function keyUpHandler(event){
    switch (event.keyCode){
        case 38: upArrowPressed = false;
            break;
        case 40: downArrowPressed = false;
            break;
    }
}
//hành động va chạm của bóng với paddle và 2 thanh trên
function collision(ball,player){
    ball.top = ball.y- ball.radius;
    ball.bottom= ball.y + ball.radius;
    ball.left= ball.x - ball.radius;
    ball.right= ball.x + ball.radius;

    player.top = player.y;
    player.bottom= player.y + player.height;
    player.left= player.x;
    player.right=player.x + player.width;

    return ball.right > player.left && ball.bottom > player.top && ball.left<player.right && ball.top < player.bottom;
}
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 4.5;
    ball.velocityX = - ball.velocityX;
    ball.velocityY = - ball.velocityY;
}
function update(){
    if (upArrowPressed && user.y>0){
        user.y -=7;
    }else if(downArrowPressed && user.y<canvas.height-user.height){
        user.y +=7;
    }
    ball.x+=ball.velocityX;
    ball.y+=ball.velocityY;
    let computerLevel= 0.03;
    comp.y += (ball.y-(comp.y+comp.height/2))*computerLevel;
    if (ball.y + ball.radius>canvas.height||ball.y-ball.radius<0){
        ball.velocityY=-ball.velocityY;
    }
    let player= (ball.x <canvas.width/ 2) ? user : comp ;
    if (collision(ball,player)){
        let collidePoint = ball.y - (player.y + player.height/2);
        collidePoint=collidePoint/player.height/2;
        let angleRad = collidePoint * Math.PI/4;
        let direction = (ball.x < canvas.width/2) ? 1:-1;
        ball.velocityX =direction* ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed +=0.5;
    }
    if(ball.x < 0){
        comp.score++;
        resetBall();
    }else if(ball.x > canvas.width){
        user.score++;
        resetBall();
    }
}
function gameOver() {
    if (user.score === 3) {
        // drawText("You win!", 3 * canvas.width / 8, canvas.height / 2, "white");
        alert("You win!");
        document.location.reload();
    } else if (comp.score === 3) {
        // drawText("You lose!", 3 * canvas.width / 8, canvas.height / 2, "white");
        alert("You lose!");
        document.location.reload();
    } else {
        setTimeout(game, 1000 / 50);
    }
}
function game(){
    update();
    render();
    gameOver();
}
setTimeout(game,1000/50);