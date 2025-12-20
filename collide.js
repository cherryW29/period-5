/* global AFRAME, TORPEDO_SPEED, TORPEDO_MARGIN */

AFRAME.registerComponent('collide', {

  schema: {
    boxDistance: {type: 'number'}
  },
 
  init: function () {
    this.el.addEventListener('hitstart', this.collide.bind(this));
  },
 
  collide: function() {
    let box = document.getElementById('box');
    let position = box.getAttribute('position');
    position.x = Math.random() * 10 * ((Math.random() < 0.5) ? -1 : 1);
    position.y = Math.random() * 9 + 1;  // Minimum y-value is 1 so it's above ground
    position.z = -(Math.random() * 8 + 2);
    box.setAttribute('position', position);
    this.el.setAttribute('visible', false);
 },
    
  tick: function (t, dt) {
    if (this.el.getAttribute('material').opacity === 0) return;

    let p = this.el.getAttribute('position');
    p.z -= (dt * TORPEDO_SPEED) / 1000;

    const travelled = Math.abs(p.z + 1);
    if (travelled > this.data.boxDistance + TORPEDO_MARGIN) {
      this.el.setAttribute('material', 'opacity', 0);   // hide, collider stays
      return;
    }
    this.el.setAttribute('position', p);
  },

  getDistance: function (a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  });
  
