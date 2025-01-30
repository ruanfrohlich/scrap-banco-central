import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { chunk } from 'lodash';
import { stringify } from 'csv-stringify';
import fs from 'fs';

type generic = {
  [key: string]: string;
};

interface IArguments {
  codSegmento: string;
  codModalidade: string;
  tipoModalidade: string;
  periodo: string;
}

const args = process.argv.slice(2);
const reqJson: generic = {};
const resJson: generic[] = [];

args.forEach((arg) => {
  const splitted = arg.split('=');
  reqJson[splitted[0]] = splitted[1];
});
const data = reqJson as unknown as IArguments;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  await page.goto(
    `https://www.bcb.gov.br/estatisticas/reporttxjuroshistorico/?
    // historicotaxajurosdiario_page=1&
    // codigoSegmento=${data.codSegmento}&
    // codigoModalidade=${data.codModalidade}&
    // tipoModalidade=${data.tipoModalidade}&
    // InicioPeriodo=${data.periodo}`,
    {
      waitUntil: 'networkidle2',
    }
  );

  await page.screenshot({
    path: 'preview.png',
  });

  const htmlContent = await page.content();

  if (htmlContent) {
    const $ = cheerio.load(htmlContent);
    const list: string[] = [];

    $('table')
      .find('tbody > tr')
      .each((i, tr) => {
        $(tr)
          .find('> td')
          .each((j, td) => {
            const value = $(td).text();
            list.push(value.replace(' ', ''));
          });
      });
    if (list.length > 0) {
      const chunked = chunk(list, 4);

      chunked.forEach((chunk) => {
        resJson.push({
          position: chunk[0],
          bankName: chunk[1],
          monthlyRate: chunk[2],
          annualRate: chunk[3],
        });
      });

      stringify(resJson, { header: true }, function (err, output) {
        fs.writeFile('data.csv', output, function (err) {
          if (err) throw err;
          console.log('CSV Gerado com sucesso!');
        });
      });
    } else console.log('Falha ao buscar os dados, tente novamente.');
  }
  await browser.close();
})();
