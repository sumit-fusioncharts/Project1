
//parsing data
function DataParsing(dataObj){
	this.dataObj = dataObj;

this.xAxisNames = function(separator){
	return (this.dataObj.timestamp.time).split(separator);
};
this.separator = function(){
	return (this.dataObj.chartinfo.dataseparator === "") ? "|" : this.dataObj.chartinfo.dataseparator;
};
this.getData = function(chartNo,separator){
	return (this.dataObj.dataset[chartNo].data).split(separator);
};
this.dataSet = function(){
	return this.dataObj.dataset;
};
this.chartDiv = function(){
	return document.getElementById(this.dataObj.chartinfo.divId);
};
this.numOfGraphsInaRow = function(svgWidth){
	return Number(((window.innerWidth/svgWidth).toString()).split(".")[0]);
};
this.chartArrengement = function(){
	return this.dataObj.chartinfo.chartsPositioning;
};
this.svgWidth = function(){
	return (this.dataObj.chartinfo.width === '') ? "400" : this.dataObj.chartinfo.width;
};
this.svgheight = function(){
	return (this.dataObj.chartinfo.height === '') ? "400" : this.dataObj.chartinfo.height;
};
this.numOfGraphs = function(){
	return this.dataObj.dataset.length;
};
this.chartType = function(){
	return this.dataObj.chartinfo.chartType;
};
this.caption = function(){
  return this.dataObj.chartinfo.caption;
};
this.subCaption = function(){
  return this.dataObj.chartinfo.subCaption;
};
this.maxmin = function(data) {
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
this.customize = function(){
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
this.max2min = function(a,b){
  return b-a;
};
this.min2max = function(a,b){
  return a-b;
};
this.sum = function(a,b){
  return a+b;
};
};