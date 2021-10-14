import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

import MopedIcon from "@mui/icons-material/Moped";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HailTwoTone from "@mui/icons-material/HailTwoTone";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export function UserListItem({
  user,
  onClick,
  matching,
  divider,
  acceptedMatch,
  disablePadding
}) {
  return (
    <ListItem
      divider={divider}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="control"
          onClick={onClick}
          color={acceptedMatch ? "primary" : matching ? "secondary" : undefined}
        >
          {acceptedMatch ? (
            <ThumbUpIcon />
          ) : matching ? (
            <HourglassTopIcon />
          ) : (
            <ControlPointIcon />
          )}
        </IconButton>
      }
      disablePadding={disablePadding}
    >
        <ListItemIcon>
          <Avatar
            sx={{
              border: `2px solid`,
              borderColor: "border",
              bgcolor:
                acceptedMatch || matching
                  ? "primary.contrastText"
                  : "secondary.main",
              color: acceptedMatch
                ? "primary.main"
                : matching
                ? "secondary.main"
                : undefined,
            }}
          >
            {user.userType === "passenger" ? (
              <HailTwoTone />
            ) : user.transportType === "car" ? (
              <DirectionsCarIcon />
            ) : (
              <MopedIcon />
            )}
          </Avatar>
        </ListItemIcon>
        <ListItemText
          primary={<b>@{user.username}</b>}
          primaryTypographyProps={{ variant: "h7" }}
          secondary={user.class}
        />
    </ListItem>
  );
}
