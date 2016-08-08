function Yaxis(chartDetails,chartObj){
	this.chartData =chartDetails;
	this.type = typeof this.chartData.chartinfo === "undefined" ? "other" : this.chartData.chartinfo.chartType;//(typeof this.chartData.svg === "undefined") ? "default":this.chartData.svg.ct;
	this.chartHeight = chartDetails[0];
	this.chartWidth = chartDetails[1];
	this.marginxy = chartDetails[2];
	this.yaxisData = (typeof chartObj === "undefined")?"0":chartObj.data;
	this.newmax = (typeof chartObj === "undefined")?"0":chartObj.newmax;
	this.newmin = (typeof chartObj === "undefined")?"0":chartObj.newmin;
	this.yaxisticks = this.calculateTicksNum(this.newmax,this.newmin);
	this.divisiony = this.chartHeight / this.yaxisticks;
	
}
Yaxis.prototype.draw = function(mainsvg){
	if(this.type=="crosstab"){
		this.mainsvg = mainsvg;
		this.lossColorMax = this.chartData.chartinfo.lossColorMax;
		this.profitColorMax = this.chartData.chartinfo.profitColorMax;
		this.lossColorMin = this.chartData.chartinfo.lossColorMin;
		this.profitColorMin = this.chartData.chartinfo.profitColorMin;
		this.crosstab();		
	}else{
		var paintY = new CanvasX();
		for(var i=0;i<=this.yaxisticks;i++){
		this.calculationY =(this.divisiony*i)+this.marginxy;
	    if(i%2!=0 && i!=this.yaxisticks){
	      paintY.createRect(mainsvg,this.marginxy-5,this.calculationY,this.divisiony,this.chartWidth-this.marginxy+10,"svgsRect","svGrectClass");                        
	    }
        var titleY = (this.newmax - (((this.newmax-this.newmin)/this.yaxisticks)*i));
        	titleY =  this.sortedTitle(titleY);
        	
        paintY.createText(mainsvg,(this.marginxy-15),(this.calculationY+5),titleY,"#145255",11,'end',"yaxistitle");
        paintY.createLines(mainsvg,(this.marginxy-10),(this.calculationY),(this.marginxy-5),(this.calculationY),"yaxisticks","yaxisticks");                       
    }//end of the for loop
	}
};
 
Yaxis.prototype.crosstab = function(){
	var canvas = new Canvas();
	var colTable = this.chartData.coltable;
	var data = this.chartData;
	var product_type = this.chartData.product_type
	var px,py,counter=0;
	var distance = this.chartData.svg.cw;
	var halfDistance = distance/2;
	var width = this.chartData.svg.sw;
	var product,pCnt = 0;
	var sos,popol,rectColor;
	var zonePos,max,bw,temp;
	this.plotRatio;

	for(var i in this.chartData.coltable){
		var tempx = (Number(i)+1)*this.chartData.svg.cw;
		var tempx2 = (Number(i))*this.chartData.svg.cw;
		
		canvas.createText(mainSvg,tempx2+halfDistance,25,this.chartData.coltable[i],"#000","17","middle","topCaption");
		if(i!="0"){
			canvas.createLines(mainSvg,tempx,10,tempx,40,"vtopLine","vtopLine");
		}
		
	}

	for(var j=0; j<data.data.length; j++){
		px = halfDistance;
		py = counter*(this.chartData.svg.bh+this.chartData.svg.bs*2)+ 60;
		counter += this.chartData.epg[j];
		canvas.createText(mainSvg,90,py,data.data[j].product_type,"#000","16","start","toptext");

		py=counter*(this.chartData.svg.bh+this.chartData.svg.bs*2)+ 40;
		canvas.createLines(mainSvg,30,py,width,py,"topLine","topLine");
	}

	for(var d = 0;d<data.product.length;d++){
		py = this.chartData.svg.bs+40+d*(this.chartData.svg.bh+this.chartData.svg.bs*2);
		px = distance+20;
		product = data.product[d];
		temp = product;
		if(product.slice(0, -1)=="Total"){
			temp = "Total";
			canvas.createText(mainSvg,px,py+15,temp,"#000","17","start","itemTotal");
		}else{
			canvas.createText(mainSvg,px,py+15,temp,"#000","17","start","productNames");
		}
		
		for(var i in data.data){
			 
			for(var j=0;j<data.data[i].values.length;j++){
				//px and zonePos
				zonePos = distance*2 + distance*j;
				max = data.maxSos[j];
				for(var k in data.data[i].values[j].zoneValues){
					
					if(product == data.data[i].values[j].zoneValues[k].product){//now plot
						//sos,sop,px,zonePos lossColor
						sos = data.data[i].values[j].zoneValues[k].sos;
						sop = data.data[i].values[j].zoneValues[k].sop;
						
						ratioColor = (Math.abs(sop)/sos);

						if(sop<0){//loss
							rectColor = this.genColor(this.lossColorMax,this.lossColorMin,ratioColor);
						}else{
							rectColor = this.genColor(this.profitColorMax,this.profitColorMin,ratioColor);
						}

						if(data.data[i].values[j].zoneValues[k].product == "Total"){
							console.log(max,data.data[i].values[j].zoneValues[k].sos,this.plot(max,data.data[i].values[j].zoneValues[k].sos))
						}
						if(sos!=0){
							bw = this.plot(max,sos);
							temp = canvas.createRect(mainSvg,zonePos,py,this.chartData.svg.bh,bw,"bars","bars");
							temp.setAttribute("fill", "#"+rectColor+"");
						}
					}
				}
			}
		}
	}

};
Yaxis.prototype.plot = function(max,sos){
	this.plotRatio = (this.chartData.svg.cw-60)/(max);
	return this.plotRatio*sos;
};
Yaxis.prototype.genColor = function(clr1,clr2,rto){

		var color1 = clr1.substring(1,clr1.length);
		var color2 = clr2.substring(1,clr2.length);

	var ratio = rto;

	var hex = function(x) {
	    x = x.toString(16);
	    return (x.length == 1) ? '0' + x : x;
	};

	var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
	var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
	var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

	var middle = hex(r) + hex(g) + hex(b);
	return middle;
}
Yaxis.prototype.calculateTicksNum = function(ub,lb){
	var yaxisticks;
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
Yaxis.prototype.sortedTitle = function(titleY){
	
    if(titleY % 1 != 0){
        titleY = titleY.toFixed(2);
    }
    var titleY_0 = titleY.toString().split(".")[0];
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
    return titleY;
};
