const getBaseApiConfig = () => {
  const referrer = document.referrer;
  const parentUrl = new URL(referrer);
  const isLocalhost = parentUrl.hostname === "localhost";
  if (isLocalhost) {
    const port = parentUrl.port;
    return {
      baseUrl: `http://localhost:5002`,
      body: { port },
    };
  }
  const subdomain = parentUrl.hostname.split(".")[0];
  return {
    baseUrl: "https://backend.magictasks.uk",
    body: { app_name: subdomain },
  };
};

export { getBaseApiConfig };
