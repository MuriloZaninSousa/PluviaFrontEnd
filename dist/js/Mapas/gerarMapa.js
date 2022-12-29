(function (window) {
    "use strict";

    window.pluvia = window.pluvia || { _isNamespace: true };

    const $ = window.jQuery;
    const axios = window.axios;

    // ok, falta chamar o arquivo csv e fazer a função de geração do svg
    function gerarMapa(dateArray, mapasArray) {

        // vai pegar do back end futuramente para receber qual arquivo vai acessar
        const URL = `dados.json`;
        axios.request(URL)
            .then(async resposta => await filtrosMapas(resposta.data, dateArray, mapasArray))
            .catch(erro => console.error(erro));

        // fim 

        // imprime no html todos os mapas filtrados
        const filtrosMapas = async (data, dateArray, mapasArray) => {

            const mapasFiltrados = data
                .filter((item) => {
                    // filtro por tipo de mapa
                    for (let t = 0; mapasArray.length > t; t++) {
                        if (item.idTipo === mapasArray[t]) {
                            return item.idTipo;
                        }

                        for (let mt = 0; mapasArray[t].length > mt; mt++) {
                            // console.log(mapasArray[t][mt]);
                            if (item.idTipo === mapasArray[t][mt]) {
                                return item.idTipo;
                            }
                        }
                    }
                })
                .filter((item) => {
                    // filtro por datas
                    $('#resultadoMapas').empty();
                    for (let d = 0; dateArray.length > d; d++) {
                        if (item.data === dateArray[d].toString()) {
                            return item.data;
                        }
                    }
                });

            if (!pluvia.mapa.temCache()) {
                await pluvia.mapa.criarCacheMapa();
            }

            for (let i = 0; mapasFiltrados.length > i; i++) {
                // imprime o html do item filtrado
                htmlMapa(mapasFiltrados[i]);

                const idSVG = `#${mapasFiltrados[i].idTipo}_${mapasFiltrados[i].id}`;
                pluvia.mapa.criarMapa(idSVG);
                pluvia.imagemMapa.criarCanvasMapa(idSVG);
                
            }
        }
    }
 
    // depois que gerar o svg e imagem
    function htmlMapa(item) {
        const info = `
        <div class="item-mapa col-lg-4 col-md-6 col-sm-12 p-3 norus-mapa" id="${item.idTipo}_${item.id}">
            <div class="p-3 shadow rounded">
                <h3 class="fs-6 text-center"><strong>${item.titulo}</strong></h3>
                <div class="mapa-svg text-center">                    
                    <div id="${item.idTipo}_${item.id}_svg"></div>
                    <div id="${item.idTipo}_${item.id}_urlIMG"></div>
                    <div id="${item.idTipo}_${item.id}_urlPNG"></div>
                    <canvas width="810" height="950" style="width: 100%" id="${item.idTipo}_${item.id}_canvas"></canvas>

                    <div class="botoes-mapa d-flex justify-content-between d-flex align-items-center"> 
                        <p class="fs-8 d-flex align-items-center mb-0">
                            <strong>${item.data}</strong>
                        </p>
                        <button class="btn align-items-center" id="${item.idTipo}_${item.id}_downloadIMG">
                            <i class="fa-solid fa-download"></i>
                        </button>
                        <button class="btn align-items-center" id="${item.idTipo}_${item.id}_ampliarIMG">
                            <i class="fa-regular fa-arrow-up-right-and-arrow-down-left-from-center"></i>
                        </button>
                    </div>

                </div>
            </div>
        </div>`;

        $('#resultadoMapas').append(info);
    }

    window.pluvia.mapas = function () {

        if (!axios) { throw new Error("A biblioteca axios.js não foi carregada."); }
        if (!$) { throw new Error("A biblioteca jquery.js não foi carregada."); }

        return {
            gerarMapa,
        }
    }();

})(window);
