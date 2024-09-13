self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/index.js"
    ],
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/cotizacion": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/cotizacion.js"
    ],
    "/enduser/conocenos": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/enduser/conocenos.js"
    ],
    "/enduser/conocenuestrosproductos": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/enduser/conocenuestrosproductos.js"
    ],
    "/enduser/galeria": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/enduser/galeria.js"
    ],
    "/registrarse": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/registrarse.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];