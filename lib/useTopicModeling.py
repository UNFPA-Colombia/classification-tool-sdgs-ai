# imports
import os
import sys
import json
import PyPDF2
import gensim.corpora as corpora
from gensim.models.ldamodel import LdaModel
from gensim.models.phrases import Phrases
from gensim.utils import simple_preprocess
import nltk
from nltk.corpus import stopwords

def make_bigrams(texts, bigram_mod):
    """
    Realiza los bigramas de cada uno de los textos
    @Parameters: Lista de listas, donde cada posicion es una lista con las palabras del contenido del PDF
    separadas por coma y que no son consideradas stopwords
    @return: Una lista (del mismo tamaño que el de la entrada) donde en cada posicion se tiene una lista con los bigramas 
    """
    return [bigram_mod[doc] for doc in texts]

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

def getDistributionNewText(docPath,id2word, bigram_mod, model ):
    """
    Funcion para obtener la distribución de los tópicos del nuevo texto 
    @param docPath: ruta del arhivo PDF 
    @param id2word: diccionario para la creación de las palabras 
    @param model: modelo que se va a analizar segun el numero de topicos seleccionado por el usuario

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
    vectorDistribution = model[other_corpus][0]
    distribution=[]
    for i in range(0,len(vectorDistribution)):
        distribution.append({"topico":vectorDistribution[i][0], "valor":float(vectorDistribution[i][1])})
    return distribution



if __name__ == '__main__':  
    
    """Endpoint para probar el modelo con un nuevo documento. Este recibe el id del usuario y el número de tópicos actual"
    En caso de que ocurra un error con la lectura de los archivos guardados (diccionario, modelo, o bigrama) 
    se envía en el json error = 1
    En caso de que ocurra un error al leer el archivo nuevo subido por el usuario u ocurra un error en el método para obtener 
    la nueva distribución de tópicos, en el json se envía error=2
    En caso de que todo el proceso ocurra exitosamente, se envía error=0
    """
    ruta = sys.argv[1]  
    path=sys.argv[2]
    numberOfTopics = sys.argv[3]
    
    
    try: 
        model_load= LdaModel.load(os.path.join(path, "model-"+str(numberOfTopics)+".model"))
        id2word_load = corpora.Dictionary.load(os.path.join(path, "id2word.dict"))
        bigram_mod_load=Phrases.load(os.path.join(path, "bigramMod.pkl"))
        try: 
            result=getDistributionNewText(ruta,id2word_load, bigram_mod_load, model_load)
            result={"error":0, "distribution":result}
        except:
            result={"error":2}  
    except:
        result={"error":1}    
        
    # Save results to stdout as JSON
    try:
        json.dump(result, sys.stdout)
    except Exception as e:
        json.dump({"error": str(e)}, sys.stdout)
