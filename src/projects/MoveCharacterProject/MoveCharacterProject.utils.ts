import { DIRECTION_KEYS } from "./MoveCharacterProject.constants";
import type { DirectionKeyType } from "./MoveCharacterProject.types";

export const isDirectionKey = (key: string): key is DirectionKeyType =>
  DIRECTION_KEYS.some((el) => el === key);
