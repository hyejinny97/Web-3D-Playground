import * as THREE from "three";
import AstronicObject from "./AstronicObject";

class PlanetRing extends AstronicObject {
  private _isPlanetRing = true;
  declare name: string;
  declare mesh: THREE.Mesh;
  declare parent: THREE.Object3D;
  declare distance: number;
  root = new THREE.Object3D();
  innerRadius: number;
  outerRadius: number;
  texture?: THREE.Texture;

  constructor({
    name,
    parent,
    distance,
    innerRadius,
    outerRadius,
    texture,
    rootYTilt,
    rootRotation,
  }: {
    name: string;
    parent: THREE.Object3D;
    distance: number;
    innerRadius: number;
    outerRadius: number;
    texture?: THREE.Texture;
    rootYTilt?: number;
    rootRotation?: number;
  }) {
    super();
    this.name = name;
    this.parent = parent;
    this.distance = distance;
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    this.texture = texture;
    this.rootYTilt = rootYTilt ?? 0;
    this.rootRotation = rootRotation ?? 0;

    this.root.name = name;
    this.locateRootToParent();

    this.createMesh();
    this.root.add(this.mesh);
    this.mesh.position.x = distance;
  }

  get isPlanetRing() {
    return this._isPlanetRing;
  }

  createMesh() {
    const geometry = new THREE.RingGeometry(this.innerRadius, this.outerRadius);
    const material = new THREE.MeshPhongMaterial({
      map: this.texture,
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  update(time: number) {
    super.update(time);
    this.locateRootToParent();
  }
}

export default PlanetRing;
