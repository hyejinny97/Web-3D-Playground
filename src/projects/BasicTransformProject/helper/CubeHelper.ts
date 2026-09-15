import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type {
  CubeHelperType,
  RotationAxesType,
} from "../BasicTransformProject.types";
import { IMAGES, ROTATION_AXES } from "../BasicTransformProject.constants";

const DEFAULT_ARGS = {
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  rotationX: 0, // 단위: 라디안
  rotationY: 0,
  rotationZ: 0,
  rotationAxes: ROTATION_AXES[0],
} as const;

class CubeHelper implements CubeHelperType {
  private controlUIGroupName = "Transform";
  private _args: CubeHelperType["args"];
  private _mesh!: THREE.Mesh;
  private loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>;
  controlUI: ControlUIType;

  constructor(
    controlUI: ControlUIType,
    loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>,
  ) {
    this.controlUI = controlUI;
    this.loadTextureImages = loadTextureImages;
    this._args = { ...DEFAULT_ARGS };
    this.init();
  }

  get args() {
    return this._args;
  }

  get mesh() {
    return this._mesh;
  }

  async init() {
    const textures = await this.generateTextures();
    const geometry = new THREE.BoxGeometry();
    const materials = textures.map(
      (texture) => new THREE.MeshPhongMaterial({ map: texture }),
    );
    this._mesh = new THREE.Mesh(geometry, materials);
    const { rotationAxes, ...rest } = this._args;
    void rotationAxes;
    this.update(rest);
  }

  async generateTextures(): Promise<THREE.Texture[]> {
    const imgEls = await this.loadTextureImages(IMAGES);
    return imgEls.map((imgEl) => {
      const texture = new THREE.Texture(imgEl);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      return texture;
    });
  }

  update(properties: Partial<Omit<CubeHelperType["args"], "rotationAxes">>) {
    Object.keys(properties).forEach((key) => {
      const property = key as keyof Omit<
        CubeHelperType["args"],
        "rotationAxes"
      >;
      const value = properties[property];
      if (value === undefined) return;

      const rotate =
        this._args.rotationAxes === "Local Axes"
          ? this.rotateOnLocalAxes.bind(this)
          : this.rotateOnParentAxes.bind(this);

      switch (property) {
        case "positionX":
          this._mesh.position.x = value;
          this._args.positionX = value;
          break;
        case "positionY":
          this._mesh.position.y = value;
          this._args.positionY = value;
          break;
        case "positionZ":
          this._mesh.position.z = value;
          this._args.positionZ = value;
          break;
        case "scaleX":
          this._mesh.scale.x = value;
          this._args.scaleX = value;
          break;
        case "scaleY":
          this._mesh.scale.y = value;
          this._args.scaleY = value;
          break;
        case "scaleZ":
          this._mesh.scale.z = value;
          this._args.scaleZ = value;
          break;
        case "rotationX": {
          const delta = value - this._args.rotationX;
          rotate("x", delta);
          this._args.rotationX = value;
          break;
        }
        case "rotationY": {
          const delta = value - this._args.rotationY;
          rotate("y", delta);
          this._args.rotationY = value;
          break;
        }
        case "rotationZ": {
          const delta = value - this._args.rotationZ;
          rotate("z", delta);
          this._args.rotationZ = value;
          break;
        }
      }
    });
  }

  rotateOnLocalAxes(axes: "x" | "y" | "z", angle: number) {
    switch (axes) {
      case "x":
        this._mesh.rotateX(angle);
        break;
      case "y":
        this._mesh.rotateY(angle);
        break;
      case "z":
        this._mesh.rotateZ(angle);
        break;
    }
  }

  rotateOnParentAxes(axes: "x" | "y" | "z", angle: number) {
    const quaternionX = new THREE.Quaternion();
    quaternionX.setFromAxisAngle(
      new THREE.Vector3(
        Number(axes === "x"),
        Number(axes === "y"),
        Number(axes === "z"),
      ).normalize(),
      angle,
    );
    this._mesh.applyQuaternion(quaternionX);
  }

  createControlUI() {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "range",
        label: "positionX",
        min: 0,
        max: 2,
        step: 0.1,
        initValue: this._args.positionX,
        onChange: (value) => {
          this.update({ positionX: value });
        },
      },
      {
        type: "range",
        label: "positionY",
        min: 0,
        max: 2,
        step: 0.1,
        initValue: this._args.positionY,
        onChange: (value) => {
          this.update({ positionY: value });
        },
      },
      {
        type: "range",
        label: "positionZ",
        min: 0,
        max: 2,
        step: 0.1,
        initValue: this._args.positionZ,
        onChange: (value) => {
          this.update({ positionZ: value });
        },
      },
      {
        type: "range",
        label: "scaleX",
        min: 0,
        max: 2,
        step: 0.1,
        initValue: this._args.scaleX,
        onChange: (value) => {
          this.update({ scaleX: value });
        },
      },
      {
        type: "range",
        label: "scaleY",
        min: 0,
        max: 2,
        step: 0.1,
        initValue: this._args.scaleY,
        onChange: (value) => {
          this.update({ scaleY: value });
        },
      },
      {
        type: "range",
        label: "scaleZ",
        min: 0,
        max: 2,
        step: 0.1,
        initValue: this._args.scaleZ,
        onChange: (value) => {
          this.update({ scaleZ: value });
        },
      },
      {
        type: "range",
        label: "rotationX",
        min: 0,
        max: 360,
        step: 1,
        initValue: THREE.MathUtils.radToDeg(this._args.rotationX),
        onChange: (value) => {
          this.update({ rotationX: THREE.MathUtils.degToRad(value) });
        },
      },
      {
        type: "range",
        label: "rotationY",
        min: 0,
        max: 360,
        step: 1,
        initValue: THREE.MathUtils.radToDeg(this._args.rotationY),
        onChange: (value) => {
          this.update({ rotationY: THREE.MathUtils.degToRad(value) });
        },
      },
      {
        type: "range",
        label: "rotationZ",
        min: 0,
        max: 360,
        step: 1,
        initValue: THREE.MathUtils.radToDeg(this._args.rotationZ),
        onChange: (value) => {
          this.update({ rotationZ: THREE.MathUtils.degToRad(value) });
        },
      },
      {
        type: "select",
        label: "rotationAxes",
        options: ROTATION_AXES.map((name) => ({
          label: name,
          value: name,
        })),
        initValue: this._args.rotationAxes,
        onChange: (value) => {
          this._args.rotationAxes = value as RotationAxesType;
        },
      },
    ]);
  }

  reset() {
    this._args = { ...DEFAULT_ARGS };
    const { rotationAxes, ...rest } = this._args;
    void rotationAxes;
    this.update(rest);
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default CubeHelper;
