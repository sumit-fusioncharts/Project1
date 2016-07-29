
//parsing data
function DataParsing(dataObj){
	this.dataObj = dataObj;
}
DataParsing.prototype.xAxisNames = function(separator){
	return (this.dataObj.timestamp.time).split(separator);
};
DataParsing.prototype.separator = function(){
	return (this.dataObj.chartinfo.dataseparator === "") ? "|" : this.dataObj.chartinfo.dataseparator;
};
DataParsing.prototype.getData = function(chartNo,separator){
	return (this.dataObj.dataset[chartNo].data).split(separator);
};
DataParsing.prototype.dataSet = function(){
	return this.dataObj.dataset;
};
DataParsing.prototype.chartDiv = function(){
	return document.getElementById(this.dataObj.chartinfo.divId);
};
DataParsing.prototype.numOfGraphsInaRow = function(svgWidth){
	return Number(((window.innerWidth/svgWidth).toString()).split(".")[0]);
};
DataParsing.prototype.chartArrengement = function(){
	return this.dataObj.chartinfo.chartsPositioning;
};
DataParsing.prototype.svgWidth = function(){
	return (this.dataObj.chartinfo.width === '') ? "400" : this.dataObj.chartinfo.width;
};
DataParsing.prototype.svgheight = function(){
	return (this.dataObj.chartinfo.height === '') ? "400" : this.dataObj.chartinfo.height;
};
DataParsing.prototype.numOfGraphs = function(){
	return this.dataObj.dataset.length;
};
DataParsing.prototype.chartType = function(){
	return this.dataObj.chartinfo.chartType;
};
DataParsing.prototype.caption = function(){
  return this.dataObj.chartinfo.caption;
};
DataParsing.prototype.subCaption = function(){
  return this.dataObj.chartinfo.subCaption;
};
DataParsing.prototype.maxmin = function(data) {
    var max,min,j,temp;
      min = Number(data[0]);
      max=min;
      j = data.length;
      while(j>=0){
         temp = Number(data[j]);
         if(temp>max && typeof temp!="undefined" && temp!=""){max=temp;}
         if(temp<min && typeof temp!="undefined" && temp!=""){min=temp;} 
         j--;
      }
      return [max,min]; 
};
DataParsing.prototype.customize = function(){
  var dataContainer = {};
  var temp,max,min,avg,title,dataArray,separator = this.separator();
  this.dataset = this.dataObj.dataset;
  for(var i in this.dataset){
    dataArray = (this.dataset[i].data).split(separator);
    temp = this.maxmin(dataArray);
    max = temp[0];
    min = temp[1];
    title = (this.dataset[i].title);
    temp = dataArray.map(function(num) {
      if(num==""){return 0;}
      else return Number(num);
    });
    temp = temp.sort(this.max2min);
    avg = temp.reduce(this.sum, 0)/temp.length;
    dataContainer[i] = {index:Number(i),data:dataArray,max:max,min:min,avg:avg,title:title}; 
  }
  return dataContainer;
};
DataParsing.prototype.max2min = function(a,b){
  return b-a;
};
DataParsing.prototype.min2max = function(a,b){
  return a-b;
};
DataParsing.prototype.sum = function(a,b){
  return a+b;
};