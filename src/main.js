import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { jQuery } from "../jquery/src/jquery.js";

import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import moment from 'moment';

import AirDatepicker from 'air-datepicker'
import 'air-datepicker/air-datepicker.css'
import localeZh from 'air-datepicker/locale/zh';

window.$ = jQuery;
window.bootstrap = bootstrap;

import config from './config';
import { fixedEncodeURIComponent, getUTCTimeStr } from "./utils"

const currentHour = moment().hour();
let minusday = currentHour >= 15 ? 0 : 1;
let basehour = (currentHour >= 15 || currentHour <= 5) ? 8 : 20;

let basetime = moment().startOf('day').hour(basehour).subtract(minusday, 'days');
let validtime = basetime.clone().add(12, 'hours');


let productType = 'medium-uv-rh';
let productTypeName = 'medium-uv-rh';
let level = '500';


//const openchartsApi = 'https://charts.ecmwf.int/opencharts-api/v1/';
const openchartsApi = 'https://ecmwf-apps.tianqitu.net/opencharts-api/v1/';

//const cors_api = 'https://icors.vercel.app/';

async function getProduct() {

    const productConfig = config[productType];

    let fetch_body = {
        "package": "opencharts",
        "product": productTypeName,
        "format": "png",
        "base_time": getUTCTimeStr(basetime),
        "valid_time": getUTCTimeStr(validtime),

    };

    if (productConfig.type) {

        if (productConfig.type === 'point-based') {
            fetch_body.epsgram = level;
            fetch_body.station_name = productConfig.name;
            fetch_body.lat = '34.6836';
            fetch_body.lon = '112.454';
        } else if (productConfig.type === 'point-based-profile') {
            fetch_body.station_name = productConfig.name;
            fetch_body.lat = '34.6836';
            fetch_body.lon = '112.454';
        } else if (productConfig.type === 'single-level') {
            fetch_body.projection = "opencharts_eastern_asia";

            if (productConfig.interval) fetch_body.interval = productConfig.interval || 12;
        }
    } else {
        fetch_body.level = level;
        fetch_body.projection = "opencharts_eastern_asia";
    }

    //var ajax_api = `${cors_api}?${fixedEncodeURIComponent(fetch_url)}`;

    let f = await fetch(openchartsApi + 'export/', {
        "body": JSON.stringify(fetch_body),
        "method": "POST",
        "mode": "cors"
    });

    if (!f.ok) return false;

    let result = await f.json();

    console.log(result)

    return result.url;
}

async function getProduct2() {

    //https://charts.ecmwf.int/opencharts-api/v1/packages/opencharts/products/graphcast_medium-mslp-rain/axis/valid_time/?base_time=202402191200&projection=opencharts_eastern_asia&interval=12&values=202402240600

    const productConfig = config[productType];

    let fetch_info = {
        "package": "opencharts",
        "product": productTypeName,
        "format": "png",
        "base_time": getUTCTimeStr(basetime),
        "valid_time": getUTCTimeStr(validtime),
        "station_name": productConfig.name,
        "interval": productConfig.interval || 12
    };

    let fetch_query = `${openchartsApi}packages/opencharts/products/${productTypeName}/axis/`;
    let timeID = fetch_info.valid_time;

    if (productConfig.type) {
        //https://charts.ecmwf.int/opencharts-api/v1/packages/opencharts/products/opencharts_meteogram/axis/base_time/?epsgram=classical_10d&lat=34.6836&lon=112.454&station_name=Luoyang&values=202402191200
        if (productConfig.type === 'point-based') {
            timeID = fetch_info.base_time;
            fetch_query += `base_time/?epsgram=${level}&lat=34.6836&lon=112.454&station_name=${fetch_info.station_name}&values=${timeID}`;
        } else if (productConfig.type === 'point-based-profile') {
            timeID = fetch_info.base_time;
            fetch_query += `base_time/?lat=34.6836&lon=112.454&station_name=${fetch_info.station_name}&values=${timeID}`;
        } else if (productConfig.type === 'single-level') {
            //https://charts.ecmwf.int/opencharts-api/v1/packages/opencharts/products/graphcast_medium-mslp-rain/axis/valid_time/?base_time=202402191200&projection=opencharts_eastern_asia&interval=12&values=202402240600
            fetch_query += `valid_time/?base_time=${fetch_info.base_time}&projection=opencharts_eastern_asia&values=${timeID}`;

            if (productConfig.interval) fetch_query += `&interval=${fetch_info.interval}`;
        }
    } else {
        fetch_query += `valid_time/?base_time=${fetch_info.base_time}&projection=opencharts_eastern_asia&values=${timeID}&level=${level}`;
    }

    //var ajax_api = `${cors_api}?${fixedEncodeURIComponent(fetch_url)}`;

    let f = await fetch(fetch_query, {
        "method": "GET",
        "mode": "cors"
    });

    if (!f.ok) return false;

    let response = await f.json();

    console.log(response)

    return response.results[timeID].url;
}

async function refresh() {
    $('#chart-spinner').show();
    //$('#result .chart').hide();

    $('#result .chart').attr('src', '#');

    let link = await getProduct();
    if (link === false){
        link = await getProduct2();

        $('#result.chart-transform .chart-title').hide();
        $('#result.chart-transform .chart-legend').hide();

        $('#result.chart-transform .chart-body .chart').css('margin-top', '-900px')
    }else{
        $('#result.chart-transform .chart-title').show();
        $('#result.chart-transform .chart-legend').show();

        $('#result.chart-transform .chart-body .chart').css('margin-top', '-1300px')
    }

    $('#result .chart').attr('src', link);
}

$('#result .chart').on('load', function () {
    $('#chart-spinner').hide();
    //$('#result .chart').show();
})

function update_levels_dom() {
    const levels = config[productType].levels;

    const list = $('#levels');

    //recreate dom
    list.html('');

    let contain = false;

    levels.forEach(function (val) {

        let active_str = ` " `;
        if (val + '' === level) {
            contain = true;
            active_str = ` active" aria-current="true" `;
        }

        list.prepend(`<a href="#" data-level='${val}' class="list-group-item list-group-item-action ${active_str}>
            ${val}
          </a>`);

    })

    if (!contain) {
        const levelEl = list.find('a').eq(0);

        levelEl.addClass('active').attr('aria-current', 'true');

        level = levelEl.data('level') + '';
    }
}

function update_validdates() {

    const MAX_FORCAST_PERIOD = 240; //240 hours
    const list = $('#validdates');
    list.html('');

    for (let span = 0; span <= MAX_FORCAST_PERIOD; span += 12) {
        let date = basetime.clone().add(span, 'hours');
        const hour = date.hour();

        list.append(`<li class="page-item ${date.isSame(validtime, 'hour') ? 'active' : ''}" aria-current="page">
            <a class="page-link" href="#" data-utc='${getUTCTimeStr(date)}'  data-local='${+date}'><span class="fs-3">${hour === 8 ? date.date() : ''}</span><span class="fs-6">${date.format("HH")}</span></a>
          </li>`)

    }
}

update_validdates();

$('#validdates').on('click', '.page-link', function () {
    const time = $(this).data('local');
    validtime = moment(time);

    update_validdates();

    refresh();
})

$('#levels').on('click', 'a', function () {
    level = $(this).data('level') + '';
    //update_levels_dom();
    $('#levels a').removeClass('active').removeAttr('aria-current');
    $(this).addClass('active').attr('aria-current', 'true');

    refresh();
})

$('#models-form-check').on('click', 'input', function () {
    console.log(this.value);
    productTypeName = this.value;

    refresh();

    //return false; //should not prevent default browser change
})

$('#select-products').on('change', function () {
    productType = $(this).val();
    update_levels_dom();

    const productConfig = config[productType];
    if (productConfig.type && productConfig.type === 'point-based') {
        $('#validdates').hide();
    } else {
        $('#validdates').show();
    }

    //css
    if (productConfig.type &&
        (productConfig.type === 'point-based' || productConfig.type === 'point-based-profile')) {

        $('#result').removeClass('chart-transform').addClass('chart-point');

    } else {
        $('#result').removeClass('chart-point').addClass('chart-transform');
    }

    $('#models-form-check').html('');
    if (productConfig.models) {

        let count = 0;
        for (const name in productConfig.models) {
            const val = productConfig.models[name];
            $('#models-form-check').append(`<input class="form-check-input" type="radio" ${count === 0 ? "checked" : ""} name="modelSelect" value='${val}' id="model${count}">
        <label class="form-check-label" for="model${count}">${name}</label>`);

            if (count === 0) productTypeName = val;
            count++;
        }
    } else {
        productTypeName = productType;
    }

    refresh();
});

//refresh();

function change_basetime() {

    update_validdates();

    refresh();
}

//AirDatepicker only select date without time and format is done with basetime
//we use basetime as center
let dp = new AirDatepicker('#basetime', {
    locale: localeZh,

    toggleSelected: false,
    onSelect({ date }) {
        change_basetime();
    },
    dateFormat(date) {//dateFormat is before onSelect and there may be twice dateFormat when select
        console.log(date);
        basetime = moment(date).hour(basetime.hour());

        return '起始场 ' + basetime.format('YYYY-MM-DD HH') + ' 北京时';
    }
})

//
$('#prevtime').on('click', function () {
    basetime.subtract(12, 'hours');
    dp.selectDate(basetime.toDate(), { silent: false })

    //change_basetime();
})

$('#nexttime').on('click', function () {
    basetime.add(12, 'hours');
    dp.selectDate(basetime.toDate(), { silent: false })

    //change_basetime();
})

//change_basetime();
dp.selectDate(basetime.toDate(), { silent: true });
$('#select-products').trigger('change');
