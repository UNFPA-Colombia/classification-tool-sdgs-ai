import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {

  const directory = path.join(process.cwd(), 'json');
  let departamentos = await fs.readFile(directory + '/departamentos.json', 'utf8');
  departamentos = JSON.parse(departamentos);

  res.status(200).send(departamentos);
}
