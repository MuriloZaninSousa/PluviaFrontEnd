(function (window) {
    "use strict";

    window.pluvia = window.pluvia || { _isNamespace: true };

    const d3 = window.d3;

    const colorRange = [[0, '#E4FDFF'],[1, '#B5F0F8'],
                    [5, '#9BD3F8'],[10, '#2486EB'],
                    [15, '#1663CF'],[20, '#66FD89'],
                    [25, '#18D807'],[30, '#1EB51A'],
                    [40, '#FEEA71'],[50, '#FDC13C'],
                    [75, '#FF6002'],[100, '#E41301'],
                    [150, '#FF5B6F'],[200, '#DFDFDF']];

    const criarLegenda = (idLegenda, idRegua) => {
        let mili = [];
        let cores = ['#ffffff'];
        
        const data = d3.range(colorRange.length + 1);
        
        for (let i = 0; i < colorRange.length; i++) {        
            mili.push(colorRange[i][0]);
            cores.push(colorRange[i][1]);
        }
        
        const colors = d3.scaleLinear()
            .domain(d3.ticks(0,colorRange.length + 1,colorRange.length + 1))
            .nice(15)
            .range(cores);
        
        const svg = d3.select(idLegenda);
        
        const rects = svg.selectAll(".rects")
            .data(data)
            .enter()
            .append("rect")
            .attr("y", 20)
            .attr("height", 20)
            .attr("x", (d,i)=>20 + i*19.8)
            .attr("width", 21)
            .attr("fill", d=>colors(d)) //falta branco
            .attr("stroke", "#d0d0d0")
            .attr("stroke-width", 0.5)
        
        let pointScale = d3.scalePoint()
            .domain(mili)
            .range([0,260]);
        
        let axis = d3.axisBottom();
        
        axis.scale(pointScale);
        
        d3.select(idRegua).call(axis);
    }

    // funções públicas

    window.pluvia.legenda = function () {

        if(!d3) { throw new Error("A biblioteca d3.js não foi carregada."); }

        return {
            criarLegenda
        }
    }();

})(window);