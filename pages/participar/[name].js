import { useRouter } from 'next/router'
import { useState } from 'react';
import municipiosJson from '../../json/municipios.json';
import departamentosJson from '../../json/departamentos.json';

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../styles/Participar.module.css'
import DoubleQuestion from '../../components/DoubleQuestion';
import Question from '../../components/Question';
import TextAudioQuestion from '../../components/TextAudioQuestion';

export default function Preguntas() {
    const router = useRouter();
    const { name } = router.query;

    const [departamento, setDepartamento] = useState(undefined);
    const [municipio, setMunicipio] = useState(undefined);
    const [edad, setEdad] = useState('');
    const [genero, setGenero] = useState(undefined);
    const [zona, setZona] = useState(undefined);

    const preguntas = [
        { pregunta: "¿Qué es lo que mas te gusta de MUNICIPIO?", pista: "Lo que má me gusta de MUNICIPIO es..." },
        { pregunta: "¿Cual crees que es el principal problema de MUNICIPIO?", pista: "El principal problema de MUNICIPIO es..." },
        { pregunta: "¿Cómo sueñas MUNICIPIO en el año 2050?", pista: "En el año 2050 MUNICIPIO será..." },
        { pregunta: "¿Como lograrías que MUNICIPIO sea un lugar mejor para vivir?", pista: "Para que MUNICIPIO sea un lugar mejor para vivir..." },
    ];

    const [respuestas, setRespuestas] = useState(Array(preguntas.length).fill(''));

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

    function nextQuestion() {
        setQuestion(question + 1);
    }

    function prevQuestion() {
        setQuestion(question - 1);
    }

    function showButtonNext() {
        const next = <button className={styles.buttonNextQuestion} role="button" onClick={nextQuestion}>&#10140;</button>;
        const nextD = <button className={styles.buttonNextQuestion} role="button" onClick={nextQuestion} disabled>&#10140;</button>;
        switch (question) {
            case 1:
                if (genero) {
                    return next;
                }
                return nextD;
            case 2:
                if (edad && edad > 5 && edad < 100) {
                    return next;
                }
                return nextD;
            case 3:
                if (municipio) {
                    return next;
                }
                return nextD;
            case 4:
                if (zona) {
                    return next;
                }
                return nextD;
            case maxQuestions + 1:
                return (
                    <button className={styles.buttonNextQuestion} role="button" onClick={nextQuestion}>&#10003;</button>
                );
            case maxQuestions + preguntas.length + 2:
                return (
                    <Link href="/"><button className={styles.buttonNextQuestion} role="button" >&#10003; Enviar</button></Link>
                );
            default:
                if (question < maxQuestions + preguntas.length + 2 && respuestas[question - (maxQuestions + 2)].length > 10) {
                    return next;
                }
                return nextD;
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
                ];
                return <Question
                    question="¿Con cual genero te identificas?"
                    options={options}
                    caption="Genero"
                    answer={genero}
                    handleAnswer={(value) => { setGenero(value) }}
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
                            onChange={(value) => { setEdad(value.target.value) }}
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
                    handleAnswer={(value) => {
                        setDepartamento(value);
                        setMunicipio(undefined);
                    }}
                    options1={options}
                    caption1="Municipio"
                    answer1={municipio}
                    handleAnswer1={(value) => { setMunicipio(value) }}
                    styles={styles}
                />;
            }
            case 4:
                const options = [
                    { value: 'Rural', label: 'Rural' },
                    { value: 'Urbana', label: 'Urbana' }
                ];
                return <Question
                    question="¿En que tipo de zona vives?"
                    options={options}
                    caption="Zona"
                    answer={zona}
                    handleAnswer={(value) => { setZona(value) }}
                    styles={styles}
                />;
            default:
                return <></>;
        }
    }

    function showQuestionText() {
        const pregunta = preguntas[question - (maxQuestions + 2)].pregunta.replace('MUNICIPIO', municipio.label)
        const pista = preguntas[question - (maxQuestions + 2)].pista.replace('MUNICIPIO', municipio.label)
        return (<>
            <p className={styles.question}>{pregunta}</p>
            <TextAudioQuestion
                styles={styles}
                caption={pista}
                answer={respuestas[question - (maxQuestions + 2)]}
                handleAnswer={(value) => {
                    const newRespuestas = [...respuestas];
                    newRespuestas[question - (maxQuestions + 2)] = value;
                    setRespuestas(newRespuestas);
                }}
                limit={600}
            />
        </>);
    }

    function showQuestionSummary() {
        const summary = [];
        for (let i = 0; i < preguntas.length; i++) {
            summary.push(<>
                <p><strong>{preguntas[i].pregunta.replace('MUNICIPIO', municipio.label)}</strong> <br />{respuestas[i]}</p>
            </>);
        }
        return summary;
    }

    function showSection() {
        if (question <= maxQuestions) {
            return (<>
                <h1 className={styles.subTitle}><strong>{name}</strong> cuéntanos un poco mas de ti...</h1>
                <p className={styles.description}>No compartiremos esta información con nadie y solo la usaremos para clasificar tus respuestas. No guardaremos tu nombre.</p>
                {showQuestion()}
                <div className={styles.select}>
                    {showButtonBack()}
                    {showButtonNext()}
                </div>
                <p className={styles.questionCount}>{`${question}/${maxQuestions + preguntas.length}`}</p>
            </>);
        }
        else if (question === maxQuestions + 1) {
            return (<>
                <h1 className={styles.subTitle}>¿Hasta ahora es correcta esta información <strong>{name}</strong>?</h1>
                <p className={styles.description}>Si hay algún error puedes regresar y corregirlo.</p>
                <div className={styles.summary}>
                    <p><strong>Genero:</strong> {genero ? genero.label : ''}</p>
                    <p><strong>Edad:</strong> {edad}</p>
                    <p><strong>Departamento:</strong> {departamento ? departamento.label : ''}</p>
                    <p><strong>Municipio:</strong> {municipio ? municipio.label : ''}</p>
                    <p><strong>Zona:</strong> {zona ? zona.label : ''}</p>
                </div>
                <div className={styles.select}>
                    {showButtonBack()}
                    {showButtonNext()}
                </div>
            </>);
        }
        else if (question <= maxQuestions + preguntas.length + 1) {
            return (<>
                <h1 className={styles.subTitle}><strong>{name}</strong> cuéntanos sobre tus experiencias, preocupaciones y expectativas...</h1>
                {showQuestionText()}
                <div className={styles.select}>
                    {showButtonBack()}
                    {showButtonNext()}
                </div>
                <p className={styles.questionCount}>{`${question - 1}/${maxQuestions + preguntas.length}`}</p>
            </>);
        }
        else if (question == maxQuestions + preguntas.length + 2) {
            return (<>
                <h1 className={styles.subTitle}>¡Revisa tus respuestas <strong>{name}</strong>!</h1>
                <p className={styles.description}>Si hay algún error puedes regresar y corregirlo.</p>
                <div className={styles.summary}>
                    {showQuestionSummary()}
                </div>
                <div className={styles.select}>
                    {showButtonBack()}
                    {showButtonNext()}
                </div>
            </>);
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
                <span >
                    <Image src="/SDG_logo.png" alt="SDGs logo" layout="fixed" width={10} height={10} />
                </span> DS-IA
            </div>
            <div className={styles.main}>
                {showSection()}
            </div>
        </div>
    );
}

