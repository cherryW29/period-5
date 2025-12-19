/* global AFRAME, BOX_SPEED */

AFRAME.registerComponent('box-spin', {

  tick: function (time, delta) {
    let rotation = this.el.getAttribute('rotation')
    rotation.y = (rotation.y + BOX_SPEED) % 360
    rotation.x = (rotation.x + BOX_SPEED) % 360
    rotation.z = (rotation.z + BOX_SPEED) % 360
    this.el.setAttribute('rotation', rotation)
  },
  
});

