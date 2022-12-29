d3.select("button").on("click", function(){
  const id = $(this).attr('id');
  const idReduz = id.substring(0, id.length - 12);
  console.log(id);
  console.log(idReduz);
  const html = d3.select("svg")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

  //console.log(html);
  const imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
  const img = '<img src="'+imgsrc+'">'; 
  d3.select("#"+idReduz+"_urlIMG").html(img);


  const canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d");

  const image = new Image;
  image.src = imgsrc;
  image.onload = function() {
    context.drawImage(image, 0, 0);
  
    const canvasdata = canvas.toDataURL("image/png");
  
    const pngimg = '<img style="width: 450px" src="'+canvasdata+'">'; 
    d3.select("#"+idReduz+"_urlPNG").html(pngimg);
    const a = document.createElement("a");
    a.download = idReduz+"_mapa.png";
    a.href = canvasdata;
    a.click();
    // d3.select(idDownloadPng).on("click", function(){
    //   downloadMapa(canvasdata)});
  };

});

// (function (window) {
//     "use strict";

//     window.pluvia = window.pluvia || { _isNamespace: true };

//     const d3 = window.d3;
//    const norusidmapa = '#eta_9';
//     const criarCanvasMapa =  function (norusidmapa) { 
//       console.log(norusidmapa); 
//         console.log('entrou aqui no png'); 
//       const html = d3.select('svg')
//         .attr("version", 1.1)
//         .attr("xmlns", "http://www.w3.org/2000/svg")
//         .node().parentNode.innerHTML;
      
//       const imgSrc = 'data:image/svg+xml;base64,'+ window.btoa(html);
//       const img = '<img src="'+imgSrc+'">'; 

//       d3.select(norusidmapa + '_urlIMG').html(img);
    
//       const canvas = document.querySelector(norusidmapa + "_svg"),
//       context = canvas.getContext("2d");

//       const image = new Image;

//       image.src = imgSrc;
//       image.onload = function() {
//         context.drawImage(image, 0, 0);
//         const canvasData = canvas.toDataURL("image/png");
//         const pngImg = '<img style="width: 430px; max-width: 100%;" src="'+canvasData+'">'; 

//         d3.select(norusidmapa + '_urlPNG').html(pngImg);
//         d3.select(norusidmapa + '_downloadIMG').on("click", function(){
//           // downloadMapa(canvasData)
//           const a = document.createElement("a");
//           a.download = "mapa.png";
//           a.href = canvasData;
//           a.click();
//         });
//       };

//       //Download PNG -------------------------------------------------------------------------
//       // function downloadMapa(canvasData){
//       //   const a = document.createElement("a");
//       //   a.download = "mapa.png";
//       //   a.href = canvasData;
//       //   a.click();
//       // };
//     }

//     window.pluvia.imagemMapa = function () {

//         if(!d3) { throw new Error("A biblioteca d3.js não foi carregada."); }

//         return {
//           criarCanvasMapa
//         }
//     }();

// })(window);

