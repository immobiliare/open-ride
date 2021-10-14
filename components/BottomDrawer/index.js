import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";

import SwipeableDrawer from "@mui/material/SwipeableDrawer";

function Puller() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 30,
        height: 6,
        backgroundColor: "border",
        borderRadius: 3,
        margin: `${theme.spacing(2)} auto 0`,
      }}
    />
  );
}

export function BottomDrawer({ content, open, onClose, onOpen }) {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      hideBackdrop
      elevation={24}
    >
      <Puller />
      {content}
    </SwipeableDrawer>
  );
}
