import { createContext } from "react";
import type { User } from "../api/types";

const UserContext = createContext<User | null>(null);

export { UserContext };
