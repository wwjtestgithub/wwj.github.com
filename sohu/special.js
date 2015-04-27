/*! sjs - v0.1.0 - 2015-04-14
* http://github.adrd.sohuno.com/?p=js/sjs.git
* Copyright (c) 2015 ; Licensed MIT */
define("sjs/matrix/ad/special",["sjs/plugin/mediator","sjs/matrix/ad/stat","sjs/data/guid","sjs/matrix/ad/form/common","sjs/matrix/ad/data","sjs/matrix/ad/config"],function(a,b,c,d,e,f){var g=jQuery,h=f._db,i={init:function(){this.ad_list={},this.as_list={},this.order_groups=[],this.ad_groups=[],this.ins_list={},this.ad_forms={},this.mediator=new a,this.report()},ones:function(a){if(a&&a.length){var b=this.gather(a);this.load(b)}},gather:function(a){var b=this.ad_groups.length;this.ad_groups[b]=[];for(var c=0,d=a.length;d>c;c++){var e=new j(a[c]);if(e&&-1!==e.status){e.data_id=c,e.group_id=b;var f=e.order||0;this.ad_groups[b][f]||(this.ad_groups[b][f]=[],this.ad_groups[b][f].status=0),this.ad_groups[b][f].push(e),this.ad_list[e.id]=e}}return b},order:function(a){this.ad_groups[a].sort(function(a,b){return"order"in a&&"order"in b?a.order>b.order?1:a.order==b.order?0:-1:1})},load:function(a){var b=this.ad_groups[a];if(b&&b.length)for(var c=0;c<b.length;c++)if(b[c]&&b[c].length&&1!==b[c].status){for(var d=0;d<b[c].length;d++){var e=b[c][d];0===e.status&&(e.status=1,e.load())}b[c].status=1;break}},cache_param:function(a){var b=Object.prototype.toString.call(a);if("[object Object]"===b){if(a.itemspaceid){var c={};c[a.itemspaceid]=a,a=c}for(pro in a){var d=a[pro].group_id||0,e=this.order_groups[d]||[];e.request||(e.request={}),g.extend(e.request,a),this.order_groups[d]=e}}else if("[object Array]"===b)for(var f=0,h=a.length;h>f;f++){var d=a[f].group_id||0,e=this.order_groups[d]||[];e.push(a[f]),this.order_groups[d]=e}},load_cache:function(){var a,b,c=this.order_groups,d=this,f=this.order_groups.length;for(a=0;f>a;a++){var b=c[a]||[];b.request?e.get(b.request,function(a){b=b.concat(a),d.ones(b)}):this.ones(b)}},create:function(a){return d.create(a)},bind:function(){return this.mediator.subscribe.apply(this.mediator,arguments)},fire:function(){return this.mediator.publish.apply(this.mediator,arguments)},unbind:function(){return this.mediator.remove.apply(this.mediator,arguments)},once:function(){return this.mediator.once.apply(this.mediator,arguments)},report:function(){var a={cont_id:"beans_13146",adtype:6};h.TAG&&(a.ext="|c-tag:"+h.TAG+"|"),b.get("pv",a)}},j=function(a){g.extend(this,{pgid:h.PAGEVIEWID,instance:{},name:""},a);var b=this;b.itemspaceid&&b.form||(b.status=-1),b.resource||(g.extend(b,b.defbean),b.resource||(b.status=-1)),this.id=this.adid+"_"+this.itemspaceid,this.cont_id=h.POSITION_ID_PREFIX+this.itemspaceid,!this.latency&&this.start_time&&this.end_time&&(this.latency=this.end_time-this.start_time),this.special&&this.special.dict&&(this.spec=g.extend({},this.special.dict,this.spec)),this.name||(this.name=this.id),this.init_event()};return j.prototype={once:function(a,b){return i.once(a+":"+this.name,b)},bind:function(a,b){return i.bind(a+":"+this.name,b)},unbind:function(a){return i.unbind(a+":"+this.name)},trigger:function(a){return i.fire(a+":"+this.name)},init_event:function(){var a=this;this.once("allownext",function(){var b=a.order||0,c=i.ad_groups[a.group_id][b];a.allowed_load_next=!0;for(var d=0,e=c.length;e>d;d++){var f=c[d];if(!f.allowed_load_next)break;d===c.length-1&&i.load(a.group_id)}}),"function"==typeof this.beforeload&&this.bind("beforeload",this.beforeload),"function"==typeof this.afterload&&this.bind("afterload",this.afterload),this.bind("afterload",function(){a.status=2;var c=a.container;if(c&&c.length&&(a.x=parseInt(c.offset().left),a.y=parseInt(c.offset().top)),!this.no_vc){b.get("pv",a);var d=a.imp||a.resource.imp;if(d)for(var e=d.split("|"),f=0;f<e.length;f++)b.get(e[f])}}),this.last_time&&this.bind("afterinit",function(){window.setTimeout(function(){if(a.instance&&"detach"in a.instance)try{a.instance.hide()}catch(b){}},a.last_time)})},load:function(){var a=this,b=this.form;if(b){var c=null,d=null,e=new Date;this.online_time&&(c=new Date(this.online_time)),this.offline_time&&(d=new Date(this.offline_time)),(!c||e>=c)&&(!d||d>e)&&(a.status=1,a.trigger("beforeload"),-1===b.indexOf("-")?require(["sjs/matrix/ad/form/"+b],function(b){a.instance=new b(a),i.ins_list[a.itemspaceid]=a.instance,a.instance.init(),a.trigger("afterinit")}):a.load_forms())}},load_forms:function(){for(var a=this,b=(this.form,this.form.split("-")),c=[],d=this.spec,e=[],f=0,h=b.length;h>f;f++){c.push("sjs/matrix/ad/form/"+b[f]);var i={};for(var j in d)if(0==j.indexOf(b[f]+"-")){var k=j.replace(b[f]+"-",""),l=d[j];i[k]=l}e.push(i)}require(c,function(){for(var c=0,d=arguments.length;d>c;c++){var f=arguments[c],h=e[c],i=g.extend({},a,{cont_id:a.cont_id+"_"+c,spec:h}),j=new f(i);a.instance[b[c]]=j,j.init()}a.trigger("afterinit")})}},i.init(),{ones:function(a){var b=Object.prototype.toString.call(a);"[object Array]"===b?i.ones(a):"[object Object]"===b&&e.get(a,function(a){i.ones(a)})},get_ad:function(a){return i.ad_list[a]},wait:function(a){return i.cache_param(a)},start:function(){return i.load_cache()},create:function(a){return i.create(a)},bind:function(a,b){return i.bind(a,b)},unbind:function(a){return i.unbind(a)},trigger:function(a){return i.fire(a)}}});