//chart type
//**Line Chart
function LineChart(svgGraph,datasetStr,dataValues,ofsetx,ofsety){
	this.svgGraph = svgGraph;
	this.datasetStr = datasetStr;
	this.dataValues = dataValues;
	this.ofsetx = ofsetx;
	this.ofsety = ofsety;
};
LineChart.prototype.draw = function(){
	var paintB = new Canvas();
	paintB.createPoly(this.svgGraph,this.datasetStr);
	var xy = this.datasetStr.split(" ");
	var val = this.dataValues.split(" ");
    var xyCor,valxy,xyCorlen = xy.length-1;
         for(var i=0;i<xyCorlen;i++){
            xyCor = xy[i].split(',');
            valxy = val[i].split(',');
            paintB.createeCirles(this.svgGraph,xyCor[0],xyCor[1],5,(Number(this.ofsetx)+Number(xyCor[0])),(Number(this.ofsety)+Number(xyCor[1])),valxy[1],valxy[0]);
         } 
};