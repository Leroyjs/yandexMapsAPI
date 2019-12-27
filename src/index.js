import css from './style.css';
ymaps.ready(init);

let places = []

let balloon = document.querySelector('.balloon');
let reviews = document.querySelector('.balloon__reviews');
let clusterMain = document.querySelector('.cluster__main');
let balloonAdress = document.querySelector('.balloon__adress');
let ok = document.querySelector('.ok');
let x = document.querySelector('.x');
let clusterX = document.querySelector('.cluster__x');
let activePlace;
let activeCluster;
let clusterPopUp = document.querySelector('.cluster');
clusterX.addEventListener('click', () => {
    clusterPopUp.classList.remove('balloon_active');
})
x.addEventListener('click', () => {
    balloon.classList.remove('balloon_active');
})
ok.addEventListener('click', () => {
    addComment();
})
var date = new Date();
let Year = date.getUTCFullYear();
let Month = date.getMonth() + 1;
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
            // iconLayout: 'default#image',
            // iconImageHref: 'media/point.png',
            // iconImageSize: [44, 66],
            // iconImageOffset: [-22, -66]
        }, );
        geoPlaces[i].id = id++;
        geoPlaces[i].events.add('click', function(e) {
            let eMap = e.get('target'); // Получение ссылки на объект, сгенерировавший событие (карта).
            balloon.classList.add('balloon_active');
            createBalloon(eMap.id)
        });
    }

    //Кластер
    let cluster = new ymaps.Clusterer({
        clusterDisableClickZoom: true
    });
    cluster.events.add('click', function(e) {
        let eMap = e.get('target'); // Получение ссылки на объект, сгенерировавший событие (карта).
        if (eMap.properties._data.geoObjects) {
            activeCluster = [];
            let reviewsDivs = ''
            let i = 0;
            for (i = 0; eMap.properties._data.geoObjects.length > i; i++) {
                activeCluster.push(eMap.properties._data.geoObjects[i].id);
                reviewsDivs += `<li class="${'id_'+eMap.properties._data.geoObjects[i].id}">${i+1}</li>`;
            }
            createPopup(--i);
            let ul = document.querySelector('.cluster__ul');
            ul.innerHTML = reviewsDivs;
            for (i = 0; eMap.properties._data.geoObjects.length > i; i++) {
                let li = document.querySelector(`.id_${eMap.properties._data.geoObjects[i].id}`);
                li.addEventListener("click", () => {
                    console.log(places);
                });
                let liId = eMap.properties._data.geoObjects[i].id;
                console.log(li);
                li.addEventListener('click', () => {
                    createPopup(liId);
                })
            }
            clusterPopUp.classList.add('balloon_active');
        }
    });
    cluster.options.set({
        clusterBalloonLayout: ymaps.templateLayoutFactory.createClass(""),
        clusterBalloonShadow: false
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
        myMap.geoObjects.add(cluster);
        cluster.add(myPlacemark);
        myPlacemark.events.add('click', function(e) {
            balloon.classList.add('balloon_active');
            let eMap = e.get('target'); // Получение ссылки на объект, сгенерировавший событие (карта).
            createBalloon(eMap.id)
        });
    });
    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {}, {
            // iconLayout: 'default#image',
            // iconImageHref: 'media/point.png',
            // iconImageSize: [44, 66],
            // iconImageOffset: [-22, -66]
        });
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        ymaps.geocode(coords).then(function(res) {
            var firstGeoObject = res.geoObjects.get(0);
            places.push({
                coords: coords,
                adress: firstGeoObject.getAddressLine(),
                comments: []
            });

        });
    }

}

function createBalloon(id) {
    if (places[id].comments.length == 0) {
        reviews.innerHTML = 'Ничего нет'
    } else {
        let reviewsDivs = ''
        for (let i = 0; places[id].comments.length > i; i++) {
            reviewsDivs += `
            <span class="balloon__text_bold">${places[id].comments[i].name}</span>
            <span class="balloon__text_thin">${places[id].comments[i].place} ${places[id].comments[i].time}</span>
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
        time: Day + "." + Month + "." + Year,
        place: placeValue,
        about: aboutValue
    });
    createBalloon(activePlace);
}

function createPopup(id) {
    console.log(places[id]);
    let reviewsDivs = `
    <h2 class="cluster__adress"><a class="a${id}" href="#">${places[id].adress}</a></h2>`;
    for (let i = 0; places[id].comments.length > i; i++) {
        reviewsDivs += `
        <h3 class="cluster__name">${places[id].comments[i].place}</h3>
        <p class="cluster__about">${places[id].comments[i].about}</p>`;
    }
    clusterMain.innerHTML = reviewsDivs;
    let popBalloon = document.querySelector('a.a' + id);
    popBalloon.addEventListener('click', function(e) {
        activePlace = id
        balloon.classList.add('balloon_active');
        clusterPopUp.classList.remove('balloon_active');
        createBalloon(activePlace)
    });
}