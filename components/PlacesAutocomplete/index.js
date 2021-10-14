//@ts-check

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import throttle from "lodash/throttle";
import { useEffect, useMemo, useState } from "react";

function fetchPlaces(query) {
  return fetch(
    "/api/geo/autocomplete?search=" + encodeURIComponent(query)
  ).then((res) => (res.ok ? res.json() : Promise.reject()));
}

export default function PlacesAutocomplete({
  onChange,
  label = "Add a location",
  ...props
}) {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPlaces = useMemo(
    () =>
      throttle(
        (query, callback, inTheEnd) => {
          fetchPlaces(query).then(callback).finally(inTheEnd);
        },
        2500,
        {
          leading: false,
          trailing: true,
        }
      ),
    []
  );

  useEffect(() => {
    let active = true;

    if (inputValue.length <= 3) {
      setLoading(false);
      setOptions(value ? [value] : []);
      return undefined;
    }

    setLoading(true);
    getPlaces(
      inputValue,
      (response) => {
        if (active) {
          const results = response.features;
          let newOptions = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      },
      () => {
        if (active) {
          setLoading(false);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, getPlaces]);

  return (
    <Autocomplete
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.properties.label
      }
      filterOptions={(x) => x}
      loading={loading}
      loadingText="Sto caricando..."
      noOptionsText="Nessun risultato"
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        onChange?.(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...props} {...params} label={label} fullWidth />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item>
                <Box
                  component={LocationOnIcon}
                  sx={{ color: "text.secondary", mr: 2 }}
                />
              </Grid>
              <Grid item xs>
                {option.properties.label}
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
