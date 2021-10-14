import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";

async function logout() {
  await fetch('/api/auth/logout');

  window.location.reload();
}

export function Header() {
  return (
    <AppBar position="static" sx={{ zIndex: "appBar" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          OpenRide
        </Typography>
        <IconButton size="large" edge="end" color="inherit" onClick={logout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
