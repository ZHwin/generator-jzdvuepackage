<template>
  <div :style="{lineHeight:(parseFloat(circleStyle.diameter)-parseFloat(circleStyle.borderWidth)*2)+'px',
                display:'inline-block',
                   textAlign:'center',
                   color:circleStyle.fontColor,
                   fontWeight:circleStyle.fontWeight,
                   fontSize:circleStyle.fontSize,
                   backgroundColor:circleStyle.bgColor,
                   width:circleStyle.diameter,
                   borderWidth:circleStyle.borderWidth,
                   borderStyle:'solid',
                   borderColor:circleStyle.borderColor,
                   height:circleStyle.diameter,
                   borderRadius:parseFloat(circleStyle.diameter)/2+'px'}">{{value}}
  </div>
</template>

<script src="./positive_circle.js"></script>
