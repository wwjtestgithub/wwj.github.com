/**
 * 图混轮换
 * author:lanchenghao
 * email:chenghaolan@sohu-inc.com
 * 页面调取传入参数示例：
 */
define("sjs/matrix/ad/form/picmixed", ["sjs/matrix/ad/form/common", "sjs/data/cookie", "sjs/data/json", "sjs/matrix/ad/special","sjs/flash/swfobject","sjs/plugin/underscore"], function(Common, cookie, JSON, special,swfobject) {
	var $ = jQuery;
	var current = 0,next = 0, prev = 0, number = 0,loaded, active, clicked, position, direction;startSlide=1;
	var Picmixed = Common.create({
		options : {
			width : 160,//默认素材宽高 todo 根据频道替换
			height:140,
			zIndex : 1,
			timeout : 8000,
			timelimit:3,
			picture:{},
			txt:{}
		},
		init : function() {
			var self = this;
			var adobj = this.adObject;
			self.checkDefbeans(adobj);
			var opt = $.extend(this.options, adobj.special);
			
			//构造主体 initStructure
			self.initStructure(adobj,opt);
			//初始事件 initEvent
			// self.initEvent();
			
			//触发加载后事件
			adobj.trigger("afterload"); 
		},
		initStructure:function(adobj,opt){
			var self = this;
			
			//构造主体
			var isContainerLive =!!jQuery("#"+adobj.cont_id)[0];
			var $container =jQuery("#"+adobj.cont_id);//最外层包裹容器
			var $slides = jQuery(".slides");
			var $slides_container =jQuery(".slides_container");//素材容器
			var $slides_control =jQuery(".slides_control");//素材控制层
			
			var normalWidth = opt.picture.width;
			var normalHeight = opt.picture.height;
			
			if(!isContainerLive){
				$container = jQuery("<div id="+adobj.cont_id+">");
				$slides = jQuery("<div class='slides'>");//上层容器
				$slides_container =jQuery("<div class='slides_container'>");//素材容器
				$slides_control =jQuery("<div class='slides_control'>");//素材控制层
				$container.css({
					'width':normalWidth,
					'height':normalHeight,
					'overflow':"hidden",
					'position':"relative"
				});
				$slides.css({
					'position':"absolute"
				});
				$slides_container.css({
					'width':normalWidth,
					'height':normalHeight,
					'overflow':"hidden",
					'position':"relative"
				});
				$slides_control.css({
					'position':"relative",
					'width':normalWidth,
					'height':normalHeight
					// 'left': -normalWidth+"px"
				});
				
				$slides_control.appendTo($slides_container);
				$slides_container.appendTo($slides);
				$slides.appendTo($container);
				//挂载广告实体
				$(opt.id).append($container);
				var randomIdNum = self.getRandom();
				opt.targetId = "targetId"+randomIdNum;
				var $slide =$("<div class='slide'><div id="+opt.targetId+"></div></div>");//每个素材容器
				$slide.css({
					'position':"absolute",
					'top': '0px',
					// 'left': opt.width,
					'z-index': 0
				});
				$slide.appendTo($slides_control);
				self.insertSource(this, opt,$slide);
					var arrow_top = (normalHeight-25)/2;
					//构造控制箭头
					var $arrow_next = $("<a href='javascript:(0);' class='next'><img src='http://www.sohu.com/upload/images20130128/btn_right02.png' width='12' height='22' alt='next'></a>");
					$arrow_next.css({
						'position': 'absolute',
						'top': arrow_top+'px',
						'right':9+'px',
						'width': 12+'px',
						'height': 22+'px',
						'z-index': 10
					});
					var $arrow_prev = $("<a href='javascript:(0);' class='prev'><img src='http://www.sohu.com/upload/images20130128/btn_left02.png' width='12' height='22' alt='prev'></a>");
					$arrow_prev.css({
						'position': 'absolute',
						'top': arrow_top+'px',
						'left': 9+'px',
						'right':"auto",
						'width': 12+'px',
						'height': 22+'px',
						'z-index': 10
					});
					$slides.append($arrow_prev).append($arrow_next);
				}else{
					var randomIdNum = self.getRandom();
					opt.targetId = "targetId"+randomIdNum;
					var $slide =$("<div class='slide'><div id="+opt.targetId+"></div></div>");//每个素材容器
					$slide.css({
						'position':"absolute",
						'top': '0px',
						// 'left': opt.width,
						'z-index': 0
					});
					if(!!adobj.direction){
						if("right"==adobj.direction){
							$slide.appendTo($slides_control);
							$slide.css({"right":-normalWidth+"px"});
							self.insertSource(this, opt,$slide);
							$slide.animate({right:'0px'},'fast',function(){
								$slide.prev().remove();
							});
						}else{
							$slide.appendTo($slides_control);
							$slide.css({"left":-normalWidth+"px"});
							self.insertSource(this, opt,$slide);
							$slide.animate({left:'0px'},'fast',function(){
								$slide.prev().remove();
							});
						}
					}
				}
		},
		//资源插入
		insertSource:function(self,opt,$el){
			var adobj = self.adObject;
			switch(opt.picture.type){
				case "image":
					var imgObj = {
						width : opt.picture.width,
						height : opt.picture.height,
						file : opt.picture.file,
						click : opt.picture.click,
						cont_id : adobj.cont_id
					};
					var $imgEntity = $("<a href="+ imgObj.click + " target='_blank'><img src="+ imgObj.file +" border=0  width="+ imgObj.width +" height="+ imgObj.height +"/></a>");
					$el.html($imgEntity);
					$span = $("<span></span>").css({
						'position': 'absolute',
						'width': '100%',
						'left': 0,
						'bottom': 0,
						'height': 21+'px',
						'padding': '4px 0 0',
						'line-height': 18+'px',
						'line-height': 20+'px9',
						'font-weight': 'bold',
						'color': '#fff',
						'text-align': 'center'
					}).append($("<i style='position: absolute; left: 0; top: 0; height: 25px; width: 100%; background: #000; filter: alpha(opacity=60); opacity: 0.60;'></i>"))
					.append($("<a style='position: relative; z-index: 3; color: #FFF;' href="+opt.txt.click+" target='_blank'>"+opt.txt.text+"</a>")).appendTo($el);
					self.getImp(adobj.imp);
					break;
				case "flash":
					var flashObj ={
						width:opt.picture.width,
						height:opt.picture.height,
						data:opt.picture.file,
						targetId:opt.targetId,
						params:{
							"wmode" : "opaque", 
							"allowScriptAccess" : "always"
						},
						attributes:{
					 		 id: "testflashid"
						},
						flashvars:{
							clickthru:opt.picture.click
						}
					};
					swfobject.embedSWF(flashObj.data, flashObj.targetId, flashObj.width, flashObj.height, "9.0.0","expressInstall.swf", flashObj.flashvars, flashObj.params, flashObj.attributes);
					$span = $("<span></span>").css({
						'position': 'absolute',
						'width': opt.picture.width+'px',
						'left': 0,
						'bottom': 0,
						'height': 21+'px',
						'padding': '4px 0 0',
						'line-height': 18+'px',
						'line-height': 20+'px9',
						'font-weight': 'bold',
						'color': '#fff',
						'text-align': 'center'
					}).append($("<i style='position: absolute; left: 0; top: 0; height: 25px; width: "+opt.picture.width+"px; background: #000; filter: alpha(opacity=60); opacity: 0.60;'></i>"))
					.append($("<a style='position: relative; z-index: 1000; color: #FFF;' href="+opt.txt.click+" target='_blank'>"+opt.txt.text+"</a>")).appendTo($el);
					var clickA = $("<a></a>");
					clickA.attr("href",opt.picture.click);
					clickA.attr("target","_blank");
					clickA.css({
						'position':"absolute",
						'width':flashObj.width+"px",
						'height':flashObj.height+"px",
						'display':"none",
						'z-index':999,
						'background':"#000",
						'filter':"alpha(opacity=0)",
						'opacity':0
					});
					$el.prepend(clickA);
					self.getImp(adobj.imp);
					break;
			};
		},
		getImp:function(imp){
	        if (typeof imp!=="undefined" && imp != "") {
	            new Image().src = imp + '?t=' + new Date().getTime();
	        }
    	},
    	checkDefbeans:function(adobj){
    		if(adobj.special){
    			//远程获取的资源
    			this.options.picture = adobj[adobj.special.dict.picture];
    			this.options.txt = adobj[adobj.special.dict.txt];
    			this.options.id = adobj.containerId;
    		}else if(adobj.defbean&&!adobj.special){
    			//打底
    			this.options.picture = adobj.defbean.resource;
    			this.options.txt = adobj.defbean.resource1;
    			this.options.id = adobj.defbean.id;
    			adobj.imp = adobj.defbean.imp;
    		}
    	},
    	getRandom:function(){
			var num=""; 
			for(var i=0;i<6;i++) {
					num+=Math.floor(Math.random()*10); 
			}
			return num;
    	}
	});
	return Picmixed;
});
