const  network={
  getMovieList:function(params){
  //  top20电影
  wx.request({
    //  豆瓣电影接口
     url: 'https://api.rixingyike.com/doubanapiv2/movie/top250?start=0&count=10',
     success:function(res){
      // console.log(res)
       var   movies = res.data.subjects;
        if(params && params.success){
          params.success(movies)
        }
     }
 })
},
getTvList:function(params){
      //  正在热映的电影
      wx.request({
        //  豆瓣电影接口
         url: 'https://api.rixingyike.com/doubanapiv2/movie/in_theaters?start=0&count=10',
         success:function(res){
          // console.log(res)
           var   tvs = res.data.subjects;
           if(params && params.success){
            params.success(tvs)
          }
         }
     });
     } ,

getShowList: function(params){
      wx.request({
        //  豆瓣电影接口
         url: 'https://api.rixingyike.com/doubanapiv2/movie/coming_soon?start=0&count7',
         success:function(res){
          // console.log(res)
           var   shows = res.data.subjects;
           if(params && params.success){
            params.success( shows)
          }
         },
     })
}
}

export  {network}