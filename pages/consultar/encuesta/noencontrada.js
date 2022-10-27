import { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import styles from '../../../styles/Consultar.module.css';
import LogosHeader from '../../../components/LogosHeader';

export default function ConsultarEncuesta() {
    const [codigo, setCodigo] = useState('');

    function handleInputChange(e) {
        setCodigo(e.target.value);
    }

    function showButton() {
        if (codigo.length === 25) {
            return (
                <Link href={`/consultar/encuesta/${codigo}`}><button className={styles.buttonStart} role="button">Consultar</button></Link>
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

            <Link href="/"><button className={styles.buttonReturn} role="button">&#10140;</button></Link>

            <LogosHeader />

            <div className={styles.main}>
                <h1 className={styles.title}>Encuesta no encontrada &#128533;</h1>
                <p className={styles.description}>Parece que la encuesta que estas buscando no existe. Intenta ingresar el código único (CU) nuevamente.</p>
                <div className={styles.item}>
                    <div className={styles.formGroup}>
                        <input type="input" className={styles.formField} placeholder="Name" name="codigoEncuesta" maxLength="25" minLength="25" value={codigo} onChange={handleInputChange} required />
                        <label htmlFor="codigoEncuesta" className={styles.formLabel}>Código</label>
                    </div>
                </div>
                {showButton()}
            </div>
        </div>
    );
}