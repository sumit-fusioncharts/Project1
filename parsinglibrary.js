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
        this.plotdata(this.chartdata);
        this.testcase();
         //dynamic but for now working with static data
         //var range = this.TickRange(14.01,3.32); //genarating range per graph
         //console.log(range);

        //console.log(maxmin[0].max+" "+this.yaxisticks);
    };



    this.calTicks=function(ub,lb){
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
      return(yaxisticks);  
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
                  //console.log(ullength+" "+lllength);
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
    this.testcase = function(){
                var maxmin = this.calculateMaxMin(this.chartdata),max,min,cnt=0,
                newmax,newmin,limits,x=0,y,xaxisDiff,dataPerPx,dataStr="";
                xaxisticks=this.chartdata.dataset.length;
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
                yaxisticks=this.calTicks(parseInt(limits[0]),parseInt(limits[1]));

                pickY = this.height/(yaxisticks+1);
                pickX = this.width/(xaxisticks+1);

                console.log(xaxisticks+" "+yaxisticks+" "+pickY+" "+pickX);

                dataPerPx = newmax/(this.height -(2*pickY));
                console.log(limits);
                for(var m=0;m<xaxisticks;m++){
                    y = this.height - Math.round((this.chartdata.dataset[m].data[cnt])*dataPerPx);
                    x = x+pickX;
                    dataStr +=x+","+y+" ";
                }
                cnt++;
                this.drawGraph(xaxisticks,yaxisticks,limits,dataStr);
                dataStr="";

            }
    };
    this.drawGraph = function(xaxisticks,yaxisticks,limits,dataStr){
       //console.log(xaxisticks+" "+yaxisticks+" "+limits+" "+dataStr)
    };





    this.drawChart = function(pointStr,pickX,pickY,ul,ll){
                var xdiff = this.width/pickX,
                ydiff = this.height/pickY;
                var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute('width', '600');
                svg.setAttribute('height', '600');
                svg.setAttribute('padding','50');
                var url = "http://www.w3.org/2000/svg";
                var coordinates = pointStr.split(" ");

                for(var i=0;i<pickX;i++){
                    var yax = document.createElementNS(url, "line");
                        yax.setAttributeNS(null, "x1",xdiff*i);
                        yax.setAttributeNS(null, "y1",this.height);
                        yax.setAttributeNS(null, "x2",xdiff*i);
                        yax.setAttributeNS(null, "y2",this.height-10);
                        yax.setAttributeNS(null, "stroke", "green");
                        yax.setAttribute('style', "stroke:#000000; fill:none;");
                        svg.appendChild(yax);

                }
                for(i=0;i<pickY;i++){

                    var newText = document.createElementNS(url,"text");
                        newText.setAttributeNS(null,"x",0);     
                        newText.setAttributeNS(null,"y",ydiff*i); 
                        newText.setAttributeNS(null,"font-size","20");
                        var textNode = document.createTextNode("val");
                        newText.appendChild(textNode);
                        svg.appendChild(newText);

                    var xax = document.createElementNS(url, "line");
                        xax.setAttributeNS(null, "x1",-10);
                        xax.setAttributeNS(null, "y1",ydiff*i);
                        xax.setAttributeNS(null, "x2",10);
                        xax.setAttributeNS(null, "y2",ydiff*i);
                        xax.setAttributeNS(null, "stroke", "green");
                        xax.setAttribute('style', "stroke:#000000; fill:none;");
                        svg.appendChild(xax);

                    var xxax = document.createElementNS(url, "line");
                        xxax.setAttributeNS(null, "x1",-10);
                        xxax.setAttributeNS(null, "y1",ydiff*i);
                        xxax.setAttributeNS(null, "x2",this.width);
                        xxax.setAttributeNS(null, "y2",ydiff*i);
                        xxax.setAttributeNS(null, "stroke", "green");
                        xxax.setAttribute('style', "stroke:rgba(72,118,255,0.7); stroke-width:0.3;stroke-dasharray:10,10 ; fill:none;");
                        svg.appendChild(xxax);

                }
                var yax = document.createElementNS(url, "line");
                yax.setAttributeNS(null, "x1",40);
                yax.setAttributeNS(null, "y1", 40);
                yax.setAttributeNS(null, "x2",40);
                yax.setAttributeNS(null, "y2",this.height);
                yax.setAttributeNS(null, "stroke", "green");
                yax.setAttribute('style', "stroke:#000000; fill:none;");
                svg.appendChild(yax);

                var xax = document.createElementNS(url, "line");
                xax.setAttributeNS(null, "x1",40);
                xax.setAttributeNS(null, "y1",this.height);
                xax.setAttributeNS(null, "x2",this.width);
                xax.setAttributeNS(null, "y2",this.height);
                xax.setAttributeNS(null, "stroke", "green");
                xax.setAttribute('style', "stroke:#000000; fill:none;");
                svg.appendChild(xax);

                var shape = document.createElementNS(url, "polyline");
                shape.setAttributeNS(null, "points", pointStr);
                shape.setAttributeNS(null, "stroke", "green");
                shape.setAttribute('style', "stroke:#5BDE6C; fill:none;");
                svg.appendChild(shape); 

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
                document.body.appendChild(svg);
    };
    this.generateRatio = function(totalData,dataPerPx){


        };
    this.plotdata = function(objP) {
        var maxmin = this.calculateMaxMin(objP),totalData,dataPerPx,xaxis,x=0,y,cnt=0,dataStr="";
        var noofiteration = ((objP.dataset).length-1);
        var pickX = (noofiteration+2),pickY;
        var xaxisDiff = this.width/pickX;
        
        for(var k in maxmin){
            var range = this.TickRange(maxmin[k].max,maxmin[k].min);
            //plot svg per data
            totalData = range[0]-range[1];
            dataPerPx = (range[0]/this.height);
            //console.log(range);
            pickY = range[3]+2;
            //retriving yaxisdata
            for(var k=0;k<=noofiteration;k++){
                y = this.height - Math.round((objP.dataset[k].data[cnt])/dataPerPx);
                //console.log(y);
                x = x+xaxisDiff;
                dataStr +=x+","+y+" ";
                //console.log(objP.dataset[k].data[cnt]);
                //console.log(this.height+" "+range[0]+" "+range[1]+" "+totalData+" "+dataPerPx+" "+objP.dataset[k].data[cnt]+"  "+Math.round((objP.dataset[k].data[cnt])/dataPerPx));
            }
            //console.log(totalData+" "+((objP.dataset).length-1));
            //console.log(dataStr);
            this.drawChart(dataStr,pickX,pickY,range[0],range[1]);
            dataStr ="",x=0;
            //break;
            cnt++;
        }
    };
    this.calculateMaxMin =function(obj){
        //will return a array of max min values or obj
        var noOfGraphs = (obj.chartinfo.yaxisnames).length,
        noofiteration=((obj.dataset).length-1),j;
        var maxminobj={};
        //console.log(noofiteration);
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
             //console.log(max+" "+min);
        }
         return maxminobj;  //returning max and min stored in this object
    };
    this.calculatepicks = function(num){
        var flag =1;
        num = parseInt(num.toString().substr(0, 2));
             for(var i=7;i>3;i--){
                 if(num%i==0)
                 {   num = i;
                     flag =0;
                     break;
                 }
             }
             if(flag == 0){
                return num;
             }else{
                return 5;
             }
    };
  
    this.TickRange = function(max,min){

        if(max<10 && max>1){
            this.xaxisticks = max*10;
            //console.log(this.xaxisticks+" .1");
            this.xaxisticks = this.calculatepicks(this.xaxisticks);
        }else if(max<1){
            //number of zeros should be calculated
            //console.log(this.xaxisticks+" .2");
            this.xaxisticks = this.calculatepicks(this.xaxisticks);
        }else{
            //console.log(this.xaxisticks+" .3");
            this.xaxisticks = this.calculatepicks(max);
        }
        //console.log(this.xaxisticks);
        //noticks=5;
        var diff = max-min;
        // console.log(diff);
        var tickrange = diff/(this.xaxisticks-1);
        //console.log(tickrange);
        var v = (Math.log10(tickrange)-1);
        // console.log(v);
        var val = Math.ceil(v);
        // console.log(val);
        var pow10 = (Math.pow(10, val));
        // console.log(pow10x);
        var rTickRange = Math.ceil(tickrange / pow10)* (pow10);
        // console.log(rTickRange);
        var ul,lw;
        ul= rTickRange*Math.round(max/rTickRange+1);
        lw= rTickRange*Math.round(min/rTickRange-1);
        return [ul,lw,rTickRange,this.xaxisticks];      
    }
}

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute('width', svgWidth);
                svg.setAttribute('height', svgHeight);
                var url = "http://www.w3.org/2000/svg";
                
                var yax = document.createElementNS(url, "line");
                yax.setAttributeNS(null, "x1",100);
                yax.setAttributeNS(null, "y1",100);
                yax.setAttributeNS(null, "x2",100);
                yax.setAttributeNS(null, "y2",chartHeight);
                yax.setAttributeNS(null, "stroke", "green");
                yax.setAttribute('style', "stroke:#000000; fill:none;");
                svg.appendChild(yax);

                var xax = document.createElementNS(url, "line");
                xax.setAttributeNS(null, "x1",100);
                xax.setAttributeNS(null, "y1",chartHeight);
                xax.setAttributeNS(null, "x2",chartWidth);
                xax.setAttributeNS(null, "y2",chartHeight);
                xax.setAttributeNS(null, "stroke", "green");
                xax.setAttribute('style', "stroke:#000000; fill:none;");
                svg.appendChild(xax);

                
                console.log("y"+yaxisticks+" "+divisiony);
                console.log("x"+xaxisticks+" "+divisionX);


                 for(i=0;i<xaxisticks;i++){
                     var gap = 100+divisiony*i;//svgHeight+(divisiony*i)-100;
                     console.log(gap);
                     var smallx = document.createElementNS(url, "line");
                     smallx.setAttributeNS(null, "x1",gap);
                     smallx.setAttributeNS(null, "y1",chartHeight-3);
                     smallx.setAttributeNS(null, "x2",gap);
                     smallx.setAttributeNS(null, "y2",chartHeight+3);
                     smallx.setAttributeNS(null, "stroke", "green");
                     smallx.setAttribute('style', "stroke:#000000; fill:none;");
                     svg.appendChild(smallx);
                 }
                 for(i=0;i<divisionX;i++){
                     var gap = 100+divisionX*i;//svgHeight+(divisiony*i)-100;
                     //console.log(gap);
                     var smallx = document.createElementNS(url, "line");
                     smallx.setAttributeNS(null, "x1",97);
                     smallx.setAttributeNS(null, "y1",gap);
                     smallx.setAttributeNS(null, "x2",103);
                     smallx.setAttributeNS(null, "y2",gap);
                     smallx.setAttributeNS(null, "stroke", "green");
                     smallx.setAttribute('style', "stroke:#000000; fill:none;");
                     svg.appendChild(smallx);
                 }


        document.body.appendChild(svg);