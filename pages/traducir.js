import { useState, useRef, useEffect } from 'react';
import prisma from '../lib/prisma';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import TextAudioQuestion from '../components/TextAudioQuestion';
import Loading from '../components/Loading';
import styles from '../styles/Traducir.module.css';
import LogosHeader from '../components/LogosHeader';

export default function Traducir({ objetivos, metas }) {

    const [texto, setTexto] = useState('');
    const [estadoTraduccion, setEstadoTraduccion] = useState(0); // 0: not posted, 1: posting, 2: posted 3: error
    const [resultadoTraduccion, setResultadoTraduccion] = useState([]);
    const [textoMuyCorto, setTextoMuyCorto] = useState(false);
    const [detalle, setDetalle] = useState(0);
    const [agruparMetas, setAgruparMetas] = useState(false);
    const textoAviso = useRef(null);
    const detalleDiv = useRef(null);

    useEffect(() => {
        if (estadoTraduccion > 0) {
            textoAviso.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [estadoTraduccion]);

    useEffect(() => {
        if (textoMuyCorto) {
            textoAviso.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [textoMuyCorto]);

    useEffect(() => {
        if (detalle > 0) {
            detalleDiv.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [detalle]);

    function traducirTexto() {
        setEstadoTraduccion(1);
        setDetalle(0);
        fetch('/api/traductor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: texto }),
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then((data) => {
                        setResultadoTraduccion(data[0]);
                        setEstadoTraduccion(2);
                    }).catch((error) => {
                        console.log(error);
                        setEstadoTraduccion(3);
                    });
            } else {
                setEstadoTraduccion(3);
            }
        })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function showResultadoTraduccionObjetivos() {
        const resultadosAgrupados = resultadoTraduccion.reduce(function (r, a) {
            r[a.goal] = r[a.goal] || [];
            r[a.goal].push(a);
            return r;
        }, Object.create(null));

        const resultado = []
        Object.entries(resultadosAgrupados).forEach((item, index) => {
            const [key, value] = item;
            const objetivo = objetivos.find((objetivo) => objetivo.id === parseInt(key));
            if (objetivo) {
                resultado.push(<>
                    <div key={index} className={styles.resultado}>
                        <button onClick={() => {
                            setDetalle(detalle === objetivo.id ? 0 : objetivo.id);
                        }} >
                            <Image src={objetivo.img} layout="fill" objectFit="cover" alt={`Logo del Objetivo de Desarrollo Sostenible numero ${objetivo.id}`} />
                        </button>
                    </div>
                </>);
            }
        });
        return resultado;
    }

    function showResultadoTraduccionMetas() {
        const targets = resultadoTraduccion.sort((a, b) => { a.sim - b.sim }).map((item, index) => {
            const meta = metas.find((meta) => meta.id === item.goal + '.' + item.target);
            const sim = Math.round((item.sim + Number.EPSILON) * 100);
            return (<>
                <button key={index} className={styles.buttonMetaExt} onClick={() => {
                    setDetalle(item.goal);
                }}>
                    <Image src={`/targets/TARGET_${item.goal}_${item.target}.svg`} layout="fill" objectFit="cover" objectPosition="left bottom" alt={`Logo de la Meta de Desarrollo Sostenible numero ${item.goal}.${item.target}`} />
                </button>
            </>);
        });
        return targets;
    }

    function showDetalleResultados() {
        if (detalle === 0) {
            return <></>;
        }
        if (detalle === 18) {
            const targets = resultadoTraduccion.sort((a, b) => { a.sim - b.sim }).map((item, index) => {
                const meta = metas.find((meta) => meta.id === item.goal + '.' + item.target);
                const sim = Math.round((item.sim + Number.EPSILON) * 100);
                return (<>
                    <button key={index} className={styles.buttonMeta} onClick={() => {
                        setDetalle(item.goal);
                    }}>
                        <span>
                            <strong>{`${item.goal}.${item.target.length > 1 ? item.target : item.target + ' '}${item.goal > 9 ? '' : '\u00A0\u00A0'}`}</strong>&nbsp;&nbsp;{sim}%&nbsp;
                        </span>
                        <span className={styles.detalleBar} style={{ width: sim * 0.75 + '%' }}>

                        </span>
                        <br />
                        <div className={styles.containerMeta}>
                            <div className={styles.imgMeta}>
                                <Image src={`/targets/TARGET_${item.goal}_${item.target}.svg`} layout="fill" objectFit="cover" objectPosition="left bottom" alt={`Logo de la Meta de Desarrollo Sostenible numero ${item.goal}.${item.target}`} />
                            </div>
                            <div className={styles.descripcionMeta}>
                                {meta ? meta.descripcion : ''}
                            </div>
                        </div>
                    </button>
                </>);
            });
            return (
                <div ref={detalleDiv} className={styles.resultadoDetalle}>
                    <div className={styles.divCerrarDetalle}>
                        <button className={styles.buttonCerrarDetalle} role="button" onClick={() => {
                            setDetalle(0);
                        }}>&#10006;</button>
                    </div>
                    <div className={styles.bodyDetalle}>
                        <div className={styles.detalleObjetivo}>
                            <strong>Metas relacionadas:</strong><br />
                            {targets}
                        </div>
                    </div>
                </div>
            );
        }
        const objetivo = objetivos.find((objetivo) => objetivo.id === detalle);
        const targets = resultadoTraduccion.filter((item) => item.goal == detalle).map((item, index) => {
            const sim = Math.round((item.sim + Number.EPSILON) * 100);
            const meta = metas.find((meta) => meta.id === item.goal + '.' + item.target);
            return (<>
                <div key={index} className={styles.contMeta}>
                    <span>
                        <strong>{`${item.goal}.${item.target.length > 1 ? item.target : item.target + ' '}`}</strong>&nbsp;&nbsp;{sim}%&nbsp;
                    </span>
                    <span className={styles.detalleBar} style={{ width: sim * 0.75 + '%' }}>

                    </span>
                    <br />
                    <div className={styles.containerMeta}>
                        <div className={styles.imgMeta}>
                            <Image src={`/targets/TARGET_${item.goal}_${item.target}.svg`} layout="fill" objectFit="cover" objectPosition="left bottom" alt={`Logo de la Meta de Desarrollo Sostenible numero ${item.goal}.${item.target}`} />
                        </div>
                        <div className={styles.descripcionMeta}>
                            {meta ? meta.descripcion : ''}
                        </div>
                    </div>
                </div>
            </>);
        });
        return (
            <div ref={detalleDiv} className={styles.resultadoDetalle}>
                <div className={styles.divCerrarDetalle}>
                    <button className={styles.buttonCerrarDetalle} role="button" onClick={() => {
                        setDetalle(0);
                    }}>&#10006;</button>
                </div>
                <div className={styles.bodyDetalle}>
                    <div className={styles.contMeta}>
                        <div className={styles.logoObjetivo}>
                            <a href={objetivo.url} target="_blank" rel="noreferrer"><Image src={objetivo.img} layout="fill" objectFit="cover" alt={`Logo del Objetivo de Desarrollo Sostenible numero ${objetivo.id}`} /></a>
                        </div>

                        <div className={styles.detalleObjetivo}>
                            <a href={objetivo.url} target="_blank" rel="noreferrer"><strong>{objetivo.nombre}</strong></a><br />
                            <div className={styles.descripcionObjetivo}>{objetivo.descripcion}</div>
                        </div>
                    </div>
                    <strong>Metas relacionadas:</strong><br />
                    {targets}
                </div>
            </div>
        );
    }

    function showTraduccion() {
        if (textoMuyCorto) {
            return (
                <div ref={textoAviso} className={styles.mensajeTraduccion}>
                    <p>El texto es muy corto. Por favor, escribe al menos 6 palabras.</p>
                </div>
            );
        }
        else if (estadoTraduccion === 0) {
            return (
                <div ref={textoAviso} className={styles.mensajeTraduccion}>
                    <p>Presiona el botón para traducir el texto.</p>
                </div>
            );
        } else if (estadoTraduccion === 1) {
            return (
                <div className={styles.traduciendo}>
                    <div className={styles.logoTraduciendo}>
                        <Loading />
                    </div>
                    <p ref={textoAviso}>Traduciendo...</p>
                </div>
            );
        } else if (estadoTraduccion === 2) {
            if (resultadoTraduccion.length === 0) {
                return (
                    <div ref={textoAviso} className={styles.mensajeTraduccion}>
                        <p>En este caso, el texto que has introducido no se ha podido asociar a ningún Objetivo de Desarrollo Sostenible (ODS).</p>
                        <p>Si crees que el texto que has introducido debería estar relacionado con alguno de los Objetivos de Desarrollo Sostenible, puedes <Link href="/contacto"><a>contactarte con nosotros</a></Link> para que lo revisemos.</p>
                    </div>
                );
            }
            return (
                <>
                    <div ref={textoAviso} className={styles.resultados}>
                        {agruparMetas ? showResultadoTraduccionObjetivos() : showResultadoTraduccionMetas()}
                    </div>
                    <div className={styles.divVerMetas}>
                        <button className={styles.buttonVerMetas} onClick={() => {
                            agruparMetas ? setAgruparMetas(false) : setAgruparMetas(true);
                        }}>{agruparMetas ? <>Desagrupar metas &#128209;</> : <>Agrupar por objetivos &#128450;</>}</button>
                        &nbsp;&nbsp;&nbsp;
                        <button className={styles.buttonVerMetas} onClick={() => {
                            detalle === 18 ? setDetalle(0) : setDetalle(18);
                        }}>Ver todas las metas &#127919;</button>
                    </div>
                </>
            );
        } else if (estadoTraduccion === 3) {
            return (
                <div ref={textoAviso} className={styles.mensajeTraduccion}>
                    <p>Ha ocurrido un error</p>
                    <p>Por favor intenta nuevamente...</p>
                </div>
            );
        }
    }

    function wordCount() {
        return texto.split(' ').length;
    }

    function showBotonTraducir() {
        if (estadoTraduccion === 0 || estadoTraduccion === 2 || estadoTraduccion === 3) {
            if (wordCount() >= 6) {
                return (
                    <button className={styles.traducirButton} role="button" onClick={traducirTexto}>&#10003; Traducir</button>
                );
            } else if (texto.length < 5) {
                return (
                    <button className={styles.traducirButton} role="button" disabled>&#10003; Traducir</button>
                );
            } else {
                return (
                    <button className={styles.traducirButton} role="button" onClick={() => {
                        setTextoMuyCorto(true);
                        setEstadoTraduccion(0);
                        setDetalle(0);
                    }}>&#10003; Traducir</button>
                );
            }
        } else if (estadoTraduccion === 1) {
            return (
                <button className={styles.traducirButton} role="button" disabled>&#10003; Traducir</button>
            );
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>ODS-IA Traducir</title>
                <meta name="description" content="Traduce en ODS-IA un texto y encuentra los ODSs mas relevantes." />
                <meta name="keywords" content="IA, Objetivos de Desarrollo Sostenibles, UNFPA, Colombia, participa, traducir, traductor"></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Link href="/"><button className={styles.buttonReturn} role="button">&#10140;</button></Link>

            <LogosHeader />

            <div className={styles.main}>
                <h1 className={styles.title}>
                    Traductor de <Image src="/SDG_logo.png" alt="SDGs logo" layout="fixed" width={44} height={44} />DSs
                </h1>
                <div className={styles.grid}>
                    <div className={styles.module}>
                        <h3 className={styles.subTitle}>Texto</h3>
                        <TextAudioQuestion
                            styles={styles}
                            caption={'Texto'}
                            answer={texto}
                            handleAnswer={(value) => {
                                setTexto(value);
                                setTextoMuyCorto(false);
                            }}
                            limit={600}
                        />
                        {showBotonTraducir()}
                    </div>
                    <div className={styles.module}>
                        <h3 className={styles.subTitle}>Traducción</h3>
                        {showTraduccion()}

                    </div>
                    <div style={{ width: "100%" }}>
                        <div className={styles.moduleDetails}>
                            {showDetalleResultados()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getStaticProps() {

    let objetivos = await prisma.Objetivos.findMany();
    let metas = await prisma.Metas.findMany();

    return { props: { objetivos, metas } };
}