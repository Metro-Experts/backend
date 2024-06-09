# Metro-Experts Backend

Este proyecto está diseñado utilizando la arquitectura de microservios, donde tendremos un API gateway para interactuar con las demas aplicaciones


## 🚀 Instrucciones para Ejecutar el Proyecto
Para correr el proyecto, sigue estos pasos:
1. Ingresa a cada una de las carpetas:
   ```bash
   cd
    ```
    - `api_gateway`
    - `users`
    - `tutorias`
    - `subjects`
    - `confirmacion-pago`
    - `conversion-monetaria`
3. Ejecuta el siguiente comando en cada carpeta:
    ```bash
    npm install
    ```

## API gateway 🤝
Es el intermedierio que entre el front end 💻 y los microservicios mediante la libreria htttp-proxy. No tiene ninguna conexion con ninguna base de datos directamente

## Users 🙋‍♂️🙋‍♀️

Es el microservicio que se encarga de todo lo que tenga que ver con el manejo de los usuarios, agregar, agregar a un curso a un estudiante,cambiar los datos del usuario , asignarle un curso a un tutor, eliminar un curso de un usuario, etc.

## Tutorias 👩‍🏫🧑‍🏫
Este microservicioo se encarga de todo el manejo de las tutorias/cursos, donde se puede crear un curso  agregar estudiantes a estos cursos  consultar todos los cursos o un curso especifico dado su ID, entre otros.

## Subjects 📚

Este microservicio se encarga de solamente visualiar todas las materias que hay disponibles y todas estan divididas por categoria, cuanta con un solo endpoint que solo te mostrara la lista de todas las materias.

## Confirmacion pago 👍👎

Este microservicio trata sobre todo lo que tenga que ver a la confirmacion de un pago , el usaurio podra subir el comprobante de su pago con una foto con el recibo del pago, donde el tutor podra confirmar que efectivamente le llego esa transferencia y podra aceptar que el estudiante se una efectivamente al curso.

## Conversion monetaria 🤑
Este microservicio solamente te saldra la conversion que hay en bolicares con las monedas mas relevantes que se necesiten en la aplicacion .



## 🧏‍♂️🧏‍♂️ Despliegue
Los microservicios están desplegados en Heroku.

## 📄 Documentación
Puedes encontrar toda la documentación [aquí](https://documenter.getpostman.com/view/17877850/2sA3QngZBm).
