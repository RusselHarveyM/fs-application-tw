import { createContext } from "react";

export const DataContext = createContext({
  users: undefined,
  buildings: undefined,
  rooms: undefined,
  spaces: undefined,
});
