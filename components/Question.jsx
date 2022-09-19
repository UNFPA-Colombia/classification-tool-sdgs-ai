import Select from 'react-select';
import { useId } from 'react';


export default function Question({ question, options, caption, answer, handleAnswer, styles }) {
    return (
        <>
            <p className={styles.question}>{question}</p>
            <div className={styles.select}>
                <Select
                    className={styles.select_item}
                    placeholder={caption}
                    value={answer || ''}
                    onChange={handleAnswer}
                    options={options}
                    isClearable={true}
                    isSearchable={true}
                    instanceId={useId()}
                />
            </div>
        </>
    )
}