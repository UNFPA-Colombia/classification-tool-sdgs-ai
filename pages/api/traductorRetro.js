const Joi = require('joi');
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'POST') {

        return new Promise(function (resolve, reject) {
            const schema = Joi.object({
                traduccionId: Joi.string().uuid().required(),
                metaId: Joi.string().min(3).max(5).required(),
                retroalimentacion: Joi.boolean().required(),
            });
            
            const { error, value } = schema.validate(req.body);

            if (error) {
                res.status(400).send(error);
                resolve();
            } else {
                prisma.MetasTraduccion.update({
                    where: {
                        metaId_traduccionId: {
                            metaId: value.metaId,
                            traduccionId: value.traduccionId,
                        },
                    },
                    data: {
                        retroalimentacion: value.retroalimentacion,
                    },
                }).then(() => {
                    res.status(200).send('OK');
                }
                ).catch((error) => {
                    console.log(error);
                    res.status(500).send('Internal error');
                }).finally(() => {
                    resolve();
                });
            }
        });

    } else {
        res.status(405).send('Only POST requests allowed');
    }
}