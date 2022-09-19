import { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Participar.module.css';

export default function Participar() {
    const [nombre, setNombre] = useState('');

    function handleInputChange(e) {
        setNombre(e.target.value);
    }

    function showButton() {
        if (nombre.length > 2) {
            return (
                <Link href={`/participar/${nombre}`}><button className={styles.button_start} role="button">Empezar</button></Link>
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
            <Link href="/"><button className={styles.button_return} role="button">&#10140;</button></Link>
            <div className={styles.logo}>
                ODS-IA
            </div>
            <div className={styles.main}>
                <h1 className={styles.title}>Participar &#9995;</h1>
                <p className={styles.description}>Responde 6 preguntas que te permitirán saber que ODSs son los mas cercanos a tus necesidades y preocupaciones. No te demoraras más de 10 minutos y nos ayudarás a comprender el territorio de manera colectiva.</p>
                <p className={styles.question}>¡Para empezar cuéntanos como te llamas!</p>
                <div className={styles.item}>
                    <div className={styles.form__group}>
                        <input type="input" className={styles.form__field} placeholder="Name" name="name" maxLength="20" value={nombre} onChange={handleInputChange} required />
                        <label htmlFor="name" className={styles.form__label}>Nombre</label>
                    </div>
                </div>
                {showButton()}
            </div>
        </div>

    );
}
