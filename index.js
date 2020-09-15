let woeid = null;
let tempInformations = null;
let searchPanel = document.querySelector('.search-menu');
let btnSearch = document.querySelector('.search-engine-input-field-conteiner button');


let app = new Vue({
    el: '#app',
    data: {
        tempInformations: [],
        actualLocation: 0,
        title: 'Loading',
        img: 'https://www.metaweather.com/static/img/weather/' + 'c' + '.svg',
        unit: 'ºC',
        data: new Date().toDateString(),
        actualTemp: 0,
        theTemp: 0,
        windSpeed: 0,
        humidity: 0,
        stateDesc: 0,
        visibility: 0,
        airPressure: 0,
        fahrenheitFlag: false,
        searchResults: [],
        searchedPlace: '',
        displaySearchPanel: 'none'
    },
    computed: {
        date() {
            return this.data.split(' ')[0] + ', ' + this.data.split(' ')[2] + ' ' + this.data.split(' ')[1]
        },
    },
    methods: {
        displayInfo(id) {
            let tempData = this.tempInformations[id];

            this.data = tempData.date;
            this.actualTemp = this.tempInformations[id].theTemp;
            this.windSpeed = tempData.windSpeed;
            this.humidity = tempData.humidity;
            this.visibility = tempData.visibility;
            this.airPressure = tempData.airPressure;
            this.stateDesc = tempData.stateDesc;
            this.img = tempData.img;
        },
        fahrenheit() {
            if (!this.fahrenheitFlag) {
                this.actualTemp = (this.actualTemp * 1.8 + 32).toFixed(2);
                for (let i = 0; i < this.tempInformations.length; i++) {
                    this.tempInformations[i].minTemp = (this.tempInformations[i].minTemp * 1.8 + 32).toFixed(2);
                    this.tempInformations[i].maxTemp = (this.tempInformations[i].maxTemp * 1.8 + 32).toFixed(2);
                    this.tempInformations[i].theTemp = (this.tempInformations[i].theTemp * 1.8 + 32).toFixed(2);
                }
                this.fahrenheitFlag = true;
                this.unit = 'ºF';
            }
        },
        celcius() {
            if (this.fahrenheitFlag) {
                this.actualTemp = ((this.actualTemp - 32) * 5 / 9).toFixed(2);
                for (let i = 0; i < this.tempInformations.length; i++) {
                    this.tempInformations[i].minTemp = ((this.tempInformations[i].minTemp - 32) * 5 / 9).toFixed(2);
                    this.tempInformations[i].maxTemp = ((this.tempInformations[i].maxTemp - 32) * 5 / 9).toFixed(2);
                    this.tempInformations[i].theTemp = ((this.tempInformations[i].theTemp - 32) * 5 / 9).toFixed(2);
                }
                this.fahrenheitFlag = false;
                this.unit = 'ºC';
            }
        },
        searchForPlace() {
            btnSearch.disabled = true;
            btnSearch.style.backgroundColor = '#868686 !important';
            btnSearch.innerText = 'Searching';
            if (this.searchedPlace.trim()) {
                fetch('https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=' + this.searchedPlace).then(function (response) {
                    return response.json();
                }).then((data) => {
                    this.searchResults = [];

                    for (let i = 0; i < data.length; i++) {
                        this.searchResults.push(data[i]);
                    }
                    console.log(this.searchResults);
                    btnSearch.innerText = 'Search'
                })
            } else {
                alert('Please Insert something at the field!')
                btnSearch.innerText = 'Search'
            }
        },
        searchAboutLocation(woeid) {
            fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid}`).then(function (response) {
                return response.json()
            }).then(function (data) {
                tempInformations = data.consolidated_weather;

                app.woeid = woeid;
                app.title = data.title;
                app.img = 'https://www.metaweather.com/static/img/weather/' + tempInformations[0].weather_state_abbr + '.svg';
                app.unit = 'ºC';
                app.data = new Date().toDateString();
                app.actualTemp = tempInformations[0].the_temp.toFixed(2);
                app.theTemp = tempInformations[0].the_temp.toFixed(2);
                app.windSpeed = tempInformations[0].wind_speed.toFixed(2);
                app.humidity = tempInformations[0].humidity.toFixed(2);
                app.stateDesc = tempInformations[0].weather_state_name;
                app.visibility = tempInformations[0].visibility.toFixed(2);
                app.airPressure = tempInformations[0].air_pressure.toFixed(1);
                app.fahrenheitFlag = false;
                app.searchResults = [];
                app.searchedPlace = '';
                app.displaySearchPanel = 'none'

                for(let i = 0; i < tempInformations.length; i++){
                    app.tempInformations[i].date = generateDate(tempInformations[i].applicable_date),
                    app.tempInformations[i].img = 'https://www.metaweather.com/static/img/weather/' + tempInformations[i].weather_state_abbr + '.svg',
                    app.tempInformations[i].theTemp = tempInformations[i].the_temp.toFixed(2),
                    app.tempInformations[i].maxTemp = tempInformations[i].max_temp.toFixed(2),
                    app.tempInformations[i].minTemp = tempInformations[i].min_temp.toFixed(2),
                    app.tempInformations[i].windSpeed = tempInformations[i].wind_speed.toFixed(2),
                    app.tempInformations[i].humidity = tempInformations[i].humidity,
                    app.tempInformations[i].visibility = tempInformations[i].visibility.toFixed(2),
                    app.tempInformations[i].airPressure = tempInformations[i].air_pressure,
                    app.tempInformations[i].state = tempInformations[i].weather_state_abbr,
                    app.tempInformations[i].stateDesc = tempInformations[i].weather_state_name
                }
            }).catch(function (reason) {
                console.log(reason.message)
            })
        },
        openSearchPanel() {
            this.displaySearchPanel = 'block';
            searchPanel.style.display = 'block !important';
        },
        closeSearchPanel() {
            this.displaySearchPanel = 'none';
            searchPanel.style.display = 'none !important';
        },
    }
})



function generateDate(date) {
    date = date.split('-')
    date = new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2])).toDateString();

    return date.split(' ')[0] + ', ' + date.split(' ')[2] + ' ' + date.split(' ')[1]
}


function getWoeid() {
    fetch('https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=london').then(function (response) {
        return response.json()
    }).then(function (data) {
        woeid = data[0].woeid;

        fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid.toString()}`).then(function (response) {
            return response.json()
        }).then(function (data) {
            tempInformations = data.consolidated_weather

            app.tempInformations = [
                {
                    date: generateDate(tempInformations[0].applicable_date),
                    img: 'https://www.metaweather.com/static/img/weather/' + tempInformations[0].weather_state_abbr + '.svg',
                    theTemp: tempInformations[0].the_temp.toFixed(2),
                    maxTemp: tempInformations[0].max_temp.toFixed(2),
                    minTemp: tempInformations[0].min_temp.toFixed(2),
                    windSpeed: tempInformations[0].wind_speed.toFixed(2),
                    humidity: tempInformations[0].humidity,
                    visibility: tempInformations[0].visibility.toFixed(2),
                    airPressure: tempInformations[0].air_pressure,
                    state: tempInformations[0].weather_state_abbr,
                    stateDesc: tempInformations[0].weather_state_name
                },
                {
                    date: generateDate(tempInformations[1].applicable_date),
                    img: 'https://www.metaweather.com/static/img/weather/' + tempInformations[1].weather_state_abbr + '.svg',
                    theTemp: tempInformations[1].the_temp.toFixed(2),
                    maxTemp: tempInformations[1].max_temp.toFixed(2),
                    minTemp: tempInformations[1].min_temp.toFixed(2),
                    windSpeed: tempInformations[1].wind_speed.toFixed(2),
                    humidity: tempInformations[1].humidity,
                    visibility: tempInformations[1].visibility.toFixed(2),
                    airPressure: tempInformations[1].air_pressure,
                    state: tempInformations[1].weather_state_abbr,
                    stateDesc: tempInformations[1].weather_state_name
                },
                {
                    date: generateDate(tempInformations[2].applicable_date),
                    img: 'https://www.metaweather.com/static/img/weather/' + tempInformations[2].weather_state_abbr + '.svg',
                    theTemp: tempInformations[2].the_temp.toFixed(2),
                    maxTemp: tempInformations[2].max_temp.toFixed(2),
                    minTemp: tempInformations[2].min_temp.toFixed(2),
                    windSpeed: tempInformations[2].wind_speed.toFixed(2),
                    humidity: tempInformations[2].humidity,
                    visibility: tempInformations[2].visibility.toFixed(2),
                    airPressure: tempInformations[2].air_pressure,
                    state: tempInformations[2].weather_state_abbr,
                    stateDesc: tempInformations[2].weather_state_name
                },
                {
                    date: generateDate(tempInformations[3].applicable_date),
                    img: 'https://www.metaweather.com/static/img/weather/' + tempInformations[3].weather_state_abbr + '.svg',
                    theTemp: tempInformations[3].the_temp.toFixed(2),
                    maxTemp: tempInformations[3].max_temp.toFixed(2),
                    minTemp: tempInformations[3].min_temp.toFixed(2),
                    windSpeed: tempInformations[3].wind_speed.toFixed(2),
                    humidity: tempInformations[3].humidity,
                    visibility: tempInformations[3].visibility.toFixed(2),
                    airPressure: tempInformations[3].air_pressure,
                    state: tempInformations[3].weather_state_abbr,
                    stateDesc: tempInformations[3].weather_state_name
                },
                {
                    date: generateDate(tempInformations[4].applicable_date),
                    img: 'https://www.metaweather.com/static/img/weather/' + tempInformations[4].weather_state_abbr + '.svg',
                    theTemp: tempInformations[4].the_temp.toFixed(2),
                    maxTemp: tempInformations[4].max_temp.toFixed(2),
                    minTemp: tempInformations[4].min_temp.toFixed(2),
                    windSpeed: tempInformations[4].wind_speed.toFixed(2),
                    humidity: tempInformations[4].humidity,
                    visibility: tempInformations[4].visibility.toFixed(2),
                    airPressure: tempInformations[4].air_pressure,
                    state: tempInformations[4].weather_state_abbr,
                    stateDesc: tempInformations[4].weather_state_name
                },
                {
                    date: generateDate(tempInformations[5].applicable_date),
                    img: 'https://www.metaweather.com/static/img/weather/' + tempInformations[5].weather_state_abbr + '.svg',
                    theTemp: tempInformations[5].the_temp.toFixed(2),
                    maxTemp: tempInformations[5].max_temp.toFixed(2),
                    minTemp: tempInformations[5].min_temp.toFixed(2),
                    windSpeed: tempInformations[5].wind_speed.toFixed(2),
                    humidity: tempInformations[5].humidity,
                    visibility: tempInformations[5].visibility.toFixed(2),
                    airPressure: tempInformations[5].air_pressure,
                    state: tempInformations[5].weather_state_abbr,
                    stateDesc: tempInformations[5].weather_state_name
                }
            ];

            app.actualLocation = woeid;
            app.title = data.title;
            app.img = 'https://www.metaweather.com/static/img/weather/' + tempInformations[0].weather_state_abbr + '.svg';
            app.unit = 'ºC';
            app.data = new Date().toDateString();
            app.actualTemp = tempInformations[0].the_temp.toFixed(2);
            app.theTemp = tempInformations[0].the_temp.toFixed(2);
            app.windSpeed = tempInformations[0].wind_speed.toFixed(2);
            app.humidity = tempInformations[0].humidity.toFixed(2);
            app.stateDesc = tempInformations[0].weather_state_name;
            app.visibility = tempInformations[0].visibility.toFixed(2);
            app.airPressure = tempInformations[0].air_pressure.toFixed(1);

        }).catch(function (reason) {
            console.log(reason.message)
            app.title = 'Error while requesting data';
        })
    }).catch(function (reason) {
        console.log(reason.message)
        app.title = 'Sorry try it later!';
    })
}


getWoeid()
