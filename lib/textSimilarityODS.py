# imports
import sys
from os import path
import json
import numpy as np
import pandas as pd
from nltk.corpus import stopwords
from contexto.limpieza import *
from contexto.vectorizacion import *
from contexto.comparacion import Similitud

basepath = path.dirname(path.realpath(__file__))
pd.set_option('display.max_columns', None)

# set stopwords
spanishStopwords = set(stopwords.words('spanish'))

# get goals
fullGoals = pd.read_csv(
    path.join(basepath, 'metas_texto_v4.csv'), encoding='latin-1', sep=';')
goals = fullGoals.terminos

# text cleanup
golasClean = [limpieza_texto(
    item, lista_palabras=spanishStopwords) for item in goals]

# vectorize
v_word2vec_m = VectorizadorWord2Vec()
vectores_m = v_word2vec_m.vectorizar(golasClean)
s_word2vec_m = Similitud(v_word2vec_m)


def getGoals(texto):
    '''get closest goals to text'''

    coseno_word2vec_m = s_word2vec_m.coseno(golasClean, limpieza_texto(texto))
    goalId = np.argsort(coseno_word2vec_m.flatten())[::-1][:3]
    goalSim = np.sort(coseno_word2vec_m.flatten())[::-1][:3]
    return (goalId, goalSim)


if __name__ == '__main__':
    result = []
    for i in range(1, len(sys.argv)):
        ids, sims = getGoals(sys.argv[i])
        ids = (ids+1).tolist()
        sims = sims.tolist()
        goals = fullGoals.loc[ids, 'id_objetivo'].tolist()
        targets = fullGoals.loc[ids, 'meta_id'].tolist()
        result.append({'ids': ids, 'sims': sims, 'goals': goals, 'targets': targets})
    json.dump(result, sys.stdout)
    sys.stdout.flush()
