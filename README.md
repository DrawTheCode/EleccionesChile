# Lector de archivos planos para elecciones Chile.

## Instalación:
----
Requerimientos:
- Versión Node: 18.16
- Versión NPM: 9.7.1

## Comandos npm run ...:
    "start": Hace correr el proyecto (necesita archivo .env).
    "dev": Hace funcionar el proyecto en modo desarrollo (necesita archivo .env).
    "tsc": Hace la compilación del proyecto.
    "nohup": Hace correr el proyecto en segundo plano.

## .ENV
----
Los valores necesarios dentro del .env para correr el proyecto son:
- PORT *puerto por donde saldrá la app*
- FTP_USER *nombre de usuario FTP*
- FTP_PASS *clave de usuario FTP*
- FTP_HOST *corresponde a la ip de la máquina FTP*
- FTP_PATH *ruta de archivos en donde se alojarán dentro del FTP*
- ENV *corresponde al entorno, si estas en local su valor debe ser "dev" *
- CORS *listado de dominios autorizados separados por comas*



## Definiciones de Endpoint´s

### Def´s
----
Trae definiciones de elementos estáticos, como el listado de tipos de zonas.

#### /api/def/zones
----
Entrega arreglo de tipos de zonas, con su respectivo id. Estos valores indican el nivel de embergadura de las zonas o locales.

**Ejemplo de elemento de lista:** { id:"G", value:"Global" }

#### /api/def/elec
----
Envía un arreglo con las definiciones de elecciones y sus id. Estos datos corresponden a el tipo de elección.

**Ejemplo de ítem en el arreglo:** { id:'N', name:'Votación Plebiscito Constitucional' }

#### /api/def/ambit
----
Trae un listado de "ámbitos" que hace referencia al tipo de voto que corresponde.

**Ejemplo de elemento en el resultado:**{ id: 1, name:"Votación Pactos" }


### Check´s
----
Lista y revisa los archivos que existen copiados.

#### /api/check/files
----
Lista los archivos copiados en el servidor, estos archivos corresponden a los que están a primer nivel. **no incluye los elementos descomprimidos**.

#### /api/check/not-copy
----
Muestra un listado de archivos no copiados entre el servidor local y el entregado al SERVEL.

#### /api/check/scenery/:zone
----
Lista los detalles de los archivos entregados por el SERVEL desde los archivos locales, estos dan detalles **corresponde a datos de archivo y no su contenido**.

#### /api/check/data/:diferenciador_del_archivo
----
Lista los escenarios entregados por el SERVEL desde los archivos locales, estos dan detalles de los tipos de escenarios y sus datos, como **COD_CAND, COD_ELEC, COD_ZONA, CAN_ORDEN, GLOSA_CAND, etc **.

#### /api/check/data/zonas/filter/:type
----
Busca en las zonas según el tipo de ella, ejemplo: países, comunas, locales. Los datos desplegados corresponde a los siguientes: **COD_ZONA, GLOSA_ZONA, TIPO_ZONA, ORDEN_ZONA**


### Result´s
----
#### /api/result/all
----
Trae toda la data de los últimos resultados enviados desde el SERVEL.

#### /api/result/filter/:key/:value
----
>[!CAUTION]
>Este filtro puede traer elementos no deseados (cosa que sucedio en entrega de datos anteriores), ejemplo un local de votación podría tener el mismo COD_ZONA que un país.

Trae los datos filtrando por los valores ingresados en la URL, el valor *:key* 
corresponde al campo por el cual se quiere filtrar y el *:value* al valor de dicho campo.

**Ejemplo de búsqueda:** https://apiservel.latercera.com/api/result/filter/COD_ZONA/1018

#### /api/result/filter/:firstKey/:firstValue/:secondKey/:secondValue
----
Trae los datos filtrando por dos valores y sus nombres ingresados en la URL, el valor *:firstKey y :secondKey* corresponde al campo por el cual se quiere filtrar y el *:firstValue y :secondValue* al valor de dichos campos.

>[!WARNING] 
>Los siguientes endpoints **no están terminados** y corresponden a pruebas en desarrollo, y por los mismo los resultados aún están en evaluación.

### Search´s
----
Trae los valores a través de identificadores definidos de antemano.

#### /api/search/by/:complexId
----
Trae los resultados con el **:complexId** que es un id compuesto de la zona, dicha combinación es su COD_ZONA + TIPO_ZONA.

#### /api/search/by/type/:typeZone
----
Entrega listado de elementos separados por tipos de zonas, *:typeZone* corresponde al TIPO_ZONA que se desea filtrar, esto entregará un listado de elementos que están agrupados por el id de COD_ZONA.

#### /api/search/by/type/:typeZone/:idZone
----
Entrega listado de elementos separados por tipos de zonas, *:typeZone* corresponde al TIPO_ZONA que se desea filtrar, adicionalmente se puede filtrar por COD_ZONA en *:idZone*, entregando un arreglo con los valores del la elección del área seleccionada.
