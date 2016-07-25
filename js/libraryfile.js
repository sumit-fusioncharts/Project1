var scr = 0;
window.onscroll = function (e) {
   scr=window.scrollY; // Value of scroll Y in px
};
window.onresize = function() {
    location.reload();
}
var xlen ;
var xCoor = [],colselect=true;
function Multivariant(chartdata) {
    this.Chartdata = chartdata;
    this.separator = (chartdata.chartinfo.dataseparator === "") ? "|" : chartdata.chartinfo.dataseparator;
    this.svgWidth = (chartdata.chartinfo.width === '') ? "300" : chartdata.chartinfo.width;
    this.svgHeight = (chartdata.chartinfo.height === '') ? "400" : chartdata.chartinfo.height;
    this.chartHeight = this.svgHeight-100;
    this.chartWidth = this.svgWidth-60;
    this.graphData = chartdata.dataset;
    this.noOfGraphs = this.graphData.length;
    this.xaxisticksNames = (chartdata.timestamp.time).split(this.separator);
    this.xaxisticks = this.xaxisticksNames.length;
    xlen = this.xaxisticks;
    this.textColor = "#000";
    this.fontSize=17;
    this.marginxy = 50;
    this.yaxisticks =5;
    this.divId=document.getElementById(chartdata.chartinfo.divId);
    this.chartType = chartdata.chartinfo.chartType;
    this.marginLeft = 30;
    this.noOfGraphPlotted  = Number(((window.innerWidth/this.svgWidth).toString()).split(".")[0]);
};



Multivariant.prototype.rearrange = function(operation){
  var sum=[],newsum=[],index=[],x=[];
  for(datai in this.graphData){
    dataArray = (this.graphData[datai].data).split(this.separator);
    dataArray = dataArray.map(function(num) {
      if(num==""){return 0;}
      else return Number(num);
    });
    sum.push(dataArray.reduce(add, 0)/dataArray.length);
  }
  for(i=0;i<sum.length;i++){
   x[i]=sum[i];
  }
  //console.log(x);
  function add(a, b){
    return a+b;
  }
  function maxtomin(a,b){
    return b-a;
  }
  function mintomax(a,b){
    return a-b;
  }
  if(operation=="mintomax"){
    newsum = sum.sort(mintomax);
  }
  else if(operation=="maxtomin"){
    newsum = sum.sort(maxtomin);
  }else if(operation=="normal"){
    newsum = sum;
  }

  for(var i=0;i<newsum.length;i++){
    var j=0;
    while(j<x.length){
      if(newsum[i]==x[j]){
        index.push(j);
       }
      j++;
    }
  }
  return(index);
}
Multivariant.prototype.render = function(){


   var url = "http://www.w3.org/2000/svg",dataArray,maxminArray,newmin,newmax,limits,calculationX,calculationY;
   var divisionX,divisiony,plotRatio,datasetStr="",ycord,xcord,y,barHight;
   this.createCaption(url);
   var rearrangeData = this.rearrange(this.Chartdata.chartinfo.chartsPositioning);
   for(datai in this.graphData){
      xCoor[datai]=[];
      dataArray = (this.graphData[rearrangeData[datai]].data).split(this.separator);
      var dataArrayLen=dataArray.length;
      maxminArray = this.calculateMaxMin(dataArray);//returning Max And Min Array
      if(maxminArray[0]==maxminArray[1]){
         newmin = maxminArray[0]-10; newmax = maxminArray[0]+10;
      }else{
         limits = this.genLimits(maxminArray[0],maxminArray[1]);
         newmax = limits[0]; newmin = limits[1];
      }
      this.yaxisticks= this.calPicks(Number(limits[0]),Number(limits[1]));
      
      //console.log(newmin+" "+newmax);
      //we have data we have upper nad lower bound
      //now user will decide line chart or column chart

      
      divisiony = (this.chartHeight) / this.yaxisticks;
      plotRatio = this.chartHeight/(newmax-newmin);   
      var svgGraph = this.createSvg(url,this.svgWidth,this.svgHeight,"svgGraph","svgGraphClass",this.divId);
      var ofsetx=svgGraph.getBoundingClientRect().left,
          ofsety=svgGraph.getBoundingClientRect().top;

         for(i=0;i<=this.yaxisticks;i++){
            calculationY =(Number(divisiony)*i)+this.marginxy;
            if(i%2!=0 && i!=yaxisticks){
              //this.marginxy-5,this.marginxy-5,this.chartHeight+10,this.chartWidth-this.marginxy+10,
              this.createRect(url,svgGraph,this.marginxy-5,calculationY,divisiony,this.chartWidth-this.marginxy+10,"svgsRect","svGrectClass");                        
            }
                    var titleY =(newmax - (((newmax-newmin)/yaxisticks)*i));
                    if(titleY%1!=0){
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
            this.createText(url,svgGraph,(this.marginxy-15),(calculationY+5),titleY,"#145255",11,'end',"yaxisticks");
            this.createLines(url,svgGraph,(this.marginxy-10),(calculationY),(this.marginxy-5),(calculationY),"yaxisticks","yaxisticks");                       
         }
      this.createRect(url,svgGraph,this.marginxy-5,this.marginxy-5,this.chartHeight+10,this.chartWidth-this.marginxy+10,"axisRect","axisRectClass");

      if(this.chartType=="line"){//line chart
        divisionX = (this.chartWidth) / (this.xaxisticks-1);
 
         for(var i=0;i<dataArrayLen;i++){
            
            if(typeof dataArray[i]!="undefined" && dataArray[i]!=""){
                y = Number(dataArray[i]);
                xcord= (divisionX*i)+this.marginxy;
                ycord = (this.chartHeight - ((y-newmin)*plotRatio))+this.marginxy;             
                datasetStr += xcord+","+ycord+" ";
                xCoor[datai][i]=[];
                xCoor[datai][i][0]=[xcord];
                xCoor[datai][i][1]=[ycord];
                xCoor[datai][i][2]=[y];
            }
         }//successfully displaying Data String for plotting
         //console.log(Multivariant.xCoor);
      

         this.createPoly(url,svgGraph,datasetStr);
        
             //console.log(ofsetx,ofsety);
         var xy = datasetStr.split(" ");
         var xyCor,xyCorlen = xy.length-1;
         for(i=0;i<xyCorlen;i++){
            xyCor = xy[i].split(',');
            this.createeCirles(url,svgGraph,xyCor[0],xyCor[1],5,(Number(ofsetx)+Number(xyCor[0])),(Number(ofsety)+Number(xyCor[1])));
            //console.log((Number(ofsetx)+Number(xyCor[0])),(Number(ofsety)+Number(xyCor[1])));
            //url,svg,x1,y1,x2,y2,classname,lineId
         }   
      this.createLines(url,svgGraph,(this.marginxy-5),(this.marginxy-5),(this.marginxy-5),(this.chartHeight+5+this.marginxy),"crosshair","crosshair");    
      this.createRect(url,svgGraph,this.marginxy-5,this.marginxy-5,this.chartHeight+10,this.chartWidth-this.marginxy+10,"svgRect","svgCrosshairRect");
      }else{
      //column chart
      divisionX = (this.chartWidth) / (this.xaxisticks);

      for(var i=0;i<dataArrayLen;i++){
        if(typeof dataArray[i]!="undefined" && dataArray[i]!=""){
                y = Number(dataArray[i]);
                xcord= (divisionX*i)+this.marginxy+5;
                barHight = ((y-newmin)*plotRatio); 
                ycord = (this.chartHeight - barHight+this.marginxy);            
                if(barHight<1){barHight=1;ycord=ycord-1;} 
                this.createRect(url,svgGraph,xcord,ycord,barHight+5,divisionX-60,"columnRect","columnRectClass",y,datai,this.chartWidth,ofsetx,ofsety);
            }
         }//successfully displaying Data String
      }
      //common rect,tooltip
      this.createRect(url,svgGraph,-90,-90,30,40,"tootltiprect","tootltiprect");
      this.createText(url,svgGraph,-90,-90,"",'rgb(22,77,96)',12,"middle","uppertext");
      this.createRect(url,svgGraph,0,0,0,0,"dragDiv","dragDiv");
      var dragable = document.createElement('div');
         dragable.className = 'dragableDiv';
         dragable.id = 'dragableDiv';
         document.body.appendChild(dragable);

//console.log(this.graphData.length,this.noOfGraphPlotted,this.graphData.length-this.noOfGraphPlotted)
    document.getElementById("svgCaption").setAttribute("width",(this.noOfGraphPlotted*this.svgWidth+this.marginxy));
    
    //if(this.noOfGraphPlotted*2==this.graphData.length){
    if(this.graphData.length-this.noOfGraphPlotted==0){
      //equal caption will be on top
      calculationX = divisionX*i+this.marginxy+divisionX/2;
      this.createRect(url,svgGraph,this.marginxy-5,2,35,this.chartWidth-this.marginxy+10,"graphTop","graphTopClass");
      this.createText(url,svgGraph,(this.chartWidth)/2+this.marginxy,25,this.Chartdata.dataset[datai].title,"#000",16,"middle","mainCaptionText");
      if(this.chartType!="line"){
        if(datai>=(this.graphData.length-this.noOfGraphPlotted)){
          for(i=0;i<this.xaxisticks;i++){       
            this.createText(url,svgGraph,(divisionX*i+this.marginxy+divisionX/2),(this.chartHeight+this.marginxy+15),this.xaxisticksNames[i],"#000",11,"start","xaxisticksNames");
          }
        }
        for(i=0;i<this.xaxisticks+1;i++){
          this.createLines(url,svgGraph,(divisionX*i+this.marginxy),(this.chartHeight+5+this.marginxy),(divisionX*i+this.marginxy),(this.chartHeight+5+this.marginxy+5),"xaxisticks","xaxisticksClass");
        }
      }else{
        for(i=0;i<this.xaxisticks+1;i++){
          this.createLines(url,svgGraph,(divisionX*i+this.marginxy),(this.chartHeight+this.marginxy+5),(divisionX*i+this.marginxy),(this.chartHeight+this.marginxy+10),"xaxisticks","xaxisticksClass");
        }
        if(datai<=(this.noOfGraphPlotted-1)){
          for(i=0;i<this.xaxisticks+1;i++){
            this.createText(url,svgGraph,(divisionX*i+this.marginxy),(this.chartHeight+this.marginxy+15),this.xaxisticksNames[i],"#000",11,"start","xaxisticksNames");
          }
        }
      }
    }else{
      this.createRect(url,svgGraph,this.marginxy-5,(this.chartHeight+this.marginxy+10),35,this.chartWidth-this.marginxy+10,"graphTop","graphTopClass");
      this.createText(url,svgGraph,(this.chartWidth)/2+this.marginxy,(this.chartHeight+this.marginxy+32),this.Chartdata.dataset[datai].title,"#000",16,"middle","mainCaptionText");
      if(this.chartType=="line"){
        for(i=0;i<this.xaxisticks+1;i++){
            this.createLines(url,svgGraph,(divisionX*i+this.marginxy),(this.marginxy-5),(divisionX*i+this.marginxy),(this.marginxy-10),"xaxisticks","xaxisticksClass");
        }
        if(datai<=(this.noOfGraphPlotted-1)){
          for(i=0;i<this.xaxisticks+1;i++){
            this.createText(url,svgGraph,(divisionX*i+this.marginxy),2,this.xaxisticksNames[i],"#000",11,"start","xaxisticksNames");
          }
        }
      }else{
        if(datai<=(this.noOfGraphPlotted-1)){
          for(i=0;i<this.xaxisticks;i++){       
            this.createText(url,svgGraph,(divisionX*i+this.marginxy+divisionX/2),2,this.xaxisticksNames[i],"#000",11,"start","xaxisticksNames");
          }
        }
        for(i=0;i<this.xaxisticks+1;i++){
          this.createLines(url,svgGraph,(divisionX*i+this.marginxy),(this.marginxy-5),(divisionX*i+this.marginxy),(this.marginxy-10),"xaxisticks","xaxisticksClass");
        }

      }
    }

      datasetStr="";
   }//end of the graphs
}

Multivariant.prototype.calculateMaxMin = function(data){
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
}
Multivariant.prototype.createCaption = function(url) {
   var svg = this.createSvg(url,'100%','50px',"svgCaption","svgCaptionClass",this.divId);
   this.createText(url,svg,'50%',20,this.Chartdata.chartinfo.caption,"#000",22,"middle","BigCaptionText");
   this.createText(url,svg,'50%',40,this.Chartdata.chartinfo.subCaption,"#717171",16,"middle","CaptionText");
};
var currentElement = null;
Multivariant.prototype.createSvg = function(url,svgW,svgH,svgId,svgClass,svgAppend){
   var svg = document.createElementNS(url, "svg");
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
}
//++++++++++++++++++++
var bool =true;
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
  var h = (e.clientY+scr) - y;

        if(w < 0 && h < 0){
          y = (e.clientY+scr);
          h *= 1;
          x = e.clientX;
          w *= -1;
        }
        if(w >= 0 && h < 0){
          y = (e.clientY+scr);
          h *= -1;
        }
        if(w < 0 && h >= 0){
          x = e.clientX;
          w *= -1;
        }
   
  d.style.top = y+"px";
  d.style.left = x+"px";
  d.style.width = w+"px";
  d.style.height = h+"px";

  var x2 = w+x;
  var y2 = h+y;
  var offsetLeft = svg.getBoundingClientRect().left;
  var offsettop = svg.getBoundingClientRect().top;
  //console.log(x,y-scr,x2,y2-scr);
  x=x;
  y=y-scr;
  x2=x2;
  y2=y2-scr;
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
    var cx2,cy2,cx3,cy3,cx4,cy4;
    //console.log(cw,ch);
    //console.log(i+" x:"+(x)+" cx:"+cx);
    cx=cx+offsetLeft;//ox;
    cy=Math.abs(cy+offsettop);//oy);
    cx2 = cx+cw;
    cy2 = cy;
    cx3 = cx;
    cy3 = cy+ch;
    cx4 = cx2;
    cy4 = cy3;

    // if(((cx<=x2 && cx4>=x2)||((cx<=x && cx4>=x))) && (cy<=y2 && cy3>=y2)){
    if(((cx<=x2 && cx>=x)||((cx4<=x2 && cx4>=x))) && (cy<=y2 && cy3>=y2)){
      col[i].style.fill="#FA8072";
      col[i].style.WebkitTransition = 'fill 1s';    
    }else{
      col[i].style.fill = '#1E7ACD';
    }
  }
  for(var i=0;i<cir.length;i++){
      cx=cir[i].getAttribute("cx"); cx=Number(cx)+offsetLeft;
      cy=cir[i].getAttribute("cy");cy=cy-scr+offsettop;
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
//++++++++++++++++
Multivariant.prototype.createText = function(url,svg,x,y,textVal,textColor,fontSize,pos,textClass){
        var newText = document.createElementNS(url,"text");
            svg.appendChild(newText);
            newText.setAttributeNS(null,"x",x);   
            newText.setAttributeNS(null,"y",y);
            newText.setAttributeNS(null,"class",textClass); 
            newText.setAttributeNS(null,"font-size",fontSize+"px");
            newText.setAttributeNS(null,"text-anchor",pos);
            newText.setAttributeNS(null, "fill", textColor);
            newText.innerHTML =textVal;
    };
Multivariant.prototype.createLines = function(url,svg,x1,y1,x2,y2,classname,lineId){
        var lineXY = document.createElementNS(url, "line");
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
Multivariant.prototype.createeCirles = function(url,svg,x,y,r,absX,absY){
            var shape = document.createElementNS(url, "circle");
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
Multivariant.prototype.createPoly = function(url,svg,dataset){
        var shape = document.createElementNS(url, "polyline");
            shape.setAttributeNS(null, "points", dataset);
            shape.setAttributeNS(null, "class",  "svgPoly");
            svg.appendChild(shape); 
    };
Multivariant.prototype.createRect = function(url,svg,rectX,rectY,rectHeight,rectWidth,rectId,rectClass,value,i,wd,ofsetx,ofsety){
       var rectLeft;
       var rect = document.createElementNS(url, "rect");
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
          //if(colselect==true){
            col[j].style.fill = '#BC4445';
            col[j].style.WebkitTransition = 'fill 0.4s';
          //}
          
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
        var svgRect = document.getElementsByClassName("svgCrosshairRect"),i,j;
        //var cir = document.getElementsByClassName("graphCircle");
        //Y = ( ( X - X1 )( Y2 - Y1) / ( X2 - X1) ) + Y1
        //console.log(eRect.length);
        for(i = 0; i<elements.length; i++){
            elements[i].setAttribute("visibility","visible");
            elements[i].setAttribute("x1",x+53);
            elements[i].setAttribute("x2",x+53);
            
            eRect[i].setAttribute("visibility","hidden");
            uppertext[i].setAttribute("visibility","hidden");

            CtopY2=crosshair[i].getAttribute("y2");
            CtopX2=svgRect[i].getAttribute("width");

          for(j=0;j<xlen;j++){
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
Multivariant.prototype.calPicks = function(ub,lb){
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
}
Multivariant.prototype.genLimits = function(max,min){
        var cnt=0,negMax=false,negMin=false;//typeval solid,single
            if(max<0){negMax=true;
                   max=removeNeg(max); 
                }
            if(max%1!=0){//decimal                    
                if(max<1){
                    newmax = max.toString().split(".")[1];
                    cnt=countzeros(newmax);//counting leading zeros
                    newmax = newmax.replace(/^0+/, '');//removing leading zeros
                    if(negMax==true){
                        newmax = genDown(newmax);
                        newmax = "-0."+addLeadingzeros(newmax,cnt);
                    }else{
                        newmax = genUp(newmax);
                        newmax = "0."+addLeadingzeros(newmax,cnt);
                    }
                }else{
                        newmax = max.toString().split(".")[0];
                        if(negMax==true){
                            newmax = "-"+genDown(newmax);
                        }else{
                            newmax = genUp(newmax);
                        }
                    }           
            }else{
                newmax = max.toString();
                if(negMax==true){
                    newmax = "-"+genDown(newmax);
                }else{
                    newmax = genUp(newmax);
                }
            }
            //+++++++++++++++++++++++
            if(min<0){negMin=true;
                    min=removeNeg(min);
                }
            if(min%1!=0){
                
                if(min<1){
                    newmin = min.toString().split(".")[1];//0.002,0.2,-0.5
                    cnt=countzeros(newmin);//counting leading zeros
                    newmin = newmin.replace(/^0+/, '');//removing leading zeros
                    if(negMin==true){
                        newmin = genUp(newmin);
                        newmin = "-0."+addLeadingzeros(newmin,cnt);
                    }else{
                        newmin = genDown(newmin);
                        newmin = "0."+addLeadingzeros(newmin,cnt);
                    }

                }else{
                    newmin = min.toString().split(".")[0];//2.34-down,(-2.34,neg=up) single-1
                        if(negMin==true){
                            newmin = "-"+genUp(newmin);
                        }else{
                            newmin = genDown(newmin);
                        }
                    }
                }else{
                    newmin = min.toString();//normal 200-down,234-down,(200,neg=up)
                    if(negMin==true){
                        newmin = "-"+genUp(newmin);
                    }else{
                        newmin = genDown(newmin);
                    }
                }  

                return[newmax,newmin]; 
    };
function countzeros(val){
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
function addLeadingzeros(val,cnt){
    if(typeof val!="string"){val=val.toString();}
        while (val.length <= cnt){
            val = "0" + val;
        }
        return val;
    };
function removeNeg(val){
        val = val.toString();
            if (val.substring(0, 1) == '-') {
            val = Number(val.substring(1));        
        }//now max does not contains "-"
        return val;
    };
function genUp(val){
          var len = val.length,temp;
          if (len > 3) {
            temp = (Number(val[len - 3]) + 1) * 100;
            temp = Number(val.substr(0, (len - 3))) * 1000 + temp;
          } else {
            temp = (Number(val[0]) + 1) * Math.pow(10, (len - 1));
          }
          return temp;
    };
function genDown(val){
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