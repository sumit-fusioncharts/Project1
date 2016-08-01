//beautifying data
function Axis(customDataObj,divId,chartType,numOfGraphs,numOfGraphsInaRow){
	this.customDataObj = customDataObj;
	this.divId = divId;
	this.chartType = chartType;
	this.numOfGraphs = numOfGraphs;
	this.numOfGraphsInaRow = numOfGraphsInaRow;
	this.chartWidth = this.customDataObj.chartDetails[1];
	this.chartHeight = this.customDataObj.chartDetails[0];
	this.svgWidth = this.chartWidth+60;
	this.svgHeight = this.chartHeight+100;
	this.marginxy = this.customDataObj.chartDetails[2];
	this.caption = this.customDataObj.chartDetails[3];
	this.subCaption = this.customDataObj.chartDetails[4];
};

Axis.prototype.draw = function(){
	var newSvg = new Canvas(),svgVariable,y,x,body;
	console.log(this.caption,this.subCaption);
	var captions = new CreateCaption(this.caption,this.subCaption,this.divId);
	captions.draw();
	for(var i = 0;i<this.numOfGraphs;i++){
		svgVariable = newSvg.createSvg(this.svgWidth,this.svgHeight,"svgGraph","svgGraphClass",this.divId);
		y = new Yaxis(this.customDataObj.chartDetails,this.customDataObj.y[i]);
		y.draw(svgVariable);
		x = new Xaxis(this.customDataObj.chartDetails,this.customDataObj.x,this.numOfGraphs,this.numOfGraphsInaRow,this.customDataObj.y[i].title,i);
		x.draw(svgVariable);
		newSvg.createRect(svgVariable,(this.marginxy-5),(this.marginxy-5),(this.customDataObj.chartDetails[0]+10),(this.customDataObj.chartDetails[1]-this.marginxy+10),"axisRect","axisRectClass");
		body = new ChartBody(this.chartType,this.customDataObj.y[i],this.customDataObj.chartDetails,(this.customDataObj.x).length,i);
		body.draw(svgVariable);

		if(this.chartType=="line"){
			newSvg.createLines(svgVariable,(this.marginxy-5),(this.marginxy-5),(this.marginxy-5),(this.chartHeight+5+this.marginxy),"crosshair","crosshair");
		    newSvg.createRect(svgVariable,this.marginxy-5,this.marginxy-5,this.chartHeight+10,this.chartWidth-this.marginxy+10,"svgRect","svgCrosshairRect");

		}

	  newSvg.createRect(svgVariable,-90,-90,30,40,"tootltiprect","tootltiprect");
      newSvg.createText(svgVariable,-90,-90,"",'rgb(22,77,96)',12,"middle","uppertext");
      
	}
	var dragable = document.createElement('div');
         dragable.className = 'dragableDiv';
         dragable.id = 'dragableDiv';
         document.body.appendChild(dragable);
};
