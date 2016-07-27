"use strict";
//setting up some window functions
var scrX = 0,scrY = 0;
window.onscroll = function (e) {
   scrY=window.scrollY;
   scrX=window.scrollX;
};
window.onresize = function() {
   location.reload();
};

//parsing data
function DataParsing(dataObj){
	this.dataObj = dataObj;
}
dataParsing.prototype.xAxisNames = function(separator){
	return (this.dataObj.timestamp.time).split(separator);
};
dataParsing.prototype.separator = function(){
	return (this.dataObj.chartinfo.dataseparator === "") ? "|" : this.dataObj.chartinfo.dataseparator;
};
dataParsing.prototype.getData = function(chartNo,separator){
	return (this.dataObj.dataset[chartNo].data).split(separator);
};
dataParsing.prototype.dataset = function(){
	return this.dataObj.dataset;
};
dataParsing.prototype.chartDiv = function(){
	return document.getElementById(this.dataObj.chartinfo.divId);
};
dataParsing.prototype.numOfGraphsInaRow = function(svgWidth){
	return Number(((window.innerWidth/svgWidth).toString()).split(".")[0]);
};
dataParsing.prototype.chartArrengement = function(){
	return this.dataObj.chartinfo.chartsPositioning;
};
dataParsing.prototype.svgWidth = function(){
	return (this.dataObj.chartinfo.width === '') ? "400" : this.dataObj.chartinfo.width;
};
dataParsing.prototype.svgheight = function(){
	return (this.dataObj.chartinfo.height === '') ? "400" : this.dataObj.chartinfo.height;
};
dataParsing.prototype.numOfGraphs = function(){
	return this.dataObj.dataset.length;
};
dataParsing.prototype.chartType = function(){
	return this.dataObj.chartinfo.chartType;
}

//defining xaxis
function Xaxis(){

};
function Yaxis(){

};


function ChartBody(){

};
ChartBody.prototype.plotData = function(){

};

//canvas Element
function Canvas(url){
	this.url = url;
}
Canvas.prototype.createLine = function(){

};
Canvas.prototype.createSvg = function(svgW,svgH,svgId,svgClass,svgAppend){
   var svg = document.createElementNS(this.url, "svg");
       svg.setAttribute('width',svgW);
       svg.setAttribute('height',svgH);
       svg.setAttribute('id',svgId);
       svg.setAttribute("class",svgClass);
   svgAppend.appendChild(svg);
   if(svgId=="svgGraph"){
      svg.addEventListener("mousedown",function(event){
      event.preventDefault();
      bool =true;
      initDrag(event,svg);   
    });
   }
   return svg;
};
Canvas.prototype.createText = function(svg,x,y,textVal,textColor,fontSize,pos,textClass){
        var newText = document.createElementNS(this.url,"text");
            svg.appendChild(newText);
            newText.setAttributeNS(null,"x",x);   
            newText.setAttributeNS(null,"y",y);
            newText.setAttributeNS(null,"class",textClass); 
            newText.setAttributeNS(null,"font-size",fontSize+"px");
            newText.setAttributeNS(null,"text-anchor",pos);
            newText.setAttributeNS(null, "fill", textColor);
            newText.innerHTML =textVal;
    };
Canvas.prototype.createLines = function(svg,x1,y1,x2,y2,classname,lineId){
        var lineXY = document.createElementNS(this.url, "line");
            lineXY.setAttributeNS(null, "x1",x1);
            lineXY.setAttributeNS(null, "y1",y1);
            lineXY.setAttributeNS(null, "x2",x2);
            lineXY.setAttributeNS(null, "y2",y2);
            lineXY.setAttributeNS(null, "class",classname);
            lineXY.setAttributeNS(null, "id",lineId);
            if(classname=="crosshair"){
                lineXY.setAttribute("visibility","hidden");
            }
            svg.appendChild(lineXY);
    };
Canvas.prototype.createeCirles = function(svg,x,y,r,absX,absY){
            var shape = document.createElementNS(this.url, "circle");
            shape.setAttributeNS(null, "cx", x);
            shape.setAttributeNS(null, "cy", y);
            shape.setAttributeNS(null, "r",  r);
            shape.setAttributeNS(null, "absX",  absX);
            shape.setAttributeNS(null, "absY",  absY);
            shape.setAttributeNS(null, "id",  'graphCircle');
            shape.setAttributeNS(null, "class",  'graphCircle');
            shape.setAttributeNS(null, "fill", "#fff");  
            svg.appendChild(shape);
    };
Canvas.prototype.createPoly = function(svg,dataset){
        var shape = document.createElementNS(this.url, "polyline");
            shape.setAttributeNS(null, "points", dataset);
            shape.setAttributeNS(null, "class",  "svgPoly");
            svg.appendChild(shape); 
    };
Canvas.prototype.createRect = function(svg,rectX,rectY,rectHeight,rectWidth,rectId,rectClass,value,i,wd,ofsetx,ofsety){
       var rectLeft;
       var rect = document.createElementNS(this.url, "rect");
            rect.setAttributeNS(null, "x", rectX);
            rect.setAttributeNS(null, "y", rectY);
            rect.setAttributeNS(null, "height", rectHeight);
            rect.setAttributeNS(null, "width", rectWidth+50);
            rect.setAttributeNS(null, "id",  rectId);
            rect.setAttributeNS(null, "class",  rectClass);
            if(typeof value!=="undefined"){
              //console.log(value);
              rect.setAttributeNS(null, "value",  value);
              rect.setAttributeNS(null, "colno",  i);
            }
            svg.appendChild(rect);
            if(rectId=="svgRect"){
                rectLeft = rect.getBoundingClientRect().left;
                rect.addEventListener("mousemove", function(event){
                  callEventlistener(event,rectLeft);
                }, false);
                rect.addEventListener("mouserollover", moveCrosshair, false);
                rect.addEventListener("mouseout", hideCrossHair, false);

            }else if(rectId=="columnRect"){
                //console.log(wd);
                rect.setAttributeNS(null, "ofsetx",  ofsetx);
                rect.setAttributeNS(null, "ofsety",  ofsety);
                rect.addEventListener("mousemove", function(event){
                  highLightRect(event,rectX,rectY,value,i,wd);
                }, false);
                rect.addEventListener("mouserollover", highLightColumn, false);
                rect.addEventListener("mouseout", resetCol, false);
            }
            return rect;
    };

//beautifying data
function DesignData(dataObj){

};
//Defining data
function Multivariant(chartdata){
	this.chartdata = chartdata;

	var chartInfo = new DataParsing(this.chartdata);
		this.separator = chartInfo.separator();
		this.svgHeight = chartInfo.svgheight();
		this.svgWidth = chartInfo.svgWidth();
		this.numOfGraphsInaRow = chartInfo.numOfGraphsInaRow();
		this.numOfGraphs = chartInfo.numOfGraphs();
		this.chartDiv = chartInfo.chartDiv();
		this.xAxisNames = chartInfo.xAxisNames();
		this.chartArrengement = chartInfo.chartArrengement();
		this.chartType = chartInfo.chartType();

	this.chartHeight = this.svgheight-100;
	this.chartWidth = this.svgWidth-60;
	this.margin = 50;

};
Multivariant.prototype.maxmin = function(data) {
	  var max,min,j,temp;
      min = Number(data[0]);
      max=min;
      j = data.length;
      while(j>=0){
         temp = Number(data[j]);
         if(temp>max && typeof temp!="undefined" && temp!=""){max=temp;}
         if(temp<min && typeof temp!="undefined" && temp!=""){min=temp;} 
         j--;
      }
      return [max,min];	
};
Multivariant.prototype.rearrange = function(){
	
};
Multivariant.prototype.render = function() {
	
};