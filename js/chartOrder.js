function ChartOrder(fun,obj){
	var chartOrd = this;
	switch(fun){
        case "maxtomin": return chartOrd.maxtomin();break;
        case "mintomax": return chartOrd.mintomax();break;
        case "avgmaxtomin": return chartOrd.avgmaxtomin();break; 
        case "avgmintomax": return chartOrd.avgmintomax();break; 
        default : return chartOrd.defaultorder();break;  
    }
}
ChartOrder.prototype.defaultorder = function(){

};
ChartOrder.prototype.maxtomin = function(){
	
};
ChartOrder.prototype.mintomax = function(){
	
};
ChartOrder.prototype.avgmaxtomin = function(){
	
};
ChartOrder.prototype.avgmintomax = function(){
	
};
