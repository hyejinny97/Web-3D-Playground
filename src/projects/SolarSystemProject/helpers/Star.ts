import * as THREE from "three";
import AstronicObject from "./AstronicObject";

class Star extends AstronicObject {
  private _isStar = true;
  declare name: string;
  declare mesh: THREE.Mesh;
  declare parent: THREE.Object3D;
  declare distance: number;
  root = new THREE.Object3D();
  radius: number;
  lightIntensity: number;
  lightDistance: number;
  texture?: THREE.Texture;

  constructor({
    name,
    parent,
    distance,
    radius,
    lightIntensity,
    lightDistance,
    texture,
    rootYTilt,
    rootRotation,
    meshRotation,
  }: {
    name: string;
    parent: THREE.Object3D;
    distance: number;
    radius: number;
    lightIntensity: number;
    lightDistance: number;
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
    this.lightIntensity = lightIntensity;
    this.lightDistance = lightDistance;
    this.texture = texture;
    this.rootYTilt = rootYTilt ?? 0;
    this.rootRotation = rootRotation ?? 0;
    this.meshRotation = meshRotation ?? 0;

    this.root.name = name;
    this.locateRootToParent();

    this.createMesh();
    this.root.add(this.mesh);
    this.mesh.position.x = distance;
    this.addLight(this.mesh);
  }

  get isStar() {
    return this._isStar;
  }

  createMesh() {
    const geometry = new THREE.SphereGeometry(this.radius);
    const material = new THREE.MeshPhongMaterial({
      map: this.texture,
      color: 0xffffff,
      emissive: new THREE.Color(0xff0000),
      emissiveIntensity: 0.5,
    });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  addLight(mesh: THREE.Mesh) {
    const light = new THREE.PointLight(
      0xffffff,
      this.lightIntensity,
      this.lightDistance,
    );
    mesh.add(light);
  }
}

export default Star;
