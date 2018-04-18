Sup.ArcadePhysics2D.setGravity(0, -0.02);
var rollingTime=0;
class PlayerBehavior extends Sup.Behavior {
  speed = 0.3;
  jumpSpeed = 0.45;

  solidBodies: Sup.ArcadePhysics2D.Body[] = [];
  platformBodies: Sup.ArcadePhysics2D.Body[] = [];
  stairsBodies: Sup.ArcadePhysics2D.Body[] = [];


  awake() {
    // We get and store all the bodies in two lists
    let solidActors = Sup.getActor("Solids").getChildren();
    for (let solidActor of solidActors) this.solidBodies.push(solidActor.arcadeBody2D);
    let platformActors = Sup.getActor("Platforms").getChildren();
    for (let platformActor of platformActors) this.platformBodies.push(platformActor.arcadeBody2D);
    let stairsActors = Sup.getActor("Stairs").getChildren();
    for (let stairsActor of stairsActors) this.stairsBodies.push(stairsActor.arcadeBody2D);
  }

  update() {
    // First, we do the check with solid bodies
    let enEscalera= false;
    let escalando = false;
    let theyseemeRolling= false;
     if (this.actor.arcadeBody2D.getMovable()==false)
           this.actor.arcadeBody2D.setMovable(true);
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, this.solidBodies);
    
        
    let touchSolids = this.actor.arcadeBody2D.getTouches().bottom;
   
    let velocity = this.actor.arcadeBody2D.getVelocity();
    if (velocity.y <= -0.60){ //BUG caidas altas, sino atraviesa plataformas
      
      velocity.y= -0.45;
    }
    // When falling, we do the check with one-way platforms
    let touchPlatforms = false;
    
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
    if (Sup.Input.isKeyDown("LEFT")) {
      velocity.x = -this.speed;
      //COMPROBACION DE ROLLEO
      if(touchBottom && Sup.Input.isKeyDown("DOWN")){
           velocity.x = -0.25;
           this.actor.arcadeBody2D.setSize(1, 0.8);
           this.actor.arcadeBody2D.setOffset({ x: 0, y: 0.4 });
           theyseemeRolling=true;
           rollingTime++;
           
        }       
      // When going left, we have to flip the sprite
      this.actor.spriteRenderer.setHorizontalFlip(true);
    } else if (Sup.Input.isKeyDown("RIGHT")) {
      velocity.x = this.speed;
      //COMPROBACION DE ROLLEO
      if(touchBottom && Sup.Input.isKeyDown("DOWN")){
           velocity.x = 0.25;
           this.actor.arcadeBody2D.setSize(1, 0.8);
           this.actor.arcadeBody2D.setOffset({ x: 0, y: 0.4 });
           theyseemeRolling=true;
           rollingTime++;
        } 
      // When going right, we cancel the flip
      this.actor.spriteRenderer.setHorizontalFlip(false);
    } else{ 
          velocity.x = 0;
          this.actor.arcadeBody2D.setSize(1, 1.8);
          this.actor.arcadeBody2D.setOffset({ x: 0, y: 0.9 });
          }
    // If the player is on the ground and wants to jump,
    // we update the `.y` component accordingly
    
    if (touchBottom && !escalando) {
    
           if (Sup.Input.wasKeyJustPressed("UP")&& !enEscalera) {

                  velocity.y = this.jumpSpeed;
                  this.actor.spriteRenderer.setAnimation("Jump");

            } 
              // There, we should play either 'Idle' or 'Run' depending on the horizontal speed
              if (velocity.x === 0){ 
                   if(rollingTime>=10){
                     this.actor.spriteRenderer.setAnimation("StopRoll");
                     this.actor.spriteRenderer.setAnimationFrameTime(0.1);
                   }
                  else
                     this.actor.spriteRenderer.setAnimation("Idle");
                     rollingTime=0;
              }else {
                    if(theyseemeRolling)
                        if(rollingTime<=10)
                           this.actor.spriteRenderer.setAnimation("Roll");
                        else
                            this.actor.spriteRenderer.setAnimation("Rolling");
                    else{
                        this.actor.spriteRenderer.setAnimation("Run");
                        rollingTime=0;
                      }
                   }
      } else {
            // There, we should play either 'Jump' or 'Fall' depending on the vertical speed
            if(!enEscalera){
                 if (velocity.y >= 0.3) this.actor.spriteRenderer.setAnimation("Jump")
                 else if(!enEscalera)this.actor.spriteRenderer.setAnimation("Fall");
            }else 
                  if(escalando && (Sup.Input.isKeyDown("UP") || Sup.Input.isKeyDown("DOWN")))
                      this.actor.spriteRenderer.setAnimation("Climb");
        
      }
      //Sup.log("escalando="+escalando);
      //Sup.log("enEscalera"+enEscalera);
      // Finally, we apply the velocity back to the ArcadePhysics body
      
      this.actor.arcadeBody2D.setVelocity(velocity);
      if(!escalando)
        Sup.ArcadePhysics2D.setGravity(0, -0.02);
    }
}
Sup.registerBehavior(PlayerBehavior);
