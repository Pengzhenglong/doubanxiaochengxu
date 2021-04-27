import  {globalurls}  from "urls.js"

const  network={
  getMovieList:function(params){
params.type= "movie";
this.getItemList(params);
},
getTVList:function(params){
    params.type= "tv";
    this.getItemList(params);
     } ,

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
}
}

export  {network}