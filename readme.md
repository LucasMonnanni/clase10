##### 22/8/23 - Clase 10: Websockets + Handlebars

Se ejecuta con `npm start`

En la ruta raíz se muestra la vista con los productos almacenados en products.json.

En la ruta `/realtimeproducts` se accede a la vista conectada al websocket. Al conectarse carga los productos y presenta un formulario para agregar uno nuevo. También, a través de un middleware asignado a la api de productos, cada vez que hay un cambio en la base de productos se emite a todos los sockets abiertos la nueva lista completa. Para lograr esto instancié globalmente en `app.js` el ProductManager y paso una referencia en el objeto a los distintos routers. El módulo de los carritos lo eliminé para limpiar un poco
