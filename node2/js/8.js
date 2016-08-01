//defining the body of the chart
function ChartBody(chartType,customYobj,info,xaxisticks,i){
	this.chartType = chartType;
	this.customYobj = customYobj;
	this.chartHeight = info[0];
	this.chartWidth = info[1];
	this.marginxy = info[2];
	this.xaxisticks = xaxisticks;
	this.currentGraph = i;
	
	this.dataArray = this.customYobj.data;
	this.index = this.customYobj.index;
};
ChartBody.prototype.plotData = function(){
	this.newmax = this.customYobj.newmax;
	this.newmin = this.customYobj.newmin;
	this.datasetStr="",this.dataValues = "";
	var dataArrayLen = this.dataArray.length,y,xcord,ycord,barHight;
	this.plotRatio = this.chartHeight/(this.newmax-this.newmin);
	//console.log(" xx "+this.max,this.min,this.plotRatio,this.dataArray);
	//this.createRect(url,svgGraph,this.marginxy-5,this.marginxy-5,this.chartHeight+10,this.chartWidth-this.marginxy+10,"axisRect","axisRectClass");
	for(var i=0;i<dataArrayLen;i++){            
	    if(typeof this.dataArray[i]!="undefined" && this.dataArray[i]!=""){
	        y = Number(this.dataArray[i]);
	        if(this.chartType=="column"){
	        	this.divisionX = (this.chartWidth) / (this.xaxisticks);
	        }else{
	        	this.divisionX = (this.chartWidth) / (this.xaxisticks-1);
	        }
	        xcord= (this.divisionX*i)+this.marginxy;
	        barHight = ((y-this.newmin)*this.plotRatio); 
            ycord = (this.chartHeight - barHight + this.marginxy);
            if(this.chartType=="column"){            	
            	if(barHight<1){barHight=1;ycord=ycord-1;}
            	this.datasetStr += (xcord+5)+","+ycord+","+(barHight+5)+","+y+","+this.currentGraph+" ";            	
            }else{
            	this.datasetStr += xcord+","+ycord+" ";
            	this.dataValues += this.currentGraph+","+y+" ";
            }
	    }
    }//successfully displaying Data String for plotting

};
ChartBody.prototype.draw = function(svgGraph){
	var _dataObj = this.plotData(),_cc,_lc;
	var ofsetx=svgGraph.getBoundingClientRect().left,
        ofsety=svgGraph.getBoundingClientRect().top;

	
	if(this.chartType=="column"){
		_cc = new ColumnChart(svgGraph,this.datasetStr,ofsetx,ofsety,this.divisionX,this.chartWidth);
		_cc.draw();
	}else{
		_lc = new LineChart(svgGraph,this.datasetStr,this.dataValues,ofsetx,ofsety);
		_lc.draw();
	}
};
