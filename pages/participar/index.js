import { useState } from 'react';

import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Participar.module.css'

export default function Participar() {
    const [nombre, setNombre] = useState('');

    const [departamento, setDepartamento] = useState(undefined);
    const [municipio, setMunicipio] = useState(undefined);
    const [edad, setEdad] = useState(undefined);
    const [genero, setGenero] = useState(undefined);
    const [barrio, setBarrio] = useState(undefined);
    const [zonas, setZonas] = useState(undefined);

    const [pregunta, setPregunta] = useState(1);

    function mostrarPregunta() {
        if (pregunta === 1) {
            return (
                <div className={styles.grid}>
                    <div className={styles.item}>
                        <label className={styles.label} for="departamentos"><strong>¿En qué departamento vives?</strong></label><br />
                        <select name="departamentos">
                            <option value="volvo">Volvo</option>
                            <option value="saab">Saab</option>
                            <option value="mercedes">Mercedes</option>
                            <option value="audi">Audi</option>
                        </select>
                    </div>
                    <input type="submit" value="Continuar" />
                </div>
            );
        }
        return (
            <div className={styles.grid}>
                <div className={styles.item}>
                    <label for="departamentos">Departamento</label><br />
                    <select name="departamentos">
                        <option value="volvo">Volvo</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>
                </div>
                <div className={styles.item}>
                    <label for="municipios">Municipio/Ciudad</label><br />
                    <select name="municipios">
                        <option value="volvo">Volvo</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>
                </div>
                <input type="submit" value="Continuar" />
            </div>
        );
    }

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
                <title>Participar</title>
                <meta name="description" content="Participa en ODS_IA y ayúdanos a comprender el territorio de manera colectiva." />
                <meta name="keywords" content="IA, Objetivos de Desarrollo Sostenibles, UNFPA, Colombia"></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <div className={styles.main}>
                <h1 className={styles.title}>Participar &#9995;</h1>
                <p className={styles.description}>Responde 6 preguntas que te permitirán saber que ODSs son los mas cercanos a tus necesidades y preocupaciones. No te demoraras más de 10 minutos y nos ayudarás a comprender el territorio de manera colectiva.</p>
                <p className={styles.question}>¡Para empezar cuéntanos como te llamas!</p>
                <div className={styles.item}>
                    <div className={styles.form__group}>
                        <input type="input" className={styles.form__field} placeholder="Name" name="name" maxlength="20" value={nombre} onChange={handleInputChange} required />
                        <label for="name" className={styles.form__label}>Nombre</label>
                    </div>
                </div>
                {showButton()}
                <Link href="/"><button className={styles.button_start} role="button">Regresar</button></Link>
            </div>
        </div>

    );
}
