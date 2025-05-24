import GitHub from "@auth/core/providers/github";
import { generateUUID } from "mtxuilib/lib/utils";
import Credentials from "next-auth/providers/credentials";
import { user } from "../../db/schema";
import { generateHashedPassword } from "../../db/utils";

export async function createGuestUser() {
  const email = `guest-${Date.now()}`;
  const password = generateHashedPassword(generateUUID());

  try {
    const db = await getDbV3();
    return await db.insert(user).values({ id: generateUUID(), email, password }).returning({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error("Failed to create guest user in database");
    throw error;
  }
}

export const providers = [
  GitHub({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }),

  //   Credentials({
  //     credentials: {},
  //     async authorize({ email, password }: any) {
  //       const users = await getUser(email);

  //       if (users.length === 0) {
  //         await compare(password, DUMMY_PASSWORD);
  //         return null;
  //       }

  //       const [user] = users;

  //       if (!user.password) {
  //         await compare(password, DUMMY_PASSWORD);
  //         return null;
  //       }

  //       const passwordsMatch = await compare(password, user.password);

  //       if (!passwordsMatch) return null;

  //       return { ...user, type: "regular" };
  //     },
  //   }),
  Credentials({
    id: "guest",
    credentials: {},
    async authorize() {
      const [guestUser] = await createGuestUser();
      return { ...guestUser, type: "guest" };
    },
  }),
];
