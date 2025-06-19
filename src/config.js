const getBaseApiConfig = () => {
  const referrer = document.referrer;
  
  let parentUrl;

  try {
    parentUrl = new URL(referrer || window.location.href);
  } catch (e) {
    // Fallback URL or error handling
    console.error('Invalid referrer URL, using window.location:', e);
    parentUrl = new URL(window.location.href);
  }

  const isLocalhost = parentUrl.hostname === "localhost";

  if (isLocalhost) {
    const port = parentUrl.port || '3000'; // default port if none provided
    return {
      baseUrl: `http://localhost:5002`,
      body: { port },
    };
  }

  const subdomainParts = parentUrl.hostname.split(".");
  const subdomain = subdomainParts.length > 2 ? subdomainParts[0] : 'default-app';

  return {
    baseUrl: "https://backend.magictasks.uk",
    body: { app_name: subdomain },
  };
};

export { getBaseApiConfig };
