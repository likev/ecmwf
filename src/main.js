import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import jquery from "jquery/src/jquery.js";
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import moment from 'moment';

window.$ = jquery;
window.bootstrap = bootstrap;

import config from './config';
import { fixedEncodeURIComponent, getUTCTimeStr } from "./utils"

const currentHour = moment().hour();
let minusday = currentHour >= 15 ? 0 : 1;
let basehour = (currentHour >= 15 || currentHour <= 5) ? 8 : 20;

let basetime = moment().hour(basehour).subtract(minusday, 'days');
let validtime = basetime.clone().add(12, 'hours');


let productType = 'medium-uv-rh';
let level = '500';

async function getProduct() {
    //https://apps.ecmwf.int/webapps/opencharts-api/v1/products/medium-uv-rh/?valid_time=2022-01-31T03%3A00%3A00Z&base_time=2022-01-31T00%3A00%3A00Z&projection=opencharts_eastern_asia&level=1000

    //const openchartsApi = 'https://apps.ecmwf.int/webapps/opencharts-api/v1/products';
    const openchartsApi = 'https://ecmwf-apps.tianqitu.net/webapps/opencharts-api/v1/products';

    //const cors_api = 'https://icors.vercel.app/';

    const productConfig = config[productType];

    let fetch_url = `${openchartsApi}/${productType}/?valid_time=${getUTCTimeStr(validtime)}&base_time=${getUTCTimeStr(basetime)}&projection=opencharts_eastern_asia&level=${level}&layer_name=${level}${productConfig.name}`;

    if (productConfig.type && productConfig.type === 'point-based') {
        fetch_url = `${openchartsApi}/${productType}/?base_time=${getUTCTimeStr(basetime)}&projection=opencharts_eastern_asia&epsgram=${level}&station_name=${productConfig.name}&lat=34.6836&lon=112.454`;
    }else if(productConfig.type && productConfig.type ==='point-based-profile'){
        fetch_url = `${openchartsApi}/${productType}/?valid_time=${getUTCTimeStr(validtime)}&base_time=${getUTCTimeStr(basetime)}&projection=opencharts_eastern_asia&station_name=${productConfig.name}&lat=34.6836&lon=112.454`;
    }

    //var ajax_api = `${cors_api}?${fixedEncodeURIComponent(fetch_url)}`;

    let f = await fetch(fetch_url);
    let result = await f.json();

    console.log(result)

    return result.data.link.href;
}

async function refresh() {
    let link = await getProduct();
    $('#result .chart').attr('src', link);
}

function update_levels() {
    const levels = config[productType].levels;

    const list = $('#levels');
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
        list.find('a').eq(0).trigger('click');
    }
}

function update_validdates() {


    const list = $('#validdates');
    list.html('');

    for (let span = 0; span <= 168; span += 12) {
        let date = basetime.clone().add(span, 'hours');

        list.append(`<li class="page-item ${date.isSame(validtime) ? 'active' : ''}" aria-current="page">
            <a class="page-link" href="#" data-utc='${getUTCTimeStr(date)}'  data-local='${+date}'><span class="fs-4">${date.date()}</span><span class="fs-6">${date.format("HH")}</span></a>
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
    update_levels();

    refresh();
})

$('#select-products').on('change', function () {
    productType = $(this).val();
    update_levels();

    const productConfig = config[productType];
    if (productConfig.type && productConfig.type === 'point-based') {
        $('#validdates').html('');
    }else{
        update_validdates();
    }

    refresh();
});

//refresh();

function set_basetime(){
    $('#basetime').val('起始场 ' + basetime.format('YYYY-MM-DD HH') + ' 北京时');
    $('#select-products').trigger('change');
}

$('#prevtime').on('click', function(){
    basetime.subtract(12, 'hours');
    set_basetime();
})

$('#nexttime').on('click', function(){
    basetime.add(12, 'hours');
    set_basetime();
})

set_basetime();
