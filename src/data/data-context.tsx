import { createContext } from "react";

export const DataContext = createContext({
  users: undefined,
  buildings: undefined,
  rooms: undefined,
  spaces: undefined,
  spaceImages: undefined,
  ratings: undefined,
  comments: undefined,
  redTags: undefined,
  addUser: () => {},
  addBuilding: () => {},
  addRoom: () => {},
  addSpace: () => {},
  addSpaceImage: () => {},
  addRating: () => {},
  addComment: () => {},
  addRedTag: () => {},
});
