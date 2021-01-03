// ==UserScript==
// @name         Papa Hardware - Calculadora de custo por frame
// @namespace    https://dudaskank.com/
// @version      1.0
// @description  Adiciona calculadora de custo por frame ao Papa Hardware
// @author       Eduardo "Dudaskank" Oliveira
// @match        https://papahardware.net/*
// @grant none
// ==/UserScript==

(function() {
    'use strict';

    // calcula o custo por frame no onchange do input
    let onchangeCalcular = function (event) {
        let input = event.target;
        let valorKit = parseFloat(input.value).toFixed(2);
        input.value = valorKit;
        // calcula os novos custos por frame
        for(let i = 0; i < input.custoPorFrame.fps.length; i++) {
            const fps = input.custoPorFrame.fps[i];
            const custoPorFrame = (valorKit / fps).toFixed(2);
            input.custoPorFrame.valuesEl[i].innerHTML = isNaN(custoPorFrame) ? '--' : custoPorFrame;
        }
    };
    // selecioan texto no onfocus do input
    let onfocusCalcular = function (event) {
        let input = event.target;
        input.select();
    }

    //console.log('oi mundo do hardware');
    let frameCostBlocks = document.querySelectorAll('div.is-comparative div.d-md-block .block-frame-cost, div.container:not(.is-comparative) .block-frame-cost');
    //console.log(frameCostBlocks);
    Array.prototype.forEach.call(frameCostBlocks, function(block, i){
        let title = block.querySelector('h4');
        let input = document.createElement('input');
        input.type = 'text';
        input.title = 'Preço do kit';
        input.value = '123.45';
        //input.style.width = '100%';
        //input.class = 'dynamicCostPerFrame';
        // pegar valores dos fps nas 3 resoluções
        let gpuEl = block.parentNode;
        while(!gpuEl.classList.contains('col-sm-6')) {
            gpuEl = gpuEl.parentNode;
        }
        let fpsEl = gpuEl.querySelectorAll('.panel-simple-info tr td:nth-of-type(2)>span');
        //console.log(fpsEl);
        let fpsValues = new Array();
        for(let i = 0; i < fpsEl.length; i++) {
            fpsValues[i] = parseFloat(fpsEl[i].textContent.replace(/[^\d.-]/g, ''));
        }
        input.custoPorFrame = {};
        input.custoPorFrame.fps = fpsValues;
        //console.log(input.custoPorFrame.fps);
        // pega os 3 elementos com o custo/frame, e já calcula o custo atual do kit
        input.custoPorFrame.valuesEl = block.querySelectorAll('.block-frame-value .value');
        //console.log(input.custoPorFrame.valuesEl);
        let custoKit = (parseFloat(input.custoPorFrame.valuesEl[0].textContent.replace(/[^\d.-]/g, '')) * input.custoPorFrame.fps[0]).toFixed(2);
        //console.log(parseFloat(input.custoPorFrame.valuesEl[0].textContent.replace(/[^\d.-]/g, '')));
        //console.log(custoKit);
        input.value = custoKit;
        // coloca a função do onchange para calcular quando alterar o valor do kit
        input.onchange = onchangeCalcular;
        input.onfocus = onfocusCalcular;
        // adiciona o input na página, junto com um belo div, logo antes do bloco de custo por frame
        let divPanel = document.createElement('div');
        divPanel.classList.add('panel');
        divPanel.classList.add('panel-simple');
        let divPanelHeader = document.createElement('div');
        divPanelHeader.classList.add('panel-header');
        divPanelHeader.style['white-space'] = 'break-spaces';
        divPanelHeader.innerHTML = 'Preço do Kit ';
        //title.appendChild(input);
        divPanelHeader.appendChild(input);
        divPanel.appendChild(divPanelHeader);
        block.insertAdjacentElement('beforebegin', divPanel);
    });

})();
