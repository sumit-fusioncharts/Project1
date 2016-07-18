
function Multivariant(chartdata) {
    var Chartdata = chartdata;
    var separator = (chartdata.chartinfo.dataseparator === "") ? "|" : chartdata.chartinfo.dataseparator;
    var svgWidth = (chartdata.chartinfo.width === '') ? "300" : chartdata.chartinfo.width;
    var svgHeight = (chartdata.chartinfo.height === '') ? "400" : chartdata.chartinfo.height;
    var chartHeight = svgHeight-100;
    var chartWidth = svgWidth-100;
    var noOfGraphs = Chartdata.dataset.length;
    var xaxisticksNames = (Chartdata.timestamp.time).split(separator);
    var xaxisticks = xaxisticksNames.length;
    var textColor = "#000",fontSize=17,marginxy = 50;
    Multivariant.xCoor = [];

    this.render = function () {
        this.plotdata();
    };
    this.calPicks=function(ub,lb){
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
     function calculateMaxMin(data){
        //will return a array of max min values or obj
         var maxminobj={};
         var max,min,data,j,temp;

         for(var i=0;i<noOfGraphs;i++){
             data = (Chartdata.dataset[i].data).split(separator);
             min = Number(data[0]);
             max=min;
             //j= data.length-1;
             j = xaxisticks;
              while(j>=0){
                temp = Number(data[j]);
                if(temp>max && typeof temp!="undefined"){max=temp;}
                if(temp<min && typeof temp!="undefined"){min=temp;} 
                j--;
              }
              maxminobj[i] = {"max": max,"min": min}; //storing max and min value in this object
         }
          return maxminobj;  //returning max and min stored in this object
    };
    this.genLimits = function(max,min){

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
        }//if(val==temp){temp=temp-5;}
         return temp;
    };

    this.plotdata = function(){
                
                var maxmin = calculateMaxMin();
                var max,min,newmax,newmin,limits;
                for(var k in maxmin){        
                    max = maxmin[k].max;
                    min = maxmin[k].min;
      
                    if(max==min){
                         newmin = max-10; newmax = max+10;
                    }else{
                        limits = this.genLimits(max,min);
                        newmax = limits[0]; newmin = limits[1];
                    }                              
                    yaxisticks= this.calPicks(Number(limits[0]),Number(limits[1])); 
                    Multivariant.xCoor[k]=[];
                    this.measureMent(yaxisticks,newmax,newmin,k);                
            }
    };
    this.measureMent = function(yaxisticks,newmax,newmin,item){
        
        var divisionX = (chartWidth) / (xaxisticks-1);
        var divisiony = (chartHeight) / yaxisticks;
        var plotRatio = chartHeight/(newmax-newmin); 
        var dataset="",ycord,xcord;
        var calculationX,calculationY;
        var i,y,title ;

        var data = (Chartdata.dataset[item].data).split(separator);
        for(i=0;i<xaxisticks;i++){
            Multivariant.xCoor[item][i]=[];
            if(typeof data[i]!="undefined" && data[i]!=""){
                //console.log(data[i]);
                y = Number(data[i]);
                xcord= (divisionX*(i))+marginxy;
                ycord = (chartHeight - ((y-newmin)*plotRatio))+marginxy;             
                dataset += xcord+","+ycord+" ";
                
                Multivariant.xCoor[item][i][0]=xcord;
                Multivariant.xCoor[item][i][1]=ycord;
                Multivariant.xCoor[item][i][2]=xaxisticksNames[i];
                Multivariant.xCoor[item][i][3]=y;
            }
        }
            var url = "http://www.w3.org/2000/svg";
            var svg = document.createElementNS(url, "svg");
                svg.setAttribute('width', svgWidth);
                if(item==(noOfGraphs-1)){
                    svg.setAttribute('height', Number(svgHeight)+50);
                }else{
                    svg.setAttribute('height', svgHeight);
                }  
                svg.setAttribute('id', "svgContainer");
                svg.setAttribute("class"," svgclass");
               //caption and SubCaption
                if(item==0){//url,svg,x,y,textVal,textColor,fontSize,pos,textStyle,textClass,xPos
                    this.createText(url,svg,25+(svgWidth)/2-marginxy/2,25,Chartdata.chartinfo.caption,"#000",20,"middle","font-weight:bold; font-family:tahoma;","caption");
                    this.createText(url,svg,25+(svgWidth)/2-marginxy/2,43,Chartdata.chartinfo.subCaption,"#28223E",15,"middle","font-family:arial;","subCaption");
                }
                
                title = Chartdata.dataset[item].title; //yaxis caption left
                this.createText(url,svg,5,chartHeight/2+marginxy,title,'#0E2D48',13,"middle","writing-mode:tb;font-weight:bold;");
                this.createRect(url,svg,marginxy,marginxy,chartHeight,chartWidth-50,"svgInnerRect","stroke:#000000;stroke-width:0.4; fill:transparent;","svgInnerRect");


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
                      if (titleY_0 > 999 && titleY_0 < 999999) {
                        titleY = (titleY_0 / 1000).toFixed(1) + "K";
                      } else if (titleY_0 > 999999) {
                        titleY = (titleY_0 / 1000000).toFixed(1) + "M";
                      }
                    }
                    

                    this.createText(url,svg,(marginxy-20),(calculationY+5),titleY,"#145255",11,'middle',"","yaxisticks");
                    this.createLines(url,svg,(marginxy-7),(calculationY),(marginxy),(calculationY),"stroke:#000000;stroke-width:0.4; fill:none;","divisons","divisons");
                    this.createLines(url,svg,(marginxy),(calculationY),(chartWidth+marginxy),(calculationY),"stroke:rgba(72,118,255,0.9); stroke-width:0.2;stroke-dasharray:10,10 ; fill:none;","dashedLines","dashedLines");
                    if(i%2==0 && i!=yaxisticks){
                        this.createRect(url,svg,marginxy, calculationY,divisiony,chartWidth-50,"svgsRect","fill:rgba(219,249,255,0.3);");                        
                    }
                }
                this.createPoly(url,svg,dataset);
                this.createLines(url,svg,(marginxy),(marginxy),(marginxy),(chartHeight+marginxy),"stroke:red;stroke-width:0.8;stroke-dasharray:9,9;","crosshair","crosshair");
                 
                var coordinates = dataset.split(" "),xy;   
                for(i=0;i<xaxisticks;i++){
                    calculationX = Number(divisionX)*i+marginxy;
                    this.createLines(url,svg,calculationX,(chartHeight+marginxy+7),calculationX,(chartHeight+marginxy),"stroke:#000000;stroke-width:0.4; fill:none;");
                }
                
                if(item==(noOfGraphs-1)){
                    for(i=0;i<xaxisticks;i++){
                        calculationX = Number(divisionX)*(i)+marginxy;
                        var textVal =xaxisticksNames[i];
                        this.createText(url,svg,(calculationX),(chartHeight+marginxy+35),textVal,"#145255",14,"middle","writing-mode:tb;","xaxisticksNames");
                    }
                    title = Chartdata.chartinfo.xaxisname; //xaxis caption bottom
                    this.createText(url,svg,25+(svgWidth)/2-marginxy/2,chartHeight+marginxy+80,title,'#0E2D48',15,"middle","","xaxisTitle");
                }
                for(i = 0;i<(coordinates.length-1);i++){               
                    xy = coordinates[i].split(","); 
                    this.createeCirles(url,svg,xy[0],xy[1],6);
                }
                
                this.createRect(url,svg,-90,-90,30,40,"tootltiprect","stroke:rgba(22,77,96,0.9); stroke-width:0.6; fill:rgba(165,226,297,0.9);","tootltiprect");
                this.createText(url,svg,0,0,title,'rgb(22,77,96)',12,"middle","margin-top:10px;","uppertext");
                this.createRect(url,svg,marginxy,marginxy,chartHeight,chartWidth-50,"svgRect","fill:transparent;","svgCrosshairRect");

                document.getElementById("chart").appendChild(svg);
                var br = document.createElement("br");
                document.getElementById("chart").appendChild(br);
                dataset = "";      
    };
    this.setTitleX = function(x){//not using right now
            x = x.split(",");
        var d = new Date();
            d.setFullYear(x[2], x[1], x[0]);
        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return x[0]+" "+months[d.getMonth()]+"'"+x[2].substr(2,3);
    };
    this.createLines = function(url,svg,x1,y1,x2,y2,styleStr,classname,lineId){
        //id = (typeof x === 'undefined') ? id : "svgline";
        var lineXY = document.createElementNS(url, "line");
            lineXY.setAttributeNS(null, "x1",x1);
            lineXY.setAttributeNS(null, "y1",y1);
            lineXY.setAttributeNS(null, "x2",x2);
            lineXY.setAttributeNS(null, "y2",y2);
            lineXY.setAttributeNS(null, "class",classname);
            lineXY.setAttributeNS(null, "id",lineId);
            lineXY.setAttribute('style', styleStr);
            if(classname=="crosshair"){
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
            svg.appendChild(shape);
    };

    this.createTitle = function(url,svg,id,textData){
        var title = document.createElementNS(url,"title");
            title.textContent = textData;
            title.setAttributeNS(null, "id",id);
            svg.appendChild(title);
    };
    this.createPoly = function(url,svg,dataset){
        var shape = document.createElementNS(url, "polyline");
            shape.setAttributeNS(null, "points", dataset);
            shape.setAttributeNS(null, "class",  "svgPoly");
            shape.setAttribute('style', "stroke:#3EABAB;stroke-width:6;fill:none;");
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
        var cArr = document.getElementsByClassName("svgCrosshairRect");
        var rollover = new CustomEvent("mouserollover",{
            "detail":{x:event.clientX,y:event.clientY}
        });
        for( var i=0;i<cArr.length;i++){
            if(cArr[i]!=event.target)
                cArr[i].dispatchEvent(rollover);
        }
    }
    function moveCrosshair(e){
        var x = e.detail.x-svgWidth/2+25+(svgWidth-700)+(screen.width-window.innerWidth)/2, yT1,xT1,cdata,CtopX1,CtopX2,CtopY2,yT;
        var elements = document.getElementsByClassName("crosshair");
        var eRect = document.getElementsByClassName("tootltiprect");
        var uppertext = document.getElementsByClassName("uppertext");
        var crosshair = document.getElementsByClassName("crosshair");
        var svgRect = document.getElementById("svgsRect");
       


        for(var i = 0; i<elements.length; i++){
            elements[i].setAttribute("visibility","visible");
            elements[i].setAttribute("x1",x);
            elements[i].setAttribute("x2",x);

        for(var j=0;j<xaxisticks;j++){

            if(Multivariant.xCoor[i][j][0]-10<x && Multivariant.xCoor[i][j][0]+10>x){
                yT = Multivariant.xCoor[i][j][1];
                xT = Multivariant.xCoor[i][j][0];

                //yT1 = Multivariant.xCoor[i][j+1][1];
                //xT1 = Multivariant.xCoor[i][j+1][0];
                //.log(yT+","+xT+"  "+yT1+","+xT1);
                //console.log(interpolate(x,xT,yT,Multivariant.xCoor[i][j+1][0],Multivariant.xCoor[i][j+1][1]));
                //uppertext[i].setAttribute("visibility","visible");
                
                CtopY2=crosshair[i].getAttribute("y2");
                CtopX2=svgRect.getAttribute("width");

                 if((CtopY2-60)<yT){
                    uppertext[i].setAttribute("y",yT-20);
                    eRect[i].setAttribute("y",yT-40);
                 }else{
                    uppertext[i].setAttribute("y",yT+30);
                    eRect[i].setAttribute("y",yT+10);
                 }
                 
                 if((CtopX2-80)<(x+10)){
                    eRect[i].setAttribute("x",xT-100);
                    uppertext[i].setAttribute("x",xT-55);
                 }else{
                    eRect[i].setAttribute("x",xT+10);
                    uppertext[i].setAttribute("x",xT+55);
                 }   
                           
            uppertext[i].innerHTML=Multivariant.xCoor[i][j][3];
          }
        }
      }
    };
    function hideCrossHair(e){
        var elements = document.getElementsByClassName("crosshair");
        for(var i = 0; i<elements.length; i++){
                elements[i].setAttribute("visibility","hidden");
            }
    }
    function interpolate(x,x1,y1,x2,y2){
        return ((((x-x1)*(y2-y1))/(x2-x1))+y1);
    }
    this.createText = function(url,svg,x,y,textVal,textColor,fontSize,pos,textStyle,textClass,xPos){
        var newText = document.createElementNS(url,"text");
            svg.appendChild(newText);
            newText.setAttributeNS(null,"x",x);   
            newText.setAttributeNS(null,"y",y);
            newText.setAttributeNS(null,"class",textClass); 
            newText.setAttributeNS(null,"font-size",fontSize+"px");
            newText.setAttributeNS(null,"text-anchor","middle");
            newText.setAttributeNS(null, "fill", textColor);
            newText.setAttributeNS(null, "style", textStyle);  
            newText.innerHTML =textVal;
    };
};
