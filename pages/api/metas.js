import prisma from '../../lib/prisma';

export default async function handler(req, res) {

  const metas = await prisma.Metas.findMany();

  res.status(200).send(metas);

}
