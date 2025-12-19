/* global AFRAME */

AFRAME.registerComponent('click-on-box', {

  init: function () {
    this.el.addEventListener('click', this.boxClicked.bind(this));
    console.log('click-on-box component initialized on:', this.el);
  },

  boxClicked: function() {
    console.log('CLICK EVENT FIRED!');
    
    // Get the camera (parent of cursor) and find its raycaster child
    let camera = this.el.parentNode;
    console.log('Camera:', camera);
    
    // Find the raycaster entity (sibling of cursor)
    let raycasterEl = camera.querySelector('[raycaster]');
    console.log('Raycaster element:', raycasterEl);
    
    if (!raycasterEl || !raycasterEl.components.raycaster) {
      console.log('ERROR: No raycaster found!');
      return;
    }
    
    let raycaster = raycasterEl.components.raycaster;
    
    // Get what the raycaster is currently intersecting
    let intersections = raycaster.intersectedEls;
    
    console.log('Intersections:', intersections);
    
    if (intersections && intersections.length > 0) {
      // Get the first intersected element (the box)
      let box = intersections[0];
      let boxPosition = box.getAttribute('position');
      
      console.log('Box found at position:', boxPosition);
      
      let torpedo = document.getElementById('torpedo');
      torpedo.emit('fire', {boxPosition: boxPosition});
    } else {
      console.log('No intersections found!');
    }
  }
});
