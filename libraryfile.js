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
                  console.log("max element length: "+ullength+" "+ul);
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
                    console.log("now ul :"+ul);
                    ul = this.placezeros(ul,ullength,1);
                    console.log("now ul :"+ul);
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
                   console.log([ul,ll]);
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
        console.log(xaxisticks+" "+yaxisticks+" "+newmax+" "+newmin);
        var divisionX = (this.width) / xaxisticks;
        var divisiony = (this.height) / yaxisticks;
        var plotRatio = (this.height-divisiony) / newmax;
        var dataset="",ycord,xcord;

            for(var k in this.chartdata.dataset){
                //console.log(this.chartdata.dataset[k].data[i]);
                xcord= (divisionX*(parseInt(k)+1));
                ycord = this.height-(divisiony+Math.round(this.chartdata.dataset[k].data[item]*plotRatio));
                dataset += xcord+","+ycord+" ";
            }
            this.drawChart(dataset,divisiony,divisionX,xaxisticks,yaxisticks,newmax,newmin,item);
            dataset = "";
    };
    this.drawChart = function(dataset,divisiony,divisionX,xaxisticks,yaxisticks,newmax,newmin,item){
        var svgHeight = (this.height);
        var svgWidth = (this.width);
        var chartHeight=svgHeight;
        var chartWidth=svgWidth;
        console.log(svgHeight+" "+svgWidth+" "+chartHeight+" "+chartWidth+" "+divisiony+" "+divisionX+" "+yaxisticks+" "+xaxisticks);


        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute('width', svgWidth);
                svg.setAttribute('height', svgHeight);
                svg.setAttribute("style","width:100%; margin-left:5%; margin-top:5%;");
                var url = "http://www.w3.org/2000/svg";
                //var coordinates = pointStr.split(" ");
                
                var yax = document.createElementNS(url, "line");
                yax.setAttributeNS(null, "x1",0);
                yax.setAttributeNS(null, "y1", 0);
                yax.setAttributeNS(null, "x2",0);
                yax.setAttributeNS(null, "y2",chartHeight);
                yax.setAttributeNS(null, "stroke", "green");
                yax.setAttribute('style', "stroke:#000000; fill:none;");
                svg.appendChild(yax);

                var xax = document.createElementNS(url, "line");
                xax.setAttributeNS(null, "x1",0);
                xax.setAttributeNS(null, "y1",chartHeight);
                xax.setAttributeNS(null, "x2",chartWidth+50);
                xax.setAttributeNS(null, "y2",chartHeight);
                xax.setAttributeNS(null, "stroke", "green");
                xax.setAttribute('style', "stroke:#000000; fill:none;");
                svg.appendChild(xax);

                 var shape = document.createElementNS(url, "polyline");
                 shape.setAttributeNS(null, "points", dataset);
                 shape.setAttributeNS(null, "stroke", "green");
                 shape.setAttribute('style', "stroke:#5BDE6C; fill:none;");
                 svg.appendChild(shape); 
                 var coordinates = dataset.split(" ");
                 for(i = 0;i<(coordinates.length-1);i++){
                     var xy =coordinates[i].split(",");
                    console.log(xy);
                     var shape = document.createElementNS(url, "circle");
                         shape.setAttributeNS(null, "cx", xy[0]);
                        shape.setAttributeNS(null, "cy", xy[1]);
                         shape.setAttributeNS(null, "r",  4);
                         shape.setAttributeNS(null, "fill", "rgba(46,139,87,0.6)");
                         svg.appendChild(shape);
                 }

                var da ;
                
                for(var i=0;i<xaxisticks;i++){
                    da = parseInt(divisionX)*(i+1);
                    var yax = document.createElementNS(url, "line");
                        yax.setAttributeNS(null, "x1",da);
                        yax.setAttributeNS(null, "y1",chartHeight);
                        yax.setAttributeNS(null, "x2",da);
                        yax.setAttributeNS(null, "y2",chartHeight-10);
                        yax.setAttributeNS(null, "stroke", "green");
                        yax.setAttribute('style', "stroke:#000000; fill:none;");
                        svg.appendChild(yax);


                        var val =this.chartdata.dataset[i].time;
                        var newText = document.createElementNS(url,"text");
                        // newText.setAttribute("style","margin-left:-10x");
                        newText.setAttributeNS(null,"x",da-30);     
                        newText.setAttributeNS(null,"y",chartHeight-10); 
                        newText.setAttributeNS(null,"font-size","17");
                        var textNode = document.createTextNode(val);
                        newText.appendChild(textNode);
                        svg.appendChild(newText);

                }
                var title = this.chartdata.chartinfo.yaxisnames[item];
                var newText = document.createElementNS(url,"text");
                    newText.setAttribute("style","stroke:#FF4500");
                        newText.setAttributeNS(null,"x","45%");     
                        newText.setAttributeNS(null,"y",20); 
                        newText.setAttributeNS(null,"font-size","15");
                        var textNode = document.createTextNode(title);
                        newText.appendChild(textNode);
                        svg.appendChild(newText);

                for(i=0;i<yaxisticks;i++){

                    da =parseInt(divisiony)*i;

                    var val =newmax - Math.round((newmax/yaxisticks)*i);
                    var newText = document.createElementNS(url,"text");
                    newText.setAttribute("style","stroke:#00BFFF");
                        newText.setAttributeNS(null,"x",0);     
                        newText.setAttributeNS(null,"y",da+15); 
                        newText.setAttributeNS(null,"font-size","15");
                        var textNode = document.createTextNode(val);
                        newText.appendChild(textNode);
                        svg.appendChild(newText);
                        // document.getElementById("chart").appendChild(newText);



                    var xax = document.createElementNS(url, "line");
                        xax.setAttributeNS(null, "x1",0);
                        xax.setAttributeNS(null, "y1",da);
                        xax.setAttributeNS(null, "x2",10);
                        xax.setAttributeNS(null, "y2",da);
                        xax.setAttributeNS(null, "stroke", "green");
                        xax.setAttribute('style', "stroke:#000000; fill:none;");
                        svg.appendChild(xax);

                    var xxax = document.createElementNS(url, "line");
                        xxax.setAttributeNS(null, "x1",0);
                        xxax.setAttributeNS(null, "y1",da);
                        xxax.setAttributeNS(null, "x2",chartWidth+60);
                        xxax.setAttributeNS(null, "y2",da);
                        xxax.setAttributeNS(null, "stroke", "green");
                        xxax.setAttribute('style', "stroke:rgba(72,118,255,0.7); stroke-width:0.3;stroke-dasharray:10,10 ; fill:none;");
                        svg.appendChild(xxax);

                }
                
                document.getElementById("chart").appendChild(svg);

    };
}//end of the library
