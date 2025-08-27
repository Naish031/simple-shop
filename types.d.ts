import { Connection } from "mongoose";

// Type definition for the global mongoose cache used in Next.js dev mode
// Keeps the cached connection on the global object to avoid creating multiple
// connections during hot reloads.

declare global {
  var mongoose:
    | {
        conn: Connection | null;
        promise: Promise<Connection> | null;
      }
    | undefined;
}

export {};
