import * as THREE from "three";
import type { TrackHelperType } from "../FollowCurveProject.types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

class TrackHelper implements TrackHelperType {
  declare root: THREE.Object3D;
  private loadManager: THREE.LoadingManager;

  constructor({ loadManager }: { loadManager: THREE.LoadingManager }) {
    this.loadManager = loadManager;
  }

  async init() {
    await this.loadGLTF();
  }

  async loadGLTF() {
    const loader = new GLTFLoader(this.loadManager);
    const gltf = await loader.loadAsync("/models/lake_track.glb");
    this.root = gltf.scene;
  }
}

export default TrackHelper;
