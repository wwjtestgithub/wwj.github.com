/*! sjs - v0.1.0 - 2015-04-27
* http://github.adrd.sohuno.com/?p=js/sjs.git
* Copyright (c) 2015 ; Licensed MIT */
define("sjs/matrix/ad/multfusion",["sjs/plugin/fingerprint2"],function(){var a={addCookie:function(a,b,c){var d=a+"="+encodeURI(b);if(c>0){var e=new Date;e.setTime(e.getTime()+3600*c*1e3),d=d+"; expires="+e.toGMTString()+"; path=/ ; domain=sohu.com"}document.cookie=d},getCookie:function(a){for(var b=document.cookie,c=b.split("; "),d=0;d<c.length;d++){var e=c[d].split("=");if(e[0]==a)return e[1]}return""},ajax:function(a){if(!a.url)throw new Error("参数不合法");var b=("jsonp_"+Math.random()).replace(".",""),c=document.getElementsByTagName("head")[0],d=document.createElement("script");c.appendChild(d),window[b]=function(e){c.removeChild(d),clearTimeout(d.timer),window[b]=null,a.success&&a.success(e)},d.src=a.url+(-1===a.url.indexOf("?")?"?":"&")+"callback="+b,a.timeout&&(d.timer=setTimeout(function(){window[b]=null,c.removeChild(d),a.fail&&a.fail({message:"too long time"})},a.timeout))}},b={init:function(){var b=this,c=Math.ceil(1e3*Math.random());if(1===c){this.check();var d=a.getCookie("beans_freq");d||this.getFinger(function(a){b.connect(a)})}},connect:function(b){var c,d=a.getCookie("SUV"),e=a.getCookie("YYID"),f=a.getCookie("TUV"),g=a.getCookie("FUID"),h=document.location.href;c=encodeURIComponent(d+"|"+f+"|"+g+"|"+h+"|"+b+"|"+e),a.addCookie("beans_freq","1",.5),a.ajax({url:"http://hui.sohu.com/mum/ipqueryjp",timeout:3e3,dataType:"jsonp",success:function(b){for(var d=b.urls||[],e=0;e<d.length;e++){var f=d[e]+(-1===d[e].indexOf("?")?"?":"&")+"cookie="+c;a.ajax({url:f,timeout:3e3,dataType:"jsonp"})}}})},getFinger:function(a){if(Fingerprint2){var b=new Fingerprint2;b.get(a)}else a("error")},check:function(){var a=new Image;a.src="http://hui.sohu.com/mum/jsurl?_="+(new Date).getTime()}};return b});