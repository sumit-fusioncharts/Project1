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