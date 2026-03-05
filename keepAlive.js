export const startKeepAlive = () => {
  const ping = async () => {
    try {
      const res = await fetch("https://your-api-url.com/health");

      console.log("KeepAlive Ping:", res.status);
    } catch (error) {
      console.error("KeepAlive Failed:", error.message);
    }
  };

  // run once when server starts
  ping();

  // run every 10 minutes
  setInterval(ping, 10 * 60 * 1000);
};
