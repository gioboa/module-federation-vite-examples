import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";
import { getRouter } from "./router";
import { loadRemoteModule } from "./mf/load-remote";

// Start fetching the remote modules before hydration, without awaiting them.
// The cached promises are reused by the route, so the Suspense boundaries
// hydrate as soon as each module arrives, keeping the server-rendered HTML.
loadRemoteModule("remote/Widget");
loadRemoteModule("remote/Counter");

const router = getRouter();

hydrateRoot(document, <StartClient router={router} />);
