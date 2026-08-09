import Grid from "@jinni-labs/ui/Grid";

const ControlGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid
      className="w-full grid-cols-[minmax(0,1fr)_100px_65px]! items-center"
      columns={3}
      columnSpacing={8}
    >
      {children}
    </Grid>
  );
};

export default ControlGrid;
