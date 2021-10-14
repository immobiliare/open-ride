import { Hail, Home, School } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { divIcon } from "leaflet";
import { render } from "react-dom";
import { Marker } from "react-leaflet";
import css from "./index.module.css";
import theme from '../theme'

function createMapIcon(
  IconComponent,
  bg = theme.palette.common.white,
  bgHover = theme.palette.grey[200],
  color = theme.palette.primary.main,
) {
  if (typeof window === "undefined") return null;

  let el = document.createElement("div");

  render(
    <IconButton
      sx={{
        border: '3px solid',
        borderColor: theme.palette.border,
        color,
        backgroundColor: bg,
        boxShadow: theme.shadows[1],
        "&:hover": {
          backgroundColor: bgHover,
          transform: 'scale(1.2)',
        },
      }}
    >
      <IconComponent />
    </IconButton>,
    el
  );

  return divIcon({
    iconSize: [46, 46],
    iconAnchor: [23, 23],
    className: css.marker,
    html: el.innerHTML,
  });
}

const homeIcon = createMapIcon(Home);

/** @param {import('react-leaflet').MarkerProps} [props] */
export function HomeMarker(props) {
  return <Marker {...props} icon={homeIcon} />;
}

const schoolIcon = createMapIcon(School);

/** @param {import('react-leaflet').MarkerProps} [props] */
export function SchoolMarker(props) {
  return <Marker {...props} icon={schoolIcon} />;
}

const passengerIcon = createMapIcon(Hail, theme.palette.secondary.main, theme.palette.secondary.dark, theme.palette.secondary.contrastText);
const activePassengerIcon = createMapIcon(Hail);

/** @param {import('react-leaflet').MarkerProps & {active: boolean}} [props] */
export function PassengerMarker({ active, ...props }) {
  return (
    <Marker {...props} icon={active ? activePassengerIcon : passengerIcon} />
  );
}
