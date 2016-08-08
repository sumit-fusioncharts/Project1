function Chart(chartobj){
	this.chartData = chartobj;
    var chartType = (typeof this.chartData.chartinfo == "undefined") ? this.chartData.chartdatafun().chartinfo.chartType : this.chartData.chartinfo.chartType;
	this.render = function(){
		if(chartType=="crosstab"){
			
            this.crosstab();

		}else if(chartType=="line" || chartType=="column"){
			
			var chartInfo = new Visualization(this.chartData,"dothis");
			this.separator = chartInfo.separator();
			this.svgHeight = chartInfo.svgheight();
			this.svgWidth = chartInfo.svgWidth();
			this.numOfGraphsInaRow = chartInfo.numOfGraphsInaRow();
			this.numOfGraphs = chartInfo.numOfGraphs();
			this.chartDiv = chartInfo.chartDiv();
			this.xAxisNames = chartInfo.xAxisNames(this.separator); xlen = this.xAxisNames.length;
			this.chartArrengement = chartInfo.chartArrengement();
			this.chartType = chartInfo.chartType();
	        this.caption = chartInfo.caption(); console.log(this.caption);
	        this.subCaption = chartInfo.subCaption();
	        this.dataSet = chartInfo.dataSet();
	        this.customData = chartInfo.customize();

			this.chartHeight = this.svgHeight-100;
			this.chartWidth = this.svgWidth-60;
			this.margin = 50;

            this.divOrder = function(){
                var ordereddArr = [],temp = [], data = chartInfo.customize();

                var maxtomin = function(){
                    for(var i in data){
                        temp.push(data[i].max);
                    }
                    temp = temp.sort(max2min);
                    for(var i in temp){
                       for(var j in data){
                         if(temp[i]==data[j].max){
                            ordereddArr.push(data[j].index);
                            }
                        }
                    }
                }
                var mintomax = function(){
                    for(var i in data){
                        temp.push(data[i].min);
                    }
                    temp = temp.sort(min2max);
                    for(var i in temp){
                       for(var j in data){
                         if(temp[i]==data[j].min){
                            ordereddArr.push(data[j].index);
                         }
                       }
                    }

                }
                var avgmaxtomin = function(){
                    for(var i in data){
                        temp.push(data[i].avg);
                    }
                    temp = temp.sort(max2min);
                    for(var i in temp){
                       for(var j in data){
                         if(temp[i]==data[j].avg){
                            ordereddArr.push(data[j].index);
                            }
                        }
                    }
                }
                var avgmintomax = function(){
                    for(var i in data){
                        temp.push(data[i].avg);
                    }
                    temp = temp.sort(min2max);
                    for(var i in temp){
                       for(var j in data){
                         if(temp[i]==data[j].avg){
                            ordereddArr.push(data[j].index);
                            }
                        }
                    }
                }
                var defaultorder = function(){
                    for(var i in data){
                        ordereddArr.push(data[i].index);
                    }
                }
                switch(this.chartArrengement){
                    case "maxtomin": maxtomin();break;
                    case "mintomax": mintomax();break;
                    case "avgmaxtomin": avgmaxtomin();break; 
                    case "avgmintomax": avgmintomax();break; 
                    default : defaultorder();break;  
                }
                return ordereddArr;
            }
            var max2min = function(a,b){
              return b-a;
            };
            var min2max = function(a,b){
              return a-b;
            };
            var sum = function(a,b){
              return a+b;
            };

			this.drawchart();
		}else{
            return this.chartData;
        }
	}
};
Chart.prototype.crosstab = function(){
	var height,width,svgHeight,svgWidth,xaxisticks = 3,chartWidth;
	this.barSpacing = 4;
	this.barHeight = 20;
	
    height = this.height("crosstab");
    width = this.width("crosstab");
    
    svgHeight = height+100;
    svgWidth = window.innerWidth-50;//width;

	chartWidth = svgWidth/this.chartData.coltable.length;
    this.cwidth = chartWidth;

	
	
	this.chartData.svg = {ct:"crosstab",bh:this.barHeight,bs:this.barSpacing,sh:svgHeight,sw:svgWidth,cw:chartWidth};

	//plotRatio = this.chartHeight/(this.newmax-this.newmin);
	//console.log(this.chartData);

	var cTab = new Crosstab(this.chartData);
		cTab.drawComponents();
};

Chart.prototype.height = function(type){
	if(type=="crosstab"){
		var tempObj = this.chartData.data;
		var tempArr = [], cnt=-1;
		for(var i in tempObj){
			for(var j in tempObj[i].values){
				for(var k in tempObj[i].values[j].zoneValues){
					if(!lookup(tempObj[i].values[j].zoneValues[k].product)){
			          tempArr.push(tempObj[i].values[j].zoneValues[k].product);
			        }
				}
			}
			cnt++;
		}
		function lookup(val){
		    len = tempArr.length,bool = false;
		    if(len<1){
		      bool = false;
		    }else{
		      while(len--){
		        if(tempArr[len]==val){
		          bool = true;
		          break;
		        }
		      }
		    }
		    return bool;
		  }
		return (this.barHeight + (this.barSpacing*2))*(tempArr.length + cnt);
	}//end of the crosstab Height
	else if(type=="line"){

	}
};
Chart.prototype.width =  function(type){
	if(type=="crosstab"){
		var tempObj = this.chartData.coltable;
		return tempObj.length*this.cwidth;
	}//end of cross tab width
	else if(type=="line"){
		
	}
};
Chart.prototype.drawchart = function(){
	    var order = this.divOrder();
		var temp,i,axisObj={};
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

		var axisInstance = new Axis(axisObj,this.chartDiv,this.chartType,this.numOfGraphs,this.numOfGraphsInaRow,order);
		axisInstance.draw();
};
Chart.prototype.countzeros = function(val){
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
Chart.prototype.addLeadingzeros = function(val,cnt){
    if(typeof val!="string"){val=val.toString();}
        while (val.length <= cnt){
            val = "0" + val;
        }
        return val;
    };
Chart.prototype.removeNeg = function(val){
        val = val.toString();
            if (val.substring(0, 1) == '-') {
            val = Number(val.substring(1));        
        }//now max does not contains "-"
        return val;
    };
Chart.prototype.genUp = function(val){
          var len = val.length,temp;
          if (len > 3) {
            temp = (Number(val[len - 3]) + 1) * 100;
            temp = Number(val.substr(0, (len - 3))) * 1000 + temp;
          } else {
            temp = (Number(val[0]) + 1) * Math.pow(10, (len - 1));
          }
          return temp;
    };
Chart.prototype.genDown = function(val){
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
Chart.prototype.beautify = function(max,min){
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
};

