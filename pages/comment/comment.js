// pages/comment/comment.js

import  {network}  from  "../../utils/network.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      total:0,
      start:1,
      count:20
  },
  /**
   * 生命周期函数--监听页面加载
   */
onLoad: function (options) {
     var  that=this;
    that.setData(options);
    // 传入的为第一页
    that.getComments(1);
  },
// 传入一个start参数
getComments:function(start){
var  that= this;
var type  = that.data.type;
var  id = that.data.id;
// loading判断用户点击是上一页还是下一页
if(start>that.data.start){
  that.setData({
    nextLoading:true
  });
}else{
  that.setData({
    preLoading:true
  });
}
  network.getItemComments({
    type:type,
    id:id,
    start:start,
    count:20,
    success:function(data){
      var  total = data.total;
      var  comments = data.interests;
      that.setData({
        total:total,
        comments:comments,
        start:start,
        // 数据请求完毕loading关闭
        preLoading:false,
        nextLoading:false
      });
      // 优化，点击下一页或上一页返回为最上面
        wx.pageScrollTo({
          scrollTop: 0,
        })
    }
  })
},
// 返回上一页
  onItemTapEvent:function(event){
    wx.navigateBack({})
  },
// 上一页
  onPrePageTap:function(event){
    var  that= this;
    var  oldStar= that.data.start;
    var count = that.data.count;
    if(oldStar-count>0){
        var  start =  oldStar-count; 
        that.getComments(start);
    }
  },
  // 下一页
  onNextPageTap:function(event){
      var  that=this;
      var oldStart = that.data.start;
      var  start = oldStart+that.data.count;
      that.getComments(start);
  }
})