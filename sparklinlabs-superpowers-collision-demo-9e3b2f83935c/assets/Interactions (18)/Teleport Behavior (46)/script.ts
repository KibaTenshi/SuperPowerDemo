class TeleportBehavior extends Sup.Behavior {
  
  teleportZoneBodies: Sup.ArcadePhysics2D.Body[] = [];
  awake() {
     let teleportZoneActors = Sup.getActor("Teleports").getChildren();
    for (let teleportZone of teleportZoneActors) this.teleportZoneBodies.push(teleportZone.arcadeBody2D);
  }

  update() {
    
     for (let teleportZoneBody of this.teleportZoneBodies)
            if(Sup.ArcadePhysics2D.intersects(Sup.getActor("Player").arcadeBody2D,teleportZoneBody)){
               let sceneName= teleportZoneBody.actor.getName();
              if(!Sup.getActor('Player').getBehavior(PlayerBehavior).teleported){ 
                 
                 Sup.getActor('Player').getBehavior(PlayerBehavior).teleported=true;
                 Sup.getActor('Player').getBehavior(PlayerBehavior).sceneName=sceneName;
                 Fade.start(Fade.Direction.Out, null);
                }
            }
    
    
  }
}
Sup.registerBehavior(TeleportBehavior);
