// components/stars/stars.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  rate:{
        type:Number,
        value:0
      }, 
  starsize:{
    type:Number,
    value:20 //rpx
  },
  fontsize:{
    type: Number,
    value:20 //rpx
  },
  fontcolor:{
    type:String,
    value:"#ccc"
  }
  },


  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  lifetimes:{
    attached:function(){
      var  that = this;
      var  rate= that.properties.rate;
      var  inRate = parseInt(rate);
      var  light = parseInt(rate/2);
      var  half = inRate%2;
      var  gray  = 5-light-half;
      var lights = [];
      var  halfs = [];
      var  grays = [];
      // for循环遍历存放到数组中
      for(var  index=1;index<=light;index++){
        lights.push(index);
      }
      for(var  index=1;index<=half;index++){
        halfs.push(index);
      }
      for(var  index=1;index<=gray;index++){
        grays.push(index);
      }
      // 评分设置
     var   ratetext = rate && rate>0?rate.toFixed(1):"未评分"
      //数组获取到后 修改 data 中的值
      that.setData({
        lights:lights,
        halfs:halfs,
        grays:grays,
        ratetext:ratetext,
      });
    }
  }
})
