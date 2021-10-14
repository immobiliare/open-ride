//@ts-check

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useForm } from "react-hook-form";
import PlacesAutocomplete from "components/PlacesAutocomplete";
import { useState, useEffect } from "react";

export function SignUpStep1({ onSubmit }) {
  const [pwdVisibility, setPwdVisibility] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    register("address", { required: true });
  }, [register]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container className="stepContainer">
        <FormControl>
          <TextField
            label="Username"
            defaultValue=""
            {...register("username", {
              required: "required",
            })}
            error={Boolean(errors.username)}
          />
        </FormControl>
        <FormControl variant="outlined">
          <TextField
            id="outlined-adornment-password"
            type={pwdVisibility ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                    onClick={() => setPwdVisibility(!pwdVisibility)}
                  >
                    {pwdVisibility ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...register("password", {
              required: "required",
            })}
            label="Password"
            error={Boolean(errors.password)}
          />
        </FormControl>
        <FormControl>
          <TextField
            label="Nome"
            defaultValue=""
            {...register("firstName", {
              required: "required",
            })}
            error={Boolean(errors.firstName)}
          />
        </FormControl>
        <FormControl>
          <TextField
            label="Cognome"
            defaultValue=""
            {...register("lastName", {
              required: "required",
            })}
            error={Boolean(errors.lastName)}
          />
        </FormControl>
        <FormControl>
          <TextField
            label="Classe"
            defaultValue=""
            {...register("class", {
              required: "required",
            })}
            error={Boolean(errors.class)}
          />
        </FormControl>
        <PlacesAutocomplete
          label="Indirizzo"
          sx={{ mb: 2 }}
          onChange={(value) => {
            if (!value) {
              setValue("address", "");
              setValue("coordinates", null);
              return;
            }

            let [lng, lat] = value.geometry.coordinates;

            setValue("address", value.properties.label);
            setValue("coordinates", {
              lat,
              lng,
            });
          }}
          error={errors.address}
        />
        <Button
          type="submit"
          variant="outlined"
          size="large"
          endIcon={<ArrowForwardIcon />}
        >
          Continua
        </Button>
      </Container>
    </form>
  );
}
