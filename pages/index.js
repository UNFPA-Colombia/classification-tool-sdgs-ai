import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import LogosHeader from '../components/LogosHeader'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ODS-IA</title>
        <meta name="description" content="Usando inteligencia artificial, esta herramienta permite clasificar los Objetivos de Desarrollo Sostenibles de acuerdo a su relevancia en el territorio." />
        <meta name="keywords" content="IA, Objetivos de Desarrollo Sostenibles, UNFPA, Colombia"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LogosHeader />

      <main className={styles.main}>
        <h1 className={styles.title}>
          ¡Bienvenido a <strong>
            <nobr >
              <Image src="/SDG_logo.png" alt="SDGs logo" layout="fixed" width={52} height={52} />DS-IA
            </nobr>
          </strong> del <a href="https://colombia.unfpa.org" target="_blank" rel="noopener noreferrer">UNFPA!</a>
        </h1>

        <p className={styles.description}>
          Usando inteligencia artificial, esta herramienta permite clasificar los Objetivos de Desarrollo Sostenibles (ODSs) de acuerdo a su relevancia en el territorio.
        </p>

        <div className={styles.grid}>

          <Link href="/traducir">
            <a className={styles.card}>
              <h2>Traducir &#128221;</h2>
              <p>Traduce simultáneamente un texto para encontrar los ODS más relacionados con él.</p>
            </a>
          </Link>

          <Link href="/participar">
            <a className={styles.card}>
              <h2>Participar &#9995;</h2>
              <p>Responde algunas preguntas que nos permiten encontrar los ODSs mas relevantes para ti.</p>
            </a>
          </Link>

          <Link href="/consultar/encuesta">
            <a className={styles.card}>
              <h2>Resultados &#x1F50E;</h2>
              <p>Consulta los ODSs más relevantes para las personas de tu ciudad o municipio.</p>
            </a>
          </Link>

          <Link href="/documentos">
            <a className={styles.card}>
              <h2>Documentos &#128196;</h2>
              <p>
                Encuentra los Objetivos de Desarrollo Sostenible que aparecen en un Plan de Ordenamiento Territorial.
              </p>
            </a>
          </Link>

          <Link href="/conocer">
            <a className={styles.card}>
              <h2>Conocer más &#x1F4DA;</h2>
              <p>
                Conoce más de esta iniciativa y sobre que son los Objetivos de Desarrollo Sostenibles.
              </p>
            </a>
          </Link>
        </div>

      </main>
      <footer className={styles.footer}>
        <a
          href="https://github.com/amartinez1224"
          target="_blank"
          rel="noopener noreferrer"
        >
          Andrés Martínez{' '}
          <span className={styles.logo}>
            <Image src="/github.png" alt="GitHub logo" width={16} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
