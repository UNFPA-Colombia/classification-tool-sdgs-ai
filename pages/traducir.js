import { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import TextAudioQuestion from '../components/TextAudioQuestion';
import styles from '../styles/Traducir.module.css';

export default function Traducir() {

    const [texto, setTexto] = useState('');

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
                    </div>
                    <div className={styles.module}>
                        <h3 className={styles.subTitle}>Traducción</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}