"use strict";
//setting up some window functions
var scrX = 0,scrY = 0,bool=true,xlen;
window.onscroll = function (e) {
   scrY=window.scrollY;
   scrX=window.scrollX;
};
window.onresize = function() {
   location.reload(); 
};
function highLightRect(event,rectX,rectY,value,i,wd){
  var col = document.getElementsByClassName("columnRectClass");
  var colrollover = new CustomEvent("mouserollover",{
        "detail":{x:rectX,y:rectY,v:value,c:i,w:wd}
        });
    for( var i=0;i<col.length;i++){
      if(col[i]!=event.target)
        col[i].dispatchEvent(colrollover);
    }
}
function highLightColumn(e){
  var col = document.getElementsByClassName("columnRectClass");
  var eRect = document.getElementsByClassName("tootltiprect");
  var uppertext = document.getElementsByClassName("uppertext");
  var xdisplacement,colnum,x,y;

    for(var j=0;j<col.length;j++){
        xdisplacement = col[j].getAttribute("x");

        if(e.detail.x==xdisplacement){
          colnum = col[j].getAttribute("colno");
          x=Number(col[j].getAttribute("x"));
          y=Number(col[j].getAttribute("y"));

          col[j].style.fill = '#BC4445';
          col[j].style.WebkitTransition = 'fill 0.4s';
          
          eRect[colnum].setAttribute("visibility","visible");
          uppertext[colnum].setAttribute("visibility","visible");

          
          if(e.detail.w<(x+100)){
            eRect[colnum].setAttribute("x",x-85);
            uppertext[colnum].setAttribute("x",x+45-85);
          }else{
            eRect[colnum].setAttribute("x",x);
            uppertext[colnum].setAttribute("x",x+45);
          }
          if((y-45)<50){
            uppertext[colnum].setAttribute("y",y+25);
            eRect[colnum].setAttribute("y",y+5);
          }else{
            uppertext[colnum].setAttribute("y",y-20);
            eRect[colnum].setAttribute("y",y-40);  
          }
          
           uppertext[colnum].innerHTML = col[j].getAttribute("value");
        }
    }
}

function resetCol(e){
  var col = document.getElementsByClassName("columnRectClass");
  //colselect=true;
  for( var i=0;i<col.length;i++){
    col[i].style.fill = "#1E7ACD";
  }
  var eRect = document.getElementsByClassName("tootltiprect");
  var uppertext = document.getElementsByClassName("uppertext");
  for(var i=0;i<eRect.length;i++){
    eRect[i].setAttribute("visibility","hidden");
    uppertext[i].setAttribute("visibility","hidden");
  }
}

function initDrag(event,svg){
  var startX = event.pageX;
  var startY = event.pageY;
  var dragable = document.getElementById("dragableDiv");
  dragable.style.top = (startY-1)+"px";
  dragable.style.left = (startX-1)+"px";
  dragable.style.visibility="visible";
    svg.addEventListener("mousemove",function(e){
     // colselect=false;
      if(bool){dragdiv(e,dragable,(startX-1),(startY-1),svg);}
    });
    dragable.addEventListener("mousemove",function(e){
     // colselect=false;
      if(bool){dragdiv(e,dragable,startX,startY,svg);}
    });
    dragable.addEventListener('mouseup', function(event){
      bool=false;      
      dragable.style.visibility="hidden";
      dragable.style.width="0px";
      dragable.style.height="0px";
      dragable.style.top="0px";
      dragable.style.left="0px";
    //  colselect=true;
    });

}

function dragdiv(e,d,x,y,svg){

  var w = e.clientX - x;
  var h = (e.clientY+scrY) - y;

        if(w < 0 && h < 0){
          y = (e.clientY+scrY);
          h *= 1;
          x = e.clientX;
          w *= -1;
        }
        if(w >= 0 && h < 0){
          y = (e.clientY+scrY);
          h *= -1;
        }
        if(w < 0 && h >= 0){
          x = e.clientX;
          w *= -1;
        }
   
  d.style.top = (y)+"px";
  d.style.left = (x)+"px";
  d.style.width = (w)+"px";
  d.style.height = (h)+"px";

  var x2 = w+x;
  var y2 = h+y;
  var offsetLeft = svg.getBoundingClientRect().left;
  var offsettop = svg.getBoundingClientRect().top;
  //console.log(x,y-scr,x2,y2-scr);
  x=x;
  y=y-scrY;
  x2=x2;
  y2=y2-scrY;
  var col = document.getElementsByClassName("columnRectClass"),cx,cy;
  var cir = document.getElementsByClassName("graphCircle");
  for(i=0;i<col.length;i++){
    cx=col[i].getAttribute("x");cx=Number(cx);//+offsetLeft;
    cy=col[i].getAttribute("y");cy=Number(cy);
    var cw=col[i].getAttribute("width");cw=Number(cw);
    var ch=col[i].getAttribute("height");ch=Number(ch);
    var ox=col[i].getAttribute("ofsetx");ox=Number(ox);
    var oy=col[i].getAttribute("ofsety");oy=Number(oy);
    var cn=col[i].getAttribute("colno");cn=Number(cn);
    var cx2,cy2,cx3,cy3;
    //console.log(cw,ch);
    //console.log(i+" x:"+(x)+" cx:"+cx);
    cx=cx+offsetLeft;//ox;
    cy=Math.abs(cy+offsettop);//oy);
    cx2 = cx+cw;
    cy2 = cy;
    cx3 = cx;
    cy3 = cy+ch;


    // if(((cx<=x2 && cx4>=x2)||((cx<=x && cx4>=x))) && (cy<=y2 && cy3>=y2)){
    if(((cx<=x2 && cx>=x)||((cx2<=x2 && cx2>=x))) && (cy<=y2 && cy3>=y2)){
      col[i].style.fill="#FA8072";
      col[i].style.WebkitTransition = 'fill 1s';    
    }else{
      col[i].style.fill = '#1E7ACD';
    }
  }
  for(var i=0;i<cir.length;i++){
      cx=cir[i].getAttribute("cx"); cx=Number(cx)+offsetLeft;
      cy=cir[i].getAttribute("cy");cy=cy-scrY+offsettop;
    //console.log(i+" x:"+x+" cx:"+ cx);
      cir[i].style.fill="#fff";
      cir[i].setAttribute("r",5);
    //  console.log(i,x,x2,cx+" -- "+y,y2,cy);
    if(cx>=x && cx<=x2 && cy>=y && cy<=y2){
    //console.log(i+": cx"+cx+" cy:"+cy);
      cir[i].style.fill="#FA8072";
      cir[i].setAttribute("r",7);
      cir[i].style.WebkitTransition = 'fill 1s';
    }
  }  
}

function callEventlistener(event,rectLeft){
  var cArr = document.getElementsByClassName("svgCrosshairRect");
  var rollover = new CustomEvent("mouserollover",{
      "detail":{x:event.clientX,y:event.clientY, left:rectLeft}
    });
    for( var i=0;i<cArr.length;i++){
      if(cArr[i]!=event.target)
       cArr[i].dispatchEvent(rollover);
  }
}
function moveCrosshair(e){
        var x = e.detail.x-e.detail.left-8;
        var yT1,xT1,cdata,CtopX1,CtopX2,CtopY2,yT;
        var elements = document.getElementsByClassName("crosshair");
        var eRect = document.getElementsByClassName("tootltiprect");
        var uppertext = document.getElementsByClassName("uppertext");
        var crosshair = document.getElementsByClassName("crosshair");
        var svgRect = document.getElementsByClassName("svgCrosshairRect");
        var circleX = document.getElementsByClassName("graphCircle");
        var i,j,data,cx,cy,col;

        for(i = 0; i<elements.length; i++){
            elements[i].setAttribute("visibility","visible");
            elements[i].setAttribute("x1",x+53);
            elements[i].setAttribute("x2",x+53);
            uppertext[i].setAttribute("visibility","hidden");
        	eRect[i].setAttribute("visibility","hidden");
            
        }

        for(j=0;j<circleX.length;j++){

        	cx = circleX[j].getAttribute("cx");
        	col = circleX[j].getAttribute("colno");


        	CtopY2=crosshair[col].getAttribute("y2");
		    CtopX2=svgRect[col].getAttribute("width");

        	cx = cx - 58;
        	if(x>=cx && x<=(cx+10)){
        	cy = circleX[j].getAttribute("cy");

        	uppertext[col].setAttribute("visibility","visible");
        	eRect[col].setAttribute("visibility","visible");
               
               //console.log("found"+xT+" "+yT);
               cx=cx+58;
            if((CtopY2-60)<cy){
                uppertext[col].setAttribute("y",cy-20);
                eRect[col].setAttribute("y",cy-40);
            }else{
            	cy = cy;
                uppertext[col].setAttribute("y",(Number(cy)+20));
                eRect[col].setAttribute("y",cy);
            }
             
            if((CtopX2-100)<(x+10)){
                eRect[col].setAttribute("x",cx-100);
                uppertext[col].setAttribute("x",cx-55);
            }else{
                eRect[col].setAttribute("x",cx+10);
                uppertext[col].setAttribute("x",cx+55);
          	} 

               uppertext[col].innerHTML = circleX[j].getAttribute("data");
        	}
        }
    }
function hideCrossHair(e){
    var elements = document.getElementsByClassName("crosshair");
    var eRect = document.getElementsByClassName("tootltiprect");
    var uppertext = document.getElementsByClassName("uppertext");
      for(var i = 0; i<elements.length; i++){
        elements[i].setAttribute("visibility","hidden");
        eRect[i].setAttribute("visibility","hidden");
        uppertext[i].setAttribute("visibility","hidden");
      }
    }


//parsing data
function DataParsing(dataObj){
	this.dataObj = dataObj;
}
DataParsing.prototype.xAxisNames = function(separator){
	return (this.dataObj.timestamp.time).split(separator);
};
DataParsing.prototype.separator = function(){
	return (this.dataObj.chartinfo.dataseparator === "") ? "|" : this.dataObj.chartinfo.dataseparator;
};
DataParsing.prototype.getData = function(chartNo,separator){
	return (this.dataObj.dataset[chartNo].data).split(separator);
};
DataParsing.prototype.dataSet = function(){
	return this.dataObj.dataset;
};
DataParsing.prototype.chartDiv = function(){
	return document.getElementById(this.dataObj.chartinfo.divId);
};
DataParsing.prototype.numOfGraphsInaRow = function(svgWidth){
	return Number(((window.innerWidth/svgWidth).toString()).split(".")[0]);
};
DataParsing.prototype.chartArrengement = function(){
	return this.dataObj.chartinfo.chartsPositioning;
};
DataParsing.prototype.svgWidth = function(){
	return (this.dataObj.chartinfo.width === '') ? "400" : this.dataObj.chartinfo.width;
};
DataParsing.prototype.svgheight = function(){
	return (this.dataObj.chartinfo.height === '') ? "400" : this.dataObj.chartinfo.height;
};
DataParsing.prototype.numOfGraphs = function(){
	return this.dataObj.dataset.length;
};
DataParsing.prototype.chartType = function(){
	return this.dataObj.chartinfo.chartType;
}
DataParsing.prototype.maxmin = function(data) {
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
DataParsing.prototype.customize = function(){
  var dataContainer = {};
  var temp,max,min,avg,title,dataArray,separator = this.separator();
  this.dataset = this.dataObj.dataset;
  for(var i in this.dataset){
    dataArray = (this.dataset[i].data).split(separator);
    temp = this.maxmin(dataArray);
    max = temp[0];
    min = temp[1];
    title = (this.dataset[i].title);
    temp = dataArray.map(function(num) {
      if(num==""){return 0;}
      else return Number(num);
    });
    temp = temp.sort(this.max2min);
    avg = temp.reduce(this.sum, 0)/temp.length;
    dataContainer[i] = {index:Number(i),data:dataArray,max:max,min:min,avg:avg,title:title}; 
  }
  return dataContainer;
};
DataParsing.prototype.max2min = function(a,b){
  return b-a;
};
DataParsing.prototype.min2max = function(a,b){
  return a-b;
};
DataParsing.prototype.sum = function(a,b){
  return a+b;
};

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


//difining yaxis
function Yaxis(chartDetails,chartObj){
	this.chartHeight = chartDetails[0];
	this.chartWidth = chartDetails[1];
	this.marginxy = chartDetails[2];
	this.yaxisData = chartObj.data;
	this.newmax = chartObj.newmax;
	this.newmin = chartObj.newmin;
	this.yaxisticks = this.calculateTicksNum(this.newmax,this.newmin);
	this.divisiony = this.chartHeight / this.yaxisticks;
	
};
Yaxis.prototype.draw = function(svgGraph){
	//console.log(this.divisiony);
	var paintY = new Canvas();
	for(var i=0;i<=this.yaxisticks;i++){
		this.calculationY =(this.divisiony*i)+this.marginxy;
	    if(i%2!=0 && i!=this.yaxisticks){
	      paintY.createRect(svgGraph,this.marginxy-5,this.calculationY,this.divisiony,this.chartWidth-this.marginxy+10,"svgsRect","svGrectClass");                        
	    }
        var titleY = (this.newmax - (((this.newmax-this.newmin)/this.yaxisticks)*i));
        	titleY =  this.sortedTitle(titleY);
        paintY.createText(svgGraph,(this.marginxy-15),(this.calculationY+5),titleY,"#145255",11,'end',"yaxistitle");
        paintY.createLines(svgGraph,(this.marginxy-10),(this.calculationY),(this.marginxy-5),(this.calculationY),"yaxisticks","yaxisticks");                       
    }//end of the for loop
}
Yaxis.prototype.calculateTicksNum = function(ub,lb){
	var yaxisticks;
   if((ub-lb)==ub){
      yaxisticks = 4;
   }else if((ub-lb)==0){
      yaxisticks = 2;
   }else{
      if((ub/lb)<3){
         yaxisticks = 4
      }else if((ub/lb)<6){
         yaxisticks = 5;
      }else{
         yaxisticks = 6;
      }  
   }
   return yaxisticks;
};
Yaxis.prototype.sortedTitle = function(titleY){
	
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


//canvas Element
function Canvas(){
	this.url = "http://www.w3.org/2000/svg";
}

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
Canvas.prototype.createeCirles = function(svg,x,y,r,absX,absY,data,colno){
            var shape = document.createElementNS(this.url, "circle");
            shape.setAttributeNS(null, "cx", x);
            shape.setAttributeNS(null, "cy", y);
            shape.setAttributeNS(null, "r",  r);
            shape.setAttributeNS(null, "absX",  absX);
            shape.setAttributeNS(null, "absY",  absY);
            shape.setAttributeNS(null, "data",  data);
            shape.setAttributeNS(null, "colno",  colno);
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
//defining the body of the chart
function ChartBody(chartType,customYobj,info,xaxisticks,i){
	this.chartType = chartType;
	this.customYobj = customYobj;
	this.chartHeight = info[0];
	this.chartWidth = info[1];
	this.marginxy = info[2];
	this.xaxisticks = xaxisticks;
	this.currentGraph = i;
	
	this.dataArray = this.customYobj.data;
	this.index = this.customYobj.index;
};


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
	var paintB = new Canvas();
	var xy = this.datasetStr.split(" ");
	var xyCor,xyCorlen = xy.length-1;
        for(var i=0;i<xyCorlen;i++){
            xyCor = xy[i].split(',');
			paintB.createRect(this.svgGraph,xyCor[0],xyCor[1],xyCor[2],this.divisionX-60,"columnRect","columnRectClass",xyCor[3],Number(xyCor[4]),this.chartWidth,this.ofsetx,this.ofsety);
		}
};

ChartBody.prototype.plotData = function(){
	this.newmax = this.customYobj.newmax;
	this.newmin = this.customYobj.newmin;
	this.datasetStr="",this.dataValues = "";
	var dataArrayLen = this.dataArray.length,y,xcord,ycord,barHight;
	this.plotRatio = this.chartHeight/(this.newmax-this.newmin);
	//console.log(" xx "+this.max,this.min,this.plotRatio,this.dataArray);
	//this.createRect(url,svgGraph,this.marginxy-5,this.marginxy-5,this.chartHeight+10,this.chartWidth-this.marginxy+10,"axisRect","axisRectClass");
	for(var i=0;i<dataArrayLen;i++){            
	    if(typeof this.dataArray[i]!="undefined" && this.dataArray[i]!=""){
	        y = Number(this.dataArray[i]);
	        if(this.chartType=="column"){
	        	this.divisionX = (this.chartWidth) / (this.xaxisticks);
	        }else{
	        	this.divisionX = (this.chartWidth) / (this.xaxisticks-1);
	        }
	        xcord= (this.divisionX*i)+this.marginxy;
	        barHight = ((y-this.newmin)*this.plotRatio); 
            ycord = (this.chartHeight - barHight + this.marginxy);
            if(this.chartType=="column"){            	
            	if(barHight<1){barHight=1;ycord=ycord-1;}
            	this.datasetStr += (xcord+5)+","+ycord+","+(barHight+5)+","+y+","+this.currentGraph+" ";            	
            }else{
            	this.datasetStr += xcord+","+ycord+" ";
            	this.dataValues += this.currentGraph+","+y+" ";
            }
	    }
    }//successfully displaying Data String for plotting

};
ChartBody.prototype.draw = function(svgGraph){
	var _dataObj = this.plotData(),_cc,_lc;
	var ofsetx=svgGraph.getBoundingClientRect().left,
        ofsety=svgGraph.getBoundingClientRect().top;

	
	if(this.chartType=="column"){
		_cc = new ColumnChart(svgGraph,this.datasetStr,ofsetx,ofsety,this.divisionX,this.chartWidth);
		_cc.draw();
	}else{
		_lc = new LineChart(svgGraph,this.datasetStr,this.dataValues,ofsetx,ofsety);
		_lc.draw();
	}
};

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
};

Axis.prototype.draw = function(){
	var newSvg = new Canvas(),svgVariable,y,x,body;
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
      var dragable = document.createElement('div');
         dragable.className = 'dragableDiv';
         dragable.id = 'dragableDiv';
         document.body.appendChild(dragable);
	}
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
		this.xAxisNames = chartInfo.xAxisNames(this.separator); xlen = this.xAxisNames.length;
		this.chartArrengement = chartInfo.chartArrengement();
		this.chartType = chartInfo.chartType();
    this.dataSet = chartInfo.dataSet();
    this.customData = chartInfo.customize();

	this.chartHeight = this.svgHeight-100;
	this.chartWidth = this.svgWidth-60;
	this.margin = 50;
};

Multivariant.prototype.render = function() {

	var temp,axisObj={};
	for(var i in this.customData){
		temp = this.beautify(this.customData[i].max,this.customData[i].min);
		if(temp[0]==temp[1]){
           temp[1] = temp[0]-10; temp[0] = temp[0]+10;
	    }else{
	       temp = this.beautify(temp[0],temp[1]);
	    }
		this.customData[i].newmax = temp[0];
		this.customData[i].newmin = temp[1];
		
	}

	axisObj.y = this.customData;
	axisObj.x = this.xAxisNames;
	axisObj.chartDetails = [this.chartHeight,this.chartWidth,this.margin];

	var axisInstance = new Axis(axisObj,this.chartDiv,this.chartType,this.numOfGraphs,this.numOfGraphsInaRow);
		axisInstance.draw();
};
Multivariant.prototype.countzeros = function(val){
        var cnt=0,len;
        for(var i=0;i<val.length;i++){
            if(val[i]=="0"){
                cnt++;
            }else{
                break;
            }
        }
        return cnt;
    }
Multivariant.prototype.addLeadingzeros = function(val,cnt){
    if(typeof val!="string"){val=val.toString();}
        while (val.length <= cnt){
            val = "0" + val;
        }
        return val;
    };
Multivariant.prototype.removeNeg = function(val){
        val = val.toString();
            if (val.substring(0, 1) == '-') {
            val = Number(val.substring(1));        
        }//now max does not contains "-"
        return val;
    };
Multivariant.prototype.genUp = function(val){
          var len = val.length,temp;
          if (len > 3) {
            temp = (Number(val[len - 3]) + 1) * 100;
            temp = Number(val.substr(0, (len - 3))) * 1000 + temp;
          } else {
            temp = (Number(val[0]) + 1) * Math.pow(10, (len - 1));
          }
          return temp;
    };
Multivariant.prototype.genDown = function(val){
         var len = val.length,temp;
          if (len == 1) {
            temp = 0;
          } else {
             if (len > 3) {
                temp = (Number(val[len - 3])) * 100;
                temp = Number(val.substr(0, (len - 3))) * 1000 + temp;
              } else {
                temp = (Number(val[0])) * Math.pow(10, (len - 1));
              }
        }
      return temp;
    };
Multivariant.prototype.beautify = function(max,min){
	var cnt=0,negMax=false,negMin=false,newmax,newmin;//typeval solid,single
            if(max<0){negMax=true;
                   max=this.removeNeg(max); 
                }
            if(max%1!=0){//decimal                    
                if(max<1){
                    newmax = max.toString().split(".")[1];
                    cnt=this.countzeros(newmax);//counting leading zeros
                    newmax = newmax.replace(/^0+/, '');//removing leading zeros
                    if(negMax==true){
                        newmax = this.genDown(newmax);
                        newmax = "-0."+this.addLeadingzeros(newmax,cnt);
                    }else{
                        newmax = this.genUp(newmax);
                        newmax = "0."+this.addLeadingzeros(newmax,cnt);
                    }
                }else{
                        newmax = max.toString().split(".")[0];
                        if(negMax==true){
                            newmax = "-"+this.genDown(newmax);
                        }else{
                            newmax = this.genUp(newmax);
                        }
                    }           
            }else{
                newmax = max.toString();
                if(negMax==true){
                    newmax = "-"+this.genDown(newmax);
                }else{
                    newmax = this.genUp(newmax);
                }
            }
            //+++++++++++++++++++++++
            if(min<0){negMin=true;
                    min=this.removeNeg(min);
                }
            if(min%1!=0){
                
                if(min<1){
                    newmin = min.toString().split(".")[1];//0.002,0.2,-0.5
                    cnt=this.countzeros(newmin);//counting leading zeros
                    newmin = newmin.replace(/^0+/, '');//removing leading zeros
                    if(negMin==true){
                        newmin = this.genUp(newmin);
                        newmin = "-0."+this.addLeadingzeros(newmin,cnt);
                    }else{
                        newmin = this.genDown(newmin);
                        newmin = "0."+this.addLeadingzeros(newmin,cnt);
                    }

                }else{
                    newmin = min.toString().split(".")[0];//2.34-down,(-2.34,neg=up) single-1
                        if(negMin==true){
                            newmin = "-"+this.genUp(newmin);
                        }else{
                            newmin = this.genDown(newmin);
                        }
                    }
                }else{
                    newmin = min.toString();//normal 200-down,234-down,(200,neg=up)
                    if(negMin==true){
                        newmin = "-"+this.genUp(newmin);
                    }else{
                        newmin = this.genDown(newmin);
                    }
                }  

                return[Number(newmax),Number(newmin)]; 
}
/*

          for(j=0;j<xlen;j++){

          	//start
          	if(x==)



          	//end
            if(typeof xCoor[i][j]!=="undefined"){
              yT = Number(xCoor[i][j][1]);
              xT = Number(xCoor[i][j][0]);
              // cir[j].style.stroke="#1F7ACB";
              // cir[j].setAttribute("r",5);
               if(xCoor[i][j][0]<=(x+59) && xCoor[i][j][0]>=(x+49)){
                  // cir[j].style.stroke="#FA8072";
                  // cir[j].setAttribute("r",6);
                  // cir[j].style.WebkitTransition = 'stroke 0.7s';
                uppertext[i].setAttribute("visibility","visible");
                eRect[i].setAttribute("visibility","visible");
                   
                   //console.log("found"+xT+" "+yT);
                if((CtopY2-60)<yT){
                    uppertext[i].setAttribute("y",yT-20);
                    eRect[i].setAttribute("y",yT-40);
                 }else{
                    uppertext[i].setAttribute("y",yT+30);
                    eRect[i].setAttribute("y",yT+10);
                 }
                 
                 if((CtopX2-100)<(x+10)){
                    eRect[i].setAttribute("x",xT-100);
                    uppertext[i].setAttribute("x",xT-55);
                 }else{
                    eRect[i].setAttribute("x",xT+10);
                    uppertext[i].setAttribute("x",xT+55);
              } 

                   uppertext[i].innerHTML=xCoor[i][j][2];
              }
            }
          }
*/