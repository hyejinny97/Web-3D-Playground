import * as YUKA from "yuka";
import FiniteStateMachine from "@/helpers/FiniteStateMachine";
import type {
  FiniteStateMachineType,
  StateInfo,
} from "@/helpers/FiniteStateMachine";
import type { JobStateType, JobType } from "../BeesFlowersProject.types";
import { TOLERANCE } from "../BeesFlowersProject.constants";

class Job implements JobType {
  private stateMachine!: FiniteStateMachineType<
    Record<JobStateType, StateInfo>
  >;
  private entity: YUKA.Vehicle;
  private behavior: YUKA.ArriveBehavior | null = null;
  private target: YUKA.Vector3 | null = null;
  private onComplete: (() => void) | null = null;

  constructor({ entity }: { entity: YUKA.Vehicle }) {
    this.entity = entity;
    this.setupStateMachine();
  }

  private setupStateMachine() {
    this.stateMachine = new FiniteStateMachine({
      statesInfo: {
        stay: {
          enter: () => {
            if (this.behavior) {
              this.behavior.active = false;
              this.entity.velocity.set(0, 0, 0);
            }

            const onComplete = this.onComplete;
            this.onComplete = null;
            this.target = null;
            onComplete?.();
          },
        },
        seek: {
          enter: () => {
            if (!this.target) return;
            if (this.behavior) {
              const { x, y, z } = this.target;
              this.behavior.target.set(x, y, z);
              this.behavior.active = true;
            } else {
              this.behavior = new YUKA.ArriveBehavior(
                this.target,
                2.5,
                TOLERANCE,
              );
              this.entity.steering.add(this.behavior);
            }
          },
          update: () => {
            if (!this.target) return;

            const toleranceSq = TOLERANCE * TOLERANCE;
            const distanceSq = this.entity.position.squaredDistanceTo(
              this.target,
            );
            if (distanceSq <= toleranceSq) {
              this.stateMachine.translate("stay");
            }
          },
        },
      },
      initialState: "stay",
    });
  }

  async seek({ target }: { target: YUKA.Vector3 }) {
    this.target = target;
    return new Promise<void>((resolve) => {
      this.onComplete = resolve;
      this.stateMachine.translate("seek");
    });
  }

  update(time: number) {
    this.stateMachine.update(time);
  }
}

export default Job;
