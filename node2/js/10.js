//Defining data
function Multivariant(chartdata){
	this.chartdata = chartdata;

	var chartInfo = new DataParsing(this.chartdata);
		this.separator = chartInfo.separator();
		this.svgHeight = chartInfo.svgheight();
		this.svgWidth = chartInfo.svgWidth();
		this.numOfGraphsInaRow = chartInfo.numOfGraphsInaRow();
		this.numOfGraphs = chartInfo.numOfGraphs();
		this.chartDiv = chartInfo.chartDiv();
		this.xAxisNames = chartInfo.xAxisNames(this.separator); xlen = this.xAxisNames.length;
		this.chartArrengement = chartInfo.chartArrengement();
		this.chartType = chartInfo.chartType();
        this.caption = chartInfo.caption();
        this.subCaption = chartInfo.subCaption();
        this.dataSet = chartInfo.dataSet();
        this.customData = chartInfo.customize();

	this.chartHeight = this.svgHeight-100;
	this.chartWidth = this.svgWidth-60;
	this.margin = 50;

    this.divOrder = function(){
        var ordereddArr = [],temp = [], data = chartInfo.customize();;

        var maxtomin = function(){
            for(var i in data){

            }
        var defaultorder = function(){

            for(var i in data){
                ordereddArr.push(data[i].index);
            }
        };
        console.log(this.chartArrengement)
        switch(this.chartArrengement){
            case "maxtomin": maxtomin();break; 
        }
        return 1;
    }
};

Multivariant.prototype.render = function() {
    this.divOrder();
	var temp,axisObj={};
	for(var i in this.customData){
		temp = this.beautify(this.customData[i].max,this.customData[i].min);
		if(temp[0]==temp[1]){
           temp[1] = temp[0]-10; temp[0] = temp[0]+10;
	    }else{
	       temp = this.beautify(temp[0],temp[1]);
	    }
		this.customData[i].newmax = temp[0];
		this.customData[i].newmin = temp[1];
		
	}

	axisObj.y = this.customData;
	axisObj.x = this.xAxisNames;
	axisObj.chartDetails = [this.chartHeight,this.chartWidth,this.margin,this.caption,this.subCaption];

	var axisInstance = new Axis(axisObj,this.chartDiv,this.chartType,this.numOfGraphs,this.numOfGraphsInaRow);
		axisInstance.draw();
};
Multivariant.prototype.countzeros = function(val){
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
Multivariant.prototype.addLeadingzeros = function(val,cnt){
    if(typeof val!="string"){val=val.toString();}
        while (val.length <= cnt){
            val = "0" + val;
        }
        return val;
    };
Multivariant.prototype.removeNeg = function(val){
        val = val.toString();
            if (val.substring(0, 1) == '-') {
            val = Number(val.substring(1));        
        }//now max does not contains "-"
        return val;
    };
Multivariant.prototype.genUp = function(val){
          var len = val.length,temp;
          if (len > 3) {
            temp = (Number(val[len - 3]) + 1) * 100;
            temp = Number(val.substr(0, (len - 3))) * 1000 + temp;
          } else {
            temp = (Number(val[0]) + 1) * Math.pow(10, (len - 1));
          }
          return temp;
    };
Multivariant.prototype.genDown = function(val){
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
Multivariant.prototype.beautify = function(max,min){
	var cnt=0,negMax=false,negMin=false,newmax,newmin;//typeval solid,single
            if(max<0){negMax=true;
                   max=this.removeNeg(max); 
                }
            if(max%1!=0){//decimal                    
                if(max<1){
                    newmax = max.toString().split(".")[1];
                    cnt=this.countzeros(newmax);//counting leading zeros
                    newmax = newmax.replace(/^0+/, '');//removing leading zeros
                    if(negMax==true){
                        newmax = this.genDown(newmax);
                        newmax = "-0."+this.addLeadingzeros(newmax,cnt);
                    }else{
                        newmax = this.genUp(newmax);
                        newmax = "0."+this.addLeadingzeros(newmax,cnt);
                    }
                }else{
                        newmax = max.toString().split(".")[0];
                        if(negMax==true){
                            newmax = "-"+this.genDown(newmax);
                        }else{
                            newmax = this.genUp(newmax);
                        }
                    }           
            }else{
                newmax = max.toString();
                if(negMax==true){
                    newmax = "-"+this.genDown(newmax);
                }else{
                    newmax = this.genUp(newmax);
                }
            }
            //+++++++++++++++++++++++
            if(min<0){negMin=true;
                    min=this.removeNeg(min);
                }
            if(min%1!=0){
                
                if(min<1){
                    newmin = min.toString().split(".")[1];//0.002,0.2,-0.5
                    cnt=this.countzeros(newmin);//counting leading zeros
                    newmin = newmin.replace(/^0+/, '');//removing leading zeros
                    if(negMin==true){
                        newmin = this.genUp(newmin);
                        newmin = "-0."+this.addLeadingzeros(newmin,cnt);
                    }else{
                        newmin = this.genDown(newmin);
                        newmin = "0."+this.addLeadingzeros(newmin,cnt);
                    }

                }else{
                    newmin = min.toString().split(".")[0];//2.34-down,(-2.34,neg=up) single-1
                        if(negMin==true){
                            newmin = "-"+this.genUp(newmin);
                        }else{
                            newmin = this.genDown(newmin);
                        }
                    }
                }else{
                    newmin = min.toString();//normal 200-down,234-down,(200,neg=up)
                    if(negMin==true){
                        newmin = "-"+this.genUp(newmin);
                    }else{
                        newmin = this.genDown(newmin);
                    }
                }  

                return[Number(newmax),Number(newmin)]; 
}