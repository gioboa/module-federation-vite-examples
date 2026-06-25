// This file intentionally has no real remote imports. It verifies that docs-like
// text such as import("remote/remote-app") is not rewritten as a federated import.

/*
 * Block-comment example: import("remote/remote-app")
 */
const remoteImportDocs = 'Dynamic remote example: import("remote/remote-app")';
const remoteImportTemplateDocs = `Dynamic remote example: import("remote/remote-app")`;

export function logRemoteImportDocs() {
  console.debug(remoteImportDocs, remoteImportTemplateDocs);
}
