import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Documentos.module.css'
import LogosHeader from '../../components/LogosHeader'
import Resultados from '../../components/Documentos/Resultados'
import { FileUploader } from "react-drag-drop-files";

import { useState } from 'react'
import { timeout } from 'd3'

const fileTypes = ["PDF"];

export default function Documentos() {

	const [files, setFiles] = useState([]);
	const [status, setStatus] = useState(0); // 0: no files, 1: uploading, 2: uploaded 3: error size, 4: error type, 5: error
	const [statusFake, setStatusFake] = useState(0); // 0: Subiendo, 1: Procesando, 2: Obteniendo datos generales, 3: Generando el modelo, 4: Obteniendo resultados, 5: Procesando resultados
	const [data, setData] = useState({});

	const handleChange = (newFiles) => {
		setFiles([...files, ...Array.from(newFiles)]);
	};

	const handleSubmission = () => {
		setStatus(0);
		if (files.length > 0) {
			
			setStatus(1);
			setStatusFake(0);
			setTimeout(() => {
				setStatusFake(1);
				setTimeout(() => {
					setStatusFake(2);
					setTimeout(() => {
						setStatusFake(3);
						setTimeout(() => {
							setStatusFake(4);
							setTimeout(() => {
								setStatusFake(5);
							}, 30000);
						}, 60000);
					}, 30000);
				}, 20000);
			}, 10000);


			const data = new FormData();

			for (const file of files) {
				data.append('files', file, file.name);
			}

			fetch('/api/documentos', {
				method: 'POST',
				body: data,
			})
				.then((response) => response.json())
				.then((result) => {
					//console.log('result:', result)
					if(result["error"]){
						setStatus(5);
					}
					else{
						setStatus(2);
						setData(result);
					}
				})
				.catch((error) => {
					if (error === "Error: Wrong type") {
						setStatus(4);
					}
					else if (error === "Error: File too large") {
						setStatus(3);
					}
					else {
						setStatus(5);
						console.error(error);
					}
				});
		}
	};

	function showDocumentos() {
		if (files.length > 0) {
			return (
				<ul>
					{files.map((f, index) => <>
						<li className={styles.archivo} key={index}>{f.name} &nbsp;&nbsp;
							<button onClick={() => {
								setFiles(files.filter((_, i) => i !== index))
							}} className={styles.buttonRemove} role="button">&#10060;</button>
						</li>
					</>)}
				</ul>
			);
		}
	}

	function showStatus() {
		if (statusFake === 0) {
			return <p className={styles.status}>Subiendo... esto puede tardar hasta 30 segundos</p>
		}
		else if (statusFake === 1) {
			return <p className={styles.status}>Procesando... esto puede tardar hasta 1 minuto</p>
		}
		else if (statusFake === 2) {
			return <p className={styles.status}>Obteniendo datos generales... esto puede tardar hasta 2 minutos</p>
		}
		else if (statusFake === 3) {
			return <p className={styles.status}>Generando el modelo... esto puede tardar hasta 1 minuto</p>
		}
		else if (statusFake === 4) {
			return <p className={styles.status}>Obteniendo resultados... esto puede tardar hasta 1 minuto</p>
		}
		else if (statusFake === 5) {
			return <p className={styles.status}>Procesando resultados... esto puede tardar hasta 3 minutos</p>
		}
	}

	console.log(status, statusFake)
	return (
		<div className={styles.container}>
			<Head>
				<title>Documentos</title>
				<meta name="description" content="Usando inteligencia artificial, esta herramienta permite extraer los temas relevantes de un documento." />
				<meta name="keywords" content="IA, Objetivos de Desarrollo Sostenibles, UNFPA, Colombia"></meta>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Link href="/"><button className={styles.buttonReturn} role="button">&#10140;</button></Link>

			<LogosHeader />

			<main className={styles.main}>
				<h1 className={styles.title}>Documentos &#128196;</h1>
				<p className={styles.description}>Puedes obtener los temas de un documento y su relación con los Objetivos de Desarrollo Sostenible.</p>
				<p className={styles.question}>¡Para empezar sube uno o varios documentos en formato PDF!</p>

				<div className={styles.documentos}  style={{textAlign:"center"}}>
					<FileUploader
						handleChange={handleChange}
						onDraggingStateChange={(f) => { 
							//console.log("dragging", f) 
						}}
						onTypeError={(f) => { 
							//console.log("type error", f) 
						}}
						onSizeError={(f) => { 
							//console.log("size error", f)
						}}
						name="files"
						types={fileTypes}
						multiple={true}
						maxSize={6}
					>
						<div className={styles.cajaArchivos}>
							{files.length > 0 ? <p>Quieres agregar más? Arrástralos o <u>haz click aquí</u></p> : <p>Arrastra los documentos o <u>haz click aquí</u></p>}
						</div>
					</FileUploader>
					{showDocumentos()}
				</div>
				{files.length > 0 && status !== 1 && <button onClick={handleSubmission} className={styles.buttonStart} role="button">Empezar</button>}
				{status === 1 && showStatus()}
				{status === 2 && <p className={styles.status}>¡Listo! Puedes ver los resultados en la sección de abajo</p>}
				{status === 3 && <p className={styles.status}>Error: El archivo es demasiado grande</p>}
				{status === 4 && <p className={styles.status}>Error: El archivo no es PDF</p>}
				{status === 5 && <p className={styles.status}>Error: Ocurrió un error inesperado</p>}
			</main>
			{status === 2 && <Resultados data={data} />}
		</div>
	)
}