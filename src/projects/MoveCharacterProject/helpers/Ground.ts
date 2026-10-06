import * as THREE from "three";
import { TILE_COLOR } from "../MoveCharacterProject.constants";
import type { GroundType } from "../MoveCharacterProject.types";

class Ground implements GroundType {
  private texture!: THREE.CanvasTexture<HTMLCanvasElement>;
  root!: THREE.Object3D;

  constructor() {
    this.createTileTexture();
    this.createGround();
    this.transform();
  }

  private createTileTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const context = canvas.getContext("2d");
    if (!context) {
      console.error("2D Context를 지원하지 않습니다.");
      return;
    }

    context.fillStyle = "#ffffff";
    context.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);

    context.fillStyle = TILE_COLOR;
    context.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

    context.fillStyle = "#ffffff";
    context.fillRect(0, canvas.height / 2, canvas.width / 2, canvas.height / 2);

    context.fillStyle = TILE_COLOR;
    context.fillRect(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2,
      canvas.height / 2,
    );

    this.texture = new THREE.CanvasTexture(canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(20, 10);
  }

  private createGround() {
    const geometry = new THREE.PlaneGeometry(50, 10);
    const material = new THREE.MeshPhongMaterial({
      map: this.texture,
      side: THREE.DoubleSide,
    });
    this.root = new THREE.Mesh(geometry, material);
  }

  private transform() {
    this.root.rotateX(-Math.PI / 2);
  }
}

export default Ground;
