(function (window) {
    "use strict";

    window.pluvia = window.pluvia || { _isNamespace: true };

    const $ = window.jQuery;
    const axios = window.axios;

    // É preciso criar fora das funções, se não uma função apaga a informação gravada da outra.
    let arrayDatasCalendario = [];
    let arrayTiposMapas = [];
    

    // ok, funcionando
    const listarTiposMapas = (idTiposMapas, idCompararUnicoMapa) => {
        const URLTipo = `tiposMapas.json`;      
        
        axios.request(URLTipo)
        .then(resposta => tipoMapaHtml(resposta.data, idTiposMapas, idCompararUnicoMapa) )
        .catch(erro => console.error(erro));

        function tipoMapaHtml(data, idTiposMapas, idCompararUnicoMapa) {
            let option = '<option>Selecione o tipo</option>';
            for (let i = 0; data.length > i; i++) {
                option += '<option value="'+ data[i].id +'">'+ data[i].nome +'</option>';
            }
            $(idTiposMapas).append(option);        
            $(idTiposMapas).selectpicker('destroy');
            $(idTiposMapas).selectpicker();
        }
    }

    // ok, funcionando
    const filtroMapas = (idTiposMapas, idCompararUnicoMapa) => {
        arrayDatasCalendario = [$(startDate).val(), $(finishDate).val()];

        // Seleciona o tipo de mapa
        $(idTiposMapas).on("change", () => {
            arrayTiposMapas = [$(idTiposMapas).val()];
            // chama a requisição com a lista de mapas
            pluvia.mapas.gerarMapa(arrayDatasCalendario, arrayTiposMapas);
        });
    }

    // ok, funcionando
    const calendarioPrevisoes = (classDatepicker, idStartDate, idFinishDate) => {
        
        $(classDatepicker).datepicker({
            monthNames: ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
            monthNamesShort:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
            dayNames:["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"],
            dayNamesShort:["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
            dayNamesMin:["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
            minDate: 0,
            dateFormat: "dd/mm/yy",
    
            beforeShowDay: (date) => {
                let dataInicioFormatada = $.datepicker.parseDate('dd/mm/yy', $(idStartDate).val());
                let dataFinalFormatada = $.datepicker.parseDate('dd/mm/yy', $(idFinishDate).val());
                return [true, dataInicioFormatada && ((date.getTime() == dataInicioFormatada.getTime()) || (dataFinalFormatada && date >= dataInicioFormatada && date <= dataFinalFormatada)) ? "dp-highlight" : ""];
            },
            onSelect: (dateText, inst) => {
                arrayDatasCalendario = [];
                let dataInicioFormatada = $.datepicker.parseDate('dd/mm/yy', $(idStartDate).val());
                let dataFinalFormatada = $.datepicker.parseDate('dd/mm/yy', $(idFinishDate).val());
                // let selectedDate = $.datepicker.parseDate('dd/mm/yy', dateText);
                
                let calcData = new Date(dataInicioFormatada);
                
                if (!dataFinalFormatada) {
                    let dataFormatada = calcData.getDate() + '/' + (calcData.getMonth() + 1) + '/' + calcData.getUTCFullYear();
                    arrayDatasCalendario.push(dataFormatada);

                } else {

                    if( dataFinalFormatada < dataInicioFormatada ) {
                        $(idFinishDate).val( $(idStartDate).val() );
                        $(idStartDate).val( dateText );
                        $(this).datepicker();                    
                    }

                    while (calcData <= dataFinalFormatada) {
    
                        let dataFormatada = calcData.getDate() + '/' + (calcData.getMonth() + 1) + '/' + calcData.getUTCFullYear();
                        arrayDatasCalendario.push(dataFormatada);
    
                        calcData.setDate(calcData.getDate() + 1);
                    }             
                }
                pluvia.mapas.gerarMapa(arrayDatasCalendario, arrayTiposMapas);
            }
        });

    }

    // ok, funcionando
    const compararMapa = (idCompararUnicoMapa, idStartDate, idFinishDate, idResultadoMapas, idTiposMapas) => {
        // Limpa o html e o array com os tipos de mapa selecionados
        $(idCompararUnicoMapa).on("click", () => {
            arrayTiposMapas = [];
            arrayDatasCalendario = [];
            $(idResultadoMapas).empty();
            $(idFinishDate).val('');
            $(idFinishDate).fadeToggle();
            $(idStartDate).val('');
            $(idTiposMapas).val('');

            const selectTipo = document.getElementById('tiposMapas');
            if (!$(idCompararUnicoMapa).prop("checked")) {
                selectTipo.setAttribute('multiple', '');
                $(idTiposMapas).selectpicker('destroy');
                $(idTiposMapas).selectpicker();
            }  else {
                selectTipo.removeAttribute('multiple', '');
                $(idTiposMapas).selectpicker('destroy');
                $(idTiposMapas).selectpicker();
            }
        });
    }

    window.pluvia.filtrosMapas = function () {

        if(!axios) { throw new Error("A biblioteca axios.js não foi carregada."); }
        if(!$) { throw new Error("A biblioteca jquery.js não foi carregada."); }
        
        return {
            listarTiposMapas,
            filtroMapas,
            calendarioPrevisoes,
            compararMapa,
        }
    }();

})(window);
