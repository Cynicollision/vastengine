var vastengine=vastengine||{};!function(){vastengine.AssetManager=function(a){if(this.assets=[],this.type=a,a!=vastengine.AssetType.IMAGE&&a!=vastengine.AssetType.AUDIO)throw'Invalid asset type "'+a+'"'},vastengine.AssetType={IMAGE:"image",AUDIO:"audio"},vastengine.AssetManager.prototype={add:function(a,b){this.assets.push({id:a,source:b,asset:void 0})},getById:function(a){for(var b=0;b<this.assets.length;b++)if(this.assets[b].id===a)return this.assets[b].asset;throw"No asset exists with the given ID value: "+a},load:function(a){for(var b=0;b<this.assets.length;b++)this.type===vastengine.AssetType.IMAGE?this.assets[b].asset=new Image:this.type===vastengine.AssetType.AUDIO&&(this.assets[b].asset=new Audio(this.assets[b].source)),this.assets[b].asset.src=this.assets[b].source;a&&a()}}}();var vastengine=vastengine||{};!function(){vastengine.CanvasManager=function(){this.canvas=this.buildCanvas(),this.backgroundScrollFactor=1,this.scaleFactor=2,this.canvas.onmousedown=function(a){vastengine.Input.onTouch(a)},this.canvas.onmouseup=function(a){vastengine.Input.onTouchEnd(a)}},vastengine.CanvasManager.prototype={buildCanvas:function(){var a=document.createElement("canvas");return a.id="vastCanvas",a.className="canvasStlye",a.width=vastengine.Game.Config.canvasWidth,a.height=vastengine.Game.Config.canvasHeight,document.body.appendChild(a),a},getDrawingContext:function(){return this.canvas.getContext("2d")},setBackgroundColor:function(a){this.canvas.style.background=a},setBackgroundImage:function(a,b){this.canvas.style.backgroundImage="url("+a+")",b||(this.canvas.style.backgroundRepeat="no-repeat")},setBackgroundPosition:function(a,b){this.canvas.style.backgroundPosition=a+"px "+b+"px"},setScrollFactor:function(a){this.backgroundScrollFactor=a},getCanvasWidth:function(){return this.canvas.width},getCanvasHeight:function(){return this.canvas.height},setCanvasSize:function(a,b){this.canvas.width=a,this.canvas.height=b},setScale:function(a){this.scaleFactor=a},getScale:function(){return this.scaleFactor},getViewRelativeX:function(a){return void 0!==a.view?a.view.x:0},getViewRelativeY:function(a){return void 0!==a.view?a.view.y:0},drawElement:function(a){var b=this.getDrawingContext();b.save(),a(this.getDrawingContext()),b.restore()},draw:function(a){var b=this.getDrawingContext();b.clearRect(0,0,this.canvas.width,this.canvas.height),b.save(),b.scale(this.scaleFactor,this.scaleFactor);var c=(this.getCanvasWidth()-this.getCanvasWidth()/this.scaleFactor)/2,d=(this.getCanvasHeight()-this.getCanvasHeight()/this.scaleFactor)/2;vastengine.Game.Config.scaleFromCenter&&b.translate(-c,-d);var e=this.getViewRelativeX(a),f=this.getViewRelativeY(a);this.setBackgroundPosition(-e*this.backgroundScrollFactor,-f*this.backgroundScrollFactor),a.sortEntities();for(var g=a.getEntities(),h=0;h<g.length;h++)if(g[h].draw&&g[h].draw(),g[h]){var i=g[h].getSprite();i&&i.draw(b,g[h].x-e,g[h].y-f)}this.getDrawingContext().restore()}}}();var vastengine=vastengine||{};!function(){vastengine.Controller=function(){this.entities=[],this.view={x:0,y:0},this.postStep=null,this.onTouch=null,this.onTouchEnd=null},vastengine.Controller.prototype={setViewPosition:function(a,b){this.view.x=a,this.view.y=b},step:function(){this.removeDestroyedEntities();for(var a=0;a<this.entities.length;a++)0!==this.entities[a].speed&&(this.entities[a].x+=Math.round(vastengine.MathUtil.getLengthDirectionX(this.entities[a].getSpeed(),this.entities[a].getDirection())/10),this.entities[a].y+=Math.round(vastengine.MathUtil.getLengthDirectionY(this.entities[a].getSpeed(),this.entities[a].getDirection())/10)),this.entities[a].step&&this.entities[a].step();this.postStep&&this.postStep()},setPostStep:function(a){this.postStep=a},setOnTouch:function(a){this.onTouch=a},setOnTouchEnd:function(a){this.onTouchEnd=a},addEntity:function(a){this.entities.push(a)},getEntities:function(){return this.entities},getEntityById:function(a){for(var b=0;b<this.entities.length;b++)if(this.entities[b].id===a)return this.entities[b]},getEntitiesByType:function(a){for(var b=[],c=0;c<this.entities.length;c++)this.entities[c].type===a&&b.push(this.entities[c]);return b},getEntitiesAtPosition:function(a,b,c){for(var d=[],e=0;e<this.entities.length;e++)this.entities[e].onPosition(a,b)&&(c&&this.entities[e].type!==c||d.push(this.entities[e]));return d},isPositionFree:function(a,b,c){for(var d=0;d<this.entities.length;d++)if(this.entities[d].onPosition(a,b)&&(!c||c===this.entities[d].type))return!1;return!0},sortEntities:function(){this.entities.sort(function(a,b){return-(a.depth-b.depth)})},removeDestroyedEntities:function(){void 0!==this.entities&&this.entities.length>0&&(this.entities=this.entities.filter(function(a){return!a||!a.isDestroyed}))}}}();var vastengine=vastengine||{};!function(){vastengine.Dialog=function(a,b,c,d,e){this.width=b,this.height=c,this.callback=e,this.buttonHeight=80,this.lineSpacing=50,this.textFont=this.lineSpacing-10+"pt Calibri",this.textPadding=10,this.textLines=this.buildTextLines(a,this.width-this.textPadding,this.textFont),0>=c&&(this.height=this.textLines.length*this.lineSpacing+this.textPadding+d.length*this.buttonHeight),this.x=0,this.y=0,vastengine.Canvas&&(this.x=vastengine.Canvas.getCanvasWidth()/2-this.width/2,this.y=vastengine.Canvas.getCanvasHeight()/2-this.height/2),this.buttons=this.buildButtons(d,this.x,this.y,this.width,this.height,this.buttonHeight),this.visible=!1,this.scale=function(){var a=0;return{get:function(){return a},update:function(){1>a&&(a+=.25*(1-a)),a>.99&&(a=1)}}}()},vastengine.Dialog.prototype={buildTextLines:function(a,b,c){var d;vastengine.Canvas&&(d=vastengine.Canvas.getDrawingContext(),d&&(d.font=c));for(var e=[],f=a.split(" "),g="",h=0;h<f.length;h++){var i=g+f[h]+" ";if(d){var j=d.measureText(i).width;j>b&&h>0?(e.push(g),g=f[h]+" "):g=i}}return e.push(g),e},buildButtons:function(a,b,c,d,e,f){for(var g=[],h=a.length-1;h>=0;h--)g.push({text:a[a.length-h-1],x:b,y:c+e-(h+1)*f,w:d,h:f});return g},setVisible:function(a){this.visible=a},isVisible:function(){return this.visible},onTouch:function(a,b){for(var c=-1,d=0;d<this.buttons.length;d++)a>this.buttons[d].x&&a<this.buttons[d].x+this.buttons[d].w&&b>this.buttons[d].y&&b<this.buttons[d].y+this.buttons[d].h&&(c=d);c>-1&&(vastengine.Game.setDialog(void 0),this.doCallback(c))},doCallback:function(a){this.callback&&this.callback(a)},draw:function(){if(this.visible){var a=vastengine.Canvas.getDrawingContext();if(a.save(),this.scale.update(),a.fillStyle="#000",a.globalAlpha=.5,a.fillRect(0,0,vastengine.Canvas.getCanvasWidth(),vastengine.Canvas.getCanvasHeight()),a.globalAlpha=1,a.shadowBlur=20,a.shadowColor="black",a.fillStyle="#FFF",a.fillRect(this.x+(this.width-this.width*this.scale.get())/2,this.y+(this.height-this.height*this.scale.get())/2,this.width*this.scale.get(),this.height*this.scale.get()),a.shadowBlur=0,1===this.scale.get()){a.textBaseline="top",a.fillStyle="#000",a.font=this.textFont;for(var b=0;b<this.textLines.length;b++)a.fillText(this.textLines[b],this.x+this.textPadding,this.y+b*this.lineSpacing);a.font=this.buttonHeight/2+"pt Calibri",a.textAlign="center",a.textBaseline="middle";for(var c=0;c<this.buttons.length;c++)a.fillText(this.buttons[c].text,this.buttons[c].x+this.buttons[c].w/2,this.buttons[c].y+this.buttons[c].h/2)}a.restore()}}}}();var vastengine=vastengine||{};!function(){vastengine.Entity=function(a,b){this.x=0,this.y=0,this.depth=0,this.type=a||"",this.id=b||0,this.isDestroyed=!1,this.speed=0,this.direction=0,this.width=0,this.height=0,this.sprite=null,this.onTouch=null,this.onTouchEnd=null,this.step=null,this.draw=null},vastengine.Entity.prototype={setOnTouch:function(a){this.onTouch=a},setOnTouchEnd:function(a){this.onTouchEnd=a},setStep:function(a){this.step=a},setDraw:function(a){this.draw=a},mouseup:function(){},destroy:function(){this.isDestroyed=!0},checkCollision:function(a){return!(this.x+this.width<a.x+1||a.x+a.width-1<this.x||this.y+this.height<a.y+1||a.y+a.height-1<this.y)},onPosition:function(a,b){return a>this.x&&b>this.y&&a<this.x+this.width&&b<this.y+this.height},getSprite:function(){return this.sprite},setSprite:function(a){this.sprite=a},setPosition:function(a,b){this.x=a,this.y=b},getX:function(){return this.x},setX:function(a){this.x=a},getY:function(){return this.y},setY:function(a){this.y=a},getSpeed:function(){return this.speed},setSpeed:function(a){this.speed=a},getDirection:function(){return this.direction},setDirection:function(a){this.direction=a},setSize:function(a,b){this.width=a,this.height=b}}}();var vastengine=vastengine||{},$vast=vastengine;!function(){function a(){vastengine.Canvas.drawElement(function(a){a.save(),a.fillStyle="White",a.font="normal 16pt Arial",a.fillText(vastengine.Game.getCurrentFPS()+" fps",64,96),a.restore()})}vastengine.Game=function(){this.activeController=null,this.activeDialog=null,this.state=vastengine.GameState.STOPPED},vastengine.GameState={STOPPED:0,RUNNING:1},vastengine.Game.Config={fps:60,canvasWidth:window.innerWidth,canvasHeight:window.innerHeight,scaleFromCenter:!1,debugShowFPS:!0},vastengine.Game.setState=function(a){this.state=a},vastengine.Game.setActiveController=function(a){this.activeController=a},vastengine.Game.getActiveController=function(){return this.activeController},vastengine.Game.hasActiveControler=function(){return this.activeController?void 0!==this.activeController.view:!1},vastengine.Game.setDialog=function(a){a?(this.activeDialog=a,this.activeDialog.setVisible(!0),vastengine.Game.setState(vastengine.GameState.STOPPED)):(vastengine.Game.setState(vastengine.GameState.RUNNING),this.activeDialog.setVisible(!1),this.activeDialog=null)},vastengine.Game.init=function(){vastengine.Images=new vastengine.AssetManager(vastengine.AssetType.IMAGE),vastengine.Audio=new vastengine.AssetManager(vastengine.AssetType.AUDIO),vastengine.Canvas=new vastengine.CanvasManager},vastengine.Game.run=function(){function b(){return window.performance&&window.performance.now?window.performance.now():(new Date).getTime()}function c(){var d=b();for(f+=Math.min(1,(d-g)/1e3);f>e;)vastengine.Game.state===vastengine.GameState.RUNNING&&vastengine.Game.hasActiveControler()&&vastengine.Game.getActiveController().step(e),f-=e;vastengine.Game.hasActiveControler()&&vastengine.Canvas.draw(vastengine.Game.getActiveController()),vastengine.Game.activeDialog&&vastengine.Game.activeDialog.isVisible()&&vastengine.Game.activeDialog.draw(),vastengine.Game.Config.debugShowFPS&&a(),g=d,requestAnimationFrame(c)}var d=vastengine.Game.Config.fps,e=1/d,f=0,g=b();vastengine.Game.state=vastengine.GameState.RUNNING,requestAnimationFrame(c)},vastengine.Game.getCurrentFPS=function(){var a=(new Date).getMilliseconds(),b=1,c=0;return function(){var d=(new Date).getMilliseconds();return a>d?(c=b,b=1):b+=1,a=d,c}}(),vastengine.Game.setError=function(a,b){var c="vastengine error: ";throw a&&(c+=a),b&&(c+="\n\n"+b),c}}();var vastengine=vastengine||{};!function(){vastengine.Input=function(){this.currentTouchX=-1,this.currentTouchY=-1},vastengine.InputEventType={TOUCH_START:0,TOUCH_END:1},vastengine.Input.onTouch=function(a){this.onTouchEvent(vastengine.InputEventType.TOUCH_START,a.pageX,a.pageY)},vastengine.Input.onTouchEnd=function(a){this.onTouchEvent(vastengine.InputEventType.TOUCH_END,a.pageX,a.pageY)},vastengine.Input.onTouchEvent=function(a,b,c){var d=vastengine.Game.getActiveController(),e=vastengine.Canvas.getScale(),f=(window.innerWidth-vastengine.Canvas.getCanvasWidth()/e)/2,g=(window.innerHeight-vastengine.Canvas.getCanvasHeight()/e)/2,h=b/e,i=c/e;if(vastengine.Game.Config.scaleFromCenter&&(h+=f,i+=g),vastengine.Game.activeDialog?a===vastengine.InputEventType.TOUCH_START&&vastengine.Game.activeDialog.onTouch(h,i):d&&(a===vastengine.InputEventType.TOUCH_START&&d.onTouch?d.onTouch(h+d.view.x,i+d.view.y):d.onTouchEnd&&d.onTouchEnd(h+d.view.x,i+d.view.y)),vastengine.Game.state===vastengine.GameState.RUNNING)for(var j=d.getEntities(),k=0;k<j.length;k++){var l=j[k];l.width>0&&l.height>0&&h>l.x&&i>l.y&&h<l.x+l.width&&i<l.y+l.height&&(a===vastengine.InputEventType.TOUCH_START&&l.onTouch?l.onTouch(h,i):l.onTouchEnd&&l.onTouchEnd(h,i))}}}();var vastengine=vastengine||{};!function(){vastengine.MathUtil={},vastengine.MathUtil.getPointDistance=function(a,b,c,d){return Math.sqrt((c-a)*(c-a)+(d-b)*(d-b))},vastengine.MathUtil.getPointDirection=function(a,b,c,d){var e=180/Math.PI*Math.atan2(d-b,c-a);return e>360?e-=360:0>e&&(e+=360),e},vastengine.MathUtil.getLengthDirectionX=function(a,b){return Math.floor(a*Math.cos(b*(Math.PI/180)))},vastengine.MathUtil.getLengthDirectionY=function(a,b){return Math.floor(a*Math.sin(b*(Math.PI/180)))}}();var vastengine=vastengine||{};!function(){vastengine.Sprite=function(a,b,c,d){this.image=a,this.frames=d,this.width=b,this.height=c,this.currentFrame=0,this.counter=0},vastengine.Sprite.buildFromImage=function(a,b,c,d,e){a||vastengine.Game.setError("Can't build Sprite from undefined image!"),b=void 0!==b?b:a.width,c=void 0!==c?c:a.height,d=void 0!==d?d:0,e=void 0!==e?e:0;for(var f=[],g=d;e>=g;g++)f.push(g);return new vastengine.Sprite(a,b,c,f)},vastengine.Sprite.prototype={getImage:function(){return this.image},draw:function(a,b,c){var d=0,e=0;if(this.frames.length>1){var f=10;this.counter==f-1&&(this.currentFrame=(this.currentFrame+1)%this.frames.length),this.counter=(this.counter+1)%f,d=Math.floor(this.frames[this.currentFrame]/(this.image.width/this.width)),e=Math.floor(this.frames[this.currentFrame]%(this.image.width/this.width)),a.drawImage(this.image,e*this.width,d*this.height,this.width,this.height,b,c,this.width,this.height)}else a.drawImage(this.image,b,c)}}}();