import pandas as pd

fullGoals = pd.read_csv('metas_texto_v3.csv', encoding='latin-1', sep=';')

fullGoals['meta_id'] = fullGoals['meta_id'].apply(lambda x: x.split('.')[1])

fullGoals['meta_texto'] = fullGoals['meta_texto'].apply(lambda x: x.strip()[0].upper()+x.strip()[1:]+'.')

fullGoals['met_conc'] = fullGoals['id_objetivo'].astype(str) + '.' + fullGoals['meta_id'] + ' ' + fullGoals['meta_texto']

fullGoals.to_csv('metas_texto_v4.csv', index=False, encoding='latin-1', sep=';')