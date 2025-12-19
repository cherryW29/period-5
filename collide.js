/* global AFRAME, TORPEDO_SPEED, TORPEDO_MARGIN */

AFRAME.registerComponent('collide', {

 schema: {
   boxDistance: {type: 'number'}
 },

 init: function () {
   this.el.addEventListener('hitstart', this.collide.bind(this));
   this.el.addEventListener('hitend', function() {
     console.log('Collision ended');
   });
   console.log('Collide component initialized');
 },

 collide: function() {
   console.log('COLLISION DETECTED!');
   console.log('Torpedo position:', this.el.getAttribute('position'));
   console.log('Torpedo world position:', this.el.object3D.getWorldPosition(new THREE.Vector3()));
   
   let box = document.getElementById('box');
   let oldPosition = box.getAttribute('position');
   console.log('Old box position:', oldPosition);
   
   let position = {
     x: Math.random() * 10 * ((Math.random() < 0.5) ? -1 : 1),
     y: Math.random() * 9 + 1,
     z: -(Math.random() * 8 + 2)
   };
   
   box.setAttribute('position', position);
   console.log('New box position:', position);
   
   this.el.setAttribute('position', {x: 0, y: 0, z: -1});
   this.el.setAttribute('visible', false);
   console.log('Torpedo reset and hidden');
 },

});
