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
        this.createTooltipDiv();
    };
    this.createTooltipDiv = function(){
        var div = document.createElement("div");
            div.style.width = "100px";
            div.style.height = "20px";
            div.style.background = "#fff";
            div.style.color = "#ccc";
            div.style.padding = "5px";
            div.style.textAlign  = "center";
            div.style.visibility  = "hidden";
            div.style.position  = "absolute";
            div.style.top  = "0px";
            div.style.left  = "0px";
            div.id = "tooltip";
            document.body.appendChild(div);
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
    this.placezeros= function(data,range,method){
        if(method==0){
            while (data.length < range) {
             data = '0'+data;
            }
            return "0."+data;
        }else{
            while (data.length < range) {
             data =  data+'0';
            }
            return data;
        }
    };
    this.createlimits= function(ul,ll){
                  var ullength = ul.length;
                  var lllength = ll.length;
                  var cnt; 
                  //lengths of the strings retrived
                  //data does not have leading zeros
                  if(ul[0]==0){
                    cnt=0;
                    for(var i=0;i<ullength;i++){
                        if(ul[i]==0){
                            cnt++;
                        }else{
                            break;
                        }
                    }
                    cnt++;
                    if(ul[0]==9){
                        ul=1;
                    }else{
                        ul = ul.replace(/^0+/, '');
                        ul = ul.substr(0,1);
                        ul = (parseInt(ul)+1).toString();
                        ul = this.placezeros(ul,cnt,0);
                    }
                  }else{
                    ul = ul.substr(0,1);
                    ul = (parseInt(ul)+1).toString();
                    ul = this.placezeros(ul,ullength,1);
                  }
                  if(ll[0]==0){
                    cnt=0;
                    for(var i=0;i<lllength;i++){
                        if(ll[i]==0){
                            cnt++;
                        }else{
                            break;
                        }
                    }
                    cnt++;
                    ll = ll.replace(/^0+/, '');
                    ll = ll.substr(0,1);
                    ll = (parseInt(ll)+1).toString();
                    ll = this.placezeros(ll,cnt,0);
                  }else{
                    ll = ll.substr(0,1);
                    ll = this.placezeros(ll,lllength,1);
                  }
                   return [ul,ll]; 
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
    this.plotdata = function(){
                var maxmin = calculateMaxMin(this.chartdata);
                var max,min,newmax,newmin,limits,divisiony,divisionX,plotRatio;
                for(var k in maxmin){
                    max = maxmin[k].max;
                    min = maxmin[k].min;
                    if(max%1!=0){//decimal
                        //newmax = max.toString().split(".")[0];
                        if(max<1){
                            newmax = max.toString().split(".")[1];
                        }else{
                            newmax = max.toString().split(".")[0];
                        }           
                    }else{
                        newmax = max.toString();
                    }
                    if(min%1!=0){
                        if(min<1){
                            newmin = min.toString().split(".")[1];
                        }else{
                            newmin = min.toString().split(".")[0];
                        }
                    }else{
                        newmin = min.toString();
                    }           
                limits = this.createlimits(newmax,newmin);
                newmax = limits[0]; newmin = limits[1];
                yaxisticks= this.calPicks(parseInt(limits[0]),parseInt(limits[1]));
                xaxisticks= this.chartdata.dataset.length; 
                this.measureMent(xaxisticks,yaxisticks,newmax,newmin,yaxisticks,xaxisticks,k);                
            }
    };
    this.measureMent = function(xaxisticks,yaxisticks,newmax,newmin,yaxisticks,xaxisticks,item){
        var svgHeight = (this.height);
        var svgWidth = (this.width);
        var chartHeight=svgHeight-140;
        var chartWidth=svgWidth-100;
        var divisionX = (chartWidth) / xaxisticks;
        var divisiony = (chartHeight) / yaxisticks;
        var plotRatio = chartHeight/(newmax-newmin); //(chartHeight) / newmax;
        var dataset="",ycord,xcord,marginxy = 50;
        var calculationX,calculationY,textColor="#000",fontSize=17;
        var i = 1;
            for(var k in this.chartdata.dataset){
                xcord= (divisionX*(parseInt(k)+1))+marginxy;
                ycord = (chartHeight - ((this.chartdata.dataset[k].data[item]-newmin)*plotRatio))+marginxy;
                dataset += xcord+","+ycord+" ";i++;
            }

            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute('width', svgWidth);
                svg.setAttribute('height', svgHeight);
                svg.setAttribute("style"," margin:20px;");
                var url = "http://www.w3.org/2000/svg";

                this.createLines(url,svg,(marginxy),(marginxy-30),(marginxy),(chartHeight+marginxy+20),"stroke:#000000; fill:none;");
                this.createLines(url,svg,(marginxy),(chartHeight+marginxy+20),(chartWidth+marginxy+50),(chartHeight+marginxy+20),"stroke:#000000; fill:none;");
                this.createPoly(url,svg,dataset);

                var coordinates = dataset.split(" "),xy;
                for(i = 0;i<(coordinates.length-1);i++){               
                    xy = coordinates[i].split(","); 
                    this.createeCirles(url,svg,xy[0],xy[1],4,i);
                }
                
                for(var i=0;i<xaxisticks;i++){
                    calculationX = parseInt(divisionX)*(i+1)+marginxy;
                    this.createLines(url,svg,calculationX,(chartHeight+marginxy+25),calculationX,(chartHeight+marginxy+15),"stroke:#000000; fill:none;");
                    var textVal =this.chartdata.dataset[i].time;
                    this.createText(url,svg,(calculationX),(chartHeight+marginxy+45),textVal,fontSize);
                }

                var title = this.chartdata.chartinfo.caption+" - "+this.chartdata.chartinfo.yaxisnames[item];
                this.createText(url,svg,'50%',25,title,fontSize);
                title = this.chartdata.chartinfo.xaxisname;
                this.createText(url,svg,'50%',chartHeight+marginxy+75,title,'red',15);

                for(i=0;i<=yaxisticks;i++){
                    calculationY =(parseInt(divisiony)*i)+marginxy;
                    var titleY =newmax - Math.round(((newmax-newmin)/yaxisticks)*i);

                    this.createText(url,svg,(marginxy-20),(calculationY+5),titleY,fontSize);
                    this.createLines(url,svg,(marginxy-5),(calculationY),(marginxy+5),(calculationY),"stroke:#000000; fill:none;");
                    this.createLines(url,svg,(marginxy+10),(calculationY),(chartWidth+marginxy+20),(calculationY),"stroke:rgba(72,118,255,0.7); stroke-width:0.3;stroke-dasharray:10,10 ; fill:none;");
                }   
                document.getElementById("chart").appendChild(svg);
                dataset = "";
    };
    this.createLines = function(url,svg,x1,y1,x2,y2,styleStr){
        var lineXY = document.createElementNS(url, "line");
            lineXY.setAttributeNS(null, "x1",x1);
            lineXY.setAttributeNS(null, "y1",y1);
            lineXY.setAttributeNS(null, "x2",x2);
            lineXY.setAttributeNS(null, "y2",y2);
            lineXY.setAttribute('style', styleStr);
            svg.appendChild(lineXY);
    };
    this.createeCirles = function(url,svg,x,y,r,i){
            var shape = document.createElementNS(url, "circle");
            shape.setAttributeNS(null, "cx", x);
            shape.setAttributeNS(null, "cy", y);
            shape.setAttributeNS(null, "r",  r);
            shape.setAttributeNS(null, "onmouseover",  'showdata('+x+','+y+');');
            shape.setAttributeNS(null, "onmouseout",  'hidedata();');
            shape.setAttributeNS(null, "id",  'circle'+i);
            shape.setAttributeNS(null, "fill", "rgba(46,139,87,0.6)");
            svg.appendChild(shape);
    };
    this.createPoly = function(url,svg,dataset){
        var shape = document.createElementNS(url, "polyline");
        shape.setAttributeNS(null, "points", dataset);
        shape.setAttribute('style', "stroke:#5BDE6C; fill:none;");
        svg.appendChild(shape); 
    };
    this.createText = function(url,svg,x,y,textVal,textColor,fontSize){
        var newText = document.createElementNS(url,"text");
            newText.setAttributeNS(null,"x",x);     
            newText.setAttributeNS(null,"y",y); 
            newText.setAttributeNS(null,"font-size",fontSize);
            newText.setAttributeNS(null,"text-anchor","middle");
            newText.setAttributeNS(null, "fill", textColor);
        var textNode = document.createTextNode(textVal);
            newText.appendChild(textNode);
            svg.appendChild(newText);
    };
}
function showdata(x,y){
       var e = document.getElementById('tooltip');
       e.style.left = (x+50)+"px";
       e.style.top = (y+30)+"px";
       e.style.visibility = 'visible';
       e.innerHTML = x;
}
function hidedata(){
       var e = document.getElementById('tooltip');
       e.style.visibility = 'hidden';
       e.innerHTML = "";
}
//end of the library
// window.onmouseover=function(e) {
//         console.log(e.target.r);
// };