# Classification tool for SDGs using AI in Colombia

Web application that allows to classify and store users' opinions based on the Sustainable Development Goals by means of artificial intelligence.


## Instrucciones para iniciar el proyecto 
Estas instrucciones son para la ejecución de la herramienta "Documentos" dentro de la aplicación. 

1. Clonar el repositorio: 
```bash
git clone 
```
2.	Instalar las dependencias correspondientes:

a. Dependencias del modelo: 
El archivo con todas las dependencias se encuentra en classification-tool-sdgs-ai\lib\requirmentsTopicModeling.txt. 

Se recomienda crear un ambiente virtual e instalar en él todas las dependencias. Para crear el ambiente virtual puede guiarse de la documentación oficial a la fecha: [Ambientes Virtuales en Python](https://docs.python.org/3/library/venv.html)

Para realizar la instalación de las dependencias, debe ir a la carpeta lib y usar: 
```bash
pip install -r .\lib\requerimentsTopicModeling.txt
```
b.	Dependencias del Front-End:
Ejecutar el comando: 
```bash
npm i
```

3.	Cambiar el Path de Python en el proyecto: 
En caso de que se desee correr en local, se debe indicar el path de Python para poder ejecutar el modelo correctamente. Este documento se encuentra en /api/documentos.js y /api/documentosUse.js
Se debe cambiar en ambos archivos la variable “pythonPath” por el path del .exe de python.
 
4.	Rectificar la existencia de carpetas: 
Para asegurarse de que la aplicación corra correctamente, en la carpeta “lib” debe encontrar las siguientes carpetas (no tiene importancia si están vacías)
* dataTopicModeling
* docsTopicModeling
 
En caso de que no encuentre estas carpetas, se deben crear. Estas carpetas se usan para guardar los archivos que sube el usuario y los modelos que se crean. 
En la primera carpeta se crean subcarpetas con el id del usuario, esto para saber cuales modelos fueron creados por él. Además de guardar los modelos, se guardan objetos importantes para la realización satisfactoria del segundo EndPoint, objetos como el diccionario y el bígama. Por otro lado, en la segunda carpeta se guardan los archivos .PDF que sube el usuario para analizar.

5.	Correr la aplicación: 
En la terminal correr el siguiente comando: 
```bash
npm run dev
# or
yarn dev
```

