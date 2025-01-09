import { createContext } from "react";
import type { CredentialGetter } from "../api/AxiosClient";

const CredentialGetterContext = createContext<CredentialGetter | null>(null);

export { CredentialGetterContext };
