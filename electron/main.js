var $3DgXv$path = require("path");
var $3DgXv$electron = require("electron");
var $3DgXv$puppeteer = require("puppeteer");
var $3DgXv$cheerio = require("cheerio");
var $3DgXv$lodash = require("lodash");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}





const $31edea84090c1773$var$resJson = [];
let $31edea84090c1773$var$totalMonthly = 0;
const $31edea84090c1773$var$scrapBCB = async (data)=>{
    const browser = await $3DgXv$puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    try {
        await page.goto(`https://www.bcb.gov.br/estatisticas/reporttxjuroshistorico/?
    // historicotaxajurosdiario_page=1&
    // codigoSegmento=${data.codSegmento}&
    // codigoModalidade=${data.codModalidade}&
    // tipoModalidade=${data.tipoModalidade}&
    // InicioPeriodo=${data.periodo}`, {
            waitUntil: 'networkidle2',
            timeout: 10000
        });
        await page.waitForSelector('table.table');
        const htmlContent = await page.content();
        if (htmlContent) {
            const $ = $3DgXv$cheerio.load(htmlContent);
            const list = [];
            $('table').find('tbody > tr').each((i, tr)=>{
                $(tr).find('> td').each((j, td)=>{
                    const value = $(td).text();
                    list.push(value.replace(' ', ''));
                });
            });
            if (list.length > 0) {
                const chunked = (0, $3DgXv$lodash.chunk)(list, 4);
                chunked.forEach((chunk)=>{
                    $31edea84090c1773$var$resJson.push({
                        position: chunk[0],
                        bankName: chunk[1],
                        monthlyRate: chunk[2],
                        annualRate: chunk[3]
                    });
                });
            } else console.log('Falha ao buscar os dados, tente novamente.');
        }
    } catch (error) {
        console.log(error);
    }
    await browser.close();
};
var $31edea84090c1773$export$2e2bcd8739ae039 = async (data)=>{
    await $31edea84090c1773$var$scrapBCB(data);
    for (const el of $31edea84090c1773$var$resJson)$31edea84090c1773$var$totalMonthly += parseFloat(el.monthlyRate);
    const monthlyAverage = $31edea84090c1773$var$totalMonthly / $31edea84090c1773$var$resJson.length;
    $31edea84090c1773$var$totalMonthly = 0;
    return Math.floor(monthlyAverage * 100) / 100;
};





var $7f74fe8f266113fa$var$$parcel$__dirname = $3DgXv$path.resolve(__dirname, "../src");
const $7f74fe8f266113fa$var$electronPath = (0, ($parcel$interopDefault($3DgXv$path))).join($7f74fe8f266113fa$var$$parcel$__dirname, '../electron/');
const $7f74fe8f266113fa$var$createWindow = ()=>{
    const win = new (0, $3DgXv$electron.BrowserWindow)({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: $7f74fe8f266113fa$var$electronPath + 'preload.js'
        }
    });
    win.loadFile($7f74fe8f266113fa$var$electronPath + 'static/index.html');
};
(0, $3DgXv$electron.app).whenReady().then(()=>{
    $7f74fe8f266113fa$var$createWindow();
    (0, $3DgXv$electron.app).on('activate', ()=>{
        if ((0, $3DgXv$electron.BrowserWindow).getAllWindows().length === 0) $7f74fe8f266113fa$var$createWindow();
    });
});
(0, $3DgXv$electron.ipcMain).handle('fetchBCB', async (event, data)=>{
    console.log(data);
    const req = await (0, $31edea84090c1773$export$2e2bcd8739ae039)(data);
    return req;
});
(0, $3DgXv$electron.app).on('window-all-closed', ()=>{
    if (process.platform !== 'darwin') (0, $3DgXv$electron.app).quit();
});


//# sourceMappingURL=main.js.map
