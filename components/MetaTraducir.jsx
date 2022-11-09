import styles from '../styles/Traducir.module.css';
import Image from 'next/image';

import { useState } from 'react';

export default function MetaTraducir({ meta, sim, item, key, idTraduccion, refresh }) {

    const [estadoRetro, setEstadoRetro] = useState(0); // 0: no retro, 1: enviando, 2: enviado, 3: error

    function enviarRetro(retro) {
        setEstadoRetro(1);
        fetch('/api/traductorRetro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                traduccionId: idTraduccion,
                retroalimentacion: retro,
                metaId: `${item.goal}.${item.target}`
            }),
        }).then((response) => {
            if (response.ok) {
                item.retroalimentacion = retro;
                setEstadoRetro(2)
            } else {
                setEstadoRetro(3)
            }
        }).catch((error) => {
            setEstadoRetro(3)
        }).finally(() => {
            setTimeout(() => {
                setEstadoRetro(0);
            }, 1800);
        });
    }

    function botonRetro() {
        if (idTraduccion) {
            if (estadoRetro === 0) {
                let buttonL = <button className={`${styles.buttonRetro} ${styles.buttonRetroL}`} onClick={() => {
                    enviarRetro(true);
                }}>&#128077;</button>
                let buttonR = <button className={`${styles.buttonRetro} ${styles.buttonRetroR}`} onClick={() => {
                    enviarRetro(false);
                }}>&#128078;</button>

                if (item.retroalimentacion === true) {
                    buttonL = <button className={`${styles.buttonRetro} ${styles.buttonRetroL}`} onClick={() => {
                        enviarRetro(true);
                    }} disabled>&#128077;</button>
                }
                else if (item.retroalimentacion === false) {
                    buttonR = <button className={`${styles.buttonRetro} ${styles.buttonRetroR}`} onClick={() => {
                        enviarRetro(false);
                    }} disabled>&#128078;</button>
                }
                return (
                    <div className={styles.retroalimentacion}>
                        {buttonL}
                        {buttonR}
                    </div>
                );
            } else if (estadoRetro === 1) {
                return (
                    <div className={styles.retroalimentacion}>
                        Enviando &#128228;
                    </div>
                );
            } else if (estadoRetro === 2) {
                return (
                    <div className={styles.retroalimentacion}>
                        Enviado &#9989;
                    </div>
                );
            } else if (estadoRetro === 3) {
                return (
                    <div className={styles.retroalimentacion}>
                        Error &#10060;
                    </div>
                );
            }
        }
    }

    return (
        <div key={key} className={styles.contMeta}>
            <span>
                <strong>{`${item.goal}.${item.target.length > 1 ? item.target : item.target + ' '}`}</strong>&nbsp;&nbsp;{sim.toFixed(1)}%&nbsp;
            </span>
            <span className={styles.detalleBar} style={{ width: `calc(calc(100% - 10.5rem)*${sim / 100})` }}>

            </span>
            <br />
            <div className={styles.containerMeta}>
                <div className={styles.imgMeta}>
                    <Image src={`/targets/TARGET_${item.goal}_${item.target.toUpperCase()}.svg`} layout="fill" objectFit="cover" objectPosition="left bottom" alt={`Logo de la Meta de Desarrollo Sostenible numero ${item.goal}.${item.target}`} />
                </div>
                <div className={styles.descripcionMeta}>
                    {meta ? meta.descripcion : ''}
                </div>
                {botonRetro()}
                <span className={styles.tooltiptext}>
                    <p>¿Te parece que el objetivo {`${item.goal}.${item.target}`} es una buena traducción?</p>
                </span>
            </div>

        </div>
    );
};