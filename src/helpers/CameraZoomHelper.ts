import * as THREE from "three";
import { gsap } from "gsap";

class CameraZoomHelper {
  private camera: THREE.PerspectiveCamera;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  fit({
    obj,
    margin = 0,
    animate = false,
    duration = 1,
    ease = "power2.in",
    initLookAtTarget = { x: 0, y: 0, z: 0 },
    onAnimationComplete,
  }: {
    obj: THREE.Object3D;
    margin?: number;
    animate?: boolean;
    duration?: gsap.TweenValue;
    ease?: gsap.EaseString | gsap.EaseFunction;
    initLookAtTarget?: { x: number; y: number; z: number };
    onAnimationComplete?: (lookAtTarget: THREE.Vector3) => void;
  }) {
    const box = new THREE.Box3().setFromObject(obj);
    const sizeBox = box.getSize(new THREE.Vector3()).length() + margin * 2;
    const centerBox = box.getCenter(new THREE.Vector3());

    const halfSizeModel = sizeBox * 0.5;
    const halfFov = THREE.MathUtils.degToRad(this.camera.fov * 0.5);
    const distance = halfSizeModel / Math.tan(halfFov);

    const { z } = this.camera.position;
    const direction = new THREE.Vector3()
      .subVectors(new THREE.Vector3(centerBox.x, centerBox.y, z), centerBox)
      .normalize();
    const position = direction.multiplyScalar(distance).add(centerBox);

    this.camera.near = sizeBox / 10;
    this.camera.far = sizeBox * 10;
    this.camera.updateProjectionMatrix();

    if (animate) {
      const lookAtTarget = initLookAtTarget;
      gsap.to(lookAtTarget, {
        duration,
        ease,
        x: centerBox.x,
        y: centerBox.y,
        z: centerBox.z,
        onUpdate: () => {
          this.camera.lookAt(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z);
        },
        onComplete: () => onAnimationComplete?.(centerBox),
      });
      gsap.to(this.camera.position, {
        duration,
        ease,
        x: position.x,
        y: position.y,
        z: position.z,
      });
    } else {
      this.camera.position.copy(position);
      this.camera.lookAt(centerBox.x, centerBox.y, centerBox.z);
    }
  }
}

export default CameraZoomHelper;
