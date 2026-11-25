// Server only. Finds the stylesheets of the remotes so the host can render
// their <link> tags during SSR, while the remotes keep plain CSS imports.
//
// A remote built with `manifest: true` publishes mf-manifest.json next to its
// remote entry. It lists the CSS files of every expose, relative to that entry,
// so the only URL knowledge needed is the one the host already has: where the
// remote entry lives.
import type { Remote } from "./remotes";

type Manifest = {
  exposes?: { assets?: { css?: { sync?: string[]; async?: string[] } } }[];
};

/**
 * @param publicBase URL the browser used for this request. A remote entry
 * relative to the host (e.g. "/extensions/remoteEntry.js") is resolved against it.
 */
export async function getRemoteStyles(remotes: Remote[], publicBase: string): Promise<string[]> {
  const hrefs = await Promise.all(
    remotes.map(async (remote) => {
      // Where the browser loads the remote from. If the server reaches the
      // remote through a different (internal) URL, fetch the manifest from
      // there and keep `publicEntry` for the hrefs.
      const publicEntry = new URL(remote.entry, publicBase);
      try {
        const response = await fetch(new URL("mf-manifest.json", publicEntry));
        if (!response.ok) return [];
        const manifest = (await response.json()) as Manifest;
        return (manifest.exposes ?? []).flatMap((expose) =>
          [...(expose.assets?.css?.sync ?? []), ...(expose.assets?.css?.async ?? [])].map(
            // Absolute, and resolved exactly like the remote entry does in the
            // browser, so the entry finds this <link> and does not add a second one.
            (file) => new URL(file, publicEntry).href
          )
        );
      } catch {
        // Remote down or no manifest: the browser still injects the CSS when
        // the remote's JS loads, only later.
        return [];
      }
    })
  );
  return [...new Set(hrefs.flat())];
}
