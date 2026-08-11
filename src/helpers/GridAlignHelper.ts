import * as THREE from "three";

interface GridAlignHelperType {
  rowGap?: number;
  columnGap?: number;
  maxGridColumns?: number;
  plane?: "xy" | "yz" | "xz";
}

class GridAlignHelper {
  private rowGap: NonNullable<GridAlignHelperType["rowGap"]>;
  private columnGap: NonNullable<GridAlignHelperType["columnGap"]>;
  private maxGridColumns: NonNullable<GridAlignHelperType["maxGridColumns"]>;
  private plane: NonNullable<GridAlignHelperType["plane"]>;

  constructor(props?: GridAlignHelperType) {
    const {
      rowGap = 1,
      columnGap = 1,
      maxGridColumns = 3,
      plane = "xy",
    } = props || {};
    this.rowGap = rowGap;
    this.columnGap = columnGap;
    this.maxGridColumns = maxGridColumns;
    this.plane = plane;
  }

  align(objects: THREE.Object3D[]) {
    const count = objects.length;
    const gridColumns = Math.min(count, this.maxGridColumns);
    const gridRows = Math.ceil(count / gridColumns);

    const rowMiddle = (gridRows + 1) / 2;
    const columnMiddle = (gridColumns + 1) / 2;
    for (let row = 1; row <= gridRows; row++) {
      for (let column = 1; column <= gridColumns; column++) {
        const idx = gridColumns * (row - 1) + (column - 1);
        if (idx > objects.length - 1) break;

        let [x, y, z] = [0, 0, 0];
        switch (this.plane) {
          case "xy": {
            x = (column - columnMiddle) * this.columnGap;
            y = (rowMiddle - row) * this.rowGap;
            break;
          }
          case "yz": {
            z = (column - columnMiddle) * this.columnGap;
            y = (rowMiddle - row) * this.rowGap;
            break;
          }
          case "xz": {
            x = (column - columnMiddle) * this.columnGap;
            z = (rowMiddle - row) * this.rowGap;
            break;
          }
        }
        objects[idx].position.set(x, y, z);
      }
    }
  }
}

export default GridAlignHelper;
