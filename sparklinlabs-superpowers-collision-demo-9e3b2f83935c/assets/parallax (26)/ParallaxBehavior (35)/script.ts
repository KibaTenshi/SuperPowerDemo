class ParallaxBehavior extends Sup.Behavior {
  awake() {
    let focal_point_speed = 5;
    let layer_difference = 1;
  }

  update() {
    //Prueba de Parallax
    //Variables
   

    //Focal point layer
    if(Sup.getActor("Player").getX()> -22 && Sup.getActor("Player").getX()<21){
     if(Sup.getActor("Player").arcadeBody2D.getVelocityX() > 0.3){
         Sup.getActor("Parallax 1").moveX(Sup.getActor("Player").arcadeBody2D.getVelocityX()-0.36);
         Sup.getActor("Parallax 2").moveX(Sup.getActor("Player").arcadeBody2D.getVelocityX()-0.34);
         Sup.getActor("Parallax 3").moveX(Sup.getActor("Player").arcadeBody2D.getVelocityX()-0.32);
         Sup.getActor("Parallax 4").moveX(Sup.getActor("Player").arcadeBody2D.getVelocityX()-0.31);
       
     }else if(Sup.getActor("Player").arcadeBody2D.getVelocityX() < -0.3){
         Sup.getActor("Parallax 1").moveX(Sup.getActor("Player").arcadeBody2D.getVelocityX()+0.36);
         Sup.getActor("Parallax 2").moveX(Sup.getActor("Player").arcadeBody2D.getVelocityX()+0.35);
         Sup.getActor("Parallax 3").moveX(Sup.getActor("Player").arcadeBody2D.getVelocityX()+0.32);
         Sup.getActor("Parallax 4").moveX(Sup.getActor("Player").arcadeBody2D.getVelocityX()+0.31);
     }
    }
    if(Sup.getActor("Player").getBehavior(PlayerBehavior).hit){
        Sup.getActor("Parallax 1").setPosition(0,0,3);
        Sup.getActor("Parallax 2").setPosition(0,0,2);
        Sup.getActor("Parallax 3").setPosition(0,5.2,1);
        Sup.getActor("Parallax 4").setPosition(0,5.741,0);
    }

    //Background layers
    //layer2.hspeed = layer3.hspeed – layer_difference;
    //layer1.hspeed = layer2.hspeed – layer_difference;

    //Foreground layers
    //layer4.hspeed = layer3.hspeed + layer_difference;
    //layer5.hspeed = layer4.hspeed + layer_difference;
    
  }
}
Sup.registerBehavior(ParallaxBehavior);
