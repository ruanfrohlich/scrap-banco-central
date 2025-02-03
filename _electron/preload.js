var e=require("electron");(0,e.contextBridge).exposeInMainWorld("electronAPI",{fetchBCB:r=>(0,e.ipcRenderer).invoke("fetchBCB",r),onUpdateCounter:r=>(0,e.ipcRenderer).on("update-counter",(e,n)=>r(n)),counterValue:r=>(0,e.ipcRenderer).send("counter-value",r)});
//# sourceMappingURL=preload.js.map
