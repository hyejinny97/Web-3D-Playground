import * as THREE from "three";
import type { CarLampsType } from "../GLTFModelProject.types";

class CarLamps implements CarLampsType {
  private lamps: THREE.Mesh;
  private lightColor: THREE.Color;
  on: boolean = false;

  constructor({
    lamps,
    lightColor,
  }: {
    lamps: THREE.Mesh;
    lightColor: THREE.Color;
  }) {
    this.lamps = lamps;
    this.lightColor = lightColor;
  }

  lightOn() {
    if (this.lamps.material instanceof THREE.MeshStandardMaterial) {
      this.lamps.material.emissive = this.lightColor;
      this.on = true;
    }
  }

  lightOff() {
    if (this.lamps.material instanceof THREE.MeshStandardMaterial) {
      this.lamps.material.emissive = new THREE.Color(0x000000);
      this.on = false;
    }
  }

  toggleLight() {
    if (this.on) {
      this.lightOff();
    } else {
      this.lightOn();
    }
  }
}

export default CarLamps;
