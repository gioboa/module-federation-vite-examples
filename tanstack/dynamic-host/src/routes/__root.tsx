import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { Theme } from "tanstack-shared";
import { ThemeContext } from "tanstack-shared";

const hostTheme: Theme = { primaryColour: "#3451b2", label: "host" };

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TanStack Start + Module Federation SSR (runtime remotes)" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeContext.Provider value={hostTheme}>
          <Outlet />
        </ThemeContext.Provider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundComponent() {
  return <p>Not Found</p>;
}
