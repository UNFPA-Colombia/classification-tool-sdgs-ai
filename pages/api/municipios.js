import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {

  const directory = path.join(process.cwd(), 'json');
  let municipios = await fs.readFile(directory + '/municipios.json', 'utf8');
  municipios = JSON.parse(municipios);

  res.status(200).send(municipios);
}
