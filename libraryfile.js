
function fc(renderdivId,separator,width,height,chartdata) {
    this.chartdata = chartdata;
    this.renderdivId = "mydiv";
    this.separator = "|";
    this.width = "300";
    this.height = "400";
    this.yaxisticks = 6;
    this.xaxisticks = 5;
 
    this.render = function () {
        this.chartdata = chartdata;
        this.renderdivId = renderdivId;
        this.separator = separator;
        this.width = width;
        this.height = height;
        this.plotdata();
        var arr=[23,3242,,342];
        console.log(arr);


    };
    this.calPicks=function(ub,lb){
        if((ub-lb)==ub){
            yaxisticks = 5;
        }else{
          if((ub/lb)<3){
                yaxisticks = 3
            }else if((ub/lb)<6){
                yaxisticks = 5
            }else{
                yaxisticks = 4;
            }  
        }
      return yaxisticks;  
    };
     function calculateMaxMin(obj){
        //will return a array of max min values or obj
        var noOfGraphs = (obj.chartinfo.yaxisnames).length,
        noofiteration=((obj.dataset).length-1),j;
        var maxminobj={};
        var max,min;
        for(var i=0;i<noOfGraphs;i++){
            min = obj.dataset[noOfGraphs].data[i];max=min;
            j= noofiteration;
             while(j>=0){
                 if((obj.dataset[j].data[i])>max){ max =obj.dataset[j].data[i]}
                 if((obj.dataset[j].data[i])<min){ min =obj.dataset[j].data[i]}
                 j--;
             }
             maxminobj[i] = {"max": max,"min": min}; //storing max and min value in this object
        }
         return maxminobj;  //returning max and min stored in this object
    };
    this.genLimits = function(max,min){

        var cnt=0,negMax=false,negMin=false;//typeval solid,single
            if(max<0){negMax=true;}
            if(negMax==true){
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
            if(min<0){negMin=true;}
            if(negMin==true){
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
        }//if(val==temp){temp=temp-5;}
         return temp;
    };

        this.plotdata = function(){
                var maxmin = calculateMaxMin(this.chartdata);

                var max,min,newmax,newmin,limits,divisiony,divisionX,plotRatio;
                for(var k in maxmin){        
                //limits = this.createlimits(newmax,newmin);
                max = maxmin[k].max;
                min = maxmin[k].min;
                limits = this.genLimits(max,min);
                newmax = limits[0]; newmin = limits[1];
                console.log("mx "+max+" mn "+min+" nmx "+newmax+" nmn "+newmin);
                yaxisticks= this.calPicks(Number(limits[0]),Number(limits[1]));
                xaxisticks= this.chartdata.dataset.length; 
                this.measureMent(xaxisticks,yaxisticks,newmax,newmin,yaxisticks,xaxisticks,k);                
            }
            for(i=0;i<xaxisticks;i++){
                var textVal =this.setTitleX(this.chartdata.dataset[i].time);
                this.createText(url,svg,(calculationX),(chartHeight+marginxy+25),textVal,"#145255",13,"start","writing-mode:tb;");
            }
    };
    this.measureMent = function(xaxisticks,yaxisticks,newmax,newmin,yaxisticks,xaxisticks,item){
        var svgHeight = (this.height);
        var svgWidth = (this.width);
        var chartHeight=svgHeight-150;
        var chartWidth=svgWidth-100;
        var divisionX = (chartWidth) / xaxisticks;
        var divisiony = (chartHeight) / yaxisticks;
        var plotRatio = chartHeight/(newmax-newmin); //(chartHeight) / newmax;
        var dataset="",ycord,xcord,marginxy = 60;
        var calculationX,calculationY,textColor="#000",fontSize=17;
        var i = 1;
            for(var k in this.chartdata.dataset){
                xcord= (divisionX*(parseInt(k)+1))+marginxy;
                ycord = (chartHeight - ((this.chartdata.dataset[k].data[item]-newmin)*plotRatio))+marginxy;
                dataset += xcord+","+ycord+" ";i++;      
            }
            var url = "http://www.w3.org/2000/svg";
            var svg = document.createElementNS(url, "svg");
                svg.setAttribute('width', svgWidth);
                svg.setAttribute('height', svgHeight);
                svg.setAttribute('id', "svgContainer");
                svg.setAttribute("style"," margin:20px;");

            var title = this.chartdata.chartinfo.caption; //caption header
                if(item==0){
                    this.createText(url,svg,chartWidth/2,25,title,18,"middle");
                }
                title = this.chartdata.chartinfo.xaxisname; //xaxis caption bottom
                this.createText(url,svg,'50%',chartHeight+marginxy+55,title,'#0E2D48',12,"middle");
                title = this.chartdata.chartinfo.yaxisnames[item]; //yaxis caption left
                this.createText(url,svg,3,chartHeight/2+marginxy,title,'#0E2D48',12,"middle","writing-mode:tb;");
                this.createDiv(svg,"tooltipDiv","classTooltip",0,0,20,90,"val");

                for(i=0;i<=yaxisticks;i++){
                    calculationY =(parseInt(divisiony)*i)+marginxy;
                    var titleY =(newmax - (((newmax-newmin)/yaxisticks)*i));
                    if(titleY%1!=0){
                        titleY = titleY.toFixed(2);
                    }
                    var titleY_0 = titleY.toString().split(".")[0];
                    var titleY_1 = titleY.toString().split(".")[1];
                    if (titleY_0.substring(0, 1) == '-') {
                      titleY_0 = Number(titleY_0.substring(1));
                      if (titleY_0 > 999 && titleY_0 < 999999) {
                        titleY = "-"+(titleY_0 / 1000).toFixed(1) + "K";
                      } else if (titleY_0 > 999999) {
                        titleY = "-"+(titleY_0 / 1000000).toFixed(1) + "M";
                      }
                    } else {
                      if (titleY_0 > 999 && titleY_0 > 999999) {
                        titleY = (titleY_0 / 1000).toFixed(1) + "K";
                      } else if (titleY_0 > 999999) {
                        titleY = (titleY_0 / 1000000).toFixed(1) + "M";
                      }
                    }
                    this.createText(url,svg,(marginxy-30),(calculationY+5),titleY,"#145255",11,'middle');
                    this.createLines(url,svg,(marginxy-5),(calculationY),(marginxy+5),(calculationY),"stroke:#000000; fill:none;");
                    this.createLines(url,svg,(marginxy+10),(calculationY),(chartWidth+marginxy+50),(calculationY),"stroke:rgba(72,118,255,0.7); stroke-width:0.3;stroke-dasharray:10,10 ; fill:none;");
                    if(i%2==0 && i!=yaxisticks){
                        this.createRect(url,svg,marginxy, calculationY,divisiony,chartWidth,"svgRect","fill:rgba(219,249,255,0.3);");                        
                    }
                }
                this.createLines(url,svg,(marginxy),(marginxy-30),(marginxy),(chartHeight+marginxy),"stroke:#000000;");
                this.createLines(url,svg,(marginxy),(chartHeight+marginxy),(chartWidth+marginxy+50),(chartHeight+marginxy),"stroke:#000000;");
                this.createPoly(url,svg,dataset);
                this.createLines(url,svg,(marginxy),(marginxy),(marginxy),(chartHeight+marginxy),"stroke:red;stroke-width:0.8;stroke-dasharray:9,9;","crosshair");
                this.createRect(url,svg,marginxy,marginxy,chartHeight,chartWidth,"svgRect","fill:transparent;","svgCrosshairRect");
                 
                var coordinates = dataset.split(" "),xy;
                         
                for(i=0;i<xaxisticks;i++){
                    calculationX = parseInt(divisionX)*(i+1)+marginxy;
                    this.createLines(url,svg,calculationX,(chartHeight+marginxy+5),calculationX,(chartHeight+marginxy-5),"stroke:#000000; fill:none;");
                }
                for(i = 0;i<(coordinates.length-1);i++){               
                    xy = coordinates[i].split(","); 
                    this.createeCirles(url,svg,xy[0],xy[1],5);
                } 
                  
                document.getElementById("chart").appendChild(svg);
                var br = document.createElement("br");
                document.getElementById("chart").appendChild(br);
                dataset = "";            
    };
    this.setTitleX = function(x){
            x = x.split(",");
        var d = new Date();
            d.setFullYear(x[2], x[1], x[0]);
        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return x[0]+" "+months[d.getMonth()]+"'"+x[2].substr(2,3);
    };
    this.createLines = function(url,svg,x1,y1,x2,y2,styleStr,id){
        //id = (typeof x === 'undefined') ? id : "svgline";
        var lineXY = document.createElementNS(url, "line");
            lineXY.setAttributeNS(null, "x1",x1);
            lineXY.setAttributeNS(null, "y1",y1);
            lineXY.setAttributeNS(null, "x2",x2);
            lineXY.setAttributeNS(null, "y2",y2);
            lineXY.setAttributeNS(null, "class",id);
            lineXY.setAttribute('style', styleStr);
            if(id=="crosshair"){
                lineXY.setAttribute("visibility","hidden");
            }
            svg.appendChild(lineXY);
    };
    this.createeCirles = function(url,svg,x,y,r){
            var shape = document.createElementNS(url, "circle");
            shape.setAttributeNS(null, "cx", x);
            shape.setAttributeNS(null, "cy", y);
            shape.setAttributeNS(null, "r",  r);
            shape.setAttributeNS(null, "id",  'circle');
            shape.setAttributeNS(null, "fill", "#fff");
            shape.setAttribute('style', "stroke:#3EABAB");   
            this.createTitle(url,shape,"titlebar",x);
            svg.appendChild(shape);
    };
    this.createDiv = function(svg,divId,divClass,divTop,divLeft,divHeight,divWidth,divData){
        var div = document.createElement("div");
            div.id = divId;
            div.class = divClass;
            div.style.position  = "absolute";
            div.style.top  = divTop+"px";
            div.style.left  = divLeft+"px";
            div.style.height  = divHeight+"px";
            div.style.width  = divWidth+"px";
            div.style.zIndex = 100;
            div.innerHTML = divData;
            document.getElementById("chart").appendChild(div);
    };
    this.createTitle = function(url,svg,id,textData){
        var title = document.createElementNS(url,"title");
            title.textContent = textData;
            title.setAttributeNS(null, "id",  id);
            svg.appendChild(title);
    };
    this.createPoly = function(url,svg,dataset){
        var shape = document.createElementNS(url, "polyline");
            shape.setAttributeNS(null, "points", dataset);
            shape.setAttribute('style', "stroke:#3EABAB;stroke-width:4;fill:none;");
            svg.appendChild(shape); 
    };
    this.createRect = function(url,svg,rectX,rectY,rectHeight,rectWidth,rectId,rectStyle,rectClass){
        var rect = document.createElementNS(url, "rect");
            rect.setAttributeNS(null, "x", rectX);
            rect.setAttributeNS(null, "y", rectY);
            rect.setAttributeNS(null, "height", rectHeight);
            rect.setAttributeNS(null, "width", rectWidth+50);
            rect.setAttributeNS(null, "id",  rectId);
            rect.setAttributeNS(null, "class",  rectClass);
            rect.setAttribute('style', rectStyle);
            svg.appendChild(rect);
            if(rectId=="svgRect"){
                //rect.addEventListener("mousemove", this.moveCrosshair, false);
                rect.addEventListener("mousemove", callEventlistener, false);
                rect.addEventListener("mouserollover", moveCrosshair, false);
                rect.addEventListener("mouseout", hideCrossHair, false);
            }

    };
    function callEventlistener(event){
        var carr = document.getElementsByClassName("svgCrosshairRect");
        var rollover = new CustomEvent("mouserollover",{
            "detail":{x:event.clientX}
        });
        for( var i=0;i<carr.length;i++){
            if(carr[i]!=event.target)
                carr[i].dispatchEvent(rollover);
        }
    }
    function moveCrosshair(e){
            var x = e.detail.x-35;
            var elements = document.getElementsByClassName("crosshair");
                for(var i = 0; i<elements.length; i++){
                    elements[i].setAttribute("visibility","visible");
                    elements[i].setAttribute("x1",x);
                    elements[i].setAttribute("x2",x);
        }
    };
    function hideCrossHair(e){
        var elements = document.getElementsByClassName("crosshair");
        for(var i = 0; i<elements.length; i++){
                elements[i].setAttribute("visibility","hidden");
            }
    }
    this.createText = function(url,svg,x,y,textVal,textColor,fontSize,pos,textStyle){
        var newText = document.createElementNS(url,"text");
        var textNode = document.createTextNode(textVal);
            newText.appendChild(textNode);
            svg.appendChild(newText);
            newText.setAttributeNS(null,"x",x);   
            newText.setAttributeNS(null,"y",y); 
            newText.setAttributeNS(null,"font-size",fontSize+"px");
            newText.setAttributeNS(null,"text-anchor",pos);
            newText.setAttributeNS(null, "fill", textColor);
            newText.setAttributeNS(null, "style", textStyle);
    };
};
// function myFunction(e) {
//     var x = e.clientX-35;
//     var elements = document.getElementsByClassName("crosshair");
//     if(x>60){
//         for(var i = 0; i<elements.length; i++){
//             elements[i].setAttribute("x1",x);
//             elements[i].setAttribute("x2",x);
//         }
//     }
// }
// var mouseX,mouseY;
// window.onmouseover=function(e) {
//         mouseX = e.clientX; //document.body.scrollLeft;
//         mouseY = e.clientY; //document.body.scrollTop;
// };
// function showdata(x,y){
//        var e = document.getElementById('tooltip');
//        e.style.left = (mouseX+e.scrollLeft)+"px";
//        e.style.top = (mouseY+e.scrollTop)+"px";
       
//        e.innerHTML = Math.round(x);
//        var x =getOffsetSum(e);
//        var scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
//        var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
//        e.style.left = (x.left+scrollLeft)+"px";
//        e.style.top = (x.top+scrollTop)+"px";
//        e.style.visibility = 'visible';
      
//       function getOffsetSum(elem) {
//               var top=0, left=0
//               while(elem) {
//                 top = top + parseInt(elem.offsetTop)
//                 left = left + parseInt(elem.offsetLeft)
//                 elem = elem.offsetParent       
//               }
//               return {top: top, left: left}
//             }
// };
// function showdata(x,y){
//     var e = document.getElementById('tooltip');
//     var scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
//     var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
//     var xx = y+"px";
//     e.style.left = x+scrollLeft+"px";
//     e.style.top = xx;
//     console.log(scrollLeft+" - "+x+" "+scrollTop+"-"+y+" "+xx);
//     e.visibility = "visible";
// };
// var cumulativeOffset = function(element) {
//     var top = 0, left = 0;
//     do {
//         top += element.offsetTop  || 0;
//         left += element.offsetLeft || 0;
//         element = element.offsetParent;
//     } while(element);

//     return {
//         top: top,
//         left: left
//     };
// };
// function hidedata(){
//        var e = document.getElementById('tooltip');
//       // e.style.visibility = 'hidden';
//        e.innerHTML = "";
// }
//end of the library