import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
 baseURL: `${process.env.NEXT_PUBLIC_AUTH_URL}/auth`, 
  plugins: [
    inferAdditionalFields({
      user: {
        name: { type: "string", required: true },
        role: { type: "string", input: true }, // Define explicitly here
      },
    }),
  ],
});
