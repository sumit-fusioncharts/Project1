window.onload=function(){
      var xmlhttp= new XMLHttpRequest(),mychart,chart;
      xmlhttp.onreadystatechange = function(){   
        if ( xmlhttp.readyState === 4 && xmlhttp.status === 200 ) {
          mychart = new Visualization(JSON.parse(xmlhttp.responseText));
          chart = new Chart(mychart);
          chart.render();
        }
  };
  xmlhttp.open('GET','json/data.json',true);
  xmlhttp.send();
};
