function Visualization(chartdata,mode){
  this.chartdata = chartdata; 
  var type = this.chartdata.chartinfo.chartType;
  var typeMode = typeof mode;
  var divId = document.getElementById("chart");
  if(typeMode=="undefined" && type != "crosstab"){
      return chartdata;
  }else if(typeMode=="undefined" && type == "crosstab"){
    if(typeof this.chartdata.chartinfo.lossColorMin === "undefined"){
      divId.innerHTML = "<p id='pError'>Chart Cannot be rendered</p>";
      return false;
    }
  }else if(typeMode!="undefined" && type != "crosstab"){
      if(typeof this.chartdata.chartinfo.chartsPositioning === "undefined"){
          divId.innerHTML = "<p id='pError'>Chart Cannot be rendered</p>";
          return false;
      }
  }


  this.numProductType = (typeof this.chartdata.data === "undefined") ? "0" : this.chartdata.data.length;
  this.elementsPerGroup = [];


  if(type=="crosstab"){  
    return this.createDataTable(); 
  }
  else if(type == "line" || type == "column" && typeMode!="undefined"){
    
    this.dataObj = chartdata;
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
      return (typeof this.dataObj.chartinfo.chartsPositioning === "undefined") ? "" : this.dataObj.chartinfo.chartsPositioning;
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

  }
}
Visualization.prototype.createDataTable = function(){
  // row : productType - product - sos1 - sos2 - sos3 -sos4 ...
  // col : PT - Product - zone1 - zone2 - zone3 -zone4 ...
  // lastRow : blank - black - range -range- range- range ...

  // find zones, create col table
  var coltable = ["Product type","Products"]
  coltable = this.zones(coltable);
  // find product type , according to zones add products and sos's ...
  // after each product type do sum and add to table
  var rowObj = this.createRow(coltable);
  // keep track of sums according zones and calculate max range min range set to 0
  // create last row
  var maxSos = this.totalSum(rowObj,coltable);
  // find other details like height,width
  // return as array objects
  var tempRowObj  = this.refine(rowObj);
  
  this.chartdata.data = rowObj;
  this.chartdata.coltable = this.zones(coltable);
  this.chartdata.maxSos = maxSos;
  this.chartdata.epg = this.elementsPerGroup;
  this.chartdata.product = this.generateProductArray();

  return this.chartdata; 
};
Visualization.prototype.totalSum = function(productObj,zoneArr){
  var totalsos = 0;
  var tempObj = productObj;
  var zones = zoneArr;
      zones = zones.splice(2, zones.length-1);
  var temp,tempArr = [];
  
  for(var z in zones){
    for(var i in tempObj){
      for(var j in tempObj[i].values){
        if(tempObj[i].values[j].zone == zones[z]){
          temp = tempObj[i].values[j].zoneValues;
          if(totalsos<temp[temp.length-1].sos){
            totalsos = temp[temp.length-1].sos;
          }
        }     
      }
    }
      tempArr.push(this.beautify(totalsos));
      totalsos = 0;
  }
  return tempArr;
};
Visualization.prototype.zones = function(coltable){
  var zones = coltable;
  var tempObj = this.chartdata.data;
  var tempObjlen = tempObj.length;

  for(var i in tempObj){
    for(var j in tempObj[i].values){
      if(!lookup(tempObj[i].values[j].zone)){
          coltable.push(tempObj[i].values[j].zone);
      }
    }
  }
  function lookup(val){
    len = zones.length,bool = false;
    if(len<1){
      bool = false;
    }else{
      while(len--){
        if(zones[len]==val){
          bool = true;
          break;
        }
      }
    }
    return bool;
  }
  return zones;
};
Visualization.prototype.createRow = function(coltable){
  var rowTable = [],temp,sumsos = 0,sumsop = 0;
  var tempObj = this.chartdata.data;
    for(var i in tempObj){
      for(var j in tempObj[i].values){       
        for(var k in tempObj[i].values[j].zoneValues){
          tempObj[i].values[j].zoneValues[k].sos = this.str2num(tempObj[i].values[j].zoneValues[k].sos);
          if(tempObj[i].values[j].zoneValues[k].sop[0]=="("){
            tempObj[i].values[j].zoneValues[k].sop = this.str2num(this.modifyData(tempObj[i].values[j].zoneValues[k].sop))*-1;
          }else{
            tempObj[i].values[j].zoneValues[k].sop = this.str2num(tempObj[i].values[j].zoneValues[k].sop);
          }
          sumsop += tempObj[i].values[j].zoneValues[k].sop; 
          sumsos += tempObj[i].values[j].zoneValues[k].sos;
          }
        tempObj[i].values[j].zoneValues.push({product:"Total"+i,sop:sumsop,sos:sumsos});
        sumsos = 0;
        sumsop = 0;
        }
      }
  return tempObj;
};
Visualization.prototype.refine = function(){
  var tempObj = this.chartdata.data;
  var tempArr,bool,temp,cnt;
  //var zone = [],zone = this.zones(zone);

  for(var i in tempObj){
    tempArr = [];
      for(var j in tempObj[i].values){
        for(var k in tempObj[i].values[j].zoneValues){
          if(!lookup(tempObj[i].values[j].zoneValues[k].product)){
            tempArr.push(tempObj[i].values[j].zoneValues[k].product);
          }
        }
      }
      this.elementsPerGroup.push(tempArr.length);
      for(var a in tempArr){
        for(var j in tempObj[i].values){
          bool = false;
          for(var k in tempObj[i].values[j].zoneValues){
            if(tempArr[a]==tempObj[i].values[j].zoneValues[k].product){
              bool = true;
              cnt = tempObj[i].values[j].zoneValues.length;
            }
          }
          if(bool!=true){
            tempObj[i].values[j].zoneValues.push({product:tempArr[a],sop:0,sos:0});
          }
        }
      }
    }//end of main for loop
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
};
Visualization.prototype.generateProductTypeArray = function(){
  var productTypeArray = [];
  var tempObj = this.chartdata.data;
  for(var i in tempObj){
    productTypeArray.push(tempObj[i].product_type);
  }
  return productTypeArray;
};
Visualization.prototype.generateProductArray = function(){
  var productArray = [],x,tempP = [];
  var tempObj = this.chartdata.data;
  for(var i in tempObj){
    for(var j in tempObj[i].values){
      for(var k in tempObj[i].values[j].zoneValues){
        if(tempObj[i].values[j].zoneValues[k].product.slice(0, -1)!="Total"){
          x=i;
          if(!lookup(tempObj[i].values[j].zoneValues[k].product)){
            tempP.push(tempObj[i].values[j].zoneValues[k].product);
          }
        }
      }
    }
    addToArr(tempP,productArray);
    tempP = [];
    productArray.push("Total"+x);
  }
  function addToArr(x,y){
    x.sort();
    for(var i in x){
      y.push(x[i]);
    }
  }
  function lookup(val){
    len = tempP.length,bool = false;
    if(len<1){
      bool = false;
    }else{
      while(len--){
        if(tempP[len]==val){
          bool = true;
          break;
        }
      }
    }
    return bool;
  }
  return productArray;
};
Visualization.prototype.modifyData = function(str){
  str = str.substr(0,str.length-1);
  str = str.substr(1);
  return str;
};
Visualization.prototype.str2num = function(str){
  return Number(str);
};
Visualization.prototype.beautify = function(val){
  var temp =1;
    length =Math.log(val) * Math.LOG10E + 1 | 0;
    length -= 2;
    while(length--){
     temp = temp*10;
    }
    val = Math.ceil(val / temp) * temp;
    return val;
}