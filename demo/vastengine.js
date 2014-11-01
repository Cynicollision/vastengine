'use strict';var vastengine=vastengine||{};vastengine.Canvas=function(){this.canvas=document.createElement("canvas");this.canvas.id="theCanvas";this.canvas.width=640;this.canvas.height=512;document.body.appendChild(this.canvas);this.context=this.canvas.getContext("2d");this.canvas.onmousedown=function(a){void 0!==vastengine.Game.getActiveController()&&vastengine.Game.getActiveController().mousedown(a)};this.canvas.onmouseup=function(a){void 0!==vastengine.Game.getActiveController()&&vastengine.Game.getActiveController().mouseup(a)}};
vastengine.Canvas.prototype.getDrawingContext=function(){return this.context};vastengine.Canvas.prototype.setBackgroundColor=function(a){this.canvas.style.background=a};vastengine.Canvas.prototype.setBackgroundImage=function(a,b){this.canvas.style.backgroundImage="url("+a+")";b||(this.canvas.style.backgroundRepeat="no-repeat")};vastengine.Canvas.prototype.setBackgroundPosition=function(a,b){this.canvas.style.backgroundPosition=a+"px "+b+"px"};vastengine.Canvas.prototype.getCanvasWidth=function(){return this.canvas.width};
vastengine.Canvas.prototype.getCanvasHeight=function(){return this.canvas.height};vastengine.Canvas.prototype.getViewRelativeX=function(a){return void 0!==a.view?a.view.x:0};vastengine.Canvas.prototype.getViewRelativeY=function(a){return void 0!==a.view?a.view.y:0};
vastengine.Canvas.prototype.draw=function(a){this.context.clearRect(0,0,this.canvas.width,this.canvas.height);var b=this.getViewRelativeX(a),d=this.getViewRelativeY(a);this.setBackgroundPosition(-b,-d);a.sortEntities();a=a.getEntities();for(var c=0;c<a.length;c++){a[c].draw();var e=a[c].getImage();void 0!==e&&this.context.drawImage(e,a[c].x-b,a[c].y-d)}};vastengine=vastengine||{};vastengine.Controller=function(){this.entities=[];this.view={x:0,y:0}};vastengine.Controller.prototype.setViewPosition=function(a,b){this.view.x=a;this.view.y=b};
vastengine.Controller.prototype.step=function(){this.removeDestroyedEntities();for(var a=0;a<this.entities.length;a++)0!==this.entities[a].speed&&(this.entities[a].x+=Math.round($vast.MathUtil.getLengthDirectionX(this.entities[a].getSpeed(),this.entities[a].getDirection())/10),this.entities[a].y+=Math.round($vast.MathUtil.getLengthDirectionY(this.entities[a].getSpeed(),this.entities[a].getDirection())/10)),this.entities[a].step();this.postStep()};vastengine.Controller.prototype.postStep=function(){};
vastengine.Controller.prototype.mousedown=function(a){var b=a.pageX+this.view.x;a=a.pageY+this.view.y;for(var d=0;d<this.entities.length;d++){var c=this.entities[d];b>c.x&&a>c.y&&b<c.x+c.width&&a<c.y+c.height&&c.mousedown(b,a)}this.postmousedown(b,a)};vastengine.Controller.prototype.mouseup=function(a){var b=a.pageX+this.view.x;a=a.pageY+this.view.y;for(var d=0;d<this.entities.length;d++){var c=this.entities[d];b>c.x&&a>c.y&&b<c.x+c.width&&a<c.y+c.height&&c.mouseup(b,a)}};
vastengine.Controller.prototype.postmousedown=function(a,b){};vastengine.Controller.prototype.addEntity=function(a){this.entities.push(a)};vastengine.Controller.prototype.getEntities=function(){return this.entities};vastengine.Controller.prototype.getEntityById=function(a){for(var b=0;b<this.entities.length;b++)if(this.entities[b].id===a)return this.entities[b]};
vastengine.Controller.prototype.getEntitiesByType=function(a){for(var b=[],d=0;d<this.entities.length;d++)this.entities[d].type===a&&b.push(this.entities[d]);return b};
vastengine.Controller.prototype.getEntitiesAtPosition=function(a,b,d){for(var c=[],e=0;e<this.entities.length;e++)a>this.entities[e].x&&b>this.entities[e].y&&a<this.entities[e].x+this.entities[e].width&&b<this.entities[e].y+this.entities[e].height&&(void 0===d?c.push(this.entities[e]):this.entities[e].type===d&&c.push(this.entities[e]));return c};vastengine.Controller.prototype.sortEntities=function(){this.entities.sort(function(a,b){return-(a.depth-b.depth)})};
vastengine.Controller.prototype.removeDestroyedEntities=function(){void 0!==this.entities&&0<this.entities.length&&(this.entities=this.entities.filter(function(a){try{return!a.isDestroyed}catch(b){throw"Can't call step() on undefined managed Entity!";}}))};vastengine=vastengine||{};vastengine.Entity=function(a,b){this.depth=this.y=this.x=0;this.type=a;this.id=b;this.isDestroyed=!1;this.height=this.width=this.direction=this.speed=0};vastengine.Entity.prototype.step=function(){};vastengine.Entity.prototype.mousedown=function(a,b){};vastengine.Entity.prototype.mouseup=function(a,b){};vastengine.Entity.prototype.draw=function(){};vastengine.Entity.prototype.destroy=function(){this.isDestroyed=!0};
vastengine.Entity.prototype.checkCollision=function(a){return!(this.x+this.width<a.x+1||a.x+a.width-1<this.x||this.y+this.height<a.y+1||a.y+a.height-1<this.y)};vastengine.Entity.prototype.getImage=function(){return this.image};vastengine.Entity.prototype.setImage=function(a){this.image=a};vastengine.Entity.prototype.setPosition=function(a,b){this.x=a;this.y=b};vastengine.Entity.prototype.getX=function(){return this.x};vastengine.Entity.prototype.setX=function(a){this.x=a};
vastengine.Entity.prototype.getY=function(){return this.y};vastengine.Entity.prototype.setY=function(a){this.y=a};vastengine.Entity.prototype.getSpeed=function(){return this.speed};vastengine.Entity.prototype.setSpeed=function(a){this.speed=a};vastengine.Entity.prototype.getDirection=function(){return this.direction};vastengine.Entity.prototype.setDirection=function(a){this.direction=a};vastengine.Entity.prototype.setSize=function(a,b){this.width=a;this.height=b};var $vast=vastengine=vastengine||{};vastengine.AssetManager=function(a){this.assets=[];this.type=a;if("image"!=a&&"audio"!=a)throw'Invalid asset type "'+a+'"';};vastengine.AssetManager.prototype.add=function(a,b){this.assets.push({id:a,source:b,asset:void 0})};vastengine.AssetManager.prototype.getById=function(a){for(var b=0;b<this.assets.length;b++)if(this.assets[b].id===a)return this.assets[b].asset};
vastengine.AssetManager.prototype.load=function(){for(var a=0;a<this.assets.length;a++)"image"===this.type?this.assets[a].asset=new Image:"audio"===this.type&&(this.assets[a].asset=new Audio(this.assets[a].source)),this.assets[a].asset.src=this.assets[a].source};vastengine.Game=function(){this.activeController};vastengine.Game=function(){};vastengine.Game.Images=new vastengine.AssetManager("image");vastengine.Game.Audio=new vastengine.AssetManager("audio");vastengine.Game.Canvas=new vastengine.Canvas;
vastengine.Game.setActiveController=function(a){this.activeController=a};vastengine.Game.getActiveController=function(){return this.activeController};vastengine.Game.hasActiveControler=function(){return this.activeController?void 0!==this.activeController.view:!1};vastengine.Game.getTimestamp=function(){return window.performance&&window.performance.now?window.performance.now():(new Date).getTime()};
vastengine.Game.run=function(){function a(){var e=vastengine.Game.getTimestamp();for(d+=Math.min(1,(e-c)/1E3);d>b;)vastengine.Game.hasActiveControler()&&vastengine.Game.getActiveController().step(b),d-=b;vastengine.Game.hasActiveControler()&&vastengine.Game.Canvas.draw(vastengine.Game.getActiveController());c=e;requestAnimationFrame(a)}var b=1/60,d=0,c=vastengine.Game.getTimestamp();requestAnimationFrame(a)};vastengine=vastengine||{};vastengine.MathUtil=function(){};vastengine.MathUtil.getPointDistance=function(a,b,d,c){return Math.sqrt((d-a)*(d-a)+(c-b)*(c-b))};vastengine.MathUtil.getPointDirection=function(a,b,d,c){a=180/Math.PI*Math.atan2(c-b,d-a);360<a?a-=360:0>a&&(a+=360);return a};vastengine.MathUtil.getLengthDirectionX=function(a,b){return Math.floor(a*Math.cos(Math.PI/180*b))};vastengine.MathUtil.getLengthDirectionY=function(a,b){return Math.floor(a*Math.sin(Math.PI/180*b))};