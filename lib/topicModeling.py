# imports
import os
import sys
import json
import gensim
from gensim.utils import simple_preprocess
import gensim.corpora as corpora
from gensim.models import CoherenceModel
import nltk
from nltk.corpus import stopwords
import PyPDF2


def readFiles(ruta):
    archivos = []
    totalpages = 0
    bits = 0
    for doc in ruta:
        bits += os.stat(doc).st_size
        readpdf = PyPDF2.PdfFileReader(open(doc, 'rb'))
        totalpages += readpdf.numPages
        content = ""
        for i in range(0, readpdf.numPages):
            content += readpdf.getPage(i).extractText()
        archivos.append(content)
    size = bits
    return (archivos, totalpages, size)


def sent_to_words(sentences):
    for sentence in sentences:
        yield (simple_preprocess(str(sentence), deacc=True))


def remove_stopwords(texts, spanish_stopwords):
    return [[word for word in simple_preprocess(str(doc)) if word not in spanish_stopwords] for doc in texts]


def make_bigrams(texts, bigram_modd):
    return [bigram_modd[doc] for doc in texts]


def countWords(data_words, data_words_nostops):
    numberWords = 0
    deletedWords = 0

    for i in range(0, len(data_words)):
        numberWords += len(data_words[i])
        deletedWords += len(data_words[i])-len(data_words_nostops[i])

    return (numberWords, deletedWords)


def organiceResult(lda_model, coherencia):
    topicos = []
    for i in lda_model.show_topics():
        topics_and_frecuency_list = i[1].split("+")
        palabras = []
        for j in topics_and_frecuency_list:
            topics_and_frecuency = j.split("*")
            topic = topics_and_frecuency[1].replace('"', '').strip()
            frecuency = topics_and_frecuency[0].strip()
            palabras.append({"palabra": topic, "frecuencia": frecuency})
        topicos.append({"topico": i[0], "palabras": palabras})
    return {"topicos": topicos, "coherencia_c_v": coherencia}


def getBestTopics(corpus, id2word, texts):
    models = []
    topics_best_coherence = 0
    best_coherence = 0
    answer = []
    for i in range(2, 11):
        lda_model = gensim.models.LdaMulticore(corpus=corpus, id2word=id2word, num_topics=i,
                                               random_state=100, chunksize=100, passes=10,
                                               per_word_topics=True)
        models.append(lda_model)
        coherence_model_lda = CoherenceModel(
            model=lda_model, texts=texts, dictionary=id2word, coherence="c_v")
        coherencia = coherence_model_lda.get_coherence()
        answer.append(organiceResult(lda_model, coherencia))
        if coherencia > best_coherence:
            best_coherence = coherencia
            topics_best_coherence = i
    return models, answer, topics_best_coherence


def topicModeling(ruta):
    generalData = {"PagesNumber": 0, "DocsNumber": len(
        ruta), "wordsNumber": 0, "deletedWords": 0, "DocsSize": ""}
    docs = readFiles(ruta)

    # STOPWORDS
    spanish_stopwords = set(stopwords.words('spanish'))
    data_words = list(sent_to_words(docs))
    # Remove Stop Words
    data_words_nostops = remove_stopwords(data_words, spanish_stopwords)
    # Build the bigram and trigram models
    # higher threshold fewer phrases.
    bigram = gensim.models.Phrases(data_words, min_count=5, threshold=100)
    # Faster way to get a sentence clubbed as a trigram/bigram
    bigram_mod = gensim.models.phrases.Phraser(bigram)

    # Form Bigrams
    data_words_bigrams = make_bigrams(data_words_nostops, bigram_mod)

    wordsNumber, deletedWords = countWords(data_words, data_words_nostops)
    generalData["wordsNumber"] = wordsNumber
    generalData["deletedWords"] = deletedWords

    # Create Dictionary con las palabras del data_words_digrams
    id2word = corpora.Dictionary(data_words_bigrams)
    # Term Document Frequency #[[], [(0 , 1),(1, 1),(2, 1),(3, 1),(4, 6)]] word id and frequency
    corpus = [id2word.doc2bow(text) for text in data_words_bigrams]

    models, answer, topics_best_coherence = getBestTopics(corpus, id2word, data_words_bigrams)
    
    return {"error": False, "bestModel": topics_best_coherence, "models": answer}


if __name__ == '__main__':
    ruta = sys.argv[1:]  # list of routes to files
    result = topicModeling(ruta)
    try:
        json.dump(result, sys.stdout)
    except Exception as e:
        json.dump({"error": str(e)}, sys.stdout)
    sys.stdout.flush()
