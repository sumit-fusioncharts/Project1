function Crosstab(chartData){
	this.chartData = chartData;
}
Crosstab.prototype.drawComponents = function(){
	//call components
	//console.log(this.chartData.svg);
	var tempx,tempy;
	var height = this.chartData.svg.sh;
	var width = this.chartData.svg.sw;
	var chartContainer = document.getElementById("chart");
	
	var canvas = new Canvas();
	var mainSvg = canvas.createSvg(width+1,height+1,"mainSvg","mainSvgClass",chartContainer);
		canvas.createLines(mainSvg,30,40,width,40,"topLine","topLine");
	
	var yaxis = new Yaxis(this.chartData);
		yaxis.draw(mainSvg);
	var xaxis = new Xaxis(this.chartData);
		xaxis.draw(mainSvg);
}