import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MopedIcon from "@mui/icons-material/Moped";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export function SignUpStep3({ onSubmit }) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    register("transportType", { required: true, value: "car" });
  }, [register]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        setLoading(true);
      })}
    >
      <Container className="stepContainer">
        <Box sx={{ mb: 6, fontSize: 16 }}>
          <Typography variant="h4" component="h2">
            Benvenuto Driver!
          </Typography>
          Dicci qualcosa di più sul tuo mezzo di trasporto...
        </Box>
        <FormControl component="fieldset" sx={{ mb: 4 }}>
          <FormLabel
            sx={{ fontWeight: "700", color: "text.primary" }}
            component="legend"
            error={Boolean(errors.transportType)}
          >
            Che tipo di mezzo guidi?
          </FormLabel>
          <RadioGroup
            aria-label="transport"
            defaultValue="car"
            name="radio-buttons-group"
            onChange={(e) => {
              setValue("transportType", e.target.value);
            }}
          >
            <FormControlLabel
              control={<Radio value="car" />}
              label={
                <span className="customRadioLabel">
                  Automobile <DirectionsCarIcon fontSize="small" />
                </span>
              }
            />
            <FormControlLabel
              control={<Radio value="scooter" />}
              label={
                <span className="customRadioLabel">
                  Scooter <MopedIcon fontSize="small" />
                </span>
              }
            />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" sx={{ mb: 4 }}>
          <FormLabel
            sx={{ fontWeight: "700", color: "text.primary", mb: 1 }}
            component="legend"
          >
            Quanti posti hai a disposizione?
          </FormLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            defaultValue={1}
            {...register("seats", {
              required: "required",
              valueAsNumber: true,
            })}
            error={Boolean(errors.seats)}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="outlined"
          size="large"
          endIcon={<ArrowForwardIcon />}
          disabled={loading}
        >
          Continua
        </Button>
      </Container>
    </form>
  );
}
