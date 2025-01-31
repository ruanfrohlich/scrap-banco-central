var $84jdv$electron = require("electron");


(0, $84jdv$electron.contextBridge).exposeInMainWorld('versions', {
    node: ()=>process.versions.node,
    chrome: ()=>process.versions.chrome,
    electron: ()=>process.versions.electron
});
(0, $84jdv$electron.contextBridge).exposeInMainWorld('fetchBCB', {
    fetch: (data)=>(0, $84jdv$electron.ipcRenderer).invoke('fetchBCB', data)
});


//# sourceMappingURL=preload.js.map
