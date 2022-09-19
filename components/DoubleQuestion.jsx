import Select from 'react-select';
import { useId } from 'react';

export default function DoubleQuestion({ question, options, caption, answer, handleAnswer, options1, caption1, answer1, handleAnswer1, styles }) {

    function showSecond() {
        if (answer) {
            return (
                <Select
                    className={styles.select_item}
                    placeholder={caption1}
                    value={answer1 || ''}
                    onChange={handleAnswer1}
                    options={options1}
                    isClearable={true}
                    isSearchable={true}
                />
            );
        }
    }
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
                {showSecond()}
            </div>
        </>
    )
}