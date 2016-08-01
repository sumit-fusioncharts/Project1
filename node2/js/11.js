function CreateCation(cation,subCaption,divId){
	this.cation = caption;
	this.subCaption = subCaption;
	this.divId = divId;
}
CreateCation.prototype.draw = function(){
	var svgCaption = new Canvas();
	var captionSvg = svgCaption.createSvg('100%','50px',"svgCaption","svgCaptionClass",this.divId);
	    svgCaption.createText(captionSvg,'50%',20,this.caption,"#000",22,"middle","BigCaptionText");
   		svgCaption.createText(captionSvg,'50%',40,this.subCaption,"#717171",16,"middle","CaptionText");
}