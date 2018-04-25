class ScriptBehavior extends Sup.Behavior {
  awake() {
    let focal_point_speed = 5;
    let layer_difference = 1;
  }

  update() {
    //Prueba de Parallax
    //Variables
   
    
    Sup.log("Entre");
        Sup.getActor("Parallax 1").setX(Sup.getActor("Player").getX());
        Sup.getActor("Parallax 2").setX(Sup.getActor("Player").getX());
        Sup.getActor("Parallax 3").setX(Sup.getActor("Player").getX());
        Sup.getActor("Parallax 4").setX(Sup.getActor("Player").getX());
   
      
  
    
    //Background layers
   //layer2.hspeed = layer3.hspeed – layer_difference;
    //layer1.hspeed = layer2.hspeed – layer_difference;

    //Foreground layers
    //layer4.hspeed = layer3.hspeed + layer_difference;
    //layer5.hspeed = layer4.hspeed + layer_difference;
    
  }
}
Sup.registerBehavior(ScriptBehavior);
