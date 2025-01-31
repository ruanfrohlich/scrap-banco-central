import { createServer } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { parse } from 'url';
import { StatusCodes } from 'http-status-codes';
import { isUndefined, some } from 'lodash';
import { bcbScrap } from './functions';
import fs from 'fs';
import path from 'path';

interface IArguments extends ParsedUrlQuery {
  codSegmento: string;
  codModalidade: string;
  tipoModalidade: string;
  periodo: string;
}

const port = process.env.PORT ?? 4000;

const server = createServer(async (req, res) => {
  const { url, method } = req;

  if (method === 'GET') {
    if (url?.startsWith('/api')) {
      const parsedUrl = parse(url, true);
      const { codModalidade, codSegmento, periodo, tipoModalidade } =
        parsedUrl.query as IArguments;

      if (
        some([codModalidade, codSegmento, periodo, tipoModalidade], isUndefined)
      ) {
        res.writeHead(StatusCodes.BAD_REQUEST, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            success: false,
            message: 'Parametros faltando na requisição',
          })
        );

        return;
      }

      const average = await bcbScrap({
        codModalidade,
        codSegmento,
        periodo,
        tipoModalidade,
      });

      res.writeHead(StatusCodes.OK, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          periodo,
          average,
        })
      );
    }

    if (req.url === '/') {
      const html = fs.readFileSync(path.join(__dirname, 'index.html'), {
        encoding: 'utf8',
      });

      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(html);
    }
  }

  res.writeHead(404);
  return res.end();
});

server.listen(port, () => console.log('Server rodando na porta ', port));
