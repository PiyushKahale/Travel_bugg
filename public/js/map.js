mapboxgl.accessToken = "pk.eyJ1IjoicHl1c2g2NzEiLCJhIjoiY20xcWtmMGhqMDB3bTJqczY5dW5wMGRkdCJ9.7ehuevygWnRriXvICF_Ksw";

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// console.log(coordinates);

const marker = new mapboxgl.Marker({ color: "red"})
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.location}</h4><p>Exact Location Provided!</p>`))
    .addTo(map);