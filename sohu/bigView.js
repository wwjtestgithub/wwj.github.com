/**
 * @desp 炫景 
 */
define("sjs/matrix/ad/form/bigView", 
	["sjs/matrix/ad/form/common","sjs/data/cookie","sjs/plugin/underscore"],
	function (Common) {
	
	var $ = jQuery;
	var is_wide_screen = ($(window).width() >= 1024);
	var tag = true;
	
	//炫景类型1-狐首炫景
	var typeone = [
		"http://www.sohu.com","http://www.sohu.com/","http://fashion.sohu.com/","http://fashion.sohu.com",
		"http://dev.wiztear.com/chenghaolan/www/ad/vichyf/index1.html","http://dev.wiztear.com/chenghaolan/www/ad/luyansohu/index.html",
		"http://dev.wiztear.com/chenghaolan/www/ad/zhouxuechaogaodibian/index.html","http://go.sohu.com/2014/h5/index1.html","http://auto.sohu.com","http://auto.sohu.com/",
		"http://dev.wiztear.com/chenghaolan/www/ad/auto_xj_20141118/index3.html"
	]; 
	
	
	var BigView = Common.create({

		options : {
			top : 30,
			width: 1420,
			height: 570,
			bannerHeight: 45,
			container: 'body',
			contentWidth: 950,
			onBeforeRender: function(){},
			onAfterRender: function(){},
			onReplayFull:function(){},
			isReplay: false,
			isColseBtn:false,
			replayBtn: 'http://images.sohu.com/bill/s2012/gates/all/replay_h.png',  	//重播按钮背景
			closeBtn: 'http://images.sohu.com/bill/s2012/gates/all/close_h.png', 	//关闭按钮背景
			flashvarsObj: {
				clickthru: ''
			},
			close_timer:null,
			isnot_flashcover: true
		},

		init : function(){
			var self = this;
			var adObject = self.adObject;
			var opt = $.extend(self.options, adObject.special);
			if(!!adObject.spec){
				opt = $.extend(opt,adObject.spec);
			}
			if(!self.checkData(adObject)){
				adObject.trigger('afterload');
				adObject.trigger("allownext");
				return;
			};
			opt.onBeforeRender.call(this);
			if("image"==adObject.resource.type){
				var container = this.container = $('<div/>').attr('id', adObject.cont_id).css({
					'margin': 'auto',
					'position': 'relative',
					'width': '100%',
					'height': adObject.resource.height,
					'top': 0,
					'zIndex': -1,
					'background': 'url(' + adObject.resource.file + ') 50% 50% no-repeat',
					'overflow-x':'auto'
				}).insertAfter('#fullscreenad');
				container.attr("class","bigView");
			}else{
				var container = this.container = $('<div/>').attr('id', adObject.cont_id).css({
					'margin': 'auto',
					'position': 'relative',
					'width': '100%',
					'height': adObject.resource.height,
					'top': 0,
					'zIndex': -1,
					'overflow-x':'auto'
				}).insertAfter('#fullscreenad');
				container.attr("class","bigView");
				opt.flashvarsObj.clickthru =  this.adObject.resource.click;
				this.adObject.resource.cont_id = this.adObject.cont_id;
				this.adObject.isnot_flashcover = opt.isnot_flashcover;
				this.adObject.resource.flashvarsObj = opt.flashvarsObj;
				this.insert();
			}
			this.checkOverFlow(container);
			//获取当前页面地址
			var chanelUrl = document.location.href;
			if (this.checkType()) {
				var pos = this.pos =  $('<div/>').attr('id', 'mardiv').css({
					margin: '-' + (opt.height * 3 + 5) + 'px auto 0px'
				}).insertAfter('#' + adObject.cont_id);
			}else{
				var pos = this.pos =  $('<div/>').attr('id', 'mardiv').css({
					margin: '-' + (opt.height -45) + 'px auto 0px'
				}).insertAfter('#' + adObject.cont_id);
			}
			//获取视窗
			var _M = (document.compatMode == "CSS1Compat") ? document.documentElement : document.body;
			
			var left = this.left = $('<div/>').attr('id', adObject.cont_id+'_left').attr("class","bigView_left").css({
				'position': 'relative',
				'cursor': 'pointer',
				'top': -opt.height,
				'left': (_M.clientWidth - opt.contentWidth) / 2 - (opt.width - opt.contentWidth)/2,
				'width': (opt.width - opt.contentWidth)/2,
				'height': adObject.resource.height
			}).insertAfter('#' + adObject.cont_id);
			var right = this.right = $('<div/>').attr('id', adObject.cont_id+'_right').attr("class","bigView_right").css({
				'position': 'relative',
				'cursor': 'pointer',
				'top': -(opt.height*2),
				'left': (_M.clientWidth - opt.contentWidth) / 2 + opt.contentWidth,
				'width': (opt.width - opt.contentWidth)/2,
				'height': adObject.resource.height
			}).insertAfter('#' + adObject.cont_id+'_left');
			var banner = this.banner = $('<div/>').attr('id', adObject.cont_id+'_banner').attr("class","bigView_banner").css({
				'position': 'relative',
				'cursor': 'pointer',
				'top': -(opt.height * 3),
				'left': (_M.clientWidth - opt.contentWidth)/2,
				'width': opt.contentWidth,
				'height': opt.bannerHeight
			}).insertAfter('#' + adObject.cont_id+'_right');
			var right_left = ((_M.clientWidth - opt.contentWidth)/2 + opt.contentWidth)+"px";
			var left_left = ((_M.clientWidth - opt.contentWidth)/2 - 235)+"px";
			var banner_left = ((_M.clientWidth - opt.contentWidth)/2)+"px";
			document.getElementById(adObject.cont_id+"_right").style.left =right_left;
			//document.getElementById(adObject.cont_id+"_left").style.left = left_left;
			document.getElementById(adObject.cont_id+"_banner").style.left = banner_left;
			if(opt.isReplay){
				var replay_btn = this.replay_btn = $('<div/>').attr('id', adObject.cont_id+'_banner_replay').css({
					'position': 'absolute',
					'top': opt.bannerHeight - 32,
					'left': opt.contentWidth - 39,
					'width': 39,
					'height': 16,
					'cursor': 'pointer',
					'backgroundImage': 'url(' + opt.replayBtn + ')'
				}).appendTo(banner);
			}
			var close_btn = this.close_btn = $('<div/>').attr('id', adObject.cont_id+'_banner_close').css({
				'position': 'absolute',
				'top': opt.bannerHeight - 16,
				'left': opt.contentWidth - 39,
				'width': 39,
				'height': 16,
				'cursor': 'pointer'
			});
			if(opt.isCloseBtn){//判断关闭按钮配置
				close_btn.css('backgroundImage','url(' + opt.closeBtn + ')');
			}
			close_btn.appendTo(banner);
			
			// this.insert();
			opt.onAfterRender.call(this);
			
			//初始化事件
			this.attach();
			
			//触发广告结束事件
			adObject.trigger("afterload");
			adObject.trigger("allownext");
		},
		
		attach : function(){
			var adObject = this.adObject;
			var opt = $.extend(this.options, adObject.special);
			var self = this;
			
			this.close_btn.bind('click', function(){
				$('#'+adObject.cont_id+'_left, #'+adObject.cont_id+'_right, #'+adObject.cont_id+', #'+adObject.cont_id).hide();
				$('#mardiv').css({margin: '-' + opt.bannerHeight + 'px auto 0px'});
				tag = false;
			});
			if(opt.isReplay){
				this.replay_btn.bind('click', function(e){
					e.stopPropagation();
					var chanelUrl = document.location.href;
					if(tag){
						tag = true;
						var full = jQuery(".full");
						if(!!full[0]){
							// full.show();
							if (this.checkType()) {
								full.css({"z-index":10000});
							}else{
								full.css({"display":"block"});
							}
							opt.onReplayFull.call(this);
							clearTimeout(opt.close_timer);
							opt.close_timer=setTimeout(function(){
								if (this.checkType()) {
									full.css({"z-index":-11});
								}else{
									full.css({"display":"none"});
								}
								//tag = true;
							},8000);
						}
					}
					
				});
			}
			window.onresize = function(){
				var _M = (document.compatMode == "CSS1Compat") ? document.documentElement : document.body;
				var right_left = ((_M.clientWidth - opt.contentWidth)/2 + opt.contentWidth)+"px";
				var left_left = ((_M.clientWidth - opt.contentWidth)/2 - 235)+"px";
				var banner_left = ((_M.clientWidth - opt.contentWidth)/2)+"px";
				document.getElementById(adObject.cont_id+"_right").style.left =right_left;
				document.getElementById(adObject.cont_id+"_left").style.left = left_left;
				document.getElementById(adObject.cont_id+"_banner").style.left = banner_left;
			};
			this.openUrl();
		},
		openUrl: function(){
			var adObject = this.adObject;
			$('#'+adObject.cont_id+'_left, #'+adObject.cont_id+'_right, #'+adObject.cont_id+'_banner').bind('click', function(){
				if(tag){
					window.open(adObject.resource.click);
				}
			});
			// $('#'+adObject.cont_id+'_left, #'+adObject.cont_id+'_right, #'+adObject.cont_id+'_banner').attr('onclick','').click(eval(function(){
				// window.open(adObject.resource.click);
			// }));
		},
		checkData:function(adObject){
			if(!adObject.resource){
				return false;
			}
			return true;
		},
		checkOverFlow:function(el){
			// if(!!el[0]){
				// el.parent().css("overflow-x","hidden");
			// }
			$("html").css("overflow-x","hidden");
		},
		checkType:function(){//监测当前url
			//目前有两种 一种为狐首的一种为其他频道或专题页的 狐首的返回true 其他的返回false
			var curUrl = document.location.href;
			var urlPatten = /sohu|typeone|/;
			var matchResult = curUrl.match(urlPatten);
			return !!matchResult;
		}
	});
	
	return BigView;
});

