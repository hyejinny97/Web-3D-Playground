import * as THREE from "three";
import { gsap } from "gsap";
import BaseProject from "../BaseProject";
import { RenderLoop } from "@/decorators/renderLoop";
import {
  DEFAULT_SIDO_COLOR_LIGHTNESS,
  DEFAULT_SIDO_COLOR_SATURATION,
  DURATION,
  EASE,
  INCREASED_DEPTH,
} from "./KoreaProject.constants";
import SidoDictionary from "./SidoDictionary";
import SigunguDictionary from "./SigunguDictionary";
import CameraZoomHelper from "@/helpers/CameraZoomHelper";
import type { ConstructorProps } from "@/types/project";
import { isNumeric } from "@/utils/number";

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
  declare private sigunguDictionary: SigunguDictionary;
  private hoveredSidoCodeNm: number | null = null;
  private hoveredSigunguCodeNm: number | null = null;
  private clickedSidoCodeNm: number | null = null;
  declare private handleSidoHover: (event: MouseEvent) => void;
  declare private handleSigunguHover: (event: MouseEvent) => void;
  declare private handleSidoClick: (event: MouseEvent) => void;
  declare private openPopper: KoreaProjectProps["openPopper"];
  declare private closePopper: KoreaProjectProps["closePopper"];

  constructor({ canvasEl, openPopper, closePopper }: KoreaProjectProps) {
    super({ canvasEl });
    this.openPopper = openPopper;
    this.closePopper = closePopper;
  }

  init() {
    super.init();
    this.setupSidoHoverEvent();
    this.setupSigunguHoverEvent();
    this.setupSidoClickEvent();
  }

  setupModel() {
    this.sidoDictionary = new SidoDictionary();
    this.sigunguDictionary = new SigunguDictionary(
      this.sidoDictionary.getAllCodeNms(),
    );
    this.root = new THREE.Group();
    this.scene?.add(this.root);

    this.createLineMaterial();
    this.createSidoModels();
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

  generateSidoMeshMaterial({
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

  createSidoModels() {
    Object.entries(this.sidoDictionary.value).forEach(
      ([codeNm, { geometryHelper }], idx, arr) => {
        const extrudeGeometry = geometryHelper.createGeometry();
        const edgesGeometry = new THREE.EdgesGeometry(extrudeGeometry);

        const meshMaterial = this.generateSidoMeshMaterial({
          color: new THREE.Color().setHSL(
            idx / arr.length,
            DEFAULT_SIDO_COLOR_SATURATION,
            DEFAULT_SIDO_COLOR_LIGHTNESS,
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

  createSigunguModels(sidoCodeNm: number) {
    const sidoModel = this.sidoDictionary.value[sidoCodeNm]?.model;
    if (!sidoModel) return;

    const sigunguModelGroup = new THREE.Group();
    const sigunguModelGroupName = "sigungu";
    sigunguModelGroup.name = sigunguModelGroupName;

    const sigunguData = this.sigunguDictionary.value[sidoCodeNm];
    Object.entries(sigunguData).forEach(
      ([sigunguCodeNm, { geometryHelper }]) => {
        const shapeGeometry = geometryHelper.createGeometry();
        const edgesGeometry = new THREE.EdgesGeometry(shapeGeometry);

        const sigunguMeshMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
          polygonOffset: true,
          polygonOffsetFactor: 1,
        });

        const mesh = new THREE.Mesh(shapeGeometry, sigunguMeshMaterial);
        const line = new THREE.LineSegments(edgesGeometry, this.lineMaterial);

        const group = new THREE.Group();
        group.name = sigunguCodeNm;
        group.add(mesh, line);
        this.sigunguDictionary.setModel({
          sidoCodeNm,
          sigunguCodeNm: Number(sigunguCodeNm),
          model: group,
        });

        sigunguModelGroup.add(group);
      },
    );

    const oldModelGroup = sidoModel.getObjectByName(sigunguModelGroupName);
    if (oldModelGroup) {
      oldModelGroup.children.forEach((group) => {
        if (!(group instanceof THREE.Group)) return;
        group.children.forEach((obj) => {
          if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
            obj.geometry.dispose();
            obj.material.dispose();
          }
        });
      });
      sidoModel.remove(oldModelGroup);
    }

    sigunguModelGroup.position.z = INCREASED_DEPTH + 0.001;
    sidoModel.add(sigunguModelGroup);
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
      margin,
      animate,
      duration: DURATION,
      ease: EASE,
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

  changeSidoModelSaturation(
    sidoModel: THREE.Group,
    to: "increase" | "decrease",
  ) {
    const toSaturation = to === "increase" ? 1 : DEFAULT_SIDO_COLOR_SATURATION;
    for (const child of sidoModel.children) {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshPhongMaterial
      ) {
        const hsl = { h: 0, s: 0, l: 0 };
        child.material.color.getHSL(hsl);
        child.material.color.setHSL(hsl.h, toSaturation, hsl.l);
        return;
      }
    }
  }

  changeSidoModelLightness(
    sidoModel: THREE.Group,
    to: "increase" | "decrease",
  ) {
    const toLightness = to === "increase" ? 0.5 : DEFAULT_SIDO_COLOR_LIGHTNESS;
    for (const child of sidoModel.children) {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshPhongMaterial
      ) {
        const hsl = { h: 0, s: 0, l: 0 };
        child.material.color.getHSL(hsl);
        child.material.color.setHSL(hsl.h, hsl.s, toLightness);
        return;
      }
    }
  }

  changeSigunguModelOpacity(
    sigunguModel: THREE.Group,
    to: "increase" | "decrease",
  ) {
    const toOpacity = to === "increase" ? 0.5 : 0;
    for (const child of sigunguModel.children) {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshPhongMaterial
      ) {
        child.material.opacity = toOpacity;
        return;
      }
    }
  }

  increaseSidoModelDepth({
    codeNm,
    onComplete,
  }: {
    codeNm: number;
    onComplete: () => void;
  }) {
    this.sidoDictionary.validateCodeNm(codeNm);
    const sidoData = this.sidoDictionary.value[codeNm];
    if (!sidoData.model) return;

    const depth = { value: 0 };
    gsap.to(depth, {
      duration: DURATION,
      ease: EASE,
      value: INCREASED_DEPTH,
      onUpdate: () => {
        sidoData.geometryHelper.setDepth(depth.value);
        for (const child of sidoData.model!.children) {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            const newGeometry = sidoData.geometryHelper.createGeometry();
            child.geometry = newGeometry;
            child.material.opacity = 1;
          }
        }
      },
      onComplete,
    });
  }

  resetSidoHover() {
    if (this.hoveredSidoCodeNm === null) return;
    const prevHoveredSidoModel =
      this.sidoDictionary.value[this.hoveredSidoCodeNm].model;
    if (prevHoveredSidoModel) {
      this.changeSidoModelSaturation(prevHoveredSidoModel, "decrease");
    }
    this.hoveredSidoCodeNm = null;
  }

  resetSigunguHover() {
    if (this.hoveredSigunguCodeNm === null) return;
    const sidoCodeNm = Number(String(this.hoveredSigunguCodeNm).slice(0, 2));
    const prevHoveredSigunguModel =
      this.sigunguDictionary.value[sidoCodeNm][this.hoveredSigunguCodeNm].model;
    if (prevHoveredSigunguModel) {
      this.changeSigunguModelOpacity(prevHoveredSigunguModel, "decrease");
    }
    this.hoveredSigunguCodeNm = null;
  }

  setupSidoHoverEvent() {
    const raycaster = new THREE.Raycaster();

    this.handleSidoHover = (event: MouseEvent) => {
      if (this.clickedSidoCodeNm !== null) return;

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
              this.resetSidoHover();
              this.hoveredSidoCodeNm = codeNm;
              this.changeSidoModelSaturation(sidoModel, "increase");
              return;
            }
          }
        }
      }
      this.resetSidoHover();
      this.closePopper();
    };
    this.canvasEl.addEventListener("mousemove", this.handleSidoHover);
  }

  setupSigunguHoverEvent() {
    const raycaster = new THREE.Raycaster();

    this.handleSigunguHover = (event: MouseEvent) => {
      if (this.clickedSidoCodeNm === null) return;

      const mousePosition = this.getMousePosition(event);
      raycaster.setFromCamera(mousePosition, this.camera!);
      const intersects = raycaster.intersectObjects(this.root.children);

      if (intersects.length > 0) {
        for (const intersect of intersects) {
          const obj = intersect.object;
          if (obj instanceof THREE.Mesh && obj.parent instanceof THREE.Group) {
            const group = obj.parent;
            const codeNm = group.name;
            if (!isNumeric(codeNm) || codeNm.length === 2) continue;

            const sidoCodeNm = Number(codeNm.slice(0, 2));
            const sigunguCodeNm = Number(codeNm);
            const sigunguData =
              this.sigunguDictionary.value[sidoCodeNm][sigunguCodeNm];
            const sigunguModel = sigunguData.model;

            this.openPopper(sigunguData.koreanName, {
              left: event.clientX,
              top: event.clientY,
            });
            if (this.hoveredSigunguCodeNm === sigunguCodeNm) return;

            if (sigunguModel) {
              this.resetSigunguHover();
              this.hoveredSigunguCodeNm = sigunguCodeNm;
              this.changeSigunguModelOpacity(sigunguModel, "increase");
              return;
            }
          }
        }
      }
      this.resetSigunguHover();
      this.closePopper();
    };
    this.canvasEl.addEventListener("mousemove", this.handleSigunguHover);
  }

  setupSidoClickEvent() {
    const raycaster = new THREE.Raycaster();

    this.handleSidoClick = (event: MouseEvent) => {
      if (this.clickedSidoCodeNm !== null) return;

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

            this.clickedSidoCodeNm = codeNm;
            this.resetSidoHover();
            this.closePopper();

            const sidoData = this.sidoDictionary.value[codeNm];
            const sidoModel = sidoData.model;
            if (sidoModel) {
              this.changeSidoModelSaturation(sidoModel, "increase");
              this.zoomFit({ obj: sidoModel, margin: 0.2, animate: true });
              this.increaseSidoModelDepth({
                codeNm,
                onComplete: () => {
                  this.createSigunguModels(codeNm);
                  this.changeSidoModelLightness(sidoModel, "increase");
                },
              });
            }
          }
        }
      }
    };
    this.canvasEl.addEventListener("click", this.handleSidoClick);
  }

  dispose() {
    super.dispose();
    this.canvasEl.removeEventListener("mousemove", this.handleSidoHover);
    this.canvasEl.removeEventListener("mousemove", this.handleSigunguHover);
    this.canvasEl.removeEventListener("click", this.handleSidoClick);
  }
}

export default KoreaProject;
