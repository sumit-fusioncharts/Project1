//**column Chart
function ColumnChart(svgGraph,datasetStr,ofsetx,ofsety,divisionX,chartWidth){
	this.svgGraph = svgGraph;
	this.datasetStr = datasetStr;
	this.ofsetx = ofsetx;
	this.ofsety = ofsety;
	this.divisionX = divisionX;
	this.chartWidth = chartWidth;
};
ColumnChart.prototype.draw = function(){
	var paintB = new CanvasX();
	var xy = this.datasetStr.split(" ");
	var xyCor,xyCorlen = xy.length-1;
        for(var i=0;i<xyCorlen;i++){
            xyCor = xy[i].split(',');
			paintB.createRect(this.svgGraph,xyCor[0],xyCor[1],xyCor[2],this.divisionX-60,"columnRect","columnRectClass",xyCor[3],Number(xyCor[4]),this.chartWidth,this.ofsetx,this.ofsety);
		}
};