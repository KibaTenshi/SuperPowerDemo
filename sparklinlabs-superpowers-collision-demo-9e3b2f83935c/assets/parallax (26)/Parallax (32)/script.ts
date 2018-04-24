class ScriptBehavior extends Sup.Behavior {
  awake() {
    let focal_point_speed = 5;
    let layer_difference = 1;
  }

  update() {
    //Prueba de Parallax
    //Variables
   

    //Focal point layer
     Sup.getActor("Parallax 1").moveX

    //Background layers
   //layer2.hspeed = layer3.hspeed – layer_difference;
    //layer1.hspeed = layer2.hspeed – layer_difference;

    //Foreground layers
    //layer4.hspeed = layer3.hspeed + layer_difference;
    //layer5.hspeed = layer4.hspeed + layer_difference;
    
  }
}
Sup.registerBehavior(ScriptBehavior);
