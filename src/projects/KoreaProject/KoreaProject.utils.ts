import * as THREE from "three";

export const createShapes = (shapes: number[][][]): THREE.Shape[] => {
  const totalShapes: THREE.Shape[] = [];
  shapes.forEach((shape) => {
    const subShape = new THREE.Shape();
    shape.forEach((coord, idx) => {
      if (idx === 0) {
        subShape.moveTo(coord[0], coord[1]);
      } else {
        subShape.lineTo(coord[0], coord[1]);
      }
    });
    totalShapes.push(subShape);
  });
  return totalShapes;
};
