import path from 'path';
import prisma from '../../lib/prisma';
const { spawn } = require('child_process');
const Joi = require('joi');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        return new Promise(function (resolve, reject) {
            const schema = Joi.object({
                grupo: Joi.string().min(2).max(50).required(),
                departamento: Joi.string().pattern(/^[0-9]+$/, 'numbers').length(5).required(),
                municipio: Joi.string().pattern(/^[0-9]+$/, 'numbers').length(5).required(),
                edad: Joi.number().integer().min(1900).max(2030).required(),
                genero: Joi.string().valid('H', 'M', 'O').required(),
                zona: Joi.string().valid('U', 'R').required(),
                respuestas: Joi.array().items(Joi.object({ respuesta: Joi.string().min(10).max(1000), pregunta: Joi.number().integer() })).required(),
            });

            const { error, value } = schema.validate(req.body);

            if (error) {
                res.status(400).send(error);
                console.log(error);
                resolve();
            } else {
                prisma.Encuestas.create({
                    data: {
                        departamentoDivipola: value.departamento,
                        municipioDivipola: value.municipio,
                        anioNacimiento: value.edad,
                        genero: value.genero,
                        zona: value.zona,
                        grupoId: value.grupo,
                    },
                    select: {
                        id: true,
                    },
                }).then((encuesta) => {
                    const { id } = encuesta;
                    const respuestasPromises = [];
                    value.respuestas.forEach((respuesta) => {
                        respuestasPromises.push(
                            prisma.Respuestas.create({
                                data: {
                                    respuesta: respuesta.respuesta,
                                    preguntaId: respuesta.pregunta,
                                    encuestaId: id,
                                },
                                select: {
                                    id: true,
                                    respuesta: true,
                                },
                            })
                        );
                    });

                    Promise.all(respuestasPromises).then((respuestas) => {
                        res.setHeader('content-type', 'application/json');
                        res.status(200).send({ id });
                        let textRespuestas = respuestas.map((respuesta) => {
                            return respuesta.respuesta;
                        });
                        const libDirectory = path.join(process.cwd(), 'lib');
                        const pythonPath = libDirectory + '/virtualenv9/bin/python'; // path to python 3.9.13 virtual environment with all required libraries
                        const pythonProcess = spawn(pythonPath, [libDirectory + '/textSimilarityODS.py', ...textRespuestas]);

                        pythonProcess.stdout.on('data', (data) => {
                            const resProcesadas = JSON.parse(data);
                            //console.log(resProcesadas);
                            resProcesadas.forEach((resProcesada, index) => {
                                prisma.MetasRespuestas.createMany({
                                    data: resProcesada.target.map((target, i) => {
                                        return {
                                            metaId: target,
                                            respuestaId: respuestas[index].id,
                                            similitud: resProcesada.sims[i],
                                        };
                                    }),
                                }).then((count) => {
                                    prisma.Respuestas.update({
                                        where: {
                                            id: respuestas[index].id,
                                        },
                                        data: {
                                            procesado: true,
                                        },
                                    });
                                });
                            });
                            prisma.Encuestas.update({
                                where: {
                                    id: id,
                                },
                                data: {
                                    procesado: true,
                                },
                            });
                        });

                        pythonProcess.stderr.on('data', (data) => {
                            console.error(`stderr: ${data}`);
                        });

                        pythonProcess.on('close', (code) => {
                            if (code !== 0) {
                                console.log(`child process exited with code ${code}`);
                                // TODO: handle error - possibly delete encuesta and answers from DB
                            }
                        });
                        resolve();
                    }).catch((error) => {
                        prisma.Respuestas.deleteMany({
                            where: { encuestaId: id },
                        }).then((count) => {
                            prisma.Encuestas.deleteMany({
                                where: { id: id },
                            }).catch((error) => {
                                console.log('On delete encuesta: ', error);
                            });
                        }).catch((error) => {
                            console.log('On delete respuestas: ', error);
                        });
                        console.log(error);
                        res.status(500).send(error);
                        resolve();
                    });
                }).catch((error) => {
                    console.log(error);
                    res.status(500).send(error);
                    resolve();
                });
            }
        });
    } else {
        res.status(405).send('Only POST requests allowed');
    }
}
