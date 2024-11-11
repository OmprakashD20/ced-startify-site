import { createRootRoute, Outlet } from "@tanstack/react-router";

import Navbar from "@/components/navbar";

export const Route = createRootRoute({
  component: () => (
    <main>
      <Navbar />
      <Outlet />
    </main>
  ),
});
