import prisma from '../../lib/prisma';

export default async function handler(req, res) {

  const municipios = await prisma.Municipios.findMany()
  ///municipios = JSON.parse(municipios);

  res.status(200).send(municipios);
}
