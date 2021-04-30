import  {globalurls}  from "urls.js"

const  network={
  // 获取电影列表
  getMovieList:function(params){
params.type= "movie";
this.getItemList(params);
},
// 获取电视剧列表
getTVList:function(params){
    params.type= "tv";
    this.getItemList(params);
     } ,
// 获取综艺列表
getShowList: function(params){
    params.type= "show";
    this.getItemList(params);
},

// 获取item列表 params获取传递参数type
getItemList:function(params){
  // 获取不同url
  var  url="";
  if(params.type === "movie"){
    url= globalurls.movieList;
  }else  if(params.type==="tv"){
    url = globalurls.tvList;
  }else{
    url= globalurls.showList;
  }
  var count = params.count ? params.count : 7;
  wx.request({
    //  豆瓣电影接口
     url: url,
     data:{
       count:count
     },
     success:function(res){
    // item代表所有的项
       var   items =res.data.subject_collection_items;
       var  itemsCount = items.length;
       var  left = itemsCount%3;
       if(left===2){
         items.push(null);
       }
       if(params && params.success){
        //  将items传出
        params.success( items)
      }
     },
 });
},

// 电影详情页面获取
      getItemDetail:function(params){
        var  type  = params.type;
        var  id= params.id;
        var  url= "";
        if(type=== 'movie'){
            url  = globalurls.movieDetail +id;
        }else  if(type==='tv'){
            url  = globalurls.tvDetail  +id;
        }else{
            url = globalurls.showDetail  + id; 
        }
        wx.request({
          url: url,
          success:function(res){
            var item = res.data;
            if(params.success){
              params.success(item);
            }
          }
        })
      },
// 标签获取
      getItemTags:function(params){
        var  type  = params.type;
        var  id= params.id;
        var  url= "";
          if(type === 'movie'){
            url = globalurls.movieTags(id);
          }else  if(type === 'tv'){
            url = globalurls.tvTags(id);
          }else{
            url  = globalurls.showTags(id);
          }
          wx.request({
            url:url,
            success:function(res){
              // console.log(res);
              var  tags = res.data.tags;
              if(params.success){
                params.success(tags);
              }
            }
          })
      },

      // 获取短评
      getItemComments:function(params){
        var  type =params.type;
        var  id= params.id;
        var  start = params.start?params.start:0;
        var count  = params.count?params.count:3;
        var  url="";
        if(type === 'movie'){
          url = globalurls.movieComments(id,start,count);
        }else  if(type ==='tv'){
          url = globalurls.tvComments(id,start,count);
        }else{
          url  =globalurls.showComments(id,start,count);
        }
        wx.request({
          url:url,
          success:function(res){
           var  data  =res.data;
           if(params.success){
             params.success(data);
           }
          }
        })
      },
      // 搜索item
      getSearch:function(params){
          var q =params.q;
          var  url = globalurls.searchUrl(q);
          wx.request({
            url: url,
            success:function(res){
              // console.log(res);
              var  subjects = res.data.subjects;
              if (params.success){
                params.success(subjects);
              }
            }
          })
      }

}

export  {network}