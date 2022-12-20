// Migration Cheat Sheet: https://www.sanity.io/docs/migration-cheat-sheet

// # TODO: this hook is not being used yet

import { useMemo } from "react";
import { useClient } from "sanity";

const apiVersion = import.meta.env.SANITY_STUDIO_VERSION;

export function useSanityClient() {
  const client = useClient();
  return useMemo(() => client.withConfig({ apiVersion }), [client]);
}
