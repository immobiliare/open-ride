import {
  MapContainer,
  TileLayer,
  useMapEvent,
  Polyline,
  useMap,
} from "react-leaflet";
import {
  HomeMarker,
  SchoolMarker,
  PassengerMarker,
} from "components/MapMarkers";
import { useQuery } from "react-query";
import { BottomDrawer } from "components/BottomDrawer";
import { UserListItem } from "components/UserListItem";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { latLngBounds } from "leaflet";

/** @param {{ user: any, schoolCoordinates: any }} [props] */
export default function MapComponent({ user, schoolCoordinates }) {
  const { data: matches = [], refetch: refetchMatches } = useQuery([
    "/api/matches",
  ]);

  const [selectedMatch, setSelectedMatch] = useState(null);

  let tracksUrl = "/api/tracks";

  if (selectedMatch?.status === "idle") {
    const passengersIds = [selectedMatch.user.id];

    for (let match of matches) {
      if (match.status === "accepted") {
        passengersIds.push(match.user.id);
      }
    }

    tracksUrl += `?passengersIds=${passengersIds.join(",")}`;
  }

  const { data: tracks = [], refetch: refetchTracks } = useQuery([tracksUrl]);

  async function selectPassenger(match) {
    setSelectedMatch(null);
    await fetch("/api/matches/" + match.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        driverId: user.id,
        userId: match.user.id,
        status: "accepted",
      }),
    });
    refetchTracks();
    refetchMatches();
  }

  return (
    <>
      <MapContainer>
        <FitBounds user={user} schoolCoordinates={schoolCoordinates} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HomeMarker position={user.coordinates} />
        <SchoolMarker position={schoolCoordinates} />
        {matches.map((match) => (
          <PassengerMarker
            position={match.user.coordinates}
            key={match.id}
            eventHandlers={{
              click: () => setSelectedMatch(match),
            }}
            active={match.status === "accepted"}
          />
        ))}
        {tracks.map((track, i) => (
          <Polyline
            positions={flipCoordinates(track.coordinates)}
            pathOptions={{
              weight: 7,
              opacity: 0.7,
            }}
            key={i}
          />
        ))}
      </MapContainer>
      <BottomDrawer
        open={Boolean(selectedMatch)}
        onOpen={() => {}}
        onClose={() => setSelectedMatch(null)}
        content={
          selectedMatch?.status === "idle" ? (
            <UserListItem
              user={selectedMatch.user}
              onClick={() => selectPassenger(selectedMatch)}
            />
          ) : selectedMatch?.status === "accepted" ? (
            <>
              <Typography gutterBottom sx={{ px: 2, pt: 2 }}>
                La lista dei tuoi passeggeri
              </Typography>
              {matches
                .filter((m) => m.status === "accepted")
                .map((m) => (
                  <UserListItem key={m.id} user={m.user} acceptedMatch />
                ))}
            </>
          ) : null
        }
      />
    </>
  );
}

function FitBounds({ user, schoolCoordinates }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(latLngBounds(user.coordinates, schoolCoordinates));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function flipCoordinates(coordinates) {
  return coordinates.map(([lng, lat]) => [lat, lng]);
}
