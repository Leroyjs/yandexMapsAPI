ymaps.ready(init);

let places = [{
    coords: [56.023, 36.988],
    adress: 'hint',
    comments: [{
        name: 'rvrv',
        time: '12.12.1231',
        place: 'rvrv',
        about: 'rvrtbt'
    }]
}]

let balloon = document.querySelector('.balloon');
let reviews = document.querySelector('.balloon__reviews');
let balloonAdress = document.querySelector('.balloon__adress');
let ok = document.querySelector('.ok');
console.log(reviews);
console.log(balloonAdress);
let x = document.querySelector('.x');
let activePlace;
x.addEventListener('click', () => {
    balloon.classList.remove('balloon_active');
})
ok.addEventListener('click', () => {
    addComment();
})
var date = new Date();
let Year = date.getUTCFullYear();
let Month = date.getMonth();
let Day = date.getDate();

function init() {
    var id = 0;
    // Создание карты.
    let myMap = new ymaps.Map("map", {
        center: [56.023, 36.988],
        zoom: 12
    });
    // Маркеры в памяти
    let geoPlaces = [];
    for (let i = 0; places.length > i; i++) {

        geoPlaces[i] = new ymaps.Placemark(places[i].coords, {
            hintContent: places[i].adress
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'media/point.png',
            iconImageSize: [44, 66],
            iconImageOffset: [-22, -66]
        });
        geoPlaces[i].id = id++;
        geoPlaces[i].events.add('click', function(e) {
            let eMap = e.get('target'); // Получение ссылки на объект, сгенерировавший событие (карта).
            console.log(eMap.id);
            balloon.classList.add('balloon_active');
            createPopup(eMap.id)
        });
    }

    //Кластер
    let cluster = new ymaps.Clusterer({

    });

    myMap.geoObjects.add(cluster);
    cluster.add(geoPlaces);


    var myPlacemark;
    myMap.events.add('click', function(e) {
        var coords = e.get('coords');
        myPlacemark = createPlacemark(coords);
        myPlacemark.id = id++;
        // Слушаем событие окончания перетаскивания на метке.
        myPlacemark.events.add('dragend', function() {
            getAddress(myPlacemark.geometry.getCoordinates());
        });
        getAddress(coords);
        console.log(myPlacemark)
        myMap.geoObjects.add(cluster);
        cluster.add(myPlacemark);
        myPlacemark.events.add('click', function(e) {
            balloon.classList.add('balloon_active');
            let eMap = e.get('target'); // Получение ссылки на объект, сгенерировавший событие (карта).
            createPopup(eMap.id)
        });
    });
    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {}, {
            iconLayout: 'default#image',
            iconImageHref: 'media/point.png',
            iconImageSize: [44, 66],
            iconImageOffset: [-22, -66]
        });
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        ymaps.geocode(coords).then(function(res) {
            var firstGeoObject = res.geoObjects.get(0);
            console.log(firstGeoObject.getAddressLine());
            places.push({
                coords: coords,
                adress: firstGeoObject.getAddressLine(),
                comments: []
            });

        });
    }

}

function createPopup(id) {
    if (places[id].comments.length == 0) {
        reviews.innerHTML = 'Ничего нет'
    } else {
        let reviewsDivs = ''
        for (let i = 0; places[id].comments.length > i; i++) {
            reviewsDivs += `
            <span class="balloon__text_bold">${places[id].comments[i].name}</span>
            <span class="balloon__text_thin">${places[id].comments[i].place} 13.12.2015</span>
            <p class="balloon__text">${places[id].comments[i].about}</p>`;
        }
        reviews.innerHTML = reviewsDivs;
    }
    balloonAdress.innerHTML = places[id].adress;
    activePlace = id;
}

function addComment() {
    let nameValue = document.querySelector('.form__name').value;
    let placeValue = document.querySelector('.form__place').value;
    let aboutValue = document.querySelector('.form__about').value;

    places[activePlace].comments.push({
        name: nameValue,
        time: Day + " " + Month + " " + Year,
        place: placeValue,
        about: aboutValue
    });
    createPopup(activePlace);
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