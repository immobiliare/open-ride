import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import { UserListItem } from "components/UserListItem";
import { useState } from "react";
import { useQuery } from "react-query";
import { BottomDrawer } from "../BottomDrawer";
import { Header } from "../Header";

export function PassengerView() {
  const [selectedDriver, setSelectedDriver] = useState(null);

  const { data: drivers = [] } = useQuery(["/api/users?userType=driver"]);
  const { data: matches = [], refetch: refetchMatches } = useQuery([
    "/api/matches",
  ]);

  const acceptedMatch = matches.find((match) => match.status === "accepted");

  async function selectDriver(driver) {
    setSelectedDriver(driver);

    if (!matches.find((match) => match.driverId === driver.id)) {
      await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driverId: driver.id,
          status: "idle",
        }),
      });
      await refetchMatches();
    }
  }

  return (
    <Container disableGutters>
      <Header />
      {!acceptedMatch && (
        <List dense disablePadding>
          {drivers.map((driver) => {
            const matching = matches.find((m) => m.driverId === driver.id);

            return (
              <UserListItem
                key={driver.id}
                user={driver}
                matching={Boolean(matching)}
                onClick={() => selectDriver(driver)}
                acceptedMatch={Boolean(acceptedMatch)}
              />
            );
          })}
        </List>
      )}
      {acceptedMatch && (
        <Box sx={{ py: 3, px: 2 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            @{acceptedMatch.user.username},<br /> hai un passaggio!
          </Typography>
          <UserListItem
            user={acceptedMatch.driver}
            acceptedMatch
            disablePadding
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {acceptedMatch.driver.firstName} {acceptedMatch.driver.lastName}{" "}
            della classe {acceptedMatch.driver.class} ha accettato la tua
            richiesta.
          </Typography>
          <Typography variant="body2">
            Contattala privatamente per mettervi d{`'`}accordo su orari o altri
            particolari.
          </Typography>
          <Typography variant="body2">Buon viaggio!</Typography>
        </Box>
      )}

      <BottomDrawer
        open={Boolean(selectedDriver && !acceptedMatch)}
        onOpen={() => {}}
        onClose={() => setSelectedDriver(null)}
        content={
          <Box sx={{ p: 2 }}>
            <Typography sx={{ mb: 2, fontWeight: "700" }}>
              Richiesta di passaggio
            </Typography>
            <Typography variant="body2">
              Abbiamo inviato una richiesta a {selectedDriver?.firstName}{" "}
              {selectedDriver?.lastName} della classe {selectedDriver?.class}!
            </Typography>
            <Typography variant="body2">
              Torna presto per controllare se ha accettato
            </Typography>
            <Box
              sx={{
                pt: 2,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="text" onClick={() => setSelectedDriver(null)}>
                OK
              </Button>
            </Box>
          </Box>
        }
      />
    </Container>
  );
}
