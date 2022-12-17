// Migration Cheat Sheet: https://www.sanity.io/docs/migration-cheat-sheet

// # TODO: this hook is not being used yet

import { useMemo } from "react";
import { useClient } from "sanity";

const apiVersion = import.meta.env.SANITY_STUDIO_API_VERSION;

export function useSanityClient() {
  const client = useClient();
  return useMemo(() => client.withConfig({ apiVersion }), [client]);
}

// import sanityClient from "part:@sanity/base/client";

// // See: https://www.sanity.io/help/studio-client-specify-api-version

// const client = sanityClient.withConfig({
//   apiVersion: process.env.SANITY_STUDIO_API_VERSION
// });

// export default client;
