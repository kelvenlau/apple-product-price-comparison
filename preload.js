const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("applePricingApp", {
  getBootstrap: () => ipcRenderer.invoke("pricing:get-bootstrap"),
  fetchSnapshot: (productId) => ipcRenderer.invoke("pricing:fetch-snapshot", productId),
  openExternal: (url) => ipcRenderer.invoke("app:open-external", url),
});
