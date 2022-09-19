import { useRouter } from 'next/router'
import { useState } from 'react';
import municipiosJson from '../../json/municipios.json';
import departamentosJson from '../../json/departamentos.json';

import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Participar.module.css'
import DoubleQuestion from '../../components/DoubleQuestion';
import Question from '../../components/Question';

export default function Preguntas() {
    const router = useRouter();
    const { name } = router.query;

    const [departamento, setDepartamento] = useState(undefined);
    const [municipio, setMunicipio] = useState(undefined);
    const [edad, setEdad] = useState('');
    const [genero, setGenero] = useState(undefined);
    const [zona, setZona] = useState(undefined);

    const [question, setQuestion] = useState(1);
    const maxQuestions = 4;

    const municipios = municipiosJson.map((municipio) => {
        return {
            label: municipio.nombre,
            value: municipio.divipola,
            departamento: municipio.divipola_departamento,
        };
    });
    const departamentos = departamentosJson.map((departamento) => {
        return {
            label: departamento.nombre,
            value: departamento.divipola,
            departamento: departamento.divipola.substring(0, 2),
        };
    });

    function changeDepartamento(value) {
        setDepartamento(value);
        setMunicipio(undefined);
    }

    function changeMunicipio(value) {
        setMunicipio(value);
    }

    function changeGenero(value) {
        setGenero(value);
    }

    function changeEdad(value) {
        setEdad(value.target.value);
    }

    function changeZona(value) {
        setZona(value);
    }

    function nextQuestion() {
        setQuestion(question + 1);
    }

    function prevQuestion() {
        setQuestion(question - 1);
    }

    function showButtonNext() {
        if (question < maxQuestions) {
            return (
                <button className={styles.buttonNextQuestion} role="button" onClick={nextQuestion}>&#10140;</button>
            );
        } 
    }

    function showButtonBack() {
        if (question > 1) {
            return (
                <button className={styles.buttonPrevQuestion} role="button" onClick={prevQuestion}>&#10140;</button>
            );
        } 
    }

    function showQuestion() {
        switch (question) {
            case 1: {
                const options = [
                    { value: 'Hombre', label: 'Hombre' },
                    { value: 'Mujer', label: 'Mujer' },
                    { value: 'Otro', label: 'Otro' }
                ]
                return <Question
                    question="¿Con cual genero te identificas?"
                    options={options}
                    caption="Genero"
                    answer={genero}
                    handleAnswer={changeGenero}
                    styles={styles}
                />;
            }
            case 2:
                return <>
                    <p className={styles.question}>¿Cuantos años tienes?</p>
                    <div className={styles.select}>
                        <input
                            className={styles.inputNumber}
                            type="number"
                            value={edad}
                            placeholder="Edad"
                            onChange={changeEdad}
                            min="5"
                            max="100"
                        />
                    </div>
                </>;
            case 3: {
                const options = departamento ? municipios.filter(municipio => municipio.departamento === departamento.departamento) : [];
                return <DoubleQuestion
                    question="¿Donde vives?"
                    options={departamentos}
                    caption="Departamento"
                    answer={departamento}
                    handleAnswer={changeDepartamento}
                    options1={options}
                    caption1="Municipio"
                    answer1={municipio}
                    handleAnswer1={changeMunicipio}
                    styles={styles}
                />;
            }
            case 4:
                const options = [
                    { value: 'Rural', label: 'Rural' },
                    { value: 'Urbana', label: 'Urbana' }
                ]
                return <Question
                    question="¿En que tipo de zona vives?"
                    options={options}
                    caption="Zona"
                    answer={zona}
                    handleAnswer={changeZona}
                    styles={styles}
                />;;
            default:
                return <></>;
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>ODS-IA: {name}</title>
                <meta name="description" content="Participa en ODS-IA y ayúdanos a comprender el territorio de manera colectiva." />
                <meta name="keywords" content="IA, Objetivos de Desarrollo Sostenibles, UNFPA, Colombia"></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Link href="/participar"><button className={styles.buttonReturn} role="button">&#10140;</button></Link>
            <div className={styles.logo}>
                ODS-IA
            </div>
            <div className={styles.main}>
                <h1 className={styles.subTitle}><strong>{name}</strong> cuéntanos un poco mas de ti...</h1>
                <p className={styles.description}>No compartiremos esta información con nadie y solo la usaremos para clasificar tus respuestas. No guardaremos tu nombre.</p>
                {showQuestion()}
                <div className={styles.select}>
                    {showButtonBack()}
                    {showButtonNext()}
                </div>
                <p className={styles.questionCount}>{`${question}/${maxQuestions}`}</p>
            </div>
        </div>
    );
}

