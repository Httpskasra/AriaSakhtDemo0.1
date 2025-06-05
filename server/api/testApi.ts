import { defineEventHandler, readBody } from "h3";

// Mock database for demonstration purposes
const users = [
  { id: 1, email: "user1@example.com", password: "password1" },
  { id: 2, email: "user2@example.com", password: "password2" },
];

// Login handler
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (body.email && body.password) {
    // Handle email/password login
    const user = users.find(
      (u) => u.email === body.email && u.password === body.password
    );
    if (user) {
      return {
        success: true,
        message: "Login successful",
        user: { id: user.id, email: user.email },
      };
    } else {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }
  } else {
    return {
      success: false,
      message: "Invalid request data",
    };
  }
});
