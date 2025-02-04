let e;var o=require("path"),a=require("electron"),t=require("electron-updater");require("dotenv/config");var n=require("puppeteer"),r=require("cheerio"),l=require("lodash"),i=require("os");function d(e){return e&&e.__esModule?e.default:e}let c=[],s="";const u=d(i).userInfo();switch(d(i).platform()){case"win32":s="C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";break;case"linux":s=`/home/${u.username}/.cache/puppeteer/chrome/linux-132.0.6834.110/chrome-linux64/chrome`}const p=async e=>{let o=await n.launch({executablePath:s}),a=await o.newPage();await a.setViewport({width:1920,height:1080});try{await a.goto(`https://www.bcb.gov.br/estatisticas/reporttxjuroshistorico?historicotaxajurosdiario_page=1&codigoSegmento=1&codigoModalidade=${e.codModalidade}&tipoModalidade=D&InicioPeriodo=${e.periodo}`),await a.waitForSelector("table.table tbody",{timeout:1e4});let o=await a.content();if(o){let e=r.load(o),a=[];e("table").find("tbody > tr").each((o,t)=>{e(t).find("> td").each((o,t)=>{let n=e(t).text();a.push(n.replace(" ",""))})}),a.length>0?(0,l.chunk)(a,4).forEach(e=>{c?.push({position:e[0],bankName:e[1],monthlyRate:e[2],annualRate:e[3]})}):console.log("Falha ao buscar os dados, tente novamente.")}}catch(e){console.log(e)}await o.close()};var h=async e=>{await p(e);let o=0,a=0;return Object.keys(c).forEach((e,a)=>{let t=parseFloat(c[a].monthlyRate.replace(",","."));o+=t}),a=Math.floor(o/c.length*100)/100,console.log({total:o,numeroDeBancos:c.length,media:a}),c=[],Math.floor(100*a)/100},w=o.resolve(__dirname,"../src");const b=d(o).join(w,"../_electron/"),g=()=>{e=new a.BrowserWindow({width:1280,height:720,maximizable:!0,center:!0,icon:"../images/logo.ico",roundedCorners:!0,webPreferences:{preload:b+"preload.js"}});let o=(0,a.Menu).buildFromTemplate([{label:"BCB Interest Check",submenu:[{click:()=>e?.webContents.send("update-counter",1),label:"Increment"},{click:()=>e?.webContents.send("update-counter",-1),label:"Decrement"},{label:"Sobre",role:"about"},{label:"Sair",click:()=>(0,a.app).quit()}]}]);(0,a.Menu).setApplicationMenu(o),e.on("closed",()=>{e=null}),e.loadFile(b+"static/index.html"),e.webContents.openDevTools()};function m(o){console.log(o),e?.webContents.send("message",o)}(0,t.autoUpdater).on("checking-for-update",()=>{m("Checking for update...")}),(0,t.autoUpdater).on("update-available",e=>{m("Update available.")}),(0,t.autoUpdater).on("update-not-available",e=>{m("Update not available.")}),(0,t.autoUpdater).on("error",e=>{m("Error in auto-updater. "+e)}),(0,t.autoUpdater).on("download-progress",e=>{let o="Download speed: "+e.bytesPerSecond;m(o=(o=o+" - Downloaded "+e.percent+"%")+" ("+e.transferred+"/"+e.total+")")}),(0,t.autoUpdater).on("update-downloaded",e=>{m("Update downloaded")}),(0,a.app).whenReady().then(()=>{(0,t.autoUpdater).checkForUpdatesAndNotify(),(0,a.ipcMain).handle("fetchBCB",async(e,o)=>{let a=await h(o);if(a)return a;throw Error("Falha ao buscar os dados no Banco Central.")}),(0,a.ipcMain).on("counter-value",(e,o)=>{console.log(o)}),g(),(0,a.app).on("activate",()=>{0===(0,a.BrowserWindow).getAllWindows().length&&g()})}),(0,a.app).on("window-all-closed",()=>{"darwin"!==process.platform&&(0,a.app).quit()});
//# sourceMappingURL=main.js.map
