;
//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_cache_pinina_pwa',
  urlsToCache = [
    './',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
    'https://fonts.gstatic.com/s/raleway/v12/1Ptrg8zYS_SKggPNwJYtWqZPAA.woff2',
    'https://use.fontawesome.com/releases/v5.0.7/css/all.css',
    'https://use.fontawesome.com/releases/v5.0.6/webfonts/fa-brands-400.woff2',

    './assets/css/login.css',
    '../assets/css/registro.css',
    
    './script.js',
    '../script.js',

    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',

    './assets/images/logo.png',
    '../assets/images/logo.png',
    './assets/images/logo2.jpg',
    '../assets/images/logo2.jpg',

    './assets/images/avatar/DuenoMascotas.png',
    './assets/images/avatar/Veterinario.png',
    './assets/images/avatar/Proveerdor.png'
  ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})