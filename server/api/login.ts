export default defineEventHandler(async (event) => {
  if (event.node.req.method !== "POST") {
    throw createError({
      statusCode: 405,
      message: "Method Not Allowed",
    });
  }

  const body = await readBody(event);
  console.log("Received body:", body); // برای دیباگ

  const { username, password } = body;

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: "Username and password are required",
    });
  }

  const validUsername = process.env.ADMIN_USERNAME || "admin";
  const validPassword = process.env.ADMIN_PASSWORD || "123456";

  if (username === validUsername && password === validPassword) {
    return {
      success: true,
      message: "Login successful",
      access_token: "sample-access-token-123456789",
      refresh_token: "sample-refresh-token-987654321",
      user: { username },
    };
  }

  throw createError({
    statusCode: 401,
    message: "Invalid username or password",
  });
});
