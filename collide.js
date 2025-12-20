/* global AFRAME, TORPEDO_SPEED, TORPEDO_MARGIN */

AFRAME.registerComponent('collide', {
  schema: { boxDistance: {type: 'number'} },

  init: function () {
    this.el.addEventListener('hitstart', this.collide.bind(this));
  },

  collide: function () {
    // 1. move the pyramid
    const box = document.getElementById('box');
    const pos = box.getAttribute('position');
    pos.x = Math.random() * 6 - 3;
    pos.y = Math.random() * 3 + 1;
    pos.z = -(Math.random() * 3 + 2);
    box.setAttribute('position', pos);

    // 2. remove the torpedo so the next shot can collide
    this.el.setAttribute('material', 'opacity', 0);
  }
});
  
