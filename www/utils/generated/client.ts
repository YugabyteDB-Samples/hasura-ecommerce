import { getHasuraURL } from "../constants";
import { Chain } from "./graphql-client-sdk";

export const client = Chain(getHasuraURL() + "/v1/graphql", {
  credentials: "include",
  mode: "cors",
  headers: (() =>
    {
        if (typeof window === "undefined") {
            return { "X-Hasura-Admin-Secret": process.env.HASURA_ADMIN_SECRET };
        } else if (process.env.NEXT_PUBLIC_HASURA_CLOUD_ADMIN_SECRET) {
            return { "X-Hasura-Admin-Secret": process.env.NEXT_PUBLIC_HASURA_CLOUD_ADMIN_SECRET };
        } else {
            return {};
        }
    })(),
});

export const openclient = Chain(getHasuraURL() + "/v1/graphql", {
  credentials: "include",
  headers: (() =>
   process.env.NEXT_PUBLIC_HASURA_CLOUD_ADMIN_SECRET
    ? { "X-Hasura-Admin-Secret": process.env.NEXT_PUBLIC_HASURA_CLOUD_ADMIN_SECRET }
    : {})(),
});
