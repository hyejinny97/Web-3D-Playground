import * as THREE from "three";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import { DEFAULT_SIDO_COLOR_SATURATION } from "./KoreaProject.constants";
import SidoDictionary from "./SidoDictionary";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";
import type { ConstructorProps } from "@/types/project";

type KoreaProjectProps = ConstructorProps & {
  openPopper: (
    content: string,
    position: { left: number; top: number },
  ) => void;
  closePopper: () => void;
};

@RenderLoop()
class KoreaProject extends BaseProject {
  declare private root: THREE.Group;
  declare private lineMaterial: THREE.Material;
  declare private sidoDictionary: SidoDictionary;
  private hoveredSidoCodeNm: number | null = null;
  declare private handleCanvasHover: (event: MouseEvent) => void;
  declare private openPopper: KoreaProjectProps["openPopper"];
  declare private closePopper: KoreaProjectProps["closePopper"];

  constructor({ canvasEl, openPopper, closePopper }: KoreaProjectProps) {
    super({ canvasEl });
    this.openPopper = openPopper;
    this.closePopper = closePopper;
  }

  init() {
    super.init();
    this.setupHoverEvent();
  }

  setupModel() {
    this.sidoDictionary = new SidoDictionary();
    this.root = new THREE.Group();
    this.scene?.add(this.root);

    this.createLineMaterial();
    this.createSidoModel();
    this.centralizeRoot();
    this.zoomFit({ obj: this.root });
  }

  createLineMaterial() {
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: "white",
      transparent: true,
      opacity: 0.8,
    });
  }

  generateMeshMaterial({
    color,
    polygonOffsetUnits,
  }: {
    color: THREE.ColorRepresentation;
    polygonOffsetUnits: number;
  }): THREE.MeshPhongMaterial {
    return new THREE.MeshPhongMaterial({
      color: color,
      flatShading: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits,
    });
  }

  createSidoModel() {
    Object.entries(this.sidoDictionary.value).map(
      ([codeNm, { geometryHelper }], idx, arr) => {
        const extrudeGeometry = geometryHelper.createGeometry();
        const edgesGeometry = new THREE.EdgesGeometry(extrudeGeometry);

        const meshMaterial = this.generateMeshMaterial({
          color: new THREE.Color().setHSL(
            idx / arr.length,
            DEFAULT_SIDO_COLOR_SATURATION,
            0.3,
          ),
          polygonOffsetUnits: idx,
        });

        const mesh = new THREE.Mesh(extrudeGeometry, meshMaterial);
        const line = new THREE.LineSegments(edgesGeometry, this.lineMaterial);

        const group = new THREE.Group();
        group.name = codeNm;
        group.add(mesh, line);
        this.sidoDictionary.setModel({ codeNm: Number(codeNm), model: group });

        this.root.add(group);
      },
    );
  }

  centralizeRoot() {
    const rootBox = new THREE.Box3().setFromObject(this.root);
    const center = rootBox.getCenter(new THREE.Vector3());
    this.root.position.sub(center);
  }

  zoomFit({
    obj,
    animate,
    margin,
  }: {
    obj: THREE.Object3D;
    animate?: boolean;
    margin?: number;
  }) {
    if (!this.camera) return;

    const zoomHelper = new CameraZoomHelper(this.camera);
    zoomHelper.fit({
      obj,
      animate,
      margin,
      initLookAtTarget: this.controls?.target,
      onAnimationComplete: (lookAtTarget) => {
        if (this.controls) {
          this.controls.target.copy(lookAtTarget);
          this.controls.update();
        }
      },
    });
  }

  getMousePosition(event: MouseEvent) {
    const x = (event.clientX / this.canvasEl.clientWidth) * 2 - 1;
    const y = -(event.clientY / this.canvasEl.clientHeight) * 2 + 1;
    return new THREE.Vector2(x, y);
  }

  enhanceSidoModelColorTone(sidoModel: THREE.Group) {
    for (const child of sidoModel.children) {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshPhongMaterial
      ) {
        const hsl = { h: 0, s: 0, l: 0 };
        child.material.color.getHSL(hsl);
        child.material.color.setHSL(hsl.h, 1, hsl.l);
        return;
      }
    }
  }

  lowerSidoModelColorTone(sidoModel: THREE.Group) {
    for (const child of sidoModel.children) {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshPhongMaterial
      ) {
        const hsl = { h: 0, s: 0, l: 0 };
        child.material.color.getHSL(hsl);
        child.material.color.setHSL(
          hsl.h,
          DEFAULT_SIDO_COLOR_SATURATION,
          hsl.l,
        );
        return;
      }
    }
  }

  resetHover() {
    if (this.hoveredSidoCodeNm === null) return;
    const prevHoveredSidoModel =
      this.sidoDictionary.value[this.hoveredSidoCodeNm].model;
    if (prevHoveredSidoModel) {
      this.lowerSidoModelColorTone(prevHoveredSidoModel);
    }
    this.hoveredSidoCodeNm = null;
  }

  setupHoverEvent() {
    const raycaster = new THREE.Raycaster();

    this.handleCanvasHover = (event: MouseEvent) => {
      const mousePosition = this.getMousePosition(event);
      raycaster.setFromCamera(mousePosition, this.camera!);
      const intersects = raycaster.intersectObjects(this.root.children);

      if (intersects.length > 0) {
        for (const intersect of intersects) {
          const obj = intersect.object;
          if (obj instanceof THREE.Mesh && obj.parent instanceof THREE.Group) {
            const group = obj.parent;
            const codeNm = Number(group.name);

            this.sidoDictionary.validateCodeNm(codeNm);
            const sidoData = this.sidoDictionary.value[codeNm];
            const sidoModel = sidoData.model;

            this.openPopper(sidoData.koreanName, {
              left: event.clientX,
              top: event.clientY,
            });
            if (this.hoveredSidoCodeNm === codeNm) return;

            if (sidoModel) {
              this.resetHover();
              this.hoveredSidoCodeNm = codeNm;
              this.enhanceSidoModelColorTone(sidoModel);
              return;
            }
          }
        }
      }
      this.resetHover();
      this.closePopper();
    };
    this.canvasEl.addEventListener("mousemove", this.handleCanvasHover);
  }

  dispose() {
    super.dispose();
    this.canvasEl.removeEventListener("mousemove", this.handleCanvasHover);
  }
}

export default KoreaProject;
