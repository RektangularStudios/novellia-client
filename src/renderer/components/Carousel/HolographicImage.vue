<template>
  <canvas
    v-if="show"
    id="canvas"
    ref="canvas"
    class="canvas"
    @mousemove="mouseMove"
    @mouseleave="mouseLeaveTimer"
    @mouseenter="mouseEnter"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
    @touchcancel="touchEnd"
  />
  <img
    v-else
    :src="src"
    class="image"
  >
</template>

<script>
import { onMounted, ref, onUnmounted } from "vue";

export default {
  props:{
    angle:{
      required : false,
      type : Number,
      default : 120
    },
    hexColor1:{
      requied : false,
      type : String,
      default : "#220b27",
    },
    hexColor2:{
      required : false,
      type : String,
      default : "#220b27"
    },
    transparency:{
      required : false,
      type : Number,
      default : 0.13
    },
    show:{
      required : false,
      type : Boolean,
      default : true
    },
    src:{
      required : false,
      type : String,
      default : ""
    },
  },
  setup( props ) {
    let canvas = ref(null);
    let timer = "";
    const color1RGB = hexToRgb(props.hexColor1);
    const color2RGB = hexToRgb(props.hexColor2);
    const mix = mixColors(0.5);
    const ifDeg = Math.abs(props.angle % 360);
    let canRotateBrowser = "onorientationchange" in window;
    let ctx;
    let wrh;
    let point1;
    let point2;

    if((ifDeg <=45 && ifDeg >=0) || (ifDeg >=135 && ifDeg<=225) || (ifDeg >= 315 && ifDeg <=360)){
      point1 = {x : (1-Math.tan(props.angle*Math.PI/180))/2, y : 0};
      point2 = {x : (1+Math.tan(props.angle*Math.PI/180))/2, y : 1};
    }
    else{
      point1 = {x : 0, y : (1-Math.tan((90-props.angle)*Math.PI/180))/2};
      point2 = {x : 1, y : (1+Math.tan((90-props.angle)*Math.PI/180))/2};
    }


    const len = Math.sqrt(Math.pow(point2.x - point1.x,2) + Math.pow(point2.y + point1.y,2),2);
    let multiplier = 0.5;
    let image = new Image();


    function mouseMove(event){
      var xLoc = event.clientX;
      var yLoc = event.clientY;
      var height = event.currentTarget.clientHeight;
      var width = event.currentTarget.clientWidth;
      var tx = ((2*(xLoc/width)-1)*15);
      var ty = ((2*(yLoc/height)-1)*15);
      var style = "rotateX(" + tx + "deg) rotateY(" + ty + "deg)";
      var e1 = {x : point2.x - point1.x, y : point2.y - point1.y};
      var e2 = {x : xLoc/width - point1.x, y : yLoc/height - point1.y};
      var val = e1.x * e2.x + e1.y * e2.y; 
      var len2 = e1.x * e1.x + e1.y * e1.y;
      var p = {x : (point1.x + (val * e1.x) / len2), y : (point1.y + (val * e1.y) / len2)};
      multiplier = 1 - (Math.sqrt(Math.pow(p.x - point1.x,2) + Math.pow(p.y - point1.y,2),2)/len);
      if(multiplier < 0){multiplier = 0;}
      if(multiplier > 1){multiplier = 1;}
      event.currentTarget.style.transform = style;
      event.currentTarget.style.webkitTransform = style;
      event.currentTarget.style.mozTransform = style;
      event.currentTarget.style.msTransform = style;
      event.currentTarget.style.oTransform = style;
        
    }
    function mouseLeaveTimer(event){
      setTimeout(mouseLeave(event),100);
    }
    function mouseLeave(event){
      multiplier = 0.5;
      var style = "rotateX(" + 0 + "deg) rotateY(" + 0 + "deg)";   
      event.currentTarget.style.transform = style;
      event.currentTarget.style.webkitTransform = style;
      event.currentTarget.style.mozTransform = style;
      event.currentTarget.style.msTransform = style;
      event.currentTarget.style.oTransform = style;
      animate(false);
    }
    function mouseEnter(){
      animate(true);   
    }
    
    function touchStart(event){
      if(!canRotateBrowser){
        animate(true);
      }
  
    }
    function touchMove(event){
      if(!canRotateBrowser){
        var xLoc = event.touches[0].clientX;
        var yLoc = event.touches[0].clientY;
        var height = event.currentTarget.clientHeight;
        var width = event.currentTarget.clientWidth;
        var tx = ((2*(xLoc/width)-1)*15);
        var ty = ((2*(yLoc/height)-1)*15);
        var style = "rotateX(" + tx + "deg) rotateY(" + ty + "deg)";
        var e1 = {x : point2.x - point1.x, y : point2.y - point1.y};
        var e2 = {x : xLoc/width - point1.x, y : yLoc/height - point1.y};
        var val = e1.x * e2.x + e1.y * e2.y; 
        var len2 = e1.x * e1.x + e1.y * e1.y;
        var p = {x : (point1.x + (val * e1.x) / len2), y : (point1.y + (val * e1.y) / len2)};
        multiplier = 1 - (Math.sqrt(Math.pow(p.x - point1.x,2) + Math.pow(p.y - point1.y,2),2)/len);
        if(multiplier < 0){multiplier = 0;}
        if(multiplier > 1){multiplier = 1;}
        event.currentTarget.style.transform = style;
        event.currentTarget.style.webkitTransform = style;
        event.currentTarget.style.mozTransform = style;
        event.currentTarget.style.msTransform = style;
        event.currentTarget.style.oTransform = style;
      }
    }
    function touchEnd(event){
      if(!canRotateBrowser){
        setTimeout(mouseLeave(event),100);
      }
    }
   
    
    function mixColors(multiplier){
      var red = Math.abs(color1RGB.r+(color2RGB.r-color1RGB.r)*multiplier);
      var blue = Math.abs(color1RGB.b+(color2RGB.b-color1RGB.b)*multiplier);
      var green = Math.abs(color1RGB.g+(color2RGB.g-color1RGB.g)*multiplier);
      return rgbToHex(red,green,blue);
    }
    function transparencyToHex(transparency){
      return Math.floor(255*transparency).toString(16);
    }
    function hexToRgb(hex){
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
    function rgbToHex(r,g,b){
      var red = toHex(r);
      var green = toHex(g);
      var blue = toHex(b);
      return "#"+red+green+blue;
    }
    
    
    function toHex(rgb) { 
      var hex = Number(rgb).toString(16);
      var dotLoc = hex.indexOf(".");
        
      if (hex.length < 2 || (dotLoc <2 && dotLoc > -1) ) {
        hex = "0" + hex;
      }
      return hex.slice(0,2);
    }

    function animate(isSelected){
      if(isSelected){
        timer = setInterval(refresh,33);
      }
      if(!isSelected){
        clearInterval(timer);
      }
    }

    onUnmounted(()=>{
      window.removeEventListener("resize", refresh);
      if(canRotateBrowser){window.addEventListener("deviceorientation", rotateScreenHandler, true);}
    });
    
    function bound(value){
      if(value < 0){
        return 0;
      }
      if(value > 1){
        return 1;
      }
      return value;
    }
    
    function initalize(){
      ctx = canvas.value.getContext("2d");
      const parentSize = canvas.value.parentNode.getBoundingClientRect();
      const width = canvas.value.offsetWidth > parentSize.width * 0.9 ? parentSize.width * 0.9 : canvas.value.offsetWidth;
      const height = canvas.value.offsetHeight > parentSize.height  * 0.9 ? parentSize.height * 0.9 : canvas.value.offsetHeight;

      wrh = image.width / image.height;

      var newWidth = width;
      var newHeight = newWidth / wrh;
      
      if (newHeight > height) {
        newHeight = height;
        newWidth = newHeight * wrh;
      }

      canvas.value.height = newHeight;
      canvas.value.width = newWidth;
      canvas.value.style.height = newHeight;
      canvas.value.style.width = newWidth;
      
      ctx.filter = "brightness("+ (Math.abs(Math.abs(2 * multiplier - 1) - 1) + 1) * 100 +"%)";

      ctx.drawImage(image,0,0, newWidth , newHeight);
      var gradient = ctx.createLinearGradient(point1.x * newWidth, 
        point1.y*newHeight, point2.x * newWidth, point2.y * newHeight);

      gradient.addColorStop(0, props.hexColor1 + transparencyToHex(bound(props.transparency)));
      gradient.addColorStop(bound(1-multiplier-0.1), mix + transparencyToHex(bound(props.transparency)));
      gradient.addColorStop(bound(1-multiplier-0.06), "#9400D3" + transparencyToHex(bound(props.transparency - 0.06)));
      gradient.addColorStop(bound(1-multiplier-0.04), "#4B0082" +transparencyToHex(bound(props.transparency - 0.04)));
      gradient.addColorStop(bound(1-multiplier-0.02), "#0000FF" + transparencyToHex(bound(props.transparency - 0.02)));
      gradient.addColorStop(bound(1-multiplier), "#00FF00" + transparencyToHex(bound(props.transparency)));
      gradient.addColorStop(bound(1-multiplier+0.02), "#FFFF00" + transparencyToHex(bound(props.transparency - 0.02)));
      gradient.addColorStop(bound(1-multiplier+0.04), "#FF7F00" + transparencyToHex(bound(props.transparency - 0.04)));
      gradient.addColorStop(bound(1-multiplier+0.06), "#FF0000" + transparencyToHex(bound(props.transparency - 0.06)));
      gradient.addColorStop(bound(1-multiplier+0.1), mix + transparencyToHex(bound(props.transparency))); 
      gradient.addColorStop(1, props.hexColor2 + transparencyToHex(bound(props.transparency))); 
      ctx.fillStyle = gradient;
      ctx.fillRect(0,0,newWidth,newHeight);
      if(canRotateBrowser){window.addEventListener("deviceorientation", rotateScreenHandler);};
      window.addEventListener("resize", refresh);
    }
    
    function rotateScreenHandler(event){
      const angleRotationMultiplier = (Math.cos(props.angle * Math.PI / 180) * event.beta + Math.sin(props.angle * Math.PI / 180) * event.gamma + 360) / 720;
      if(angleRotationMultiplier < 0){angleRotationMultiplier = 0;}
      if(angleRotationMultiplier > 1){angleRotationMultiplier = 1;}
      multiplier = angleRotationMultiplier;
    }
    
    function refresh(){
      const parentSize = canvas.value.parentNode.getBoundingClientRect();
      const width = canvas.value.offsetWidth > parentSize.width * 0.9 ? parentSize.width * 0.9 : canvas.value.offsetWidth;
      const height = canvas.value.offsetHeight > parentSize.height * 0.9 ? parentSize.height * 0.9 : canvas.value.offsetHeight;
     
      var newWidth = width;
      var newHeight = newWidth / wrh;

      if (newHeight > height) {
        newHeight = height;
        newWidth = newHeight * wrh;
      }
 
      canvas.value.height = newHeight;
      canvas.value.width = newWidth;
      canvas.value.style.height = newHeight;
      canvas.value.style.width = newWidth;
      ctx.filter = "brightness("+ (Math.abs(Math.abs(2 * multiplier - 1) - 1) + 1) * 100 +"%)";
      ctx.clearRect(0,0,image.width,image.height);
      ctx.drawImage(image,0,0, newWidth , newHeight);
      var gradient = ctx.createLinearGradient(point1.x * newWidth, 
        point1.y*newHeight, point2.x * newWidth, point2.y * newHeight);
      gradient.addColorStop(0, props.hexColor1 + transparencyToHex(bound(props.transparency)));
      gradient.addColorStop(bound(1-multiplier-0.1), mix + transparencyToHex(bound(props.transparency)));
      gradient.addColorStop(bound(1-multiplier-0.06), "#9400D3" + transparencyToHex(bound(props.transparency - 0.06)));
      gradient.addColorStop(bound(1-multiplier-0.04), "#4B0082" +transparencyToHex(bound(props.transparency - 0.04)));
      gradient.addColorStop(bound(1-multiplier-0.02), "#0000FF" + transparencyToHex(bound(props.transparency - 0.02)));
      gradient.addColorStop(bound(1-multiplier), "#00FF00" + transparencyToHex(bound(props.transparency)));
      gradient.addColorStop(bound(1-multiplier+0.02), "#FFFF00" + transparencyToHex(bound(props.transparency - 0.02)));
      gradient.addColorStop(bound(1-multiplier+0.04), "#FF7F00" + transparencyToHex(bound(props.transparency - 0.04)));
      gradient.addColorStop(bound(1-multiplier+0.06), "#FF0000" + transparencyToHex(bound(props.transparency - 0.06)));
      gradient.addColorStop(bound(1-multiplier+0.1), mix + transparencyToHex(bound(props.transparency))); 
      gradient.addColorStop(1, props.hexColor2 + transparencyToHex(bound(props.transparency))); 
      ctx.fillStyle = gradient;
      ctx.fillRect(0,0,newWidth,newHeight);
    }
    onMounted(() => {
      if(props.show){
        image.onload = initalize;
        image.src = props.src;
      }

    });
  
    return {mouseEnter,mouseLeaveTimer,mouseMove,canvas,touchStart,touchMove,touchEnd};
  }
};
</script>

<style lang="scss" scoped>
.canvas{
  object-fit: scale-down;
  mix-blend-mode:screen;
}
.image{
  object-fit: contain;
}

</style>
