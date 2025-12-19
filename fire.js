/* global AFRAME, TORPEDO_SPEED, TORPEDO_MARGIN */

AFRAME.registerComponent('fire', {

 schema: {
   boxDistance: {type: 'number'}
 },

 init: function () {
   this.el.addEventListener('fire', this.fire.bind(this));
   this.camera = null;
 },

 fire: function(event) {
   if (!this.el.getAttribute('visible')) {
     if (!this.camera) {
       this.camera = document.getElementById('camera');
     }
     
     let cameraPos = this.camera.getAttribute('position');
     let boxPos = event.detail.boxPosition;
     
     // Calculate actual distance from camera to box
     this.data.boxDistance = this.getDistance(cameraPos, boxPos);
     
     this.el.setAttribute('visible', true);
     this.el.setAttribute('position', {x: 0, y: 0, z: -1});
   }
 },

 tick: function(time, timeDelta) {
   if (this.el.getAttribute('visible')) {
     let pos = this.el.getAttribute('position');
     
     // Calculate how far torpedo has traveled (its distance from starting position)
     let distanceTraveled = Math.abs(pos.z + 1); // +1 because it starts at z=-1
     
     if (distanceTraveled > this.data.boxDistance + TORPEDO_MARGIN) {
       this.el.setAttribute('visible', false);
     } else {
       pos.z += -timeDelta * TORPEDO_SPEED / 1000.0;
       this.el.setAttribute('position', pos);
     }
   }
 },

 getDistance: function(pos1, pos2) {
   let dx = pos2.x - pos1.x;
   let dy = pos2.y - pos1.y;
   let dz = pos2.z - pos1.z;
   return Math.sqrt(dx*dx + dy*dy + dz*dz);
 }

});
