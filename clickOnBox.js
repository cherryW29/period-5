/* global AFRAME */

AFRAME.registerComponent('click-on-box', {

  init: function () {
    this.el.addEventListener('click', this.boxClicked.bind(this));
  },

  boxClicked: function() {
    // Get the camera (parent of cursor) and find its raycaster child
    let camera = this.el.parentNode;
    
    // Find the raycaster entity (sibling of cursor)
    let raycasterEl = camera.querySelector('[raycaster]');
    
    if (!raycasterEl || !raycasterEl.components.raycaster) {
      return;
    }
    
    let raycaster = raycasterEl.components.raycaster;
    
    // Get what the raycaster is currently intersecting
    let intersections = raycaster.intersectedEls;
    
    if (intersections && intersections.length > 0) {
      // Get the first intersected element (the box)
      let box = intersections[0];
      let boxPosition = box.getAttribute('position');
      
      let torpedo = document.getElementById('torpedo');
      torpedo.emit('fire', {boxPosition: boxPosition});
    }
  }
});
