import * as THREE from "three";
import { gsap } from "gsap";

class CameraZoomHelper {
  private camera: THREE.PerspectiveCamera;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  private updateNearFar({
    cameraPosition,
    targetPosition,
    nearFactor = 0.1,
    farFactor = 10,
    minNear = 0.01,
    minFar = 100,
  }: {
    cameraPosition: THREE.Vector3;
    targetPosition: THREE.Vector3;
    nearFactor?: number;
    farFactor?: number;
    minNear?: number;
    minFar?: number;
  }) {
    const dist = cameraPosition.distanceTo(targetPosition);
    this.camera.near = Math.max(dist * nearFactor, minNear);
    this.camera.far = Math.max(dist * farFactor, minFar);
    this.camera.updateProjectionMatrix();
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
        onUpdate: () => {
          this.updateNearFar({
            cameraPosition: this.camera.position,
            targetPosition: centerBox,
            minFar: sizeBox * 10,
          });
        },
      });
    } else {
      this.camera.position.copy(position);
      this.camera.lookAt(centerBox.x, centerBox.y, centerBox.z);
      this.updateNearFar({
        cameraPosition: this.camera.position,
        targetPosition: centerBox,
        minFar: sizeBox * 10,
      });
    }
  }
}

export default CameraZoomHelper;
