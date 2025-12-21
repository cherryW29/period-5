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
      
      // Get camera world position
      const cameraObj = this.camera.object3D;
      cameraObj.updateMatrixWorld(true);
      const cameraWorldPos = new THREE.Vector3();
      cameraObj.getWorldPosition(cameraWorldPos);
      
      // Get box position (world space)
      const boxPos = event.detail.boxPosition;
      
      // Calculate direction from camera to box (world space)
      const worldDx = boxPos.x - cameraWorldPos.x;
      const worldDy = boxPos.y - cameraWorldPos.y;
      const worldDz = boxPos.z - cameraWorldPos.z;
      
      // Calculate distance
      this.data.boxDistance = Math.sqrt(worldDx * worldDx + worldDy * worldDy + worldDz * worldDz);
      
      // Transform world direction to camera local space
      const worldDirection = new THREE.Vector3(worldDx, worldDy, worldDz).normalize();
      
      // Transform to camera local space using the camera's inverse world matrix
      const localDirection = worldDirection.clone();
      const cameraWorldMatrix = new THREE.Matrix4();
      cameraWorldMatrix.copy(cameraObj.matrixWorld);
      const cameraLocalMatrix = new THREE.Matrix4();
      cameraLocalMatrix.copy(cameraWorldMatrix).invert();
      
      // Extract only rotation from the matrix (remove translation)
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.extractRotation(cameraLocalMatrix);
      localDirection.applyMatrix4(rotationMatrix);
      localDirection.normalize();
      
      // Store direction in camera local space
      this.data.direction = {
        x: localDirection.x,
        y: localDirection.y,
        z: localDirection.z
      };
      
      // Store starting position
      this.data.startPos = {x: 0, y: 0, z: -1};
      
      this.el.setAttribute('visible', true);
      this.el.setAttribute('position', this.data.startPos);
    }
  },
 
  tick: function(time, timeDelta) {
    if (!this.el.getAttribute('visible') || !this.data.direction) return;
    
    let pos = this.el.getAttribute('position');
    
    // Calculate movement distance for this frame
    const moveDistance = (timeDelta * TORPEDO_SPEED) / 1000.0;
    
    // Move torpedo in the direction of the box (all 3 axes)
    pos.x += this.data.direction.x * moveDistance;
    pos.y += this.data.direction.y * moveDistance;
    pos.z += this.data.direction.z * moveDistance;
    
    // Calculate 3D distance travelled from start
    const dx = pos.x - this.data.startPos.x;
    const dy = pos.y - this.data.startPos.y;
    const dz = pos.z - this.data.startPos.z;
    const distanceTraveled = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    // Get torpedo world position
    const worldPos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(worldPos);
    
    // Manual collision check with box (fallback if aabb-collider doesn't work)
    const box = document.getElementById('box');
    if (box && box.object3D) {
      const boxWorldPos = new THREE.Vector3();
      box.object3D.getWorldPosition(boxWorldPos);
      const distToBox = worldPos.distanceTo(boxWorldPos);
      
      // Check if torpedo is close enough to box (within collision radius)
      // Box is a cone with radiusBottom 0.7, torpedo is sphere with radius 0.2
      const collisionRadius = 0.7 + 0.2; // Combined radii
      
      if (distToBox < collisionRadius) {
        // Emit collision event manually
        this.el.emit('hitstart', {el: box, distance: distToBox});
      }
    }
    
    if (distanceTraveled > this.data.boxDistance + TORPEDO_MARGIN) {
      this.el.setAttribute('visible', false);
      this.el.setAttribute('position', {x: 0, y: 0, z: -1});
    } else {
      this.el.setAttribute('position', pos);
    }
  },
 
  getDistance: function(pos1, pos2) {
    let dx = pos2.x - pos1.x;
    let dy = pos2.y - pos1.y;
    let dz = pos2.z - pos1.z;
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
  }
 
 });
