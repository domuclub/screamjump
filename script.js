/* global createCanvas, noStroke, noLoop, loop, text, frameCount, translate, keyCode, collideLineRect, random, fill, rect, p5, ellipse, background, image, loadImage, tint, width, height, getAudioContext*/
let amp;
let mic;
let gameOver = false;
let player;
let platform;
let platforms;
let score = 0;

//only run once at the beginning (start)
function setup() {
  createCanvas(200, 200);
  amp = new p5.Amplitude();
  mic = new p5.AudioIn();
  mic.start();
  
  player = new Player();
  
  platforms = [];
  platforms.push(new Platform(10));
  platforms.push(new Platform(80));
  platforms.push(new Platform(170));
}

//run continuously (update)
function draw() {
  
  background(0);
  score += 1;
  fill(255)
  text(score,20,20);
  var vol = mic.getLevel();
  
  translate(-player.x + 10,0);
  
  for(let i = 0; i < platforms.length; i++)
  {
    platforms[i].show();
    platforms[i].update();
    if(platforms[i].x < player.x - 50)
    {
      platforms[i].x = player.x + 210;
    }
  }
  player.show();
  player.update(vol);
  player.collision(platforms);
  
  if (player.y==height - 10){
    gameOver=true;
  }

  
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
  
  if (gameOver){
      noLoop(); 
      fill(255)
      text("Game Over!", width/2 - 50, 20)
      text(`Your final score is ${score}`, width/2 - 60, 40 )
      text("Press the space key to start again.", width/2 - 90, 60)
    }
  }



function keyPressed()
{
  if(keyCode == '32' && gameOver)
  {
    score = 0;
    gameOver= false;
    player.y = 0;
    loop();
    
  }
}

class Player
{
  constructor()
  {
    this.x = 10;
    this.y = 0;
    
    this.gravity = 0.05;
    this.velocity = 0;
  }
  
  show()
  {
    noStroke();
    fill(255,0,0);
    rect(this.x, this.y, 10, 10);
  }
  
  update(audioLevel)
  {
    if(audioLevel > 0)
    {
      this.y -= audioLevel * 30;
    }
    
    this.velocity += this.gravity
    this.y += this.velocity;
    
    if(this.y > height - 10)
    {
      this.y = height - 10;
      this.velocity = 0;
    }
    
  }
  
  collision(platforms)
  {
    for(let i = 0; i < platforms.length; i++)
    {
      if(collideLineRect(platforms[i].x,platforms[i].top,platforms[i].width,platforms[i].top,this.x, this.y, 10, 10))
      {
        console.log("hit");
        this.velocity = 0;
      }
    }
  }
}


class Platform
{
  constructor(x)
  {
    this.top = random(height/2,height)
    this.x = x;
    this.width = random(12,50);
  }
  
  show()
  {
    fill(255);
    rect(this.x, this.top, this.width, height);
  }
  
  update()
  {
    if(frameCount % 2 ==0)
    {
      this.x--;
    }
  }
}