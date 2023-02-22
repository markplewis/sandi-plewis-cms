import { useMemo } from "react";
import { useClient } from "sanity";

// V3 migration Cheat Sheet: https://www.sanity.io/docs/migration-cheat-sheet

const apiVersion = process.env.SANITY_STUDIO_VERSION;

export default function useSanityClient() {
  const client = useClient({ apiVersion });
  return useMemo(() => client.withConfig({ apiVersion }), [client]);
}
