import prisma from '../../../lib/prisma';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../../styles/Consultar.module.css';
import LogosHeader from '../../../components/LogosHeader';

export default function Resultado({ encuesta }) {

    function showRespuestas() {
        if (encuesta.procesado) {
            return encuesta.respuestas.map(pregunta => {
                return (
                    <div className={styles.respuesta} key={pregunta.id}>
                        <h3>{pregunta.pregunta.pregunta.replace('MUNICIPIO', encuesta.municipio.nombre).replace('DEPARTAMENTO', encuesta.departamento.nombre)}</h3>
                        <p>{pregunta.respuesta}</p>
                        <p><strong>{pregunta.metasRespuesta.length > 0 ? pregunta.metasRespuesta.length === 1 ? "Meta asociada:" : "Metas asociadas:" : "No se encontraron metas asociadas"}</strong></p>
                        <div className={styles.metas}>
                            {pregunta.metasRespuesta.map((meta, index) => {
                                const sim = Math.round((meta.similitud + Number.EPSILON) * 100);
                                const factor = (sim - 60) / 40;
                                return (<>
                                    <button key={index} className={styles.buttonMeta} onClick={() => {

                                    }} disabled>
                                        <Image src={`/targets/TARGET_${meta.meta.objetivoId}_${meta.meta.key}.svg`} layout="fill" objectFit="cover" objectPosition="left bottom" alt={`Logo de la Meta de Desarrollo Sostenible numero ${meta.meta.id}`} />
                                        <div><span className={styles.dot} style={{ width: `${(factor * 15) + 40}px`, height: `${(factor * 15) + 40}px` }}><p style={{ paddingTop: `${(factor * 7.5) + 10}px` }}><strong>{sim}%</strong></p></span></div>
                                        <span className={styles.tooltiptext}>
                                            <p><strong>Meta {meta.meta.id}:</strong> {meta.meta.descripcion}</p>
                                        </span>
                                    </button>
                                </>);
                            })
                            }
                        </div>
                    </div>
                );
            });
        } else {
            return (
                <div className={styles.mensajeProcesar}>
                    <h2>La encuesta aún no ha sido procesada</h2>
                    <p>Por favor, espera unos segundos y vuelve a consultar.</p>
                    <Link href={`/consultar/encuesta/${encuesta.id}`} ><button className={styles.buttonRecargar}>Recargar</button></Link>
                </div>
            );
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>ODS-IA consultar encuesta</title>
                <meta name="description" content="Consulta en ODS-IA los resultados de una encuesta." />
                <meta name="keywords" content="IA, Objetivos de Desarrollo Sostenibles, UNFPA, Colombia, consulta"></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Link href="/consultar/encuesta"><button className={styles.buttonReturn} role="button">&#10140;</button></Link>

            <LogosHeader />

            <div className={styles.main}>
                <h1 className={styles.title}>Resultados Encuesta &#128238;</h1>

                <div className={styles.infoEncuesta}>
                    <p><strong>Código único (CU):</strong> {encuesta.id}</p>
                    <p><strong>Fecha de creación:</strong> {encuesta.createdAt}</p>
                </div>
                <div className={styles.infoDemografica}>
                    <h3>Información demográfica</h3>
                    <p><strong>Año de nacimiento: </strong> {encuesta.anioNacimiento}</p>
                    <p><strong>Género: </strong>{encuesta.genero}</p>
                    <p><strong>Departamento: </strong>{encuesta.departamento.nombre}</p>
                    <p><strong>Municipio: </strong>{encuesta.municipio.nombre}</p>
                    <p><strong>Zona: </strong>{encuesta.zona}</p>
                </div>
                <div className={styles.grid}>
                    {showRespuestas()}
                </div>

            </div>
        </div>
    );
}

export async function getServerSideProps({ params }) {
    let encuesta = await prisma.Encuestas.findUnique({
        where:
            { id: params.id },
        select: {
            id: true,
            createdAt: true,
            municipio: true,
            departamento: true,
            zona: true,
            genero: true,
            anioNacimiento: true,
            procesado: true,
            grupo: true,
            respuestas: {
                select: {
                    id: true,
                    respuesta: true,
                    procesado: true,
                    pregunta: {
                        select: {
                            pregunta: true,
                        }
                    },
                    metasRespuesta: {
                        select: {
                            meta: true,
                            similitud: true,
                        }
                    },
                }
            },
        },
    });

    if (!encuesta) {
        return {
            redirect: {
                destination: '/consultar/encuesta/noencontrada',
                permanent: false,
            },
        }
    }

    encuesta.createdAt = encuesta.createdAt.toLocaleString('es-CO', { timeZone: 'America/Bogota' });
    encuesta.zona = encuesta.zona == 'U' ? 'Urbana' : 'Rural';
    encuesta.genero = encuesta.genero == 'H' ? 'Hombre' : encuesta.genero == 'M' ? 'Mujer' : 'Otro';


    return {
        props: { encuesta },
    }
}