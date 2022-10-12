/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\n    const lat =  -31.4241298;\n    const lng =  -64.1896442;\n    const mapa = L.map('mapa-inicio').setView([lat, lng ], 12);\n\n    let makers = new L.FeatureGroup().addTo(mapa)\n\n    let propiedades = []\n\n    //Filtros \n    const filtros = {\n        categoria: '',\n        precio: ''\n    }\n\n    const categoriasSelect= document.querySelector('#categorias')\n    const preciosSelect= document.querySelector('#precios')\n\n\n    categoriasSelect.addEventListener('change', e => {\n        filtros.categoria = +e.target.value\n        filtrarPropiedades()\n    })\n\n    preciosSelect.addEventListener('change', e => {\n        filtros.precio = +e.target.value\n        filtrarPropiedades()\n    })\n    \n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(mapa);\n\n    const obtenerPropiedades = async() => {\n\n        try {\n            const url = '/api/propiedades'\n            const rta = await fetch(url)\n            propiedades = await rta.json()\n\n            mostrarPropiedades(propiedades)\n\n        } catch (error) {\n            console.log(error)\n        }\n    }\n\n    const mostrarPropiedades = props => {\n\n        //Limpiar makers previos\n        makers.clearLayers()\n\n        props.forEach(prop => {\n            //Agregar pin\n            const marker = new L.marker([prop?.lat,prop?.lng],{\n                autoPan: true\n            })\n            .addTo(mapa)\n            .bindPopup(`\n                <p class='text-gray-600 text-indigo-600 font-bold'>${prop.categoria.nombre}</p>\n                <h1 class='text-xl font-extrabold uppercase my-3'>${prop?.titulo}</h1>\n                <img src='/uploads/${prop?.imagen}' alt='Imagen de la propiedad ${prop?.titulo}'/>\n                <p class='text-gray-600 font-bold'>${prop.precio.nombre}</p>\n                <a href='/propiedad/${prop?.id}' class='bg-indigo-600 block p-2 text-center font-bold uppercase text-white'>Ver Propiedad </a>\n            `)\n\n            makers.addLayer(marker)\n        })\n    }\n\n    const filtrarPropiedades = () => {\n        const result = propiedades.filter(filtrarCategoria).filter(filtrarPrecio)\n        mostrarPropiedades(result)\n    }\n\n    const filtrarCategoria = (prop) => filtros.categoria ? prop.categoriaId === filtros.categoria : prop\n\n    const filtrarPrecio = (prop) => filtros.precio ? prop.precioId === filtros.precio : prop\n    \n\n    obtenerPropiedades()\n\n\n})()\n\n//# sourceURL=webpack://bienes-raices/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;