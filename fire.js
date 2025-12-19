/* global AFRAME, TORPEDO_SPEED, TORPEDO_MARGIN */

AFRAME.registerComponent('fire', {
  schema: { boxDistance: {type: 'number'} },

  init: function () {
    this.el.addEventListener('fire', this.fire.bind(this));
    this.camera = document.getElementById('camera');
  },

  fire: function (evt) {
    // only fire if torpedo is not already visible
    if (this.el.getAttribute('visible')) return;

    // compute distance camera → box
    const camPos = this.camera.getAttribute('position');
    const boxPos = evt.detail.boxPosition;
    this.data.boxDistance = this.getDistance(camPos, boxPos);

    // arm torpedo
    this.el.setAttribute('position', {x: 0, y: 0, z: -1});
    this.el.setAttribute('visible', true);
  },

  tick: function (t, dt) {
    if (!this.el.getAttribute('visible')) return;

    let p = this.el.getAttribute('position');
    p.z -= (dt * TORPEDO_SPEED) / 1000;

    const travelled = Math.abs(p.z + 1);          // distance from start
    if (travelled > this.data.boxDistance + TORPEDO_MARGIN) {
      // ----- hide only when past the target -----
      this.el.setAttribute('visible', false);
      return;
    }
    this.el.setAttribute('position', p);
  },

  getDistance: function (a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
});
