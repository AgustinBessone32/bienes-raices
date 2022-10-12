(function(){
    const lat =  -31.4241298;
    const lng =  -64.1896442;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 12);

    let makers = new L.FeatureGroup().addTo(mapa)

    let propiedades = []

    //Filtros 
    const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriasSelect= document.querySelector('#categorias')
    const preciosSelect= document.querySelector('#precios')


    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value
        filtrarPropiedades()
    })

    preciosSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value
        filtrarPropiedades()
    })
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const obtenerPropiedades = async() => {

        try {
            const url = '/api/propiedades'
            const rta = await fetch(url)
            propiedades = await rta.json()

            mostrarPropiedades(propiedades)

        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = props => {

        //Limpiar makers previos
        makers.clearLayers()

        props.forEach(prop => {
            //Agregar pin
            const marker = new L.marker([prop?.lat,prop?.lng],{
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <p class='text-gray-600 text-indigo-600 font-bold'>${prop.categoria.nombre}</p>
                <h1 class='text-xl font-extrabold uppercase my-3'>${prop?.titulo}</h1>
                <img src='/uploads/${prop?.imagen}' alt='Imagen de la propiedad ${prop?.titulo}'/>
                <p class='text-gray-600 font-bold'>${prop.precio.nombre}</p>
                <a href='/propiedad/${prop?.id}' class='bg-indigo-600 block p-2 text-center font-bold uppercase text-white'>Ver Propiedad </a>
            `)

            makers.addLayer(marker)
        })
    }

    const filtrarPropiedades = () => {
        const result = propiedades.filter(filtrarCategoria).filter(filtrarPrecio)
        mostrarPropiedades(result)
    }

    const filtrarCategoria = (prop) => filtros.categoria ? prop.categoriaId === filtros.categoria : prop

    const filtrarPrecio = (prop) => filtros.precio ? prop.precioId === filtros.precio : prop
    

    obtenerPropiedades()


})()