//difining yaxis
function Yaxis(chartDetails,chartObj){
	this.chartHeight = chartDetails[0];
	this.chartWidth = chartDetails[1];
	this.marginxy = chartDetails[2];
	this.yaxisData = chartObj.data;
	this.newmax = chartObj.newmax;
	this.newmin = chartObj.newmin;
	this.yaxisticks = this.calculateTicksNum(this.newmax,this.newmin);
	this.divisiony = this.chartHeight / this.yaxisticks;
	
};
Yaxis.prototype.draw = function(svgGraph){
	//console.log(this.divisiony);
	var paintY = new Canvas();
	for(var i=0;i<=this.yaxisticks;i++){
		this.calculationY =(this.divisiony*i)+this.marginxy;
	    if(i%2!=0 && i!=this.yaxisticks){
	      paintY.createRect(svgGraph,this.marginxy-5,this.calculationY,this.divisiony,this.chartWidth-this.marginxy+10,"svgsRect","svGrectClass");                        
	    }
        var titleY = (this.newmax - (((this.newmax-this.newmin)/this.yaxisticks)*i));
        	titleY =  this.sortedTitle(titleY);
        paintY.createText(svgGraph,(this.marginxy-15),(this.calculationY+5),titleY,"#145255",11,'end',"yaxistitle");
        paintY.createLines(svgGraph,(this.marginxy-10),(this.calculationY),(this.marginxy-5),(this.calculationY),"yaxisticks","yaxisticks");                       
    }//end of the for loop
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
