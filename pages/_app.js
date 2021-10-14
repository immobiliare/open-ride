import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "components/theme";
import "leaflet/dist/leaflet.css";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import "styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ({ queryKey }) => {
        return fetch(queryKey[0]).then((res) => (res.ok ? res.json() : Promise.reject()))
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta charSet="utf-8" />
        <title>OpenRide</title>
        <meta
          name="description"
          content="Condividi il percorso con i tuoi compagni di classe!"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Nunito:300,400,500,700&display=swap"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default MyApp;
