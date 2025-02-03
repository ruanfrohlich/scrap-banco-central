import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { chunk } from 'lodash';
import { GenericObject, IFetchBCBArguments } from '../types';
import os from 'os';

let resJson: GenericObject[] = [];
let browserPath: string = '';
const userInfo = os.userInfo();

switch (os.platform()) {
  case 'win32': {
    browserPath =
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    break;
  }
  case 'linux': {
    browserPath = `/home/${userInfo.username}/.cache/puppeteer/chrome/linux-132.0.6834.110/chrome-linux64/chrome`;
    break;
  }
}
const scrapBCB = async (data: IFetchBCBArguments) => {
  const browser = await puppeteer.launch({
    executablePath: browserPath,
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  try {
    await page.goto(
      `https://www.bcb.gov.br/estatisticas/reporttxjuroshistorico?historicotaxajurosdiario_page=1&codigoSegmento=1&codigoModalidade=${data.codModalidade}&tipoModalidade=D&InicioPeriodo=${data.periodo}`
    );

    await page.screenshot({
      path: './preview.png',
    });

    await page.waitForSelector('table.table tbody', {
      timeout: 10000,
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
          resJson?.push({
            position: chunk[0],
            bankName: chunk[1],
            monthlyRate: chunk[2],
            annualRate: chunk[3],
          });
        });
      } else console.log('Falha ao buscar os dados, tente novamente.');
    }
  } catch (error) {
    console.log(error);
  }

  await browser.close();
};

export default async (data: IFetchBCBArguments): Promise<number> => {
  await scrapBCB(data);
  let total = 0;
  let monthlyAverage = 0;

  Object.keys(resJson).forEach((el, i) => {
    const format = parseFloat(resJson[i].monthlyRate.replace(',', '.'));
    total += format;
  });

  monthlyAverage = Math.floor((total / resJson.length) * 100) / 100;

  console.log({
    total,
    numeroDeBancos: resJson.length,
    media: monthlyAverage,
  });

  resJson = [];

  return Math.floor(monthlyAverage * 100) / 100;
};
