import prisma from '../../lib/prisma';

export default async function handler(req, res) {

  const departamentos = await prisma.Departamentos.findMany();

  res.status(200).send(departamentos);
}
