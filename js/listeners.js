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
    
      cir[i].style.fill="#fff";
      cir[i].setAttribute("r",5);
    
     console.log(typeof cy, typeof scrY, typeof offsettop);
    if((cx+8)>=(x-scrX) && (cx-8)<=(x2-scrX) && (cy+8)>=(y-scrY) && (cy-8)<=(y2-scrY)){
    
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
               

          cx= cx + 58;
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
