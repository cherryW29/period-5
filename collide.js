/* global AFRAME, TORPEDO_SPEED, TORPEDO_MARGIN */

AFRAME.registerComponent('collide', {

  schema: {
    boxDistance: {type: 'number'}
  },
 
  init: function () {
    this.collided = false; // Track if collision already happened for this torpedo
    
    // Listen for collision events from aabb-collider
    this.el.addEventListener('hitstart', this.onCollision.bind(this));
    this.el.addEventListener('hitend', function() {
      this.collided = false; // Reset when collision ends
    }.bind(this));
    
    // Listen for fire event to reset collision flag
    this.el.addEventListener('fire', function() {
      this.collided = false;
    }.bind(this));
  },
 
  onCollision: function(evt) {
    // Prevent multiple collisions for the same torpedo
    if (this.collided || !this.el.getAttribute('visible')) {
      return;
    }
    
    this.collided = true;
    
    let box = document.getElementById('box');
    if (!box) {
      return;
    }
    
    // Move box to a new random position
    let newPosition = {
      x: Math.random() * 10 * ((Math.random() < 0.5) ? -1 : 1),
      y: Math.random() * 9 + 1,
      z: -(Math.random() * 8 + 2)
    };
    
    box.setAttribute('position', newPosition);
    
    // Hide the torpedo
    this.el.setAttribute('visible', false);

    // Update score
    this.updateScore();
  },
  
  updateScore: function() {
    try {
      let scoreText = document.getElementById('scoreText');
      if (!scoreText) {
        return;
      }
      
      // Ensure score text is visible
      if (scoreText.getAttribute('visible') === false) {
        scoreText.setAttribute('visible', true);
      }
      
      // Get current score value safely
      let currentValue = scoreText.getAttribute('value') || 'Score: 0';
      let scoreMatch = currentValue.match(/Score:\s*(\d+)/);
      let currentScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      let newScore = currentScore + 10; // Add 10 points per hit
      
      // Update score text
      scoreText.setAttribute('value', 'Score: ' + newScore);
      
      // Update high score
      let highText = document.getElementById('highText');
      if (highText) {
        // Ensure high score text is visible
        if (highText.getAttribute('visible') === false) {
          highText.setAttribute('visible', true);
        }
        
        let highValue = highText.getAttribute('value') || 'Best: 0';
        let highMatch = highValue.match(/Best:\s*(\d+)/);
        let highScore = highMatch ? parseInt(highMatch[1]) : 0;
        
        if (newScore > highScore) {
          highScore = newScore;
          highText.setAttribute('value', 'Best: ' + highScore);
          // Save to localStorage
          try {
            localStorage.setItem('sgHighScores', highScore.toString());
          } catch(e) {
            // Silently fail if localStorage is not available
          }
        }
      }
    } catch(error) {
      // Silently handle errors
    }
  }
});
