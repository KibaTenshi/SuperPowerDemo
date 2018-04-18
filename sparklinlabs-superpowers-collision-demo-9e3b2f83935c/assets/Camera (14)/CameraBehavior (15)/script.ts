class CameraBehavior extends Sup.Behavior {
  
  update() {
    this.actor.setPosition(Sup.getActor("Player").getX(),Sup.getActor("Player").getY());
  }
}
Sup.registerBehavior(CameraBehavior);
