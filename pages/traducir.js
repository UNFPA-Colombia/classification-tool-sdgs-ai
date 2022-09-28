import { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import TextAudioQuestion from '../components/TextAudioQuestion';
import Loading from '../components/Loading';
import styles from '../styles/Traducir.module.css';

export default function Traducir() {

    const [texto, setTexto] = useState('');
    const [estadoTraduccion, setEstadoTraduccion] = useState(0); // 0: not posted, 1: posting, 2: posted 3: error
    const [resultadoTraduccion, setResultadoTraduccion] = useState([]);

    function traducirTexto() {
        setEstadoTraduccion(1);
        fetch('/api/traductor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: texto }),
        }).then((response) => {
            if (response.ok) {
                setEstadoTraduccion(2);
                return response.json()
                    .then((data) => {
                        console.log(data);
                        setResultadoTraduccion(data);
                    });
            } else {
                setEstadoTraduccion(3);
            }
        })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function showTraduccion() {
        if (estadoTraduccion === 0) {
            return (
                <div className={styles.traduccion}>
                    <p>Traducción</p>
                    <p>Presiona el botón para traducir el texto</p>
                </div>
            );
        } else if (estadoTraduccion === 1) {
            return (
                <div className={styles.traduciendo}>
                    <div className={styles.logoTraduciendo}>
                        <Loading />
                    </div>
                    <p>Traduciendo...</p>
                </div>
            );
        } else if (estadoTraduccion === 2) {
            return (
                <div className={styles.traduccion}>
                    <p>Traducción</p>
                    {resultadoTraduccion.map((item, index) => {
                        return <div key={index}>
                            <p>Traduccion</p>
                        </div>;
                    })}
                </div>
            );
        } else if (estadoTraduccion === 3) {
            return (
                <div className={styles.traduccion}>
                    <p>Traducción</p>
                    <p>Ha ocurrido un error</p>
                </div>
            );
        }
    }

    function showBotonTraducir() {
        if (estadoTraduccion === 0 || estadoTraduccion === 2 || estadoTraduccion === 3) {
            return (
                <button className={styles.traducirButton} role="button" onClick={traducirTexto}>&#10003; Traducir</button>
            );
        } else if (estadoTraduccion === 1) {
            return (
                <button className={styles.traducirButton} role="button" onClick={traducirTexto} disabled>&#10003; Traducir</button>
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
            <div className={styles.logo}>
                <span >
                    <Image src="/SDG_logo.png" alt="SDGs logo" layout="fixed" width={10} height={10} />
                </span> DS-IA
            </div>
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
                            handleAnswer={setTexto}
                            limit={600}
                        />
                        {showBotonTraducir()}
                    </div>
                    <div className={styles.module}>
                        <h3 className={styles.subTitle}>Traducción</h3>
                        {showTraduccion()}
                    </div>
                </div>
            </div>
        </div>
    );
}