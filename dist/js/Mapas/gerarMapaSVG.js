(function (window) {
  "use strict";

  window.pluvia = window.pluvia || { _isNamespace: true };

  const d3 = window.d3;

  let cache = {};

  const width = 810, height = 950;
  // o limite da projeção que será usada.
  // no momento, abranje toda a região do arquivo ./data/Dia00.csv
  const bounds = [[-75, -40], [-35, 10]];

  // com base no limite, cria uma projeção mmm
  const projection = d3.geoMercator()
    .scale(width)
    .translate([width / 2, height / 3])
    .rotate([(bounds[0][0] + bounds[1][0]) / -2,
    (bounds[0][0] + bounds[1][1]) / -18]);

  // as faixas de cores que serão usadas na legenda. 14 padrão
  const colorRange = [[0, '#E4FDFF'], [1, '#B5F0F8'],
  [5, '#9BD3F8'], [10, '#2486EB'],
  [15, '#1663CF'], [20, '#66FD89'],
  [25, '#18D807'], [30, '#1EB51A'],
  [40, '#FEEA71'], [50, '#FDC13C'],
  [75, '#FF6002'], [100, '#E41301'],
  [150, '#FF5B6F'], [200, '#DFDFDF']];

  // não sei se isso é exatamente a resolução do mapa.
  const resolution = 1_000_000;

  const csvMapa = "./data/Dia02.csv";

  const contourConfig = d3.contourDensity()
    .x(d => d[0])
    .y(d => d[1])
    .size([width, height])
    .cellSize(1.1)
    .bandwidth(2.6);

  // obtem a cor que será usada a partir do volume.
  const _getColor = volume => {
    for (let i = 0; i < colorRange.length; i++) {
      if (volume < colorRange[i][0]) {
        return colorRange[i][1];
      }
    }
    return colorRange[colorRange.length - 1][1];
  };


  const criarCacheMapa = async () => {

    const brasilData = await d3.json("./data/brasil_estados.json");
    const watershedsData = await d3.json("./data/mapeamento_gifs.geojson");
    // define a area onde o mapa será desenhado em tela
    const path = d3.geoPath().projection(projection);

    // cria o elemento svg no documento.
    let svg = d3.create("svg")
      .attr("width", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background-color", "white");
      // .attr("version", 1.1)
      // .attr("xmlns", "http://www.w3.org/2000/svg");

    _brasilMap(svg, brasilData, path);
    _watershedsMap(svg, watershedsData, path);
    cache.svg = svg;

  }

  // obtém em qual posição da legenda o volume está.
  const _getColorIndex = volume => {
    for (let i = 0; i < colorRange.length; i++) {
      if (volume <= colorRange[i][0]) {
        return i;
      }
    }
    return colorRange.length - 1;
  };

  // carrega o array do arquivo Dia00.csv e o converte para o formato geojson.
  const _formatGrid = ([lon, lat, volume]) => {
    return {
      "centroid": projection([lon, lat]),
      "volume": volume,
      "index": _getColorIndex(volume)
    }
  };

  // formata a linha carregada do arquivo .csv para numérico.
  // exemplo: [-76, 10, 20.28]
  const _formatRow = row => [row.lon, row.lat, row.volume]
    .map(value => +value.replace(',', '.'));

  // obtem o array de dados no formato que será usado
  // para gerar os contornos do mapa.
  // para isso, os pontos são replicados de acordo com o índice de volume.
  // assim, tendo i como valor do índice pluviométrico, haverão i replicações.
  const _getContourData = gridPoints => {
    let contourData = [];
    for (let i = 0; i < gridPoints.length; i++) {
      for (let j = 0; j < gridPoints[i].index; j++) {
        contourData.push(gridPoints[i].centroid);
      }
    }
    return contourData;
  };

  //Contornos Mapa Brasil/Estados
  const _brasilMap = (svg, brasil, path) => svg
    .append("g")
    .attr("class", "brasil")
    .selectAll("path")
    .data(brasil.features)
    .enter().append("path")
    .attr("stroke-width", 2.0)
    .style("stroke", "#878787")
    .style("fill", "none")
    .attr("d", path);

  //Contornos bacias
  const _watershedsMap = (svg, watersheds, path) =>
    svg
      .append("g")
      .attr("class", "watersheds")
      .selectAll("path")
      .data(watersheds.features)
      .enter().append("path")
      .attr("stroke-width", 2.5)
      .style("stroke", "black")
      .style("fill", "none")
      .attr("d", path);

  // Desenha os contornos de precipitação do mapa no svg.
  // Deve ser incluído ANTES dos contornos do Brasil e Bacias
  const _rainfallMap = (svg, contours, colors) =>
    svg
      .insert("g", ':first-child')
      .attr("class", "rainfall")
      .selectAll(".contour")
      .data(contours)
      .join("g")
      .append("path")
      .attr("d", d3.geoPath())
      .attr("class", 'contour')
      .attr("data-pluvia-volume", d => d.value)
      .attr("stroke-width", 0.3)
      .style("stroke", "black")
      .style("background-color", "white")
      .attr("fill", d => colors.filter(color => color.value === d.value)[0].color);


  const criarMapa = async (norusidmapa) => {

    // carrega o arquivo .csv e o converte para o array [lon, lat, volume].
    const rainfallData = await d3.dsv(";", csvMapa, _formatRow);

    // cria o array de pontos no formato que será usado para gerar os contornos.
    const gridPoints = rainfallData.map(_formatGrid)

    // cria o array de dados para gerar os contornos. mmm
    const contourData = _getContourData(gridPoints);

    const maxVolume = rainfallData.reduce((max, point) => {
      return point[2] > max ? point[2] : max;
    }, 0);

    const maxColorIndex = _getColorIndex(maxVolume) + 1;

    // cria os contornos. Passando o limite máximo da escala
    const contours = contourConfig.thresholds(maxColorIndex)(contourData);

    // cria a escala de cores para os contornos.
    const colors = contours.map((c, i) => {
      return { value: c.value, color: colorRange[i][1] };
    });

    // // cria a escala de cores para os contornos.
    // // ainda não compreendi bem como funciona e o que o número 100000 representa.
    const densityThresholds = contours.map(d => Math.floor(+d.value * resolution) / resolution);

    // cria a escala de cores para os contornos.
    const linearColorScale = d3.scaleLinear()
      .domain(d3.range(0, 1, 1 / colors.length))
      .range(colors)
      .interpolate(d3.interpolateLab);

    // // cria a quantização da escala de cores para os contornos.
    // // ainda não compreendi bem como funciona.
    const quantz = d3.quantize(linearColorScale, densityThresholds.length * 2);

    // // cria a escala de cores para os contornos.
    // // ainda não compreendi bem como funciona.
    const thresholdIndexDomain = d3.range(0, densityThresholds.length, 1);

    // // cria a escala de cores para os contornos.
    // // ainda não compreendi bem como funciona.
    const thresholdColorScale = d3.scaleOrdinal()
      .domain(densityThresholds)
      .range(quantz.slice(-thresholdIndexDomain.length));

    if (!cache.svg) {
      await criarCacheMapa();
    }

    // Clonar svg em cache
    let newSvg = cache.svg.clone(true);

    // Plotar preciptação no novo SVG
    _rainfallMap(newSvg, contours, colors);

    // Adicionar Node do SVG no div
    d3.select(norusidmapa + '_svg').node().appendChild(newSvg.node());

    
    // Ampliar svg maior
    $(norusidmapa + '_ampliarIMG').on("click", () => {
        $(norusidmapa + '_svg').toggleClass('ampliar');
    });

  };

  window.pluvia.mapa = function () {

    if (!d3) { throw new Error("A biblioteca d3.js não foi carregada."); }

    return {
      criarMapa,
      criarCacheMapa,
      temCache: () => !!cache.svg
    }
  }();

})(window);


