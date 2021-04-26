import  {network}  from  "network.js"

Page({
  /*
  *页面初始数据
  */
 data:{

 },
/*
*生命周期函数-监听页面加载
*/
onLoad:function(options){
  // that方便后期使用当前Page对象
   var  that = this;
    // 电影
    network.getMovieList({
      success: function(movies){
        that.setData({
          movies:movies
        })
      }
    })
    //  正在热映的电影
    network.getTvList({
      success:function(tvs){
        that.setData({
          tvs:tvs
        })
      }
    })
  //  即将上映的电影
  network.getShowList({
    success:function(shows){
      that.setData({
       shows:shows
      })
    }
  })
}
})