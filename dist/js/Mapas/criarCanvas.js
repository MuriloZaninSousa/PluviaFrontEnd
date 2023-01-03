(function (window) {
  "use strict";

  window.pluvia = window.pluvia || { _isNamespace: true };

  const d3 = window.d3;

  const criarCanvasMapa = async function (norusidmapa) { 
    console.log(norusidmapa);
    d3.select(norusidmapa + '_downloadIMG').on("click", function(){
    const html = d3.select(norusidmapa + '_svg svg')
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node().parentNode.innerHTML;
    const imgSrc = 'data:image/svg+xml;base64,'+ window.btoa(html);
    const img = '<img src="'+imgSrc+'">'; 

    d3.select(norusidmapa + '_urlIMG').html(img);
  
    const canvas = document.querySelector(norusidmapa + "_canvas"),
    context = canvas.getContext("2d");

    const image = new Image;

    image.src = imgSrc;
    image.onload = async function() {
      context.drawImage(image, 0, 0);
      const canvasData = canvas.toDataURL("image/png");
      const pngImg = '<img style="width: 430px; max-width: 100%;" src="'+canvasData+'">'; 

      d3.select(norusidmapa + '_urlPNG').html(pngImg);
      const a = document.createElement("a");
      a.download = norusidmapa + "mapa.png";
      a.href = canvasData;
      a.click();
    };
  });
  }
  //teste
  window.pluvia.imagemMapa = function () {

      if(!d3) { throw new Error("A biblioteca d3.js não foi carregada."); }

      return {
        criarCanvasMapa
      }
  }();

})(window);

