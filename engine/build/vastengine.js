!function(){window.vastengine=window.vastengine||{},window.$vast=window.vastengine}(),vastengine.AssetType={IMAGE:"image",AUDIO:"audio"},vastengine.AssetManager=function(a){if(this.assets=[],this.type=a,a!=vastengine.AssetType.IMAGE&&a!=vastengine.AssetType.AUDIO)throw'Invalid asset type "'+a+'"'},vastengine.AssetManager.prototype={add:function(a,b){this.assets.push({id:a,source:b,asset:void 0})},getById:function(a){for(var b=0;b<this.assets.length;b++)if(this.assets[b].id===a)return this.assets[b].asset;throw"No asset exists with the given ID value: "+a},load:function(a){for(var b=0;b<this.assets.length;b++)this.type===vastengine.AssetType.IMAGE?this.assets[b].asset=new Image:this.type===vastengine.AssetType.AUDIO&&(this.assets[b].asset=new Audio(this.assets[b].source)),this.assets[b].asset.src=this.assets[b].source;a&&a()}},vastengine.Canvas=function(){var a,b,c=1,d=1,e="vastCanvas",f="canvasStyle";return{visible:!0,buildCanvas:function(){a=document.createElement("canvas"),a.id=e,a.className=f,this.setVisible(!1),a.onmousedown=function(a){vastengine.Input.onTouch(a)},a.onmouseup=function(a){vastengine.Input.onTouchEnd(a)},b=a.getContext("2d"),document.body.appendChild(a),this.updateCanvasSize()},setVisible:function(b){this.visible=b,a.style.display=b?"block":"none"},updateCanvasSize:function(){d=vastengine.Config.scale,vastengine.Config.fullScreen?(a.width=window.innerWidth,a.height=window.innerHeight):(a.width=vastengine.Config.canvasWidth*vastengine.Config.scale,a.height=vastengine.Config.canvasHeight*vastengine.Config.scale)},setBackgroundColor:function(b){a.style.background=b},setBackgroundImage:function(b,c){a.style.backgroundImage="url("+b+")",c||(a.style.backgroundRepeat="no-repeat")},setBackgroundPosition:function(b,c){a.style.backgroundPosition=b+"px "+c+"px"},setScrollFactor:function(a){c=a},getWidth:function(){return a.width},getHeight:function(){return a.height},setSize:function(b,c){a.width=b,a.height=c},getScale:function(){return d},getViewRelativeX:function(a){return void 0!==a.view?a.view.x:0},getViewRelativeY:function(a){return void 0!==a.view?a.view.y:0},drawElement:function(a){b.save(),a(b),b.restore()},draw:function(){var e,f=0,g=0,h=0,i=0;b.clearRect(0,0,a.width,a.height),b.save(),b.scale(d,d),f=(a.width-a.width/d)/2,g=(a.height-a.height/d)/2,vastengine.Config.scaleCenter&&b.translate(-f,-g),e=vastengine.Game.getActiveController(),e&&(h=e.view.x,i=e.view.y),this.setBackgroundPosition(-h*c,-i*c),e&&(e.drawEntities(b),e.draw&&e.draw()),b.restore(),vastengine.Debug&&(b.save(),vastengine.Debug.draw(b),b.restore())}}}(),vastengine.Config={fullScreen:!1,gameSpeed:60,scaleCenter:!1,scale:1,canvasWidth:640,canvasHeight:480},vastengine.Controller=function(){this.entities=[],this.view={x:0,y:0},this.preStep=null,this.postStep=null,this.onTouch=null,this.onTouchEnd=null,this.draw=null},vastengine.Controller.prototype={setViewPosition:function(a,b){this.view.x=a,this.view.y=b},step:function(){this.removeDestroyedEntities(),this.preStep&&this.preStep();for(var a=0;a<this.entities.length;a++)0!==this.entities[a].speed&&(this.entities[a].x+=Math.round(vastengine.MathUtil.getLengthDirectionX(this.entities[a].speed,this.entities[a].direction)/10),this.entities[a].y+=Math.round(vastengine.MathUtil.getLengthDirectionY(this.entities[a].speed,this.entities[a].direction)/10)),this.entities[a].step&&this.entities[a].step();this.postStep&&this.postStep()},addEntity:function(a){this.entities.push(a)},getEntities:function(){return this.entities},getEntityById:function(a){for(var b=0;b<this.entities.length;b++)if(this.entities[b].id===a)return this.entities[b]},getEntitiesByType:function(a){for(var b=[],c=0;c<this.entities.length;c++)this.entities[c].type===a&&b.push(this.entities[c]);return b},getEntitiesAtPosition:function(a,b,c){for(var d=[],e=0;e<this.entities.length;e++)this.entities[e].onPosition(a,b)&&(c&&this.entities[e].type!==c||d.push(this.entities[e]));return d},isPositionFree:function(a,b,c){for(var d=0;d<this.entities.length;d++)if(this.entities[d].onPosition(a,b)&&(!c||c===this.entities[d].type))return!1;return!0},sortEntities:function(){this.entities.sort(function(a,b){return-(a.depth-b.depth)})},removeDestroyedEntities:function(){void 0!==this.entities&&this.entities.length>0&&(this.entities=this.entities.filter(function(a){return!a||!a.isDestroyed}))},drawEntities:function(a){this.sortEntities();for(var b=0;b<this.entities.length;b++)if(!this.entities[b].isDestroyed){var c=this.entities[b].x-this.view.x,d=this.entities[b].y-this.view.y;this.entities[b].drawSprite(a,c,d),this.entities[b].draw&&this.entities[b].draw(a,c,d)}}},vastengine.Debug=function(){var a=[{0:"showFPS"},{1:"showEntityCount"}],b=function(){var a=(new Date).getMilliseconds(),b=1,c=0;return function(){var d=(new Date).getMilliseconds();return a>d?(c=b,b=1):b+=1,a=d,c}}();return{displayFont:"normal 16pt Consolas",displayColor:"White",show:!1,draw:function(c){if(this.show){c.fillStyle=vastengine.Debug.displayColor,c.font=vastengine.Debug.displayFont;for(var d=0;d<a.length;d++){var e="";if(0===d)e="FPS: "+b();else if(1===d){var f=vastengine.Game.getActiveController();f&&(e="Entities: "+f.getEntities().length)}c.fillText(e,16,32+20*d)}}}}}(),vastengine.Entity=function(a,b){this.type=a||"",this.id=b||0,this.isDestroyed=!1,this.x=0,this.y=0,this.width=0,this.height=0,this.depth=0,this.speed=0,this.direction=0,this.onTouch=null,this.onTouchEnd=null,this.step=null,this.draw=null},vastengine.Entity.prototype={checkCollision:function(a){return!(this.x+this.width<a.x+1||a.x+a.width-1<this.x||this.y+this.height<a.y+1||a.y+a.height-1<this.y)},onPosition:function(a,b){return a>this.x&&b>this.y&&a<this.x+this.width&&b<this.y+this.height},setPosition:function(a,b){this.x=a,this.y=b},setSize:function(a,b){this.width=a,this.height=b},setSizeFromSprite:function(){this.sprite&&(this.width=this.sprite.width,this.height=this.sprite.height)},destroy:function(){this.isDestroyed=!0},drawSprite:function(a,b,c){this.sprite&&this.sprite.draw(a,b,c)}},vastengine.GameState={STOPPED:0,RUNNING:1},vastengine.Game=function(){var a=new vastengine.Controller;return vastengine.Canvas.buildCanvas(),vastengine.Images=new vastengine.AssetManager(vastengine.AssetType.IMAGE),vastengine.Audio=new vastengine.AssetManager(vastengine.AssetType.AUDIO),state=vastengine.GameState.STOPPED,{setState:function(a){state=a},getState:function(){return state},setActiveController:function(b){a=b},getActiveController:function(){return a},run:function(){function b(){var g=e();for(f+=Math.min(1,(g-d)/1e3);f>c;)state===vastengine.GameState.RUNNING&&a&&a.step(c),f-=c;vastengine.Canvas.draw(),d=g,requestAnimationFrame(b)}var c,d,e,f=0;c=1/vastengine.Config.gameSpeed,state=vastengine.GameState.RUNNING,e=function(){return function(){return window.performance&&window.performance.now?window.performance.now():(new Date).getTime()}}(),d=e(),vastengine.Canvas.updateCanvasSize(),vastengine.Canvas.setVisible(!0),requestAnimationFrame(b)},setError:function(a,b){var c="vastengine error: ";throw a&&(c+=a),b&&(c+="\n\n"+b),c}}}(),vastengine.InputEventType={TOUCH_START:0,TOUCH_END:1},vastengine.Input=function(){return{onTouch:function(a){this.onTouchEvent(vastengine.InputEventType.TOUCH_START,a.pageX,a.pageY)},onTouchEnd:function(a){this.onTouchEvent(vastengine.InputEventType.TOUCH_END,a.pageX,a.pageY)},onTouchEvent:function(a,b,c){var d,e,f,g,h,i;if(e=vastengine.Canvas.getScale(),f=(window.innerWidth-vastengine.Canvas.getWidth()/e)/2,g=(window.innerHeight-vastengine.Canvas.getHeight()/e)/2,h=b/e,i=c/e,vastengine.Config.scaleCenter&&(h+=f,i+=g),d=vastengine.Game.getActiveController(),d&&(a===vastengine.InputEventType.TOUCH_START&&d.onTouch?d.onTouch(h+d.view.x,i+d.view.y):d.onTouchEnd&&d.onTouchEnd(h+d.view.x,i+d.view.y)),vastengine.Game.getState()===vastengine.GameState.RUNNING)for(var j=d.getEntities(),k=0;k<j.length;k++){var l=j[k];l.width>0&&l.height>0&&h>l.x&&i>l.y&&h<l.x+l.width&&i<l.y+l.height&&(a===vastengine.InputEventType.TOUCH_START&&l.onTouch?l.onTouch(h,i):l.onTouchEnd&&l.onTouchEnd(h,i))}}}}();var vastengine=vastengine||{};vastengine.MathUtil=function(){return{getPointDistance:function(a,b,c,d){return Math.sqrt((c-a)*(c-a)+(d-b)*(d-b))},getPointDirection:function(a,b,c,d){var e=180/Math.PI*Math.atan2(d-b,c-a);return e>360?e-=360:0>e&&(e+=360),e},getLengthDirectionX:function(a,b){return Math.floor(a*Math.cos(b*(Math.PI/180)))},getLengthDirectionY:function(a,b){return Math.floor(a*Math.sin(b*(Math.PI/180)))}}}();var vastengine=vastengine||{};!function(){vastengine.Sprite=function(a,b,c,d){this.image=a,this.frames=d,this.width=b,this.height=c,this.frameSpeed=10,this.currentFrame=0,this.counter=0},vastengine.Sprite.fromImage=function(a,b,c,d,e){a||vastengine.Game.setError("Can't build Sprite from undefined image!"),b=void 0!==b?b:a.width,c=void 0!==c?c:a.height,d=void 0!==d?d:0,e=void 0!==e?e:0;for(var f=[],g=d;e>=g;g++)f.push(g);return new vastengine.Sprite(a,b,c,f)},vastengine.Sprite.prototype={draw:function(a,b,c){if(this.image){var d=0,e=0;this.frames.length>1?(this.counter==this.frameSpeed-1&&(this.currentFrame=(this.currentFrame+1)%this.frames.length),this.counter=(this.counter+1)%this.frameSpeed,d=Math.floor(this.frames[this.currentFrame]/(this.image.width/this.width)),e=Math.floor(this.frames[this.currentFrame]%(this.image.width/this.width)),a.drawImage(this.image,e*this.width,d*this.height,this.width,this.height,b,c,this.width,this.height)):a.drawImage(this.image,b,c)}}}}();