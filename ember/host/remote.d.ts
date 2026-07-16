declare module "remote/mount" {
  export const __mf_remote_pending: Promise<unknown>;
  const mount: (element: HTMLElement) => Promise<() => void>;
  export default mount;
}
