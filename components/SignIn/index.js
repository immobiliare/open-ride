// @ts-check

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
import { useRouter } from "next/router";
import Alert from "@mui/material/Alert";
import { useState } from "react";

function signin(username, password) {
  return fetch("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
}

/**
 * We create the SignIn page with the Form
 * asking for username and password
 */
export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [loginError, setLoginError] = useState(false);
  const [pwdVisibility, setPwdVisibility] = useState(false);

  /**
   * When form is submitted we send username/password
   * to the server for the check, if the server
   * respone OK we redirect to the min page which will show
   * component for passenger/driver accordingly.
   *
   * If any error we show the error text and prompt for retry.
   *
   */
  const onSubmit = async (data) => {
    setLoginError(false);
    const response = await signin(data.username, data.password);
    if (response.ok) {
      router.push("/");
    } else {
      setLoginError(true);
    }
  };

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
            helperText={
              errors.username
                ? "Inserisci il tuo username per autenticarti"
                : null
            }
          />
        </FormControl>
        <FormControl>
          <TextField
            label="Password"
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
            error={Boolean(errors.password)}
          />
        </FormControl>
        <Button
          type="submit"
          variant="outlined"
          size="large"
          endIcon={<ArrowForwardIcon />}
        >
          Accedi
        </Button>
        {loginError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Username o password errati
          </Alert>
        )}
      </Container>
    </form>
  );
}
