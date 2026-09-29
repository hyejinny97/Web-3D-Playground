import * as THREE from "three";

interface DrawLineHelperProps {
  canvasEl: HTMLCanvasElement;
  camera: THREE.Camera;
  target: THREE.Object3D;
  maxPoints?: number;
  lineColor?: THREE.Color;
  debug?: boolean;
  excludeNames?: string[] | ((objName: string) => boolean);
}

class DrawLineHelper {
  private canvasEl: HTMLCanvasElement;
  private camera: THREE.Camera;
  private target: THREE.Object3D;
  private maxPoints: number;
  private lineColor: THREE.Color;
  private debug: boolean;
  private excludeNames: Set<string> | ((objName: string) => boolean);
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private handleClick: ((e: MouseEvent) => void) | null = null;
  private handleKeydown: ((e: KeyboardEvent) => void) | null = null;
  line!: THREE.Line;
  points: THREE.Vector3[] = [];

  constructor({
    canvasEl,
    camera,
    target,
    maxPoints = 500,
    lineColor = new THREE.Color(0xff0000),
    debug = false,
    excludeNames = [],
  }: DrawLineHelperProps) {
    this.canvasEl = canvasEl;
    this.camera = camera;
    this.target = target;
    this.maxPoints = maxPoints;
    this.lineColor = lineColor;
    this.debug = debug;
    this.excludeNames = Array.isArray(excludeNames)
      ? new Set(excludeNames)
      : excludeNames;

    this.createLine();
  }

  private createLine() {
    const positions = new Float32Array(this.maxPoints * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setDrawRange(0, 0);

    const material = new THREE.LineBasicMaterial({
      color: this.lineColor,
      depthTest: false,
    });

    this.line = new THREE.Line(geometry, material);
    this.line.frustumCulled = false;
    this.line.renderOrder = 999;
  }

  private getRaycastTargets(): THREE.Mesh[] {
    const meshes: THREE.Mesh[] = [];
    this.target.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mesh = obj;

      if (this.excludeNames instanceof Set) {
        if (this.excludeNames.has(mesh.name)) return;
      } else {
        if (this.excludeNames(mesh.name)) return;
      }

      const mat = Array.isArray(mesh.material)
        ? mesh.material[0]
        : mesh.material;
      if (mat && mat.transparent && mat.opacity === 0) return;

      meshes.push(mesh);
    });
    return meshes;
  }

  private addPoint(worldPoint: THREE.Vector3) {
    if (this.points.length >= this.maxPoints) {
      console.warn("최대 저장 가능한 좌표 개수를 초과했습니다.");
      return;
    }

    this.points.push(worldPoint.clone());
    const index = this.points.length - 1;

    this.line.updateWorldMatrix(true, false);
    const local = this.line.worldToLocal(worldPoint.clone());

    const positionAttribute = this.line.geometry.attributes.position;
    positionAttribute.setXYZ(index, local.x, local.y, local.z);
    positionAttribute.needsUpdate = true;

    this.line.geometry.setDrawRange(0, this.points.length);
  }

  private removeLastPoint() {
    if (this.points.length === 0) {
      console.warn("제거할 point가 없습니다.");
      return;
    }

    this.points.pop();
    const newLength = this.points.length;

    const positionAttribute = this.line.geometry.attributes.position;
    positionAttribute.setXYZ(newLength, 0, 0, 0);
    positionAttribute.needsUpdate = true;

    this.line.geometry.setDrawRange(0, newLength);
  }

  private logHits(hits: THREE.Intersection[]) {
    console.table(
      hits.map((h) => {
        const mesh = h.object as THREE.Mesh;
        const mat = Array.isArray(mesh.material)
          ? mesh.material[0]
          : mesh.material;
        return {
          name: h.object.name,
          type: h.object.type,
          dist: Number(h.distance.toFixed(4)),
          y: Number(h.point.y.toFixed(4)),
          visible: h.object.visible,
          matVisible: mat?.visible,
          transparent: mat?.transparent,
          opacity: mat?.opacity,
          side: mat?.side,
        };
      }),
    );
  }

  private addClickEventListener(onChange?: () => void) {
    if (this.handleClick) return;

    this.handleClick = (event: MouseEvent) => {
      const rect = this.canvasEl.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.target.updateMatrixWorld(true);
      this.raycaster.setFromCamera(this.mouse, this.camera);

      const hits = this.raycaster.intersectObjects(
        this.getRaycastTargets(),
        false,
      );

      if (this.debug) {
        this.logHits(hits);
      }

      const hit = hits[0];
      if (!hit) return;

      this.addPoint(hit.point);
      onChange?.();
    };

    this.canvasEl.addEventListener("dblclick", this.handleClick);
  }

  private removeClickEventListener() {
    if (this.handleClick) {
      this.canvasEl.removeEventListener("dblclick", this.handleClick);
      this.handleClick = null;
    }
  }

  private addCtrlZEventListener(onChange?: () => void) {
    if (this.handleKeydown) return;

    this.handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
        this.removeLastPoint();
        onChange?.();
      }
    };

    window.addEventListener("keydown", this.handleKeydown);
  }

  private removeCtrlZEventListener() {
    if (this.handleKeydown) {
      window.removeEventListener("keydown", this.handleKeydown);
      this.handleKeydown = null;
    }
  }

  canDraw(onChange?: () => void) {
    this.addClickEventListener(onChange);
    this.addCtrlZEventListener(onChange);
  }

  cannotDraw() {
    this.removeClickEventListener();
    this.removeCtrlZEventListener();
  }

  dispose() {
    this.cannotDraw();
    this.line.geometry.dispose();
    (this.line.material as THREE.Material).dispose();
  }
}

export default DrawLineHelper;
