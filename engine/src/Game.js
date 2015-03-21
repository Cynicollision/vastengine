/// <reference path="Canvas.js" />
var vastengine = vastengine || {};
var $vast = vastengine;

(function () {
    /**
     * Manages game-level components such as the currently running Controller object, routing input, and accessing assets through AssetManager instances.
     * @constructor
     */
    vastengine.Game = function () {
        this.activeController = null;
        this.activeDialog = null;
        this.state = vastengine.GameState.STOPPED;
    };

    /**
     * Enum of states that the game loop can be in (stopped or running).
     * @enum {number}
     */
    vastengine.GameState = {
        STOPPED: 0,
        RUNNING: 1
    };

    /**
     * Game-level constants. Intended to be overridden as the first step of game setup (or use these defaults).
     */
    vastengine.Game.Config = {
        fps: 60, // TODO: should be "game speed" as it will always attempt to run at 60fps.
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight,
        scaleFromCenter: false,
        debugShowFPS: true
    };

    /**
     * Sets the game state, used to pause and resume the game loop.
     * @param {GameState} state.
     */
    vastengine.Game.setState = function (state) {
        this.state = state;
    };

    /** 
     * Sets the running Controller to the given Controller object.
     */
    vastengine.Game.setActiveController = function (newActiveController) {
        this.activeController = newActiveController;
    };

    /** 
     * Returns the running Controller
     */
    vastengine.Game.getActiveController = function () {
        return this.activeController;
    };

    /**
     * Determines whether a Controller object has been assigned as the active controller.
     * @return {boolean} True if an active controller exists.
     */
    vastengine.Game.hasActiveControler = function () {
        if (this.activeController) {
            return this.activeController.view !== undefined;
        }
        return false;
    };

    /**
     * Pauses the game loop to launch the given Dialog object.
     * @param {Dialog} Dialog object to show.
     */
    vastengine.Game.setDialog = function (dialog) {
        if (dialog) {
            this.activeDialog = dialog;
            this.activeDialog.setVisible(true);
            vastengine.Game.setState(vastengine.GameState.STOPPED);
        } else {
            vastengine.Game.setState(vastengine.GameState.RUNNING);
            this.activeDialog.setVisible(false);
            this.activeDialog = null;
        }
    };

    // TODO: can this be eliminated?
    /**
     * Initializes all game-level resources. Must be called first when setting up the game.
     */
    vastengine.Game.init = function () {
        // TODO: someday make these $vast.Images, $vast.Audio, $vast.Canvas
        vastengine.Game.Images = new vastengine.AssetManager(vastengine.AssetType.IMAGE);
        vastengine.Game.Audio = new vastengine.AssetManager(vastengine.AssetType.AUDIO);
        vastengine.Game.Canvas = new vastengine.Canvas();
    };

    /**
     * The main game loop. Keeps the game running at a fixed FPS.
     */
    vastengine.Game.run = function () {
        var fps = vastengine.Game.Config.fps;
        var fpsActual = 0;
        var stepSize = 1 / fps;
        var offset = 0;
        var previous = getTimestamp();
        vastengine.Game.state = vastengine.GameState.RUNNING;

        function getTimestamp() {
            if (window.performance && window.performance.now) {
                return window.performance.now();
            } else {
                return (new Date()).getTime();
            }
        }

        function stepAndDraw() {
            var current = getTimestamp();
            offset += (Math.min(1, (current - previous) / 1000));

            // still step during the offset (time difference between frames).
            while (offset > stepSize) {
                if (vastengine.Game.state === vastengine.GameState.RUNNING) {
                    if (vastengine.Game.hasActiveControler()) {
                        vastengine.Game.getActiveController().step(stepSize);
                    }
                }

                offset -= stepSize;
            }

            // draw
            if (vastengine.Game.hasActiveControler()) {
                vastengine.Game.Canvas.draw(vastengine.Game.getActiveController());
            }
            if (vastengine.Game.activeDialog) {
                if (vastengine.Game.activeDialog.isVisible()) {
                    vastengine.Game.activeDialog.draw();
                }

            }

            if (vastengine.Game.Config.debugShowFPS) {
                drawCurrentFPS();
            }

            previous = current;
            requestAnimationFrame(stepAndDraw);
        }

        requestAnimationFrame(stepAndDraw);
    };

    /**
     * Draws the current FPS that the game is running at.
     */
    function drawCurrentFPS() {
        vastengine.Game.Canvas.drawElement(function (context) {
            context.save();
            context.fillStyle = "White";
            context.font = "normal 16pt Arial";

            context.fillText(vastengine.Game.getCurrentFPS() + " fps", 64, 96);

            context.restore();
        });
    }

    // this is awesome: http://stackoverflow.com/questions/8279729/calculate-fps-in-canvas-using-requestanimationframe
    vastengine.Game.getCurrentFPS = (function () {
        var lastLoop = (new Date()).getMilliseconds();
        var count = 1;
        var fps = 0;

        return function () {
            var currentLoop = (new Date()).getMilliseconds();
            if (lastLoop > currentLoop) {
                fps = count;
                count = 1;
            } else {
                count += 1;
            }
            lastLoop = currentLoop;
            return fps;
        };
    }());

    // TODO: test method for the following, also maybe modify to check for undefined error
    /**
     * For throwing exceptions by errors raised by vastengine itself.
     * @param {string} message Error message.
     * @param {string} (optional) e Inner exception.
     */
    vastengine.Game.setError = function (message, e) {
        var error = "vastengine error: ";
        if (message) {
            error += message;
        }
        if (e) {
            error += '\n\n' + e;
        }

        throw error;
    };

})();