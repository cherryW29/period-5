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
  z: -(Math.random() * 5 + 3)   // ‑3 … ‑8   
};
   
   box.setAttribute('position', position);
   console.log('New box position:', position);
   
   this.el.setAttribute('position', {x: 0, y: 0, z: -1});
   this.el.setAttribute('visible', false);
   console.log('Torpedo reset and hidden');
  // update score
let text = document.querySelector('#scoreText');
let newScore = parseInt(text.getAttribute('value').split(' ')[1]) + SCORE_PER_HIT;
text.setAttribute('value', 'Score: ' + newScore);
  // read old highs
let highs = JSON.parse(localStorage.getItem(HIGH_SCORE_KEY) || '[]');
highs.push(newScore);
highs.sort((a,b)=>b-a);
highs = highs.slice(0,3);
localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(highs));
// show best
document.querySelector('#highText').setAttribute('value', 'Best: ' + highs[0]);
 },

});
