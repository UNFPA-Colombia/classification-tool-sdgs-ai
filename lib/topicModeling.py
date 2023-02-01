# imports
import os
import sys
import math
import json
import PyPDF2
import gensim
import gensim.corpora as corpora
from gensim.models import CoherenceModel
from gensim.utils import simple_preprocess
import nltk
from nltk.corpus import stopwords
import pyLDAvis.gensim_models as gensimvis



def convert_size(size_bytes):
    """
    hace una conversion de bytes a B, KB, MB, etc. 
    @Parameters: numero de bytes.
    @return: String con las unidades correspondientes. Ej 15MB
    """
    if size_bytes == 0:
        return "0B"
    size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return "%s %s" % (s, size_name[i])


def readFiles(ruta):
    """
    Lee los archivos PDF especificados en la ruta.
    @Parameters: Lista de Strings, donde cada posición es la localización del archivo
    @return: Tupla con la infomración necesaria. (lista con el contenido de los archivos, 
    número total de páginas, lista con las páginas por documento, tamaño total de todos los archivos, 
     lista con el tamaño por documento, titulos de los documentos )
    """
    archivos = []
    totalpages = 0
    sizePerDocument=[]
    pagesPerDocument=[]
    bits = 0
    titles=[]
    for doc in ruta:
        sizePerDocument.append(convert_size(os.stat(doc).st_size))
        bits += os.stat(doc).st_size
        readpdf = PyPDF2.PdfFileReader(open(doc, 'rb'))
        totalpages += readpdf.numPages
        pagesPerDocument.append(readpdf.numPages)
        content = ""
        title=doc.split("/")
        title=title[len(title)-1].split(".pdf")[0]
        title=title.split("_")
        titles.append(title[0])
        for i in range(0, readpdf.numPages):
            content += readpdf.getPage(i).extractText()
        content=content.replace("\n", "")
        archivos.append(content)
    size = convert_size(bits)
    return (archivos, totalpages, pagesPerDocument, size, sizePerDocument, titles)


def sent_to_words(sentences):
    """
    Separa por palabras cada contenido de sentences  (lista de String) y hace un preproceso default de gensim
    @Parameters: Lista de Strings, cada posicion tiene el contenido de los archivos PDF
    @return: Una lista (del mismo tamaño que el de la entrada) donde en cada posicion se tiene otra lista con las palabras separadas
    """
    for sentence in sentences:
        yield (simple_preprocess(str(sentence), deacc=True))


def remove_stopwords(texts):
    """
    Elimina las palabras vacias para cada uno de los textos que se pasan por parámetro
    @Parameters: Lista de listas, donde cada posicion es una lista con las palabras del contenido del PDF
    separadas por coma
    @return: Una lista (del mismo tamaño que el de la entrada) donde en cada posicion se tiene otra lista con las palabras separadas y que NO stopwords
    """
    spanish_stopwords = set(stopwords.words('spanish'))
    spanish_stopwords.add("uf")
    return [[word for word in simple_preprocess(str(doc)) if word not in spanish_stopwords] for doc in texts]


def make_bigrams(texts, bigram_mod):
    """
    Realiza los bigramas de cada uno de los textos
    @Parameters: Lista de listas, donde cada posicion es una lista con las palabras del contenido del PDF
    separadas por coma y que no son consideradas stopwords
    @return: Una lista (del mismo tamaño que el de la entrada) donde en cada posicion se tiene una lista con los bigramas 
    """
    return [bigram_mod[doc] for doc in texts]


def countWords(data_words, data_words_nostops):
    """
    Funcion que cuenta la cantidad de palabras que fueron eliminadas y el total de palabras en los documentos 
    @param data_words:lista de listas donde cada posicion es una lista con las palabras separadas del contenido de un documento PDF
    @param data_words_nostops: lista de listas donde cada posicion es una lista con las palabras separadas y que no son STOPWORDS del contenido de un documento PDF
    @return tupla con las estadisticas necesarias (numero de palabras totales, numero de palabras totales eliminadas, 
    lista con el numero de palabras por documento, lista con el numero de palabras eliminadas por documento)
    """
    numberWordsPerDocument=[]
    deletedWordsPerDocument=[]
    numberWords = 0
    deletedWords = 0

    for i in range(0, len(data_words)):
        numberWordsPerDocument.append(len(data_words[i]))
        numberWords += len(data_words[i])
        deletedWords += len(data_words[i])-len(data_words_nostops[i])
        deletedWordsPerDocument.append(len(data_words[i])-len(data_words_nostops[i]))

    return (numberWords, deletedWords, numberWordsPerDocument, deletedWordsPerDocument)


def organiceResult(lda_model, coherencia):
    """
    Organiza  resultado para despues convertirlo en JSON
    @param lda_model: modelo LDA obtenido, 
    @param coherencia: numero de coherencia que se obtuvo del modelo. 
    Returns: diccionario organizado de la siguiente manera: 
    ej: 
    {topicos: [
        topico:0, palabras: [ {text: ejemplo1, value: 0.25}, {text: ejemplo12, value: 0.75}...],
        topico:1, palabras: [ {text: ejemplo2, value: 0.25}, {text: ejemplo22, value: 0.75}...],
        topico:2, palabras: [ {text: ejemplo3, value: 0.25}, {text: ejemplo42, value: 0.75}...]
    ], 
    "coherencia_c_v": 0.5}
    
    """
    topicos = []
    for i in lda_model.show_topics(formatted=False):
        palabras = []
        for j in i[1]:
            palabras.append({"text": j[0], "value":float( j[1])  })
        topicos.append({"topico": i[0], "palabras": palabras})
    return {"topicos": topicos, "coherencia_c_v": coherencia}

def organiceResultGeneralData(totalpages, pagesPerDocument, size, sizePerDocument, titles,
                              wordsNumber,deletedWords,numberWordsPerDocument, 
                              deletedWordsPerDocument):
    """
    Función que organiza el resultado  los datos de las estadisticas generales para converirlos después en JSON
    @param totalpages: número total de paginas de los documentos 
    @param pagesPerDocument: lista con el número total de paginas por documento
    @size: tamaño total de todos los documentos (el ponderado)
    @sizePerDocument: Lista con el tamaño de cada uno de los documentos
    @titles: lista con los titulos de los documentos 
    @wordsNumber: numero total de palabras de todos los documentos (el ponderado)
    @deletedWords: numero total de palabras eliminadas de todos los documentos (el ponderado)
    @numberWordsPerDocument: lista con el número total de palabras del documento
    @deletedWordsPerDocument: lista con el número total de palabras eliminadas por documento

    @returns: diccionario con la informacion organizada: 
    ej: para dos documentos:
    [{"title": "Ejemplo1-118-128", "words": 4845, "pages": 11, "size": "218.48 KB", "deleted": 1978}, 
    {"title": "Ejemplo1-129-139", "words": 5193, "pages": 11, "size": "222.54 KB", "deleted": 2163}, 
    {"title": "Total", "words": 10038, "pages": 22, "size": "441.02 KB", "deleted": 4141}]
    Nota: Las estadisticas totales de los documentos estará sienpre en la ultima posicion con el titulo "Total"
    """
    newJson=[]
    for i in range(0, len(pagesPerDocument) ):
        documentData={}
        documentData["title"]=titles[i]
        documentData["words"]=numberWordsPerDocument[i]
        documentData["pages"]=pagesPerDocument[i]
        documentData["size"]=sizePerDocument[i]
        documentData["deleted"]=deletedWordsPerDocument[i]        
        newJson.append(documentData)
    
    documentData={}
    documentData["title"]="Total"
    documentData["words"]=wordsNumber
    documentData["pages"]=totalpages
    documentData["size"]=size
    documentData["deleted"]=deletedWords
    newJson.append(documentData)
    
    return(newJson)


def getBestTopics(corpus, id2word, texts):
    """
    Revisa cad auno de los modelos realizados para los topicos de 2 a 10, y obtiene cual es el mejor modelo según el nievl de coherencia. 
    @param corpus: Term Document Frequency #[[], [(0 , 1),(1, 1),(2, 1),(3, 1),(4, 6)]] word id and frequency
    @param id2word: Dictionary con las palabras del data_words_digrams
    @param texts: lista de listas con los contenidos ya preprocesados de cada uno de los documentos  

    @returns:tupla con una lista de todos los modelos segun el numero de topicos ,
      diccionario con los restultados de los modelos organizados y listos para convertir a JSON, 
      el numero de topico en en que se obtuvo el mejor indice de coherencia
    """
    models = []
    topics_best_coherence = 0
    best_coherence = 0
    answer = []
    for i in range(2, 11):
        lda_model = gensim.models.LdaMulticore(corpus=corpus, id2word=id2word, num_topics=i,
                                               random_state=100, chunksize=100, passes=10,
                                               per_word_topics=True, minimum_probability=0.0)
        models.append(lda_model)
        coherence_model_lda = CoherenceModel(
            model=lda_model, texts=texts, dictionary=id2word, coherence="c_v")
        coherencia = coherence_model_lda.get_coherence()
        answer.append(organiceResult(lda_model, coherencia))
        if coherencia > best_coherence:
            best_coherence = coherencia
            topics_best_coherence = i
    return (models, answer, topics_best_coherence)


def topicModelingPart1(ruta):

    """
    Funcion que realiza la primera parte del modelado de topicos para obtener las estadísticas generales.
    esto es numero de palabras, numero de palabras eliminadas, numero de paginas, tamaño etc
    @param ruta: lista con las rutas (string) de cada uno de los documentos a analizar
    @returns: diccionario con la información lista para ser convertida a JSON 
    ej: para dos documentos
    [{"title": "Ejemplo1-118-128", "words": 4845, "pages": 11, "size": "218.48 KB", "deleted": 1978}, 
    {"title": "Ejemplo1-129-139", "words": 5193, "pages": 11, "size": "222.54 KB", "deleted": 2163},
    {"title": "Total", "words": 10038, "pages": 22, "size": "441.02 KB", "deleted": 4141}]
    Nota: Las estadisticas totales de los documentos estará sienpre en la ultima posicion con el titulo "Total"
    """
    generalData = {"PagesNumber": 0, "DocsNumber": len(
        ruta), "wordsNumber": 0, "deletedWords": 0, "DocsSize": ""}
    docs = readFiles(ruta)
    generalData["PagesNumber"]=docs[1]
    generalData["DocsSize"]=docs[3]
    
    data_words = list(sent_to_words(docs[0]))
    
    # Remove Stop Words
    data_words_nostops = remove_stopwords(data_words)
    
    wordsNumber, deletedWords, numberWordsPerDocument, deletedWordsPerDocument=countWords(data_words, data_words_nostops)
    generalData["wordsNumber"] = wordsNumber
    generalData["deletedWords"] = deletedWords
    
    jsonForGeneralData=organiceResultGeneralData(docs[1], docs[2], docs[3], docs[4], docs[5],
                              wordsNumber,deletedWords,numberWordsPerDocument, 
                              deletedWordsPerDocument)
    return( jsonForGeneralData, data_words, data_words_nostops)
    
def topicModelingPart2(data_words,data_words_nostops ):
    """
    Funcion que realiza la segunda parte del modelado de tópicos. Se devuelven todos los modelos. 
    @param data_words:lista de listas donde cada posicion es una lista con las palabras separadas del contenido de un documento PDF
    @param data_words_nostops: lista de listas donde cada posicion es una lista con las palabras separadas y que no son STOPWORDS del contenido de un documento PDF

    @returns diccionario listo para ser convertido de JSON Este contiene la informacion de cada uno de los modelos, 
    y el número de tópicos que da una mejor coherencia 

    ej:
     {
   "BestTopicNumber": 6,
   "grupos": [
      {
         "topicos": [
            {
               "topico": 0,
               "palabras": [
                  {
                     "text": "debe",
                     "value": 0.023617450147867203
                  },
                  {
                     "text": "articulo",
                     "value": 0.020958127453923225
                  },
               ]
            },
            {
               "topico": 1,
               "palabras": [
                  {
                     "text": "revisar",
                     "value": 0.001177977304905653
                  },
                  {
                     "text": "sistema",
                     "value": 0.0011604118626564741
                  }
               ]
            }
         ],
         "coherencia_c_v": 0.855555555
      },
      {
         "topicos": [
            {
               "topico": 0,
               "palabras": [
                  {
                     "text": "debe",
                     "value": 0.02440776117146015
                  },
                  {
                     "text": "tema",
                     "value": 0.021995224058628082
                  }
               ]
            },
            {
               "topico": 1,
               "palabras": [
                  {
                     "text": "articulo",
                     "value": 0.001613518106751144
                  },
                  {
                     "text": "tema",
                     "value": 0.001446800073608756
                  }
               ]
            },
            {
               "topico": 2,
               "palabras": [
                  {
                     "text": "debe",
                     "value": 0.0010257316753268242
                  },
                  {
                     "text": "articulo",
                     "value": 0.0010143830440938473
                  }
               ]
            }
         ],
         "coherencia_c_v": 0.14173523579293396
      },
    ]
}
    """
    # Build the bigram and trigram models
    # higher threshold fewer phrases.
    bigram = gensim.models.Phrases(data_words, min_count=5, threshold=100)
    # Faster way to get a sentence clubbed as a trigram/bigram    
    bigram_mod = gensim.models.phrases.Phraser(bigram)
    # Form Bigrams
    data_words_bigrams = make_bigrams(data_words_nostops, bigram_mod)
    # Create Dictionary con las palabras del data_words_digrams
    id2word = corpora.Dictionary(data_words_bigrams)
    # Term Document Frequency #[[], [(0 , 1),(1, 1),(2, 1),(3, 1),(4, 6)]] word id and frequency
    corpus = [id2word.doc2bow(text) for text in data_words_bigrams]
    models, answer, topics_best_coherence = getBestTopics(corpus, id2word, data_words_bigrams)
    jsonAnswer={"bestModelNumber":topics_best_coherence, "models":answer}
    return (jsonAnswer, id2word, corpus, models, bigram_mod)
# ///////////////////////////////////////////////////////////////////////////////////////
def readFile(doc):
    """
    Funcion para realziar la lectura de un nuevo documento a analizar (despues de haber creado ya el modelo)
    @param doc: String ruta del archivo PDF
    @return: retorna el contenido deñ documento como una cadena de Strings
    """
    readpdf = PyPDF2.PdfFileReader(open(doc, 'rb'))
    content = ""
    for i in range(0, readpdf.numPages):
        content += readpdf.getPage(i).extractText()
        content=content.replace("\n", "")
    return content

def cleanText(text):
    """
    Funcion para realizar la limpieza del contenido del texto nuevo
    @param text: String con el contenido del texto
    @return: lista con las palabras separadas y las palabras Stopwords eliminadas
    """
    return remove_stopwords(list(sent_to_words(text)))

#Datos para la grafica de torta :) 
def getDistributionTopicsInAllText( numberOfTopic,  documento , corpus, models):
    """
    Funcion para obtener la distribución de tópicos para un determinado documento con el que se construyó el modelo. 
    @param numberOfTopic: numero de topicos que se desean revisar (número de tópico selccionado por el usuario)(numero de 2 al 10)
    @param documento: número de documento -1. Tambien puede ser visto como el indice del documento en la lista de documentos usados para crear el modelo.
      Por ejemplo, si es el primer documento el que se desea revisar. El parámetro tendría el valor de 0
    @param corpus realizado para obtener los modelos de tópicos 
    @param models: lista de los modelos 
    @return distribución de los tópicos para dicho documento. 
    por ejemplo, si el primer documento el que se desea revisar y el numero de topicos seleccionado es 7, se obtiene: 
    [{'topico': 0, 'valor': 0.9997116923332214}, 
    {'topico': 1, 'valor': 4.802714101970196e-05}, 
    {'topico': 2, 'valor': 4.8026980948634446e-05}, 
    {'topico': 3, 'valor': 4.8026970034698024e-05}, 
    {'topico': 4, 'valor': 4.8027031880337745e-05}, 
    {'topico': 5, 'valor': 4.820752656087279e-05}, 
    {'topico': 6, 'valor': 4.802698458661325e-05}]
    """
    vectorDistribution = models[numberOfTopic][corpus[documento]][0]
    distribution=[]
    for i in range(0,len(vectorDistribution)):
        distribution.append({"topico":vectorDistribution[i][0], "valor":float(vectorDistribution[i][1])})
    return distribution

def getAllDistributions(corpus, numDocumentos, models):
    """
    Obtiene todas las posibles distribuciones de los tópicos para cada uno de los textos subidos. 
    @param corpus:corpus realizado para obtener los modelos de tópicos 
    @param numDocumentos: Número total de documentos que se subieron
    @param models: lista de modelos 
    """
    allData=[]
    for i in range(0,numDocumentos):
        data={"documento":i, "distribucion":[]}
        for j in range(0, 9):
            data["distribucion"].append(getDistributionTopicsInAllText( j,  i , corpus, models))
        allData.append(data)
    return allData 

# Grafica en pydalvis 
def getDataForInteractiveGraph(numberofTopic, models, corpus, id2word):
    """
    Funcion que retorna la informacion necesaria para la construcción de la gráfica interactiva.  
    @param numberOfTopic: numero de topicos que se desean revisar (numero de 2 al 9)
    @param models: lista con los modelos de topicos realizados 
    @param id2word:diccionario para la creación de las palabras 
    @param corpus: corpus realizado para obtener los modelos de tópicos 
    """
    data_graph= gensimvis.prepare(models[numberofTopic], corpus, id2word)
    return data_graph.to_dict()

def getDistributionNewText(numberOfTopic, docPath,id2word, bigram_mod, models ):
    """
    Funcion para obtener la distribución de los tópicos del nuevo texto 
    @param numberOfTopic: numero de topicos que se desean revisar (numero de 2 al 10)
    @param docPath: ruta del arhivo PDF 
    @param id2word: diccionario para la creación de las palabras 
    @param models: lista de todos los modelos (los diferentes modelos con tópicos)

    @return: la distribución de tópicos del nuevo documento. 
    ejemplo, si se tiene como el numero de topicos seleccionado el 5, el output sería de la manera: 
    [{"topico": 0, "valor": 0.019510839134454727}, 
    {"topico": 1, "valor": 5.0709539209492505e-05}, 
    {"topico": 2, "valor": 5.07093827764038e-05}, 
    {"topico": 3, "valor": 5.070936822448857e-05}, 
    {"topico": 4, "valor": 5.070943007012829e-05}]
    """
    text=[]
    text.append(readFile(docPath))
    text=cleanText(text)[0]
    data_words_bigrams = make_bigrams(text, bigram_mod)
    other_corpus =id2word.doc2bow(text)
    vectorDistribution = models[numberOfTopic][other_corpus][0]
    distribution=[]
    for i in range(0,len(vectorDistribution)):
        distribution.append({"topico":vectorDistribution[i][0], "valor":float(vectorDistribution[i][1])})
    return distribution


def funcionFinal (ruta):
    """Endpoint que da toda la información necesaria para la construcción de toda la aplicación. 
    Manda un JSON con los siguientes datos: 
    {"generalData": datos data general, "topicModeling": palabras y frecuencias del modelado de topicos, 
    "distribuciones": distribuciones de los tópicos en cada texto, 
    "interactive": todos los datos necesarios para la construccion de la grafica interactiva en pyldavis}
    """
    
    #Get general data:
    result1 = topicModelingPart1(ruta)
    generalData=result1[0]
    data_words=result1[1]
    data_words_nostops=result1[2]
    #print("data general obtenida")
    
    #Get de topic modeling: 
    result2= topicModelingPart2(data_words, data_words_nostops)
    topicModeling=result2[0]
    id2word=result2[1]
    corpus=result2[2]
    models=result2[3]
    bigram_mod=result2[4]
    #print("modelos obtenidos")
    
    #Get data for pie chart 
    distribuciones=getAllDistributions(result2[2], len(ruta), result2[3])
    #print("Distribuciones de pie hechas")
    
    #Get data for intereactive graph
    interactiveGraph=[]
    for i in range(0,9):
        dataInteractive= getDataForInteractiveGraph(i, result2[3], result2[2], result2[1])
        interactiveGraph.append(dataInteractive)
    #print("Interactive graph")
    
    finalJson={"error": False, "generalData": generalData, "topicModeling": topicModeling, "distribuciones": distribuciones, 
              "interactive":interactiveGraph}
    
    return finalJson, id2word, bigram_mod, models

if __name__ == '__main__':  
    ruta = sys.argv[1:-2]  
    result, id2word, bigram_mod, models = funcionFinal(ruta) 
    
    path=os.path.join(sys.argv[-1], sys.argv[-2])
    id = sys.argv[-2] 
    os.mkdir(path)
    
    id2word.save(fname_or_handle=os.path.join(path,"id2word.dict"))
    bigram_mod.save(os.path.join(path,"bigramMod.pkl"))
    for i in range(0, len(models)):
        models[i].save(os.path.join(path,"model_"+str(i)+".model"))  
        
    result["id"]=id
    
    # Remove temporary files
    for file in ruta:
        os.remove(file)
        
    # Save results to stdout as JSON
    try:
        json.dump(result, sys.stdout)
    except Exception as e:
        json.dump({"error": str(e)}, sys.stdout)

    