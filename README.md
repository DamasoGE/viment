# Aplicación FRONTEND Viment

- [Aplicación FRONTEND Viment](#aplicación-frontend-viment)
    - [Introduccion](#introduccion)
    - [Librerías externas utilizadas](#librerías-externas-utilizadas)
    - [REACT](#react)
    - [ANT DESIGN](#ant-design)
    - [STYLED COMPONENTS](#styled-components)
    - [Uso de la aplicación](#uso-de-la-aplicación)
    - [Despliegue local de Viment](#despliegue-local-de-viment)
    - [Variables de entorno](#variables-de-entorno)

### Introduccion
Esta aplicación está hecha sobre el empaquetador VITE, que proporciona una forma directa y sencilla de poner a funcionar un servidor para Frontend.

Para este proyecto además utilizaremos **Typescript** que es una versión de Javascript tipada. Esto obliga a ser muy cuidadosos con la definición de variables y funciones para asegurar que no haya inconsistencias de tipado.

Herramienta que se utiliza para levantarlo:
- **NodeJS**: es un entorno en tiempo de ejecución multiplataforma, de código abierto, para la capa del servidor.

### Librerías externas utilizadas
Las pueden encontrar en el archivo **LIBRARIES** en la misma carpeta que este README.
Enlace al documento: [README_LIBRARIES.md](./README_LIBRARIES.md)

De todas formas hablaré a continuación de las librerías más importantes utilizadas en el proyecto.

### REACT

Se ha utilizado React para construir el proyecto. REACT es un framework para trabajar en javascript basado en componentes. Permite la reutilización de código por medio de bloques de código renderizables llamados componentes y mejora la escalabilidad de los proyectos.

### ANT DESIGN

Para tener un estilo homogéneo y empresarial se decidió el uso de Ant Design. Es una librería enorme de componentes de React listos para utilizar y mantenter un estilo cohesionado entre sí.

La propia página de Ant Design tiene un apartado enorme dedicado a enseñar cómo se debería hacer un buen diseño de Frontend, mientras que por otro lado tiene la documentación de todos los componentes con ejemplos.

### STYLED COMPONENTS

Para el estilado de la aplicación he utilizado Styled Components que es una librería que permite crear, a partir de componentes ya creados, componentes estilados que puedes reemplazar por el componente sin estilizar. Esto va muy de la mano con la filosofía de REACT.

### Uso de la aplicación

Esta aplicación es un BACKOFFICE. Permite la lectura, inserción, modificación y eliminación de distintos documentos de la base de datos controlado por el backend.

Se ha intentado mejorar la navegación de la pagina buscando la forma de minimizar los recorridos de ratón para poder realizar más acciones en menos tiempo.

### Despliegue local de Viment

Para desplegar Viment de forma local se puede realizar mediante:
```
npm run dev
```

### Variables de entorno
-   **VITE_BACKEND_API**: Dirección web donde se encuentra alojado el Backend