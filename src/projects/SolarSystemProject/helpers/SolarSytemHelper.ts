import * as THREE from "three";
import Star from "./Star";
import Planet from "./Planet";
import type AstronicObject from "./AstronicObject";
import { IMAGES } from "../SolarSystemProject.constants";
import type {
  AstronicObjectNameType,
  SolarSystemHelperType,
} from "../SolarSystemProject.types";
import PlanetRing from "./PlanetRing";
import Setellite from "./Setellite";
import type { ControlUIType } from "@/types/project";

const DEFAULT_ARGS = {
  showAxis: false,
  showOrbit: false,
} as const;

class SolarSystemHelper implements SolarSystemHelperType {
  private controlUIGroupName = "Solar System";
  private _args: SolarSystemHelperType["args"];
  declare private textures: Record<AstronicObjectNameType, THREE.Texture>;
  private children: AstronicObject[] = [];
  private axesGroup: THREE.AxesHelper[] = [];
  private orbitGroup: THREE.Line[] = [];
  root = new THREE.Object3D();
  loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>;
  controlUI: ControlUIType;

  constructor(
    controlUI: ControlUIType,
    loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>,
  ) {
    this.controlUI = controlUI;
    this.loadTextureImages = loadTextureImages;
    this._args = { ...DEFAULT_ARGS };
    this.root.name = "solar system";
  }

  get args() {
    return this._args;
  }

  async init() {
    await this.createTextures();
    this.createModels();
    this.createAxis();
    this.createOrbit();
  }

  private async createTextures() {
    const names = Object.keys(IMAGES) as AstronicObjectNameType[];
    const urls = names.map((name) => IMAGES[name]);
    const images = await this.loadTextureImages(urls);

    const textures: Partial<Record<AstronicObjectNameType, THREE.Texture>> = {};
    images.forEach((img, idx) => {
      const name = names[idx];
      const texture = new THREE.Texture(img);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      textures[name] = texture;
    });
    this.textures = textures as Record<AstronicObjectNameType, THREE.Texture>;
  }

  private createModels() {
    const sun = new Star({
      name: "sun",
      parent: this.root,
      distance: 0,
      radius: 16,
      texture: this.textures.sun,
      meshRotation: 0.004,
      lightDistance: 200,
      lightIntensity: 100000,
    });

    const mercury = new Planet({
      name: "mercury",
      parent: sun.root,
      distance: 28,
      radius: 3.2,
      texture: this.textures.mercury,
      rootRotation: 0.04,
      meshRotation: 0.004,
    });
    const venus = new Planet({
      name: "venus",
      parent: sun.root,
      distance: 44,
      radius: 5.8,
      texture: this.textures.venus,
      rootRotation: 0.015,
      meshRotation: 0.002,
    });
    const earth = new Planet({
      name: "earth",
      parent: sun.root,
      distance: 62,
      radius: 6,
      texture: this.textures.earth,
      rootRotation: 0.01,
      meshRotation: 0.02,
    });
    const mars = new Planet({
      name: "mars",
      parent: sun.root,
      distance: 78,
      radius: 4,
      texture: this.textures.mars,
      rootRotation: 0.008,
      meshRotation: 0.018,
    });
    const jupiter = new Planet({
      name: "jupiter",
      parent: sun.root,
      distance: 100,
      radius: 12,
      texture: this.textures.jupiter,
      rootRotation: 0.002,
      meshRotation: 0.04,
    });
    const saturn = new Planet({
      name: "saturn",
      parent: sun.root,
      distance: 138,
      radius: 10,
      texture: this.textures.saturn,
      rootRotation: 0.0009,
      meshRotation: 0.038,
    });
    const uranus = new Planet({
      name: "uranus",
      parent: sun.root,
      distance: 176,
      radius: 7,
      texture: this.textures.uranus,
      rootRotation: 0.0004,
      meshRotation: 0.03,
    });
    const neptune = new Planet({
      name: "neptune",
      parent: sun.root,
      distance: 200,
      radius: 7,
      texture: this.textures.neptune,
      rootRotation: 0.0001,
      meshRotation: 0.032,
    });

    const saturnRing = new PlanetRing({
      name: "saturn-ring",
      parent: saturn.mesh,
      distance: 0,
      innerRadius: 10,
      outerRadius: 20,
      texture: this.textures.saturnRing,
      rootYTilt: -Math.PI / 2,
      rootRotation: 0.002,
    });
    const uranusRing = new PlanetRing({
      name: "uranus-ring",
      parent: uranus.mesh,
      distance: 0,
      innerRadius: 7,
      outerRadius: 12,
      texture: this.textures.uranusRing,
      rootYTilt: -Math.PI / 2,
      rootRotation: 0.002,
    });

    const moon = new Setellite({
      name: "moon",
      parent: earth.mesh,
      distance: 10,
      radius: 0.4,
      texture: this.textures.moon,
      rootRotation: 0.001,
      meshRotation: 0.001,
    });
    const ganymede = new Setellite({
      name: "ganymede",
      parent: jupiter.mesh,
      distance: 15,
      radius: 0.36,
      texture: this.textures.ganymede,
      rootRotation: 0.008,
      meshRotation: 0.002,
    });
    const io = new Setellite({
      name: "io",
      parent: jupiter.mesh,
      distance: 17,
      radius: 0.48,
      texture: this.textures.io,
      rootRotation: 0.03,
      meshRotation: 0.01,
    });

    this.children.push(
      sun,
      mercury,
      venus,
      earth,
      mars,
      jupiter,
      saturn,
      uranus,
      neptune,
      saturnRing,
      uranusRing,
      moon,
      ganymede,
      io,
    );
    this.children.forEach((child) => this.root.add(child.root));
  }

  private createAxis() {
    this.children.forEach((child) => {
      if (child instanceof PlanetRing) return;
      const { mesh } = child;
      if (mesh.geometry instanceof THREE.SphereGeometry) {
        const radius = mesh.geometry.parameters.radius;
        const axes = new THREE.AxesHelper(radius + radius * 1.5);
        axes.visible = false;
        mesh.add(axes);
        this.axesGroup.push(axes);
      }
    });
  }

  private createOrbit() {
    const SEGMENTS = 100;
    this.children.forEach((child) => {
      if (child instanceof Planet || child instanceof Setellite) {
        const { root, distance } = child;

        const points: THREE.Vector3[] = [];
        for (let idx = 0; idx <= SEGMENTS; idx++) {
          const theta = (idx / SEGMENTS) * Math.PI * 2;
          const x = distance * Math.cos(theta);
          const y = distance * Math.sin(theta);
          const z = 0;
          points.push(new THREE.Vector3(x, y, z));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: new THREE.Color(0x666666),
        });
        const line = new THREE.Line(geometry, material);

        line.rotation.x = -Math.PI / 2;
        line.visible = false;
        root.add(line);
        this.orbitGroup.push(line);
      }
    });
  }

  createControlUI() {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "checkbox",
        label: "showAxis",
        initChecked: this._args.showAxis,
        onChange: (value) => {
          this._args.showAxis = value;
          this.axesGroup.forEach((axes) => {
            axes.visible = this._args.showAxis;
          });
        },
      },
      {
        type: "checkbox",
        label: "showOrbit",
        initChecked: this._args.showOrbit,
        onChange: (value) => {
          this._args.showOrbit = value;
          this.orbitGroup.forEach((orbit) => {
            orbit.visible = this._args.showOrbit;
          });
        },
      },
    ]);
  }

  update(time: number) {
    this.children.forEach((child) => child.update(time));
  }
}

export default SolarSystemHelper;
