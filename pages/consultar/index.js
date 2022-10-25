import { useState, useId } from 'react';
import prisma from '../../lib/prisma';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import DoubleQuestion from '../../components/DoubleQuestion';
import styles from '../../styles/Consultar.module.css';
import LogosHeader from '../../components/LogosHeader';

export default function Consultar({ municipios, departamentos }) {
    const [departamento, setDepartamento] = useState(undefined);
    const [municipio, setMunicipio] = useState(undefined);

    function changeDepartamento(value) {
        setDepartamento(value);
        setMunicipio(undefined);
    }

    function changeMunicipio(value) {
        setMunicipio(value);
    }

    function showButton() {
        if (municipio) {
            return (
                <Link href={`/${municipio.value}/`}><button className={styles.buttonStart} role="button">Consultar</button></Link>
            );
        }
    }

    let opciones = departamento ? municipios.filter(municipio => municipio.departamento === departamento.value) : [];
    return (
        <div className={styles.container}>
            <Head>
                <title>ODS-IA consultar</title>
                <meta name="description" content="Consulta en ODS-IA los ODSs más relevantes para las personas de tu ciudad o municipio." />
                <meta name="keywords" content="IA, Objetivos de Desarrollo Sostenibles, UNFPA, Colombia, consulta"></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Link href="/"><button className={styles.buttonReturn} role="button">&#10140;</button></Link>

            <LogosHeader />

            <div className={styles.main}>
                <h1 className={styles.title}>Consultar resultados &#x1F50E;</h1>
                <p className={styles.description}>Puedes consultar los ODSs mas relevantes para las personas de tu ciudad y municipio, o de cualquier region del país que selecciones.</p>
                <DoubleQuestion
                    question="¡Cuéntanos que region quieres consultar!"
                    options={departamentos}
                    caption="Departamento"
                    answer={departamento}
                    handleAnswer={changeDepartamento}
                    options1={opciones}
                    caption1="Municipio"
                    answer1={municipio}
                    handleAnswer1={changeMunicipio}
                    styles={styles}
                />
                {showButton()}
            </div>
        </div>

    );
}

export async function getStaticProps() {

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

    return { props: { municipios, departamentos } };
}