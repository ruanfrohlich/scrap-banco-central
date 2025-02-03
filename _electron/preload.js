var e=require("electron");(0,e.contextBridge).exposeInMainWorld("versions",{node:()=>process.versions.node,chrome:()=>process.versions.chrome,electron:()=>process.versions.electron}),(0,e.contextBridge).exposeInMainWorld("fetchBCB",{fetch:o=>(0,e.ipcRenderer).invoke("fetchBCB",o)});
//# sourceMappingURL=preload.js.map
