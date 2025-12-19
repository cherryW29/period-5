/* global AFRAME */
AFRAME.registerComponent('sound-unlock', {
  init: function () {
    // wait for any click/touch/gaze-trigger
    this.el.sceneEl.addEventListener('click', () => {
      const sounds = this.el.sceneEl.querySelectorAll('a-sound, a-entity[sound]');
      sounds.forEach(s => {
        const audio = s.components.sound?.data?.src;
        if (audio) {
          // resume the WebAudio context that A-Frame created
          s.components.sound.pool.children[0].context.resume();
        }
      });
    }, { once: true });
  }
});
