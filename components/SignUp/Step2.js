import Typography from "@mui/material/Typography";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";

export function SignUpStep2({ onSubmit }) {
    const [loading, setLoading] = useState(false);

  return (
    <Container
      className="stepContainer"
    >
      <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
        Cerchi un passaggio o vuoi offrirlo?
      </Typography>

      <Button
        variant="outlined"
        size="large"
        endIcon={<ArrowForwardIcon />}
        sx={{ mb: 4 }}
        onClick={() => onSubmit({ userType: "driver" })}
        disabled={loading}
      >
        Offro un passaggio
      </Button>
      <Button
        variant="outlined"
        size="large"
        endIcon={<ArrowForwardIcon />}
        onClick={() => {
            onSubmit({ userType: "passenger" });
            setLoading(true);
        }}
        disabled={loading}
      >
        Cerco un passaggio
      </Button>
    </Container>
  );
}
