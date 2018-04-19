Sup.ArcadePhysics2D.setGravity(0, -0.02);
var world = new p2.World({
    gravity:[0,-9.82]
});

var rollingTime=0;
class PlayerBehavior extends Sup.Behavior {
  speed = 0.3;
  jumpSpeed = 0.45;
  public muerto=false;
  public hit=false;
  public ball=false;

  solidBodies: Sup.ArcadePhysics2D.Body[] = [];
  platformBodies: Sup.ArcadePhysics2D.Body[] = [];
  stairsBodies: Sup.ArcadePhysics2D.Body[] = [];

  awake() {
    // We get and store all the bodies in two lists
    let solidActors = Sup.getActor("Solids").getChildren();
    for (let solidActor of solidActors)
      this.solidBodies.push(solidActor.arcadeBody2D);
    
    let platformActors = Sup.getActor("Platforms").getChildren();
    for (let platformActor of platformActors) this.platformBodies.push(platformActor.arcadeBody2D);
    let stairsActors = Sup.getActor("Stairs").getChildren();
    for (let stairsActor of stairsActors) this.stairsBodies.push(stairsActor.arcadeBody2D);
     
  }

  update() {
  
    // First, we do the check with solid bodies
    let ballForm=false;
    let enEscalera= false;
    let escalando = false;
    let theyseemeRolling=false;
     if (this.actor.arcadeBody2D.getMovable()==false)
           this.actor.arcadeBody2D.setMovable(true);
    let cuestaArriba=false;
    let cuestaAbajo=false;
     //COMPROBACION TILESET CUESTA
    var x= Math.floor(this.actor.getX());
    var y= Math.floor(this.actor.getY());
    var actualTileID=Sup.getActor("Map").tileMapRenderer.getTileMap().getTileAt(1,x+2,y+1);
    
    var tileProperty= Sup.getActor("Map").tileMapRenderer.getTileSet().getTileProperties(actualTileID);
    
   Object.keys(tileProperty)
  .forEach(function eachKey(key) { 
    Sup.log(key); // alerts key  
    Sup.log(tileProperty[key]); // alerts value
     if(tileProperty[key]=="1"){
        // Sup.log("Sube"); 
        cuestaArriba=true;
     }else if(tileProperty[key]=="2"){
       //  Sup.log("Baja");
         cuestaAbajo=true;
     }
  });
    
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, this.solidBodies); //esto es una constante le esta haciendo chocar con solidbodies.

    if(this.actor.arcadeBody2D.getTouches().top)
          Sup.log("Toque cabeza");
    let touchSolids = this.actor.arcadeBody2D.getTouches().bottom;
    let velocity = this.actor.arcadeBody2D.getVelocity();
    if (velocity.y <= -0.60){ //BUG caidas altas, sino atraviesa plataformas
      
      velocity.y= -0.45;
    }
    // When falling, we do the check with one-way platforms
    let touchPlatforms = false;
    
    
    
    
    
   
    //Comprobacion de muerte por caida.
    if(this.muerto==true){
        if(!Fade.isFading){
           this.actor.arcadeBody2D.warpPosition(6.552,7.952);
           
           while(!Fade.isFading){
             Fade.start(Fade.Direction.In, null);
             if(Fade.isFading)
               break;
           }
           
           this.muerto=false;
           this.hit=false;
        }
      
    }
    //MIENTRAS EL PERSONAJE CAE
    if (velocity.y < 0) {
      //Sup.log("Velocidad X Y"+this.actor.arcadeBody2D.getVelocity());
      // We must change the size of the player body so only the feet are checked
      // To do so, we reduce the height of the body and adapt the offset
        this.actor.arcadeBody2D.setSize(1, 0.4);
        this.actor.arcadeBody2D.setOffset({ x: 0, y: 0.2 });
      
      // Now, we can do check with every platform
      //recorres todas las plataformas dentro del array que rellenamos al principio.
      for (let platformBody of this.platformBodies) {
        Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, platformBody);
        //Collides significa colisión entre dos valores EN este caso el personaje y las plataformas
        if (this.actor.arcadeBody2D.getTouches().bottom) {
          touchPlatforms = true;
          velocity.y = 0;
          break;
        }
      }
  
      // After the check, we have to reset the body to its normal size
      this.actor.arcadeBody2D.setSize(1, 1.8);
      this.actor.arcadeBody2D.setOffset({ x: 0, y: 0.9 });
    }
    let touchBottom = touchSolids || touchPlatforms;
    
   
    
   //INICIO BUCLE DE COMPROBACIÓN ESCALERAS SUBIR Y BAJAR
        for (let stairBody of this.stairsBodies){
                if(Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D,stairBody))
                    enEscalera= true;

                if(enEscalera && Sup.Input.isKeyDown("UP") && !Sup.Input.isKeyDown("RIGHT") && !Sup.Input.isKeyDown("LEFT") ){
                    velocity.y= 0.2;
                    this.actor.arcadeBody2D.setCustomGravityY(0);
                    this.actor.spriteRenderer.setAnimation("Climb");
                    escalando=true;
                  //Sup.log("Estoy escalando!");

                  }else {
                      if(enEscalera && !touchSolids && Sup.Input.isKeyDown("DOWN") && !Sup.Input.isKeyDown("RIGHT") && !Sup.Input.isKeyDown("LEFT") ){
                            velocity.y= -0.2;
                            this.actor.arcadeBody2D.setCustomGravityY(0);
                            this.actor.spriteRenderer.setAnimation("Climb");
                            escalando= true;
                          //Sup.log("Estoy bajando!");

                          }else
                              if(enEscalera && !touchBottom && !Sup.Input.isKeyDown("RIGHT") && !Sup.Input.isKeyDown("LEFT")) {
                                      if (this.actor.arcadeBody2D.getMovable()==true)
                                          this.actor.arcadeBody2D.setMovable(false);
                                      this.actor.spriteRenderer.setAnimation("Climb");
                                      this.actor.spriteRenderer.pauseAnimation();

                                }else{
                                      this.actor.arcadeBody2D.setCustomGravityY(null);
                                      this.actor.arcadeBody2D.setMovable(true);

                                  }
                  }
            }
    //FIN BUCLE DE COMPROBACIÓN ESCALERAS SUBIR Y BAJAR
    
    
    
    // We override the `.x` component based on the player's input
    if (Sup.Input.isKeyDown("LEFT")&& !Sup.Input.isKeyDown("RIGHT")) {
           
        if (velocity.x >= -this.speed){
            velocity.x += -0.01;
        } 
        if(cuestaArriba){
           if (velocity.y >= -this.speed)
            velocity.y += -0.01;
        
          
        }
      this.actor.spriteRenderer.setHorizontalFlip(true);
    } else{ 
          if (Sup.Input.isKeyDown("RIGHT") && !Sup.Input.isKeyDown("LEFT")) {
            // When going right, we cancel the flip
             this.actor.spriteRenderer.setHorizontalFlip(false);
             
             if (velocity.x <= this.speed)
                    velocity.x += 0.01;
             Sup.log("cuestaArrib="+cuestaArriba);
          if(cuestaArriba){
               velocity.x=this.speed;
           
                velocity.y=0.165 ;
          }
        } else
              velocity.x =0;
    }
    
   
     //COMPROBACION DE ROLLEO
      if(touchBottom && Sup.Input.isKeyDown("DOWN")){
        if(Sup.Input.isKeyDown("LEFT"))  
            velocity.x = -0.25;
        else if(Sup.Input.isKeyDown("RIGHT"))
            velocity.x = +0.25;
           this.actor.arcadeBody2D.setSize(1, 1);
           this.actor.arcadeBody2D.setOffset({ x: 0, y: 0.5 });
           theyseemeRolling=true;
           rollingTime++;
           
        }else 
            if(!theyseemeRolling){
                 this.actor.arcadeBody2D.setSize(1, 1.8);
                 this.actor.arcadeBody2D.setOffset({ x: 0, y: 0.9 });
              }    
      // When going left, we have to flip the sprite
    
    // If the player is on the ground and wants to jump,
    // we update the `.y` component accordingly
    
    if (touchBottom && !escalando ||cuestaArriba) {
    
           if (Sup.Input.wasKeyJustPressed("UP")&& !enEscalera && !theyseemeRolling) {
                  velocity.y = this.jumpSpeed;
                  this.actor.spriteRenderer.setAnimation("Jump");

            } 
              // There, we should play either 'Idle' or 'Run' depending on the horizontal speed
              if (velocity.x === 0){ 
                       if(rollingTime>=10){
                             this.actor.spriteRenderer.setAnimation("StopRoll");
                             this.actor.spriteRenderer.setAnimationFrameTime(0.1);
                             rollingTime=0;
                        }else{
                             
                             this.actor.spriteRenderer.setAnimation("Idle"); 
                             rollingTime=0;
                         }
                     
                    
                
              }else {
                    if(theyseemeRolling){
                        if(rollingTime<=10)
                           this.actor.spriteRenderer.setAnimation("Roll");
                        else
                            this.actor.spriteRenderer.setAnimation("Rolling");
                
                    }else{
                          this.actor.spriteRenderer.setAnimation("Run");
                          rollingTime=0;
                        }
                      
                   }
      } else {
            // There, we should play either 'Jump' or 'Fall' depending on the vertical speed
            if(this.hit) this.actor.spriteRenderer.setAnimation("Hit")
            else    
              if(!enEscalera){
                   if (velocity.y >= 0.4) 
                     this.actor.spriteRenderer.setAnimation("Jump")
                    else if(cuestaArriba && velocity.y>0)
                          this.actor.spriteRenderer.setAnimation("Run")
                         else if(!enEscalera && velocity.y<0)this.actor.spriteRenderer.setAnimation("Fall");
            }else 
                  if(escalando && (Sup.Input.isKeyDown("UP") || Sup.Input.isKeyDown("DOWN")))
                      this.actor.spriteRenderer.setAnimation("Climb");
        
      }
      //Sup.log("escalando="+escalando);
      //Sup.log("enEscalera"+enEscalera);
      // Finally, we apply the velocity back to the ArcadePhysics body
      
      this.actor.arcadeBody2D.setVelocity(velocity);
      if(!escalando && !cuestaArriba)
        Sup.ArcadePhysics2D.setGravity(0, -0.02);
    }
}
Sup.registerBehavior(PlayerBehavior);
