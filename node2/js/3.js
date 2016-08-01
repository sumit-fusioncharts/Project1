//defining xaxis - ticks, 
function Xaxis(chartDetails,xAxisNames,numOfGraphs,numOfGraphsInaRow,title,currentGraph){
	this.chartHeight = chartDetails[0];
	this.chartWidth = chartDetails[1];
	this.marginxy = chartDetails[2];
	this.title = title;
	this.currentGraph = currentGraph;
	this.numOfGraphs = numOfGraphs;
	this.numOfGraphsInaRow = numOfGraphsInaRow;
	this.xAxisNames = xAxisNames;
	this.xaxisticks = this.xAxisNames.length;
	this.divisionX = (this.chartWidth) / (this.xaxisticks);

};
Xaxis.prototype.draw = function(svgGraph){
	var paintX = new Canvas();
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
        for(i=0;i<this.xaxisticks+1;i++){
          paintX.createLines(svgGraph,(this.divisionX*i+this.marginxy),(this.chartHeight+5+this.marginxy),(this.divisionX*i+this.marginxy),(this.chartHeight+5+this.marginxy+5),"xaxisticks","xaxisticksClass");
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
        for(var i=0;i<this.xaxisticks+1;i++){
          paintX.createLines(svgGraph,(this.divisionX*i+this.marginxy),(this.marginxy-5),(this.divisionX*i+this.marginxy),(this.marginxy-10),"xaxisticks","xaxisticksClass");
        }
      }
    }
};
