export function patchRoutes(routes) {
  window.g_routes = routes;
}

export function render(oldRender) {
  oldRender();
}
