// Netlify Serverless Function — API entry point
// Future: connect to Neon Postgres via Prisma

export const handler = async (event, context) => {
  const { path, httpMethod, body } = event;

  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  if (httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Route handler stub
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: "ProLearn API — connect your database to activate",
      path,
      method: httpMethod,
    }),
  };
};
