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
    this.testcase = function(){
                var o = this.chartdata,arrData=[];
                var availableData = ((o.dataset[0].data).length-1),
                    noofiteration = ((o.dataset).length-1);
                    for(var i=0;i<noofiteration;i++){
                        arrData.push(o.dataset[i].data[0]);
                    }
                    arrData.sort(function(a, b) {
                      return a - b;
                    });
                    console.log(arrData);
                    for(i =0;i<arrdata.length;i++){
                        
                    }

                    console.log(arrData);
                    //var kvArray = [{key:1, value:10}, {key:2, value:20}, {key:3, value: 30}];
                    var reformattedArray = o.dataset.map(function(obj){ 
                       var rObj = {};
                       rObj[obj.time] = obj.data;
                       //console.log(rObj);
                       return rObj;
                    });

                console.log(reformattedArray);
    };
    this.drawChart = function(pointStr){
                var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute('width', '800');
                svg.setAttribute('height', '600');
                var url = "http://www.w3.org/2000/svg";

                var yax = document.createElementNS(url, "line");
                yax.setAttributeNS(null, "x1",10);
                yax.setAttributeNS(null, "y1", 0);
                yax.setAttributeNS(null, "x2",10);
                yax.setAttributeNS(null, "y2",this.height);
                yax.setAttributeNS(null, "stroke", "green");
                yax.setAttribute('style', "stroke:#000000; fill:none;");
                svg.appendChild(yax);

                var xax = document.createElementNS(url, "line");
                xax.setAttributeNS(null, "x1",0);
                xax.setAttributeNS(null, "y1", this.height-10);
                xax.setAttributeNS(null, "x2",this.width+60);
                xax.setAttributeNS(null, "y2",this.height-10);
                xax.setAttributeNS(null, "stroke", "green");
                xax.setAttribute('style', "stroke:#000000; fill:none;");
                svg.appendChild(xax);

                var shape = document.createElementNS(url, "polyline");
                shape.setAttributeNS(null, "points", pointStr);
                shape.setAttributeNS(null, "stroke", "green");
                shape.setAttribute('style', "stroke:#5BDE6C; fill:none;");
                svg.appendChild(shape); 

                document.body.appendChild(svg);
    };
    this.generateRatio = function(totalData,dataPerPx){


        };
    this.plotdata = function(objP) {
        var maxmin = this.calculateMaxMin(objP),totalData,dataPerPx,xaxis,x=0,y,cnt=0,dataStr="";
        var noofiteration = ((objP.dataset).length-1);
        var xaxisDiff = this.width/noofiteration;

        for(var k in maxmin){
            var range = this.TickRange(maxmin[k].max,maxmin[k].min);
            //plot svg per data
            totalData = range[0]-range[1];
            dataPerPx = (totalData/this.height);
            //retriving yaxisdata
            for(var k=0;k<=noofiteration;k++){
                y = Math.round((objP.dataset[k].data[cnt])/dataPerPx);
                console.log(y);
                x = x+xaxisDiff;
                dataStr +=x+","+y+" ";
                //console.log(objP.dataset[k].data[cnt]);
                //console.log(this.height+" "+range[0]+" "+range[1]+" "+totalData+" "+dataPerPx+" "+objP.dataset[k].data[cnt]+"  "+Math.round((objP.dataset[k].data[cnt])/dataPerPx));
            }
            // for(var k=0;k<((objP.dataset).length-1);k++){
            //     console.log(objP.dataset[cnt].data[k]);
            // }
            //console.log(totalData+" "+((objP.dataset).length-1));
            console.log(dataStr);
            this.drawChart(dataStr);
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
