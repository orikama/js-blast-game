export default class Animation {
  constructor(animatedTiles, duration) {
    this.playAnimation = true;
    this.animatedTiles = animatedTiles;
    this.animationDuration = duration;
    this.currentTime = 0.0;

    this.lerpT = 0.0;
  }

  getAnimatedTiles() {
    return this.animatedTiles;
  }

  isAnimationPlaying() {
    return this.playAnimation;
  }

  _updateTime(dt) {
    if (this.currentTime < this.animationDuration) {
      this.currentTime += dt;
      if (this.currentTime > this.animationDuration) {
        this.currentTime = this.animationDuration;
      }
      this.lerpT = this.currentTime / this.animationDuration;
    } else {
      this.playAnimation = false;
    }

    return this.playAnimation;
  }

  lerp(start, end) {
    return start * (1 - this.lerpT) + end * this.lerpT;
  }
}
