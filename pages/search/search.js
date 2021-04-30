// pages/search/search.js
import  {network}  from   "../../utils/network"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        // wx.getStorage({
        //   key: 'searched',
        //   success:function(res){
        //     console.log(res)
        //   }
        // })
  },
  onSearchInputEvent:function(event){
    var  that= this;
    // console.log(event)
    var  value = event.detail.value;
    network.getSearch({
      q:value,
      success:function(subjects){
            that.setData({
              subjects:subjects
            })
      }
    })
  },
  onItemTapEvent:function(event){
    // console.log(event)
    var id = event.currentTarget.dataset.id;
  // 跳转到某一个页面
    wx.navigateTo({
      url: '/pages/detail/detail?type=movie&id='+id,
    })

    // var title = event.currentTarget.dataset.title;
    // wx.setStorage({
    //   key: 'searched',
    //   data:[{id:id,title:title}] ,  
      
    //   success:function(){
    //   console.log("保存成功！")
    // }
    // })
  }
 
})