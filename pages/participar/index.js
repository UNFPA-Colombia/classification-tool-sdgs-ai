import { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Participar.module.css';
import LogosHeader from '../../components/LogosHeader';

export default function Participar() {
    const [codigo, setCodigo] = useState('');

    function handleInputChange(e) {
        setCodigo(e.target.value);
    }

    function showButton() {
        if (codigo.length > 0) {
            return (
                <Link href={`/participar/${codigo}`}><button className={styles.buttonStart} role="button">Empezar</button></Link>
            );
        } else {
            return (
                <Link href={`/participar/predeterminado`}><button className={styles.buttonStart} role="button">Empezar sin código</button></Link>
            );
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>ODS-IA participar</title>
                <meta name="description" content="Participa en ODS-IA y ayúdanos a comprender el territorio de manera colectiva." />
                <meta name="keywords" content="IA, Objetivos de Desarrollo Sostenibles, UNFPA, Colombia, participa"></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Link href="/"><button className={styles.buttonReturn} role="button">&#10140;</button></Link>

            <LogosHeader />

            <div className={styles.main}>
                <h1 className={styles.title}>Participar &#9995;</h1>
                <p className={styles.description}>Responde algunas preguntas que te permitirán saber que ODSs son los mas cercanos a tus necesidades y preocupaciones. No te demoraras más de 10 minutos y nos ayudarás a comprender el territorio de manera colectiva.</p>
                <p className={styles.question}>¡Para empezar cuéntanos si tienes un código de grupo!</p>
                <div className={styles.item}>
                    <div className={styles.formGroup}>
                        <input type="input" className={styles.formField} placeholder="Name" name="codigo" maxLength="20" value={codigo} onChange={handleInputChange} required />
                        <label htmlFor="name" className={styles.formLabel}>Código</label>
                    </div>
                </div>
                {showButton()}
            </div>
        </div>

    );
}
