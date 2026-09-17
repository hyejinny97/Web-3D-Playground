import * as THREE from "three";
import AstronicObject from "./AstronicObject";

class Setellite extends AstronicObject {
  private _isSetellite = true;
  declare name: string;
  declare mesh: THREE.Mesh;
  declare parent: THREE.Object3D;
  declare distance: number;
  root = new THREE.Object3D();
  radius: number;
  texture?: THREE.Texture;

  constructor({
    name,
    parent,
    distance,
    radius,
    texture,
    rootYTilt,
    rootRotation,
    meshRotation,
  }: {
    name: string;
    parent: THREE.Object3D;
    distance: number;
    radius: number;
    texture?: THREE.Texture;
    rootYTilt?: number;
    rootRotation?: number;
    meshRotation?: number;
  }) {
    super();
    this.name = name;
    this.parent = parent;
    this.distance = distance;
    this.radius = radius;
    this.texture = texture;
    this.rootYTilt = rootYTilt ?? 0;
    this.rootRotation = rootRotation ?? 0;
    this.meshRotation = meshRotation ?? 0;

    this.root.name = name;
    this.locateRootToParent();

    this.root.add(this.mesh);
    this.mesh.position.x = distance;
  }

  get isSetellite() {
    return this._isSetellite;
  }

  createMesh() {
    const geometry = new THREE.SphereGeometry(this.radius);
    const material = new THREE.MeshPhongMaterial({
      map: this.texture,
      color: 0xffffff,
    });
    this.mesh = new THREE.Mesh(geometry, material);
  }
}

export default Setellite;
