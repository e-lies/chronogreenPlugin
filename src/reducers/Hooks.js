import { useEffect, useState } from "react";
import { useHistory, useLocation, matchPath } from "react-router-dom";
import { isJson } from "./Functions";

export const useSize = (id) => {
  const element = document.querySelector(`#${id}`) || document.body;
  const [dimensions, setDimensions] = useState({});
  useEffect(() => {
    appDim();
    window.addEventListener("resize", () => {
      appDim();
    });
  }, []);
  useEffect(() => {
    appDim();
  }, [element.innerWidth, element.innerHeight]);
  const appDim = () => {
    if (element) {
      const deviceWidth = window.innerWidth;
      const deviceSize =
        deviceWidth <= 360
          ? "xxs"
          : deviceWidth <= 480
          ? "xs"
          : deviceWidth <= 700
          ? "sm"
          : deviceWidth <= 960
          ? "md"
          : deviceWidth <= 1024
          ? "lg"
          : "xl";
      const isMobile = ["xxs", "xs", "sm"].includes(deviceSize);

      setDimensions({
        width: element.clientWidth,
        height: element.clientHeight,
        deviceSize,
        isMobile,
        deviceHeight: window.innerHeight,
        deviceWidth,
      });
    }
  };
  //let dimensions = element ? { width: element.clientWidth, height: element.clientHeight } : { width: null, height: null }
  return dimensions;
};
// retourne les paramètres de géolocalisation. exp: {latLng, altitude} = useLocation()
export const useGeolocation = () => {
  const [location, setLocation] = useState({});
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((rep) => {
      setLocation({
        latLng: { lat: rep.coords.latitude, lng: rep.coords.longitude },
        altitude: rep.coords.altitude || 0,
        accuracy: rep.coords.accuracy,
        speed: rep.coords.speed || 0,
        lastReqDt: rep.timestamp,
      });
    });
  }
  return location;
};

export const useRedirect = (location) => {
  if (matchPath(location)) {
    let history = useHistory;
    history.push(location);
    //return ( <React.Fragment> <Redirect to={location} /> </React.Fragment> )
  } else {
    return null;
  }
};

export const useSearch = () => {
  const location = useLocation();
  const search =
    location.search.length > 0
      ? location.search
          .slice(1)
          .split("&")
          .reduce((acc, cur) => {
            acc[cur.split("=")[0]] = isJson(cur.split("=")[1])
              ? JSON.parse(cur.split("=")[1])
              : cur.split("=")[1];
            return acc;
          })
      : {};
  return search;
};

export const useRedirectSearch = (search = "") => {
  const location = useLocation();
  return location.pathname + search;
  // return ( <Redirect to={`${location.pathname}${search}`} /> )
};

window.requestAnimFrame = (function() {
  "use strict";

  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

// Simple way to check if some form of pointerevents is enabled or not
window.PointerEventsSupport = false;
if (window.PointerEvent || window.navigator.msPointerEnabled) {
  window.PointerEventsSupport = true;
}
/**
 * Function that makes a callback call whenever element is swiped right or left
 * @param {Ref OR HTMLElement} ref Parent Element's ( ref or the element itself )
 * @param {String} selector CSS selector for the element to track for swiping
 * @param {String} animated CSS selector for the element to animate upon swiping
 * @param {Function} callback Callback fired whenever element is swiped right or left. Argument: direction {Array} of directions: [(1 if right, 0 if middle, -1 if left), (1 if down, 0 if middle, -1 if up)]. Returns: new state. Same as argument
 * @param {Array} threshold Threshold for the swipe to be considered. [Horizontally, Vertically]
 * @param {Array} animate Array of boolean defining whether to animate the item upon swiping or not, on x and y axis respectively.
 * @param {Array} scroll Array of boolean defining whether to enable scrolling in a direction or not, on x and y axis respectively
 * @param {Array} reset Array of boolean defining whether to reset X and Y offset to 0
 * @param {Array} max Array of numbers defining the maximum scrolling distance for each axis.
 * @param {Boolean} allowClick Whether to allow clicking events
 */
export const SwipeRevealItem = function(
  ref,
  selector,
  animated,
  callback,
  threshold = [],
  animate = [],
  scroll = [],
  reset = [true, true],
  max = [false, false],
  allowClick = false
) {
  const targetElement = ref.current ? ref.current : ref;
  // Gloabl state variables
  var STATE_DEFAULT = [0, 0];
  var STATE_LEFT_SIDE = -1;
  var STATE_RIGHT_SIDE = 1;
  if (
    reset.length !== 2 ||
    typeof reset[0] !== typeof true ||
    typeof reset[1] !== typeof true
  )
    throw new Error("reset should be an array of two booleans");
  if (
    max.length !== 2 ||
    !["boolean", "number"].includes(typeof max[0]) ||
    !["boolean", "number"].includes(typeof max[1])
  )
    throw new Error("max should be an array of two booleans or numbers");
  if (targetElement.querySelector) {const animatedElement = targetElement.querySelector(animated) || document.body;
  var swipeFrontElement = targetElement.querySelectorAll(selector);
  var newYTransform;
  var newXTransform;
  
  if (swipeFrontElement) {
    for(let i = 0;i < swipeFrontElement.length; i++){
      swipeFrontElement[i].style.touchAction = "none";
    }
    var rafPending = false;
    var initialTouchPos = null;
    var lastTouchPos = {};
    var currentXPosition = 0;
    var currentYPosition = 0;
    var currentState = [...STATE_DEFAULT];
    var handleSize = 10;

    // Perform client width here as this can be expensive and doens't
    // change until window.onresize
    var itemWidth = animatedElement.clientWidth;
    var itemHeight = animatedElement.clientHeight;
    var slopValueX =
      threshold !== undefined && threshold[0] ? threshold[0] : itemWidth / 4;
    var slopValueY =
      threshold !== undefined && threshold[1] ? threshold[1] : itemHeight / 4;
    // On resize, change the slop value
    this.resize = function() {
      itemWidth = animatedElement.clientWidth;
      itemHeight = animatedElement.clientHeight;
      slopValueX = threshold !== undefined ? threshold[0] : itemWidth / 4;
      slopValueY = threshold !== undefined ? threshold[1] : itemHeight / 4;
    };

    /* // [START handle-start-gesture] */
    // Handle the start of gestures
    let XOffset, YOffset;
    this.handleGestureStart = function(evt) {
      evt.preventDefault();

      if (evt.touches && evt.touches.length > 1) {
        return;
      }

      // Add the move and end listeners
      if (window.PointerEvent) {
        evt.target.setPointerCapture(evt.pointerId);
      } else {
        // Add Mouse Listeners
        document.addEventListener("mousemove", this.handleGestureMove, true);
        document.addEventListener("mouseup", this.handleGestureEnd, true);
      }

      const matches = /translateX\((.*)px\)\ translateY\((.*)px\)/.exec(
        animatedElement.style.transform
      );
      if (matches === null) {
        XOffset = 0;
        YOffset = 0;
      } else {
        XOffset = parseFloat(matches[1]);
        YOffset = parseFloat(matches[2]);
      }
      const { x, y } = getGesturePointFromEvent(evt);
      initialTouchPos = { x: x - XOffset, y: y - YOffset };
      lastTouchPos = initialTouchPos;
      animatedElement.style.transition = "initial";
    }.bind(this);
    /* // [END handle-start-gesture] */

    // Handle move gestures
    //
    /* // [START handle-move] */
    this.handleGestureMove = function(evt) {
      evt.preventDefault();

      if (!initialTouchPos) {
        return;
      }
      const penultimateTouchPos = lastTouchPos;
      lastTouchPos = getGesturePointFromEvent(evt);
      const YDif = lastTouchPos.y - penultimateTouchPos.y;
      const XDif = lastTouchPos.x - penultimateTouchPos.x;
      for (let i of [0, 1]) {
        if (scroll[i] && (i ? YDif : XDif)) {
          document.scrollingElement[i ? "scrollTop" : "scrollLeft"] =
            document.scrollingElement[i ? "scrollTop" : "scrollLeft"] -
            (i ? YDif : XDif) / 2;
        }
      }
      if (rafPending) {
        return;
      }

      rafPending = true;

      window.requestAnimFrame(onAnimFrame);
    }.bind(this);
    /* // [END handle-move] */

    /* // [START handle-end-gesture] */
    // Handle end gestures
    this.handleGestureEnd = function(evt) {
      evt.preventDefault();
      const { x, y } = getGesturePointFromEvent(evt);
      lastTouchPos = { x: x - XOffset, y: y - YOffset };
      if (evt.touches && evt.touches.length > 0) {
        return;
      }

      rafPending = false;

      // Remove Event Listeners
      if (window.PointerEvent) {
        evt.target.releasePointerCapture(evt.pointerId);
      } else {
        // Remove Mouse Listeners
        document.removeEventListener("mousemove", this.handleGestureMove, true);
        document.removeEventListener("mouseup", this.handleGestureEnd, true);
      }

      updateSwipeRestPosition();

      initialTouchPos = null;
    }.bind(this);
    /* // [END handle-end-gesture] */
    this.remove = function() {
      for(let i = 0;i < swipeFrontElement.length; i++){
        if (window.PointerEvent) {
          // Add Pointer Event Listener
          swipeFrontElement[i].removeEventListener(
            "pointerdown",
            this.handleGestureStart,
            true
          );
          swipeFrontElement[i].removeEventListener(
            "pointermove",
            this.handleGestureMove,
            true
          );
          swipeFrontElement[i].removeEventListener(
            "pointerup",
            this.handleGestureEnd,
            true
          );
          swipeFrontElement[i].removeEventListener(
            "pointercancel",
            this.handleGestureEnd,
            true
          );
        } else {
          // Add Touch Listener
          swipeFrontElement[i].removeEventListener(
            "touchstart",
            this.handleGestureStart,
            true
          );
          swipeFrontElement[i].removeEventListener(
            "touchmove",
            this.handleGestureMove,
            true
          );
          swipeFrontElement[i].removeEventListener(
            "touchend",
            this.handleGestureEnd,
            true
          );
          swipeFrontElement[i].removeEventListener(
            "touchcancel",
            this.handleGestureEnd,
            true
          );

          // Add Mouse Listener
          swipeFrontElement[i].removeEventListener(
            "mousedown",
            this.handleGestureStart,
            true
          );
        }
      }
    }.bind(this);

    function updateSwipeRestPosition() {
      if (!initialTouchPos) return;
      var differenceInX = initialTouchPos.x - lastTouchPos.x;
      var differenceInY = initialTouchPos.y - lastTouchPos.y;
      currentXPosition = currentXPosition - differenceInX;
      currentYPosition = currentYPosition - differenceInY;

      // Go to the default state and change
      var newState = [...STATE_DEFAULT];
      // Check if we need to change state to left or right based on slop value
      for (let i of [0, 1]) {
        if (
          Math.abs(i === 0 ? differenceInX : differenceInY) >
          (i === 0 ? slopValueX : slopValueY)
        ) {
          if (currentState[i] === STATE_DEFAULT[i]) {
            if ((i === 0 ? differenceInX : differenceInY) > 0) {
              newState[i] = STATE_LEFT_SIDE;
            } else {
              newState[i] = STATE_RIGHT_SIDE;
            }
          } else {
            if (
              currentState[i] === STATE_LEFT_SIDE &&
              (i === 0 ? differenceInX : differenceInY) > 0
            ) {
              newState[i] = STATE_DEFAULT[i];
            } else if (
              currentState[0] === STATE_RIGHT_SIDE[i] &&
              (i === 0 ? differenceInX : differenceInY) < 0
            ) {
              newState[i] = STATE_DEFAULT[i];
            }
          }
        } else {
          newState[i] = currentState[i];
        }
      }

      changeState(newState);

      animatedElement.style.transition = "all 150ms ease-out";
    }

    function changeState(newState) {
      const currentPosition = [0, 0];
      for (let i of [0, 1]) {
        switch (newState[i]) {
          case STATE_DEFAULT[i]:
            currentPosition[i] = 0;
            break;
          case STATE_LEFT_SIDE:
            currentPosition[i] = -(itemWidth - handleSize);
            break;
          case STATE_RIGHT_SIDE:
            currentPosition[i] = itemWidth - handleSize;
            break;
          default:
            break;
        }
      }
      if (reset[0]) {
        newXTransform = "0px";
      }
      if (reset[1]) {
        newXTransform = "0px";
      }
      if (reset[0] || reset[1]) {
        const transformStyle = `translateX(${newXTransform}) translateY(${newYTransform})`;
        animatedElement.style.msTransform = transformStyle;
        animatedElement.style.MozTransform = transformStyle;
        animatedElement.style.webkitTransform = transformStyle;
        animatedElement.style.transform = transformStyle;
      }
      newState = callback(newState) || [];
      if (newState.filter((x) => [-1, 0, 1].includes(x)).length !== 2)
        newState = [0, 0];
      if (newState[0] === 0) currentXPosition = 0;
      if (newState[1] === 0) currentYPosition = 0;
      currentState = newState;
      if (JSON.stringify(newState) === JSON.stringify([0, 0]) && allowClick) {
        const el = document.elementFromPoint(
          initialTouchPos.x,
          initialTouchPos.y
        );
        el && el.click && el.click();
      }
    }

    function getGesturePointFromEvent(evt) {
      var point = {};

      if (evt.targetTouches) {
        point.x = evt.targetTouches[0].clientX;
        point.y = evt.targetTouches[0].clientY;
      } else {
        // Either Mouse event or Pointer Event
        point.x = evt.clientX;
        point.y = evt.clientY;
      }
      return point;
    }

    /* // [START on-anim-frame] */
    function onAnimFrame() {
      if (!rafPending) {
        return;
      }
      var differenceInX = animate[0] ? initialTouchPos.x - lastTouchPos.x : 0;
      var differenceInY = animate[1] ? initialTouchPos.y - lastTouchPos.y : 0;
      if ((max[0] && Math.abs(differenceInX) < max[0]) || !max[0]) {
        newXTransform = currentXPosition - differenceInX + "px";
      }
      if ((max[1] && Math.abs(differenceInY) < max[1]) || !max[1]) {
        newYTransform = currentYPosition - differenceInY + "px";
      }

      const transformStyle =
        "translateX(" + newXTransform + ") translateY(" + newYTransform + ")";
      animatedElement.style.webkitTransform = transformStyle;
      animatedElement.style.MozTransform = transformStyle;
      animatedElement.style.msTransform = transformStyle;
      animatedElement.style.transform = transformStyle;

      rafPending = false;
    }
    /* // [END on-anim-frame] */

    /* // [START addlisteners] */
    // Check if pointer events are supported.
    for(let i = 0;i < swipeFrontElement.length; i++){
      if (window.PointerEvent) {
      // Add Pointer Event Listener
        swipeFrontElement[i].addEventListener(
          "pointerdown",
          this.handleGestureStart,
          true
        );
        swipeFrontElement[i].addEventListener(
          "pointermove",
          this.handleGestureMove,
          true
        );
        swipeFrontElement[i].addEventListener(
          "pointerup",
          this.handleGestureEnd,
          true
        );
        swipeFrontElement[i].addEventListener(
          "pointercancel",
          this.handleGestureEnd,
          true
        );
      } else {
      // Add Touch Listener
      swipeFrontElement[i].addEventListener(
        "touchstart",
        this.handleGestureStart,
        true
      );
      swipeFrontElement[i].addEventListener(
        "touchmove",
        this.handleGestureMove,
        true
      );
      swipeFrontElement[i].addEventListener(
        "touchend",
        this.handleGestureEnd,
        true
      );
      swipeFrontElement[i].addEventListener(
        "touchcancel",
        this.handleGestureEnd,
        true
      );

      // Add Mouse Listener
      swipeFrontElement[i].addEventListener(
        "mousedown",
        this.handleGestureStart,
        true
      );
    }
  }
    /* // [END addlisteners] */
  }}

  var swipeRevealItems = [];

  window.onload = function() {
    "use strict";
    var swipeRevealItemElements = document.querySelectorAll(".swipe-element");
    for (var i = 0; i < swipeRevealItemElements.length; i++) {
      swipeRevealItems.push(new SwipeRevealItem(swipeRevealItemElements[i]));
    }

    // We do this so :active pseudo classes are applied.
    window.onload = function() {
      if (/iP(hone|ad)/.test(window.navigator.userAgent)) {
        document.body.addEventListener("touchstart", function() {}, false);
      }
    };
  };

  window.onresize = function() {
    "use strict";
    for (var i = 0; i < swipeRevealItems.length; i++) {
      swipeRevealItems[i].resize();
    }
  };
};