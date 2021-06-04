var Play = 1;
var End = 0;
var gameState = Play;

var background, backgroundImage;

var score = 0;

var sun, sunImage;

var ground, groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var cloudsGroup, cloudImage;

var gameover, gameoverImage;

var jumpSound, collideSound;

function preload()
{
  backgroundImage = loadImage("backgroundImg.png");
  
  sunAnimation = loadAnimation("sun.png");
  
  cloudImage = loadImage("cloud.png");
  
  groundImage = loadImage("ground.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  
  trex_running = loadAnimation("trex_1.png", "trex_2.png", 
"trex_3.png");
  
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
  trex_collided = loadAnimation("trex_collided.png");
  
  jumpSound = loadSound("sounds/jump.wav");
  
  collideSound = loadSound("sounds/collided.wav");
}
function setup()
{
  createCanvas(windowWidth, windowHeight);
  
  restart = createSprite(width/2, height/2+100);
  restart.addImage(restartImage);
  restart.scale = 0.3;
  restart.visible = false;
  
  gameover = createSprite(width/2, height/2-50);
  gameover.addImage(gameoverImage);
  gameover.scale = 3;
  gameover.visible = false;
  
  sun = createSprite(1500,100,20,20);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1;
  
  trex = createSprite(100, height-80,20, 20);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.1;
  
  trex.setCollider("circle", 0, 0, 300);
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage(groundImage);
  ground.scale = 1;
  
  invisibleGround = createSprite(width/2, height-60, width, 5);
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
}
function draw()
{
  background(backgroundImage);
  
  fill("black");
  textSize(30);
  text("SCORE = " + score, 50, 50);
  
  if(gameState == Play)
  {
    if(keyDown(UP_ARROW) && trex.y >= height-180)
    {
      jumpSound.play();
      trex.velocityY = -10;
    }

    if(keyDown(RIGHT_ARROW))
    {
      trex.position.x = trex.position.x + 20;
      camera.x = trex.position.x;
      camera.y = displayHeight/2;
    }
  
    trex.velocityY = trex.velocityY + 0.8;
    
    score = score + Math.round(getFrameRate()/60);
    
    ground.velocityX = -(6 + 3*score/100);
  
   if(ground.x < 500)
     {
       ground.x = ground.width/2;
     }
     spawnClouds();
  
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex))
      {
        collideSound.play();
        gameState = End;
      }
  }
  
  if(gameState == End)
    {
      trex.changeAnimation("collided",trex_collided);
      
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
      ground.velocityX = 0;
      trex.velocityY = 0;
        
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      
      gameover.visible = true;
      restart.visible = true;
      
      if(mousePressedOver(restart))
        {
          reset();
        }
    }
  
  trex.collide(invisibleGround);
  
  background.depth = trex.depth;
  trex.depth = trex.depth + 1;
  
  drawSprites();
}


 function spawnClouds()
 {
   if(frameCount % 60 == 0)
   { 
   var cloud = createSprite(width, Math.round(random(100, 250)), 50, 50);
   cloud.addImage(cloudImage);
   cloud.scale = 0.6;
   cloud.velocityX = -(5 + 3*score/80);
   cloud.lifetime = 300;
   
   cloud.depth = gameover.depth;
   gameover.depth = gameover.depth + 1;
   
   cloud.depth = restart.depth;
   restart.depth = restart.depth + 1;
   
   cloudsGroup.add(cloud);
   }
 }
function spawnObstacles()
{
  if(frameCount % 100 == 0)
    {
      var obstacle = createSprite(width, height-100, 20, 20);
      obstacle.velocityX = -(6 + 3*score/100);
      
      var rand = Math.round(random(1, 2));
      
      switch(rand)
     {
       case 1: obstacle.addImage(obstacle1);
               obstacle.scale = 0.4;
               obstacle.setCollider("circle",0,0,45);
               break;
                
       case 2: obstacle.addImage(obstacle2);
               obstacle.scale = 0.4;
               obstacle.setCollider("circle",0,0,45);
               break;
     }
      obstacle.lifetime = 300;
      
      obstaclesGroup.add(obstacle);
    }
}
function reset()
{
  gameState = Play;
  
  trex.changeAnimation("running",trex_running);
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  gameover.visible = false;
  restart.visible = false;
  
  score = 0;
}