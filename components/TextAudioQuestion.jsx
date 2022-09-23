import { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'


export default function Question({ answer, handleAnswer, caption, limit, styles }) {

    const {
        transcript,
        finalTranscript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
    } = useSpeechRecognition();

    useEffect(() => {
        if (finalTranscript !== '') {
            handleAnswer(`${answer} ${finalTranscript}`.substring(0, limit));
            resetTranscript();
        }
    }, [finalTranscript]);

    function textAudioMode() {
        if (listening) {
            return transcript ? `${answer} ${transcript}`.substring(0, limit) : answer;
        } else {
            return answer;
        }
    }

    function showAudioControls() {
        if (browserSupportsSpeechRecognition) {
            if (isMicrophoneAvailable) {
                if (listening) {
                    return <button className={styles.listenButton} onClick={SpeechRecognition.stopListening}>&#10006; &#127908;</button>;
                } else {
                    return <button className={styles.listenButton}
                    onClick={() => {
                        SpeechRecognition.startListening({ language: 'es-CO' })
                    }}>&#127908; Audio</button>;
                }
            } else {
                return <span className={styles.noAudioAlert}>Para usar la opción de audio debes dar permiso para usar el micrófono.</span>;
            }
        }
    }

    return (<>
        <textarea
            className={styles.textResponse}
            placeholder={caption}
            value={textAudioMode()}
            onChange={(value) => { handleAnswer(value.target.value.substring(0, limit)) }}
            maxLength={limit}>
        </textarea>
        {showAudioControls()}
    </>);

}
