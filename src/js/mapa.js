(function() {
    const lat = document.querySelector('#lat').value || -31.4241298;
    const lng = document.querySelector('#lng').value ||  -64.1896442;
    const mapa = L.map('mapa').setView([lat, lng ], 14);
    let marker;
    
    //Utilizar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService()

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    marker = new L.marker([lat,lng],{
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    marker.on('moveend', function(e){
        marker = e.target

        const posicion = marker.getLatLng()

        mapa.panTo(new L.LatLng(posicion.lat,posicion.lng))

        //Obtener info de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion,14).run(function(err,res){
            marker.bindPopup(res.address.LongLabel)

            console.log(res)

            //llenar campos 
            document.querySelector('.calle').textContent = res?.address?.Address ?? ''
            document.querySelector('#calle').value = res?.address?.Address ?? ''
            document.querySelector('#lat').value = res?.latlng?.lat ?? ''
            document.querySelector('#lng').value = res?.latlng?.lng ?? ''
        })

    })

})()