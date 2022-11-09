import path from 'path';
import prisma from '../../lib/prisma';
const { spawn } = require('child_process');
const Joi = require('joi');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        return new Promise(function (resolve, reject) {
            const schema = Joi.object({
                data: Joi.string().min(10).max(1000).required(),
            });

            const { error, value } = schema.validate(req.body);

            if (error) {
                res.status(400).send(error);
                resolve();
            } else {
                const libDirectory = path.join(process.cwd(), 'lib');
                const pythonPath = libDirectory + '/virtualenv9/bin/python'; // path to python 3.9.13 virtual environment with all required libraries
                const pythonProcess = spawn(pythonPath, [libDirectory + '/textSimilarityODS.py', value.data]);

                pythonProcess.stdout.on('data', (data) => {
                    const newData = { metas: JSON.parse(data.toString())[0], id: '' };
                    prisma.Traduccion.create({
                        data: {
                            texto: value.data,
                        },
                        select: {
                            id: true,
                        },
                    }).then((traduccion) => {
                        newData.metas.forEach(meta => {
                            prisma.MetasTraduccion.create({
                                data: {
                                    metaId: `${meta.goal}.${meta.target}`,
                                    traduccionId: traduccion.id,
                                    similitud: meta.sim,
                                }
                            }).catch((error) => {
                                console.log(error);
                            });
                        })
                        newData.id = traduccion.id;
                    }).catch((error) => {
                        console.log(error);
                    }).finally(() => {
                        res.setHeader('content-type', 'application/json');
                        res.status(200).send(newData);
                    });
                });

                pythonProcess.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });

                pythonProcess.on('close', (code) => {
                    if (code !== 0) {
                        console.log(`child process exited with code ${code}`);
                        res.status(500).send('Internal error');
                    }
                    resolve();
                });
            }
        });
    } else {
        res.status(405).send('Only POST requests allowed');
    }
}