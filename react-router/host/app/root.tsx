import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/root";
import { remotes } from "./mf/remotes";
import { getRemoteStyles } from "./mf/remote-styles.server";

export async function loader({ request }: Route.LoaderArgs) {
  return { remoteStyles: await getRemoteStyles(remotes, request.url) };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Remote CSS, in the server HTML: no unstyled flash before hydration. */}
        {data?.remoteStyles.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
