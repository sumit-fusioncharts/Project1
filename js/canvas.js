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
   return svg;
};
Canvas.prototype.createText = function(svg,x,y,textVal,textColor,fontSize,pos,textClass){
        var newText = document.createElementNS(this.url,"text");
            
            newText.setAttributeNS(null,"x",x);   
            newText.setAttributeNS(null,"y",y);
            newText.setAttributeNS(null,"class",textClass); 
            newText.setAttributeNS(null,"font-size",fontSize+"px");
            newText.setAttributeNS(null,"text-anchor",pos);
            newText.setAttributeNS(null, "fill", textColor);
            newText.innerHTML =textVal;
            svg.appendChild(newText);
            return newText;
    };
Canvas.prototype.group = function(svg){
        var g = document.createElementNS(this.url, "g");
            g.setAttribute('id', 'group');
            g.setAttribute('shape-rendering', 'inherit');
            g.setAttribute('pointer-events', 'all');
            svg.appendChild(g);
            return g;
    };
Canvas.prototype.createLines = function(svg,x1,y1,x2,y2,classname,lineId){
        var lineXY = document.createElementNS(this.url, "line");
            lineXY.setAttributeNS(null, "x1",x1);
            lineXY.setAttributeNS(null, "y1",y1);
            lineXY.setAttributeNS(null, "x2",x2);
            lineXY.setAttributeNS(null, "y2",y2);
            lineXY.setAttributeNS(null, "class",classname);
            lineXY.setAttributeNS(null, "id",lineId);
            svg.appendChild(lineXY);
            return lineXY;
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
            return shape;
    };
Canvas.prototype.createPoly = function(svg,dataset){
        var shape = document.createElementNS(this.url, "polyline");
            shape.setAttributeNS(null, "points", dataset);
            shape.setAttributeNS(null, "class",  "svgPoly");
            svg.appendChild(shape); 
            return shape;
    };
Canvas.prototype.createRect = function(svg,rectX,rectY,rectHeight,rectWidth,rectId,rectClass){
       var rectLeft;
       var rect = document.createElementNS(this.url, "rect");
            rect.setAttributeNS(null, "x", rectX);
            rect.setAttributeNS(null, "y", rectY);
            rect.setAttributeNS(null, "height", rectHeight);
            rect.setAttributeNS(null, "width", rectWidth+50);
            rect.setAttributeNS(null, "id",  rectId);
            rect.setAttributeNS(null, "class",  rectClass);
            svg.appendChild(rect);
            return rect;
    };