class DeathBehavior extends Sup.Behavior {
  
  deathZoneBodies: Sup.ArcadePhysics2D.Body[] = [];
  awake() {
    // We get and store all the bodies in two lists
    let deathZoneActors = Sup.getActor("Deaths").getChildren();
    for (let deathZone of deathZoneActors) this.deathZoneBodies.push(deathZone.arcadeBody2D);
    
  }

  update() {
      for (let deathZoneBody of this.deathZoneBodies)
            if(Sup.ArcadePhysics2D.intersects(Sup.getActor("Player").arcadeBody2D,deathZoneBody)){
              if(!Sup.getActor('Player').getBehavior(PlayerBehavior).muerto){ 
                 
                 Fade.start(Fade.Direction.Out, null);
                 Sup.getActor('Player').getBehavior(PlayerBehavior).muerto=true;
                }
            }
  }
}
Sup.registerBehavior(DeathBehavior);
