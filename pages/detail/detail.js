// pages/detail/detail.js

import  {network}  from  "../../utils/network"

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
    var that  =this;
         var  type =options.type;
         var  id=options.id;
         that.setData({
           id:id,
           type:type
         })
         network.getItemDetail({
           type:type,
           id:id,
           success:function(item){
             var  genres= item.genres;
            //  ["1","2","3"].join("/")
            genres = genres.join("/");
            item.genres = genres;

            var   actors = item.actors;
            var  actorNames = [];
            if(actors.length>3){
              actors = actors.slice(0,3);
            }
            for(var  index = 0;index<actors.length;index++){
              var  actor  = actors[index];
              actorNames.push(actor.name);
            }
            actorNames = actorNames.join("/");

            var  director  = item.directors[0].name;
            var  authors = director+"(导演)/"+actorNames;
            item.authors = authors;

             that.setData({
               item:item
             })
            // console.log(item)
           }
         });
         network.getItemTags({
           type :type,
           id:id,
           success:function(tags){
              that.setData({
                tags: tags
              })
           }
         })

        //  获取评论
        network.getItemComments({
          type:type,
          id:id,
          success:function(data){
            var  totalComment = data.total;
            var  comments= data.interests;
            that.setData({
              totalComment:totalComment,
              comments:comments
            })
            // console.log(data)
          }
        })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      wx.pageScrollTo({
        scrollTop:0,
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})