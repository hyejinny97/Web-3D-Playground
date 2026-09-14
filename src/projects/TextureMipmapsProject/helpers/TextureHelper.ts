import * as THREE from "three";
import type { ControlUIType } from "@/types/project";
import type { TextureHelperType } from "../TextureMipmapsProject.types";
import {
  MIPMAP_IMAGE_URLS,
  PLANE_HEIGHT,
} from "../TextureMipmapsProject.constants";

class TextureHelper implements TextureHelperType {
  private controlUIGroupName = "Texture";
  declare private _texture: THREE.Texture;
  private loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>;
  controlUI: ControlUIType;

  constructor(
    controlUI: ControlUIType,
    loadTextureImages: (urls: string[]) => Promise<HTMLImageElement[]>,
  ) {
    this.controlUI = controlUI;
    this.loadTextureImages = loadTextureImages;
  }

  get texture() {
    return this._texture;
  }

  async init() {
    const imgEls = await this.loadTextureImages(MIPMAP_IMAGE_URLS);

    this._texture = new THREE.Texture(imgEls[0]);
    this._texture.colorSpace = THREE.SRGBColorSpace;
    this._texture.generateMipmaps = false;
    this._texture.mipmaps = imgEls as unknown as HTMLCanvasElement[];
    this._texture.wrapS = THREE.RepeatWrapping;
    this._texture.wrapT = THREE.RepeatWrapping;
    this._texture.repeat.x = 1;
    this._texture.repeat.y = Math.trunc(PLANE_HEIGHT / 3);
    this._texture.needsUpdate = true;
  }

  createControlUI() {
    this.controlUI.add(this.controlUIGroupName, [
      {
        type: "image-view",
        label: "mipmaps",
        imageUrl: "/textures/mips.png",
      },
    ]);
  }

  reset() {
    this.controlUI.removeGroup(this.controlUIGroupName);
  }
}

export default TextureHelper;
