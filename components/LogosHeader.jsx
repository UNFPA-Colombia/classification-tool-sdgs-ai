import Image from 'next/image';
import styles from '../styles/LogosHeader.module.css'

export default function LogosHeader() {
    return (
        <div className={styles.logosHeader}>
        <div className={styles.logoODSIA}>
            <span><Image src="/SDG_logo.png" alt="SDGs logo" layout="fixed" width={10} height={10} /></span>DS-IA
        </div>
        <div className={styles.logoUNFPA}>
            <a className={styles.logoUNFPALight} href="https://colombia.unfpa.org" target="_blank" rel="noopener noreferrer"><Image src="/UNFPA_logo_light.png" alt="UNFPA logo" layout={'fill'} objectFit={'contain'} /></a>
            <a className={styles.logoUNFPADark} href="https://colombia.unfpa.org" target="_blank" rel="noopener noreferrer"><Image src="/UNFPA_logo_dark.png" alt="UNFPA logo" layout={'fill'} objectFit={'contain'} /></a>
        </div>
    </div>
    )
}