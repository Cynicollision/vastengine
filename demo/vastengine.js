'use strict';var vastengine=vastengine||{};vastengine.AssetManager=function(a){this.assets=[];this.type=a;if(a!=vastengine.AssetType.IMAGE&&a!=vastengine.AssetType.AUDIO)throw'Invalid asset type "'+a+'"';};vastengine.AssetType={IMAGE:"image",AUDIO:"audio"};vastengine.AssetManager.prototype.add=function(a,b){this.assets.push({id:a,source:b,asset:void 0})};vastengine.AssetManager.prototype.getById=function(a){for(var b=0;b<this.assets.length;b++)if(this.assets[b].id===a)return this.assets[b].asset};
vastengine.AssetManager.prototype.load=function(){for(var a=0;a<this.assets.length;a++)this.type===vastengine.AssetType.IMAGE?this.assets[a].asset=new Image:this.type===vastengine.AssetType.AUDIO&&(this.assets[a].asset=new Audio(this.assets[a].source)),this.assets[a].asset.src=this.assets[a].source};var vastengine=vastengine||{},CanvasScaleMode={NONE:0,FIT:1,COVER:2};vastengine.Canvas=function(){this.buildCanvas();this.scaleY=this.scaleX=1;this.canvas.onmousedown=function(a){vastengine.Game.Input.onTouch(a)};this.canvas.onmouseup=function(a){vastengine.Game.Input.onTouchEnd(a)}};vastengine.Canvas.prototype.buildCanvas=function(){this.canvas=document.createElement("canvas");this.canvas.id="vastCanvas";this.setCanvasSize(640,512);this.context=this.canvas.getContext("2d");document.body.appendChild(this.canvas)};
vastengine.Canvas.prototype.getDrawingContext=function(){return this.context};vastengine.Canvas.prototype.setBackgroundColor=function(a){this.canvas.style.background=a};vastengine.Canvas.prototype.setBackgroundImage=function(a,b){this.canvas.style.backgroundImage="url("+a+")";b||(this.canvas.style.backgroundRepeat="no-repeat")};vastengine.Canvas.prototype.setBackgroundPosition=function(a,b){this.canvas.style.backgroundPosition=a+"px "+b+"px"};vastengine.Canvas.prototype.getCanvasWidth=function(){return this.canvas.width};
vastengine.Canvas.prototype.getCanvasHeight=function(){return this.canvas.height};vastengine.Canvas.prototype.setCanvasSize=function(a,b){this.canvas.width=a;this.canvas.height=b};vastengine.Canvas.prototype.setScaleMode=function(a){this.scaleMode=a};
vastengine.Canvas.prototype.setCanvasScale=function(a,b){a||(a=window.innerWidth/this.canvas.width);b||(b=window.innerHeight/this.canvas.height);this.scaleX=a;this.scaleY=b;var c=this.getScale();this.canvas.style.transformOrigin="0 0";this.canvas.style.transform="scale("+c+")"};vastengine.Canvas.prototype.getScale=function(){switch(this.scaleMode){case CanvasScaleMode.COVER:return Math.max(this.scaleX,this.scaleY);case CanvasScaleMode.FIT:return Math.min(this.scaleX,this.scaleY);default:return 1}};
vastengine.Canvas.prototype.getViewRelativeX=function(a){return void 0!==a.view?a.view.x:0};vastengine.Canvas.prototype.getViewRelativeY=function(a){return void 0!==a.view?a.view.y:0};
vastengine.Canvas.prototype.draw=function(a){this.context.clearRect(0,0,this.canvas.width,this.canvas.height);var b=this.getViewRelativeX(a),c=this.getViewRelativeY(a);this.setBackgroundPosition(-b,-c);a.sortEntities();a=a.getEntities();for(var d=0;d<a.length;d++){a[d].draw&&a[d].draw();var e=a[d].getImage();e&&this.context.drawImage(e,a[d].x-b,a[d].y-c)}this.setCanvasScale()};vastengine=vastengine||{};vastengine.Controller=function(){this.entities=[];this.view={x:0,y:0};this.postStep;this.onTouch};vastengine.Controller.prototype.setViewPosition=function(a,b){this.view.x=a;this.view.y=b};
vastengine.Controller.prototype.step=function(){this.removeDestroyedEntities();for(var a=0;a<this.entities.length;a++)0!==this.entities[a].speed&&(this.entities[a].x+=Math.round(vastengine.MathUtil.getLengthDirectionX(this.entities[a].getSpeed(),this.entities[a].getDirection())/10),this.entities[a].y+=Math.round(vastengine.MathUtil.getLengthDirectionY(this.entities[a].getSpeed(),this.entities[a].getDirection())/10)),this.entities[a].step&&this.entities[a].step();this.postStep&&this.postStep()};
vastengine.Controller.prototype.setPostStep=function(a){this.postStep=a};vastengine.Controller.prototype.setOnTouch=function(a){this.onTouch=a};vastengine.Controller.prototype.addEntity=function(a){this.entities.push(a)};vastengine.Controller.prototype.getEntities=function(){return this.entities};vastengine.Controller.prototype.getEntityById=function(a){for(var b=0;b<this.entities.length;b++)if(this.entities[b].id===a)return this.entities[b]};
vastengine.Controller.prototype.getEntitiesByType=function(a){for(var b=[],c=0;c<this.entities.length;c++)this.entities[c].type===a&&b.push(this.entities[c]);return b};vastengine.Controller.prototype.getEntitiesAtPosition=function(a,b,c){for(var d=[],e=0;e<this.entities.length;e++)this.entities[e].onPosition(a,b)&&(c&&this.entities[e].type!==c||d.push(this.entities[e]));return d};
vastengine.Controller.prototype.isPositionFree=function(a,b,c){for(var d=0;d<this.entities.length;d++)if(this.entities[d].onPosition(a,b)&&(!c||c===this.entities[d].type))return!1;return!0};vastengine.Controller.prototype.sortEntities=function(){this.entities.sort(function(a,b){return-(a.depth-b.depth)})};
vastengine.Controller.prototype.removeDestroyedEntities=function(){void 0!==this.entities&&0<this.entities.length&&(this.entities=this.entities.filter(function(a){try{return!a.isDestroyed}catch(b){throw"Can't call step() on undefined managed Entity!";}}))};vastengine=vastengine||{};vastengine.Entity=function(a,b){this.depth=this.y=this.x=0;this.type=a;this.id=b;this.isDestroyed=!1;this.height=this.width=this.direction=this.speed=0;this.onTouch;this.onTouchEnd;this.step;this.draw};vastengine.Entity.prototype.setOnTouch=function(a){this.onTouch=a};vastengine.Entity.prototype.setOnTouchEnd=function(a){this.onTouchEnd=a};vastengine.Entity.prototype.setStep=function(a){this.step=a};vastengine.Entity.prototype.setDraw=function(a){this.draw=a};
vastengine.Entity.prototype.mouseup=function(a,b){};vastengine.Entity.prototype.destroy=function(){this.isDestroyed=!0};vastengine.Entity.prototype.checkCollision=function(a){return!(this.x+this.width<a.x+1||a.x+a.width-1<this.x||this.y+this.height<a.y+1||a.y+a.height-1<this.y)};vastengine.Entity.prototype.onPosition=function(a,b){return a>this.x&&b>this.y&&a<this.x+this.width&&b<this.y+this.height};vastengine.Entity.prototype.getImage=function(){return this.image};
vastengine.Entity.prototype.setImage=function(a){this.image=a};vastengine.Entity.prototype.setPosition=function(a,b){this.x=a;this.y=b};vastengine.Entity.prototype.getX=function(){return this.x};vastengine.Entity.prototype.setX=function(a){this.x=a};vastengine.Entity.prototype.getY=function(){return this.y};vastengine.Entity.prototype.setY=function(a){this.y=a};vastengine.Entity.prototype.getSpeed=function(){return this.speed};vastengine.Entity.prototype.setSpeed=function(a){this.speed=a};
vastengine.Entity.prototype.getDirection=function(){return this.direction};vastengine.Entity.prototype.setDirection=function(a){this.direction=a};vastengine.Entity.prototype.setSize=function(a,b){this.width=a;this.height=b};var $vast=vastengine=vastengine||{};vastengine.Game=function(){this.activeController=null};vastengine.Game.Config={fps:60};vastengine.Game.setActiveController=function(a){this.activeController=a};vastengine.Game.getActiveController=function(){return this.activeController};vastengine.Game.hasActiveControler=function(){return this.activeController?void 0!==this.activeController.view:!1};
vastengine.Game.getTimestamp=function(){return window.performance&&window.performance.now?window.performance.now():(new Date).getTime()};vastengine.Game.init=function(){vastengine.Game.Input=new vastengine.Input;vastengine.Game.Images=new vastengine.AssetManager(vastengine.AssetType.IMAGE);vastengine.Game.Audio=new vastengine.AssetManager(vastengine.AssetType.AUDIO);vastengine.Game.Canvas=new vastengine.Canvas};
vastengine.Game.run=function(){function a(){var e=vastengine.Game.getTimestamp();for(c+=Math.min(1,(e-d)/1E3);c>b;)vastengine.Game.hasActiveControler()&&vastengine.Game.getActiveController().step(b),c-=b;vastengine.Game.hasActiveControler()&&vastengine.Game.Canvas.draw(vastengine.Game.getActiveController());d=e;requestAnimationFrame(a)}var b=1/vastengine.Game.Config.fps,c=0,d=vastengine.Game.getTimestamp();requestAnimationFrame(a)};vastengine=vastengine||{};vastengine.Input=function(){this.currentTouchX;this.currentTouchY};vastengine.InputEventType={touchStart:0,touchEnd:1};vastengine.Input.prototype.onTouch=function(a){this.onTouchEvent(vastengine.InputEventType.touchStart,a.pageX,a.pageY)};vastengine.Input.prototype.onTouchEnd=function(a){this.onTouchEvent(vastengine.InputEventType.touchEnd,a.pageX,a.pageY)};
vastengine.Input.prototype.onTouchEvent=function(a,b,c){var d=vastengine.Game.getActiveController(),e=vastengine.Game.Canvas.getScale();a=d.getEntities();b=b/e+d.view.x;c=c/e+d.view.y;if(d.onTouch)d.onTouch(b,c);for(d=0;d<a.length;d++)if(e=a[d],0<e.width&&0<e.height&&b>e.x&&c>e.y&&b<e.x+e.width&&c<e.y+e.height&&e.onTouch)e.onTouch(b,c)};vastengine=vastengine||{};vastengine.MathUtil={};vastengine.MathUtil.getPointDistance=function(a,b,c,d){return Math.sqrt((c-a)*(c-a)+(d-b)*(d-b))};vastengine.MathUtil.getPointDirection=function(a,b,c,d){a=180/Math.PI*Math.atan2(d-b,c-a);360<a?a-=360:0>a&&(a+=360);return a};vastengine.MathUtil.getLengthDirectionX=function(a,b){return Math.floor(a*Math.cos(Math.PI/180*b))};vastengine.MathUtil.getLengthDirectionY=function(a,b){return Math.floor(a*Math.sin(Math.PI/180*b))};
