import prisma from '../../lib/prisma';

export default async function handler(req, res) {

  const objetivos = await prisma.Objetivos.findMany();

  res.status(200).send(objetivos);
}