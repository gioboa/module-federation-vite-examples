declare module "remote/mount" {
  export const __mf_remote_pending: Promise<unknown>;
  const mount: (element: HTMLElement) => void | (() => void);
  export default mount;
}
