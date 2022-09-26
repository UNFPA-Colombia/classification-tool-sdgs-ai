import { useRouter } from 'next/router'
import { useState } from 'react';
import prisma from '../../lib/prisma';

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../styles/Participar.module.css'
import DoubleQuestion from '../../components/DoubleQuestion';
import Question from '../../components/Question';
import TextAudioQuestion from '../../components/TextAudioQuestion';

export default function Preguntas({ municipios, departamentos, preguntas }) {
    const router = useRouter();
    const { grupo } = router.query;

    const [departamento, setDepartamento] = useState(undefined);
    const [municipio, setMunicipio] = useState(undefined);
    const [edad, setEdad] = useState('');
    const [genero, setGenero] = useState(undefined);
    const [zona, setZona] = useState(undefined);

    const [respuestas, setRespuestas] = useState(Array(preguntas.length).fill(''));

    const [question, setQuestion] = useState(1);
    const maxQuestions = 4;

    const [posting, setPosting] = useState(0); // 0: not posted, 1: posting, 2: posted 3: error

    function nextQuestion() {
        setQuestion(question + 1);
    }

    function prevQuestion() {
        setQuestion(question - 1);
    }

    function postAnswers() {
        const reqBody = {
            grupo: grupo,
            departamento: departamento.value,
            municipio: municipio.value,
            edad: edad,
            genero: genero.value,
            zona: zona.value,
            respuestas: respuestas,
        };

        setPosting(1);
        fetch('/api/procesamiento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody),
        }).then((response) => {
            if (response.ok) {
                setPosting(2);
                return response.json();
            } else {
                setPosting(3);
            }
        })
            .then((data) => {
                console.log('Success:', data, data.status);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
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
                if (edad && edad > 1899 && edad < 2031) {
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
                    <button className={styles.buttonNextQuestion} role="button" onClick={postAnswers}>&#10003; Enviar</button>
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
                    { value: 'H', label: 'Hombre' },
                    { value: 'M', label: 'Mujer' },
                    { value: 'O', label: 'Otro' }
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
                    <p className={styles.question}>¿En qué año naciste?</p>
                    <div className={styles.select}>
                        <input
                            className={styles.inputNumber}
                            type="number"
                            value={edad}
                            placeholder="Año"
                            onChange={(value) => { setEdad(value.target.value) }}
                            min="1900"
                            max="2030"
                        />
                    </div>
                </>;
            case 3: {
                const options = departamento ? municipios.filter(municipio => municipio.departamento === departamento.value) : [];
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
                    { value: 'R', label: 'Rural' },
                    { value: 'U', label: 'Urbana' }
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
        const pregunta = preguntas[question - (maxQuestions + 2)].pregunta.replace('MUNICIPIO', municipio.label).replace('DEPARTAMENTO', departamento.label)
        const pista = preguntas[question - (maxQuestions + 2)].pista.replace('MUNICIPIO', municipio.label).replace('DEPARTAMENTO', departamento.label)
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
                <p key={i}><strong>{preguntas[i].pregunta.replace('MUNICIPIO', municipio.label).replace('DEPARTAMENTO', departamento.label)}</strong> <br />{respuestas[i]}</p>
            </>);
        }
        return summary;
    }

    function showPosting() {
        switch (posting) {
            case 0:
                return (<>
                    {showButtonBack()}
                    {showButtonNext()}
                </>);
            case 1:
                return <p className={styles.posting}>Enviando...</p>;
            case 2:
                return <p className={styles.posting}>Enviado</p>;
            case 3:
                return <p className={styles.posting}>Error</p>;
            default:
                return <></>;
        }
    }

    function showSection() {
        if (question <= maxQuestions) {
            return (<>
                <h1 className={styles.subTitle}>Cuéntanos un poco mas de ti...</h1>
                <p className={styles.description}>No compartiremos esta información con nadie y solo la usaremos para clasificar tus respuestas.</p>
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
                <h1 className={styles.subTitle}>¿Hasta ahora es correcta esta información?</h1>
                <p className={styles.description}>Si hay algún error puedes regresar y corregirlo.</p>
                <div className={styles.summary}>
                    <p><strong>Genero:</strong> {genero ? genero.label : ''}</p>
                    <p><strong>Año de nacimiento:</strong> {edad}</p>
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
                <h1 className={styles.subTitle}>Cuéntanos sobre tus experiencias, preocupaciones y expectativas...</h1>
                {showQuestionText()}
                <div className={styles.select}>
                    {showButtonBack()}
                    {showButtonNext()}
                </div>
                <p className={styles.questionCount}>{`${question - 1}/${maxQuestions + preguntas.length}`}</p>
            </>);
        }
        else if (question === maxQuestions + preguntas.length + 2) {
            return (<>
                <h1 className={styles.subTitle}>¡Revisa tus respuestas!</h1>
                <p className={styles.description}>Si hay algún error puedes regresar y corregirlo.</p>
                <div className={styles.summary}>
                    {showQuestionSummary()}
                </div>
                <div className={styles.select}>
                    {showPosting()}
                </div>
            </>);
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>ODS-IA: participar</title>
                <meta name="description" content="Participa en ODS-IA y ayúdanos a comprender el territorio de manera colectiva." />
                <meta name="keywords" content="IA, Objetivos de Desarrollo Sostenibles, UNFPA, Colombia"></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {posting === 0 ? <Link href="/participar"><button className={styles.buttonReturn} role="button">&#10140;</button></Link> : <></>}
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

export async function getStaticPaths() {

    let grupos = await prisma.Grupos.findMany();
    grupos = grupos.map((grupo) => {
        return {
            params: {
                grupo: grupo.nombre
            }
        }
    });

    return {
        paths: grupos,
        fallback: 'blocking',
    }
}

export async function getStaticProps({ params }) {

    let grupo = await prisma.Grupos.findUnique({
        where:
            { nombre: params.grupo },
        include:
            { preguntasGrupos: { include: { pregunta: true } } },
    });

    if (!grupo) {
        return {
            redirect: { destination: '/participar/noexiste', permanent: false},
        }
    }

    if (!grupo.activo) {
        return {
            redirect: { destination: '/participar/inactivo', permanent: false},
        }
    }

    let preguntas = grupo.preguntasGrupos.map((preguntaGrupo) => {
        return preguntaGrupo.pregunta;
    });

    let municipios = await prisma.Municipios.findMany();
    municipios = municipios.map((municipio) => {
        return {
            label: municipio.nombre,
            value: municipio.divipola,
            departamento: municipio.departamentoDivipola,
        };
    });

    let departamentos = await prisma.Departamentos.findMany();
    departamentos = departamentos.map((departamento) => {
        return {
            label: departamento.nombre,
            value: departamento.divipola,
        };
    });

    return { props: { municipios, departamentos, preguntas } };

}