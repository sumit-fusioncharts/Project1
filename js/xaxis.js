function Xaxis(chartDetails,xAxisNames,numOfGraphs,numOfGraphsInaRow,title,currentGraph){
	this.chartData = chartDetails;
  //console.log(this.chartData.chartinfo.chartType);
  this.type = this.chartData.chartinfo.chartType; //(typeof this.chartData.svg === "undefined") ? "default":this.chartData.svg.ct;
	this.chartHeight = chartDetails[0];
	this.chartWidth = chartDetails[1];
	this.marginxy = chartDetails[2];
	this.title = title;
	this.currentGraph = currentGraph;
	this.numOfGraphs = numOfGraphs;
	this.numOfGraphsInaRow = numOfGraphsInaRow;
	this.xAxisNames = xAxisNames;
	this.xaxisticks = (typeof this.xAxisNames === "undefined") ? "0" : this.xAxisNames.length;
	this.divisionX = (this.chartWidth) / (this.xaxisticks);
};
Xaxis.prototype.draw = function(mainSvg){
	if(this.type=="crosstab"){
		this.svg = mainSvg;
		this.lossColor = this.chartData.chartinfo.lossColor;
		this.profitColor = this.chartData.chartinfo.profitColor;
		this.crosstab();		
	}else{
		this.drawChart(mainSvg);
	}
};
Xaxis.prototype.drawChart = function(svgGraph){
	var paintX = new CanvasX();
	this.noOfGraphPlotted = Number(((window.innerWidth/(this.chartWidth+60)).toString()).split('.')[0]);
  	document.getElementById("svgCaption").setAttribute("width",(this.noOfGraphPlotted*(this.chartWidth+50)+this.marginxy));
	if(this.numOfGraphs<=this.noOfGraphPlotted){
      //equal caption will be on top
      //calculationX = this.divisionX*i+this.marginxy+this.divisionX/2;
      paintX.createRect(svgGraph,this.marginxy-5,2,35,this.chartWidth-this.marginxy+10,"graphTop","graphTopClass");
      paintX.createText(svgGraph,(this.chartWidth)/2+this.marginxy,25,this.title,"#000",16,"middle","mainCaptionText");
      if(this.chartType!="line"){
        if(this.currentGraph>=(this.numOfGraphs-this.noOfGraphPlotted)){
          for(i=0;i<this.xaxisticks;i++){       
            paintX.createText(svgGraph,(this.divisionX*i+this.marginxy+this.divisionX/2),(this.chartHeight+this.marginxy+15),this.xAxisNames[i],"#000",11,"start","xaxisticksNames");
          }
        }
        for(i=0;i<this.xaxisticks;i++){
          paintX.createLines(svgGraph,(this.divisionX*i+this.marginxy+this.divisionX/2),(this.chartHeight+5+this.marginxy),(this.divisionX*i+this.marginxy+this.divisionX/2),(this.chartHeight+5+this.marginxy+5),"xaxisticks","xaxisticksClass");
        }
      }else{
        for(i=0;i<this.xaxisticks+1;i++){
          paintX.createLines(svgGraph,(this.divisionX*i+this.marginxy),(this.chartHeight+this.marginxy+5),(this.divisionX*i+this.marginxy),(this.chartHeight+this.marginxy+10),"xaxisticks","xaxisticksClass");
        }
        if(this.currentGraph<=(this.noOfGraphPlotted-1)){
          for(i=0;i<this.xaxisticks+1;i++){
            paintX.createText(svgGraph,(this.divisionX*i+this.marginxy),(this.chartHeight+this.marginxy+15),this.xAxisNames[i],"#000",11,"start","xaxisticksNames");
          }
        }
      }
    }else{
      paintX.createRect(svgGraph,this.marginxy-5,(this.chartHeight+this.marginxy+10),35,this.chartWidth-this.marginxy+10,"graphTop","graphTopClass");
      paintX.createText(svgGraph,(this.chartWidth)/2+this.marginxy,(this.chartHeight+this.marginxy+32),this.title,"#000",16,"middle","mainCaptionText");
      if(this.chartType=="line"){
        for(i=0;i<this.xaxisticks+1;i++){
            paintX.createLines(url,svgGraph,(this.divisionX*i+this.marginxy),(this.marginxy-5),(this.divisionX*i+this.marginxy),(this.marginxy-10),"xaxisticks","xaxisticksClass");
        }
        if(this.currentGraph<=(this.noOfGraphPlotted-1)){
          for(i=0;i<this.xaxisticks+1;i++){
            paintX.createText(svgGraph,(this.divisionX*i+this.marginxy),2,this.xAxisNames[i],"#000",11,"start","xaxisticksNames");
          }
        }
      }else{
        if(this.currentGraph<=(this.noOfGraphPlotted-1)){
          for(i=0;i<this.xaxisticks;i++){       
            paintX.createText(svgGraph,(this.divisionX*i+this.marginxy+this.divisionX/2),2,this.xAxisNames[i],"#000",11,"start","xaxisticksNames");
          }
        }
        for(var i=0;i<this.xaxisticks;i++){
          paintX.createLines(svgGraph,(this.divisionX*i+this.marginxy+this.divisionX/2),(this.marginxy-5),(this.divisionX*i+this.marginxy+this.divisionX/2),(this.marginxy-10),"xaxisticks","xaxisticksClass");
        }
      }
    }
};
Xaxis.prototype.crosstab = function(){
	var zones = this.chartData.coltable;
	var width = this.chartData.svg.cw;
	var barHeight = this.chartData.svg.bh;
	var barSpace = this.chartData.svg.bs;
	var height = this.chartData.product.length*(barHeight+2*barSpace)+100;
	var x,y=40,line,divisionX,temp;
	var maxsos = this.chartData.maxSos;
	var xaxiscaption = this.chartData.chartinfo.xaxiscaption;
	divisionX = width/4;

	var canvas = new Canvas();
	
	for(var i=2; i<zones.length;i++){
		x = i*width;
		line = canvas.createLines(this.svg,x,y,x,height,"topLine","topLine");
    if (i == zones.length-1){
      line = canvas.createLines(this.svg,x+width,y,x+width,height,"topLine","topLine");
    }
		temp = maxsos[i-2]/4;
		for(var j = 1;j<4;j++){
			canvas.createLines(this.svg,x+(divisionX*j),height-60,x+(divisionX*j),height-50,"topLine","topLine");
			canvas.createText(this.svg,x+(divisionX*j),height-30,this.sortedTitle(temp*j),"#000","16","middle","productNames");
			canvas.createText(this.svg,x+(width/2),height-10,xaxiscaption,"#000","16","middle","xaxiscaption");
		}
	}
	
};
Xaxis.prototype.sortedTitle = function(titleY){
	
    if(titleY % 1 != 0){
        titleY = titleY.toFixed(2);
    }
    var titleY_0 = titleY.toString().split(".")[0];
    if (titleY_0.substring(0, 1) == '-') {
      titleY_0 = Number(titleY_0.substring(1));
      if (titleY_0 > 999 && titleY_0 < 999999) {
        titleY = "-"+(titleY_0 / 1000).toFixed(1) + "K";
      } else if (titleY_0 > 999999) {
        titleY = "-"+(titleY_0 / 1000000).toFixed(1) + "M";
      }
    } else {
      if (titleY_0 > 999 && titleY_0 < 999999) {
        titleY = (titleY_0 / 1000).toFixed(1) + "K";
      } else if (titleY_0 > 999999) {
        titleY = (titleY_0 / 1000000).toFixed(1) + "M";
      }
    }
    return titleY;
};