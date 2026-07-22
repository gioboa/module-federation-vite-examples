// Server component: fetches a server-rendered HTML fragment from the remote
// app and inlines it into the host's server render. This puts the remote's
// static markup in the initial HTML (like nuxt's Module Federation SSR);
// the federated client component swaps it for the live version after
// hydration, since vinext's MF bridge is browser-only.
const REMOTE_ORIGIN = "http://localhost:4174";

export default async function RemoteFragment({ name }: { name: string }) {
  try {
    const response = await fetch(`${REMOTE_ORIGIN}/fragments/${name}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const startMarker = `<template data-mf-fragment-start="${name}"></template>`;
    const endMarker = `<template data-mf-fragment-end="${name}">`;
    const start = html.indexOf(startMarker);
    const end = html.indexOf(endMarker);
    if (start === -1 || end === -1) {
      return null;
    }

    const fragment = html.slice(start + startMarker.length, end);
    return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: fragment }} />;
  } catch {
    // Remote unavailable during server render: fall back to client-only load.
    return null;
  }
}
