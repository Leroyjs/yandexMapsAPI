ymaps.ready(init);

let places = [{
        coordx: 56.023,
        coordy: 36.988,
        hintContent: 'hint',
        balloonContent: 'balloon'
    },
    {
        coordx: 56.9,
        coordy: 36.0,
        hintContent: 'hint',
        balloonContent: 'balloon'
    },
    {
        coordx: 56.2,
        coordy: 36.0,
        hintContent: 'hint',
        balloonContent: 'balloon'
    },
    {
        coordx: 56.1,
        coordy: 36.0,
        hintContent: 'hint',
        balloonContent: 'balloon'
    },
    {
        coordx: 56.6,
        coordy: 36.0,
        hintContent: 'hint',
        balloonContent: 'balloon'
    }
]

function init() {
    // Создание карты.
    let myMap = new ymaps.Map("map", {
        center: [56.023, 36.988],
        zoom: 12
    });
    // Маркеры
    let geoPlaces = [];
    for (i = 0; places.length > i; i++) {

        geoPlaces[i] = new ymaps.Placemark([places[i].coordx, places[i].coordy], {
            hintContent: places[i].hintContent,
            balloonContent: places[i].balloonContent
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'media/point.png',
            iconImageSize: [44, 66],
            iconImageOffset: [-22, -66]

        });
    }

    //Кластер
    let cluster = new ymaps.Clusterer({

    });

    myMap.geoObjects.add(cluster);
    cluster.add(geoPlaces);
}








// var coords = [
//     [56.023, 36.988],
//     [56.025, 36.981],
//     [56.020, 36.981],
//     [56.021, 36.983],
//     [56.027, 36.987]
// ];
// var myCollection = new ymaps.GeoObjectCollection();

// // for (var i = 0; i < coords.length; i++) {
// //     myCollection.add(new ymaps.Placemark(coords[i], {}, {
// //         iconLayout: 'default#image',
// //         iconImageHref: 'media/point.png',
// //         iconImageSize: [44, 66],
// //         iconImageOffset: [-22, -66]
// //     }));
// // }
// var myGeoObjects = [];

// for (var i = 0; i < coords.length; i++) {
//     myGeoObjects[i] = new ymaps.GeoObject({
//         geometry: {
//             type: "Point",
//             coordinates: coords[i]
//         },
//         properties: {
//             clusterCaption: 'Геообъект № ' + (i + 1),
//             balloonContentBody: 'Текст балуна № ' + (i + 1)
//         }
//     });
// }

// var myClusterer = new ymaps.Clusterer({ clusterDisableClickZoom: true });
// myClusterer.add(myGeoObjects);
// myMap.geoObjects.add(myClusterer);