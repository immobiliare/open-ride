import Image from "next/image";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";

export function Landing() {
  return (
    <Container
      sx={{
        justifyContent: "center",
      }}
    >
      <Box sx={{ mb: 6, textAlign: "center", fontSize: 22 }}>
        <Image
          src="/images/landing-image.svg"
          height={180}
          width={180}
          alt="Logo"
        />
        <Typography
          variant="h5"
          component="h1"
          sx={{ mt: 1, color: "primary.main" }}
        >
          Benvenuto su OpenRide
        </Typography>
        Offri o cerca un passaggio
        <br />
        per andare a scuola
      </Box>
      <Link href="/signin" passHref>
        <Button
          component="a"
          variant="outlined"
          color="secondary"
          size="large"
          sx={{ mb: 4 }}
        >
          Accedi
        </Button>
      </Link>
      <Link href="/signup" passHref>
        <Button component="a" variant="outlined" color="secondary" size="large">
          Registrati
        </Button>
      </Link>
    </Container>
  );
}