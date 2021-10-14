import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import lazy from "next/dynamic";
import { Header } from "../Header";

const MapComponent = lazy(
  async () => import("./Map"),
  { ssr: false }
);

export function DriverView({ user, schoolCoordinates }) {
  return (
    <Container disableGutters>
      <Header />
      <Box sx={{ flex: "1 1 100%" }}>
        <MapComponent user={user} schoolCoordinates={schoolCoordinates} />
      </Box>
    </Container>
  );
}
