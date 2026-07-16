import Application from "./app";
import environment from "./config";

export default async function mount(element: HTMLElement) {
  const rootId = element.id || "ember-federated-remote";
  element.id = rootId;

  const application = Application.create({
    ...environment.APP,
    autoboot: false,
    rootElement: element,
  });

  await application.visit("/", {
    location: "none",
    rootElement: `#${rootId}`,
  });

  return () => application.destroy();
}
