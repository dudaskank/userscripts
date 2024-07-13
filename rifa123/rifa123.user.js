// ==UserScript==
// @name         Rifa 321 - Botoões utilitários
// @namespace    https://dudaskank.com/
// @version      1.0.20240712
// @description  Botões para limpar seleção e selecionar vários aleatórios
// @author       Eduardo "Dudaskank" Oliveira
// @match        https://rifa321.com/rifa/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==

// @grant none
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("Estamos na rifa321");

    const btnAvailable = [...document.querySelectorAll("button[data-status='available']")];
    console.log(btnAvailable.length, 'rifas disponíveis');

    const generateElements = function(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.children;
    }
 
    const onclickLimpar = function (event) {
        console.log('limpando seleção');
        const btnMarcados = document.querySelectorAll("button[data-status='available'][data-raffle-active='true']");
        console.log('marcados', btnMarcados.length);
        btnMarcados.forEach(bt => {
            bt.click();
        });
    }

    const onclickEscolher = function (event) {
        console.log('escolhendo rifas aleatoriamente dentre as possíveis', btnAvailable.length);
        onclickLimpar();
        if (btnAvailable.length > 0) {
            let strRifas = prompt('Quantas rifas deseja?', btnAvailable.length);
            const nRifas = parseInt(strRifas);
            console.log(nRifas, 'rifas desejadas');
            if (nRifas >=1 && nRifas <= btnAvailable.length) {
                // embaralha
                for (let index = 0; index < btnAvailable.length; index++) {
                    const randomIndex = Math.floor(Math.random() * btnAvailable.length);
                    [btnAvailable[index], btnAvailable[randomIndex]] = [btnAvailable[randomIndex], btnAvailable[index]];
                }
                // sorteia
                const rifas = btnAvailable.slice(0, nRifas);
                rifas.forEach(rifa => {
                    //console.log(rifa.getAttribute("data-raffle-number"));
                    rifa.click();
                });
            } else {
                console.log(nRifas, 'é um valor inválido');
            }
        }
    }

    const hrs = document.querySelectorAll("hr");
    if (hrs) {
        const hrAntesDasRifas = hrs ? hrs[hrs.length - 1] : null;
        let btnLimpar = generateElements("<button class='btn btn-dark'>Limpar seleção</button>")[0];
        btnLimpar.onclick = onclickLimpar;
        hrAntesDasRifas.after(btnLimpar);
        hrAntesDasRifas.after(" ");
        let btnEscolher = generateElements("<button class='btn btn-dark'>Escolher rifas aleatoriamente</button>")[0];
        btnEscolher.onclick = onclickEscolher;
        hrAntesDasRifas.after(btnEscolher);
    }


})();
