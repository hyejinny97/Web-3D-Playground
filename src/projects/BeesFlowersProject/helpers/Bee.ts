import * as THREE from "three";
import * as YUKA from "yuka";
import { BEES_TRANSFORMATION } from "../BeesFlowersProject.constants";
import type { BeeType } from "../BeesFlowersProject.types";
import DynamicElements from "./DynamicElements";
import Job from "./Job";

class Bee extends DynamicElements implements BeeType {
  protected url = "/models/bee/scene.gltf";
  protected count = BEES_TRANSFORMATION.length;
  private jobs: Job[] = [];
  private targets: YUKA.Vector3[] = [];
  private isWorking: boolean = false;

  async init() {
    await super.init();
    this.setupJobs();
  }

  protected transformGLTF() {
    if (this.gltf) {
      this.gltf.scene.visible = false;
      this.gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.renderOrder = 999;
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((mat) => {
            mat.depthTest = false;
            mat.depthWrite = false;
            mat.transparent = true;
            mat.color.offsetHSL(0, 0.3, 0.3);
            mat.needsUpdate = true;
          });
        }
      });
    }
  }

  protected transformModels() {
    BEES_TRANSFORMATION.forEach(({ position, rotationY, scale }, idx) => {
      const model = this.models[idx];
      if (!model) return;

      model.position.set(position.x, position.y, position.z);
      model.rotateY(rotationY);
      model.scale.set(scale, scale, scale);
    });
  }

  private setupJobs() {
    this.entities.forEach((entity) => {
      const job = new Job({ entity });
      this.jobs.push(job);
    });
  }

  private getRandomNm({ min = 0, max = 1 }: { min?: number; max?: number }) {
    return Math.trunc(Math.random() * (max - min + 1)) + min;
  }

  setTargets(...targets: YUKA.Vector3[]) {
    this.targets = targets.map((target) => new YUKA.Vector3().copy(target));
  }

  private getNextTask() {
    if (this.targets.length === 0) {
      throw new Error("targets가 존재하지 않습니다.");
    }
    if (this.models.length !== this.count) {
      throw new Error("models가 존재하지 않습니다.");
    }
    if (this.jobs.length !== this.count) {
      throw new Error("jobs가 존재하지 않습니다.");
    }

    const randomBee = this.getRandomNm({ max: this.count - 1 });
    const model = this.models[randomBee];
    model.visible = true;

    return {
      target: this.targets[this.getRandomNm({ max: this.targets.length - 1 })],
      job: this.jobs[randomBee],
    };
  }

  async work() {
    this.isWorking = true;
    while (this.isWorking) {
      const { job, target } = this.getNextTask();
      await job.seek({ target });
    }
  }

  stop() {
    this.isWorking = false;
  }

  update(time: number) {
    this.jobs.forEach((job) => job.update(time));
  }
}

export default Bee;
