---
title: 豆瓣小程序&入门&搜索栏的实现&评分星星布局
index_img: /image/16.PNG
date: 2021-04-20 20:15:58
tags: 
- WX
- 小程序
categories:
- WX

---
微信小程序由于适用性强、逻辑简要、开发迅速的特性，叠加具有海量活跃用户的腾讯公司背景，逐渐成为了轻量级单一功能应用场景的较佳承载方式，诸如电影购票、外卖点餐、移动商城、生活服务等场景服务提供商迅速切入了。       
前段时间学习了一个微信小程序，将所学的html,css,js一起运用学习，下面是记录我的开发过程。

---

### 初始化
下载微信开发者工具新建一个微信小程序即可,会出现以下目录结构：
```
- project.config.json：项目的配置文件。比如设置项目的名字，设置appid等。
- app.js：小程序逻辑处理。比如小程序加载完成执行的代码。
- app.json：小程序公共配置。比如小程序的页面，是否有tabbar等。
- app.wxss：小程序公共样式。在这个里面写的样式可以被所有页面使用。
- pages：存储小程序页面的。
- index：页面的名称
- index.js：index页面的逻辑处理文件。
- index.json：index页面的配置文件。
- index.wxml：index页面的页面结构。
- index.wxss：index页面的样式。
- 其他页面
```

![目录结构](/image/16.1.PNG)

修改app.json文件全局配置

```
  "window":{
    "backgroundTextStyle":"light",
    "navigationBarBackgroundColor": "#41be57",
    "navigationBarTitleText": "豆瓣评分",
    "navigationBarTextStyle":"white"
  },
```
### 微信小程序组件封装
相信大家在开发小程序时会遇到某个功能多次使用的情况，比如弹出框。这个时候大家首先想到的是组件化开发，就是把弹出框封装成一个组件，然后哪里使用哪里就调用。


### 搜索栏的实现1--主页search

因为搜索栏会在多处使用，所以把它做成组件是最好的，这样可以多处使用，实现代码的优化。

![新建组件](/image/16.2.png)

1. 分析：搜索框由两部分组成，即外盒子和搜索框组成
2. 在主页的时候是导航栏，在搜索页面的时候是搜索框。

![搜索框](/image/16.3.png)


2. searchbar.wxml/.wxss代码实现

```
<view  class="searchbar">
<!-- 导航栏 -->
<navigator    url='/pages/search/search'  class="search-navigator"></navigator>
<input class='search-input'  placeholder="搜索"></input>
</view>
<!-- 这里一保存ctrl+s就会自动生成/pages/search/search文件了 -->

```

```
.searchbar{
  background-color: #41be57;
  padding: 20rpx;
}
.search-navigator{
  width: 100%;
  height: 60rpx;
  background:#fff;
  border-radius:  10rpx;

  <!-- 本地图片资源无法通过wxss获取，可以通过网络图片，或者base64，或者</image>标签  这里我们使用网络转换的base图片 -->

  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAPA0lEQVR4Xu2dj5UUNxLGpQgMERhHwBKBrUnAEIFxBOYiOByBIQKvIzBOYAQR3F4EhyM4iED3Pq/mPDvsTFep1b3qqq/f4wFvJc3qK/2mVKU/HQMfKkAFzioQqQ0VoALnFSAgHB1U4IICBITDgwoQEI4BKtCmAD1Im26s5UQBAuLE0OxmmwIEpE031nKiAAFxYmh2s00BAtKmG2s5UYCAODE0u9mmAAFp0421nChAQJwYmt1sU4CAtOnGWk4UICBO.....省略");

  background-position: center center;
  background-repeat: no-repeat;
  background-size: 8%;
}
```


3. 组件被使用(在首页中使用)在index.json文件中注册

```
{
  "usingComponents": {
    "searchbar":"/components/searchbar/searchbar",
  }
}
```


4. 组件的使用

index.html中代码

```
<searchbar></searchbar>
```
### 搜索栏的实现2---search页面

1. 使用组件

```
{
  "usingComponents": {
    "searchbar":"/components/searchbar/searchbar"
  }
}
```
![组件的注册](/image/16.4.png)

2. 组件使用
   
search.wxml中代码

```
<searchbar></searchbar>
```

3. 搜索页面searchbar.wxml


将导航组将navigator添加到组件的属性列表

![添加属性](/image/16.5.png)

```
<view  class="searchbar">

<!--根据导航组件进行不同的渲染 -->

<navigator  wx:if="{{isnavigator}}"  url='/pages/search/search'  class="search-navigator"></navigator>

<view wx:else class="search-input-group">
<input class='search-input'  placeholder="搜索"></input>
</view>
</view>

```
首页index.wxml  
```
<searchbar  isnavigator="{{true}}"></searchbar>
```

搜索框样式

```
.search-input-group{
  width: 100%;
  height: 60rpx;
  background:#fff;
  border-radius: 10rpx;
  border-radius:10rpx;
  padding:10rpx 20rpx;
  box-sizing: border-box;
}
.search-input{
  min-height: 40rpx;
  height: 40rpx;
  font-size: 12px;
}
```
### 电影模块布局

1. 分析：为一个模块而不是一个盒子，因为下面的是一样的模块，所以后面可以复用。

wxml
```
    <view class="module-group">
      <view class="module-top">
        <view class="module-title">正在热映电影</view>
        <navigator class="module-more">更多</navigator>
      </view>
      <scroll-view class="module-scroll-view" scroll-x="{{true}}">
        <navigator
          wx:for="{{tvs}}"
          wx:key="{{item-title}}"
          class="item-navigator"
        >
          <view class="item-group">
            <view class="thumbnail-group">
              <image class="thumbnail" src="{{item.images.small}}"></image>
            </view>
            <view class="item-title">{{item.title}}</view>
            <stars rate="{{item.rating.average}}"></stars>
          </view>
        </navigator>
      </scroll-view>
    </view>
```

wxss

```
/* 最大模块 */
.module-group{
  padding: 40rpx;
  background-color: #fff;
}
/* 顶部电影 更多flex布局 */
.module-group .module-top{
  font-size: 36rpx;
  display: flex;
  /* 主轴元素贴两边 */
  justify-content: space-between;
}
/* title字体颜色设置 */
.module-top .moudle-title{
  color:#494949;
}
/* more颜色设置 */
.module-top .module-more{
  color: #41be57;
}

.module-scroll-view{
  margin-top: 40rpx;
  width: 100%;
  height:400rpx;
  /* 设置横向滚动 */
  white-space: nowrap;
}
.module-scroll-view .item-navigator{
  width:200rpx;
  margin-right: 20rpx;
  display: inline-block;
}
/* 最后一个的右边距 对齐 */
.module-scroll-view .item-navigator:last-of-type{
  margin-right: 0;
}
.item-navigator  .item-group{
  width: 100px;
}
.item-group .item-title{
  font-size: 28rpx;
  text-align: center;
  margin-top: 20rpx;
  /* 文本过长处理 */
  text-overflow:ellipsis;
  overflow: hidden;
}

```

![css作用效果例图](/image/16.7.png)

补充：

scroll-view：
有时候我们的一些视图在手机指定的宽度和高度不够存放。那么可以放在 scroll-view 中。
设置横向滚动：
1. 给 scroll-view 添加 scroll-x="true" 属性。
2. 给 scroll-view 添加 white-space:nowrap; 样式。
3. 给 scroll-view 中的子元素设置为 display:inline-block; 。


### 评分星星布局1--初始化固定样式

wxml
```
    <view class="rate-group">
      <image wx:for="{{1,2,3}}" src="/imags/rate_light.png"></image>
      <image src="/imags/rate_half.png"></image>
      <image src="/imags/rate_gray.png"></image>
      <text>8.0</text>
    </view>
```

图片来源本地

![星星图片](/image/16.6.png)

wxss

```
.rate-group{
  display: flex;
  justify-content: center;
  align-content: center;
  font-size: 20rpx;
  color:#ccc;
  margin-top:20rpx;
}
.rate-group  image{
  width: 20rpx;
  height: 20rpx;
}
```

### 评分星星布局2--组件化

#### 分析：评分的星星(高亮，半高亮，不亮星星)是通过评分数字变化的，而评分数字是变化的(不同电影)，所以我们可以将数字传进来计算星星的个数，这时候我们可以使用组件的方式。在组件当中我们定义一个属性评分，然后接收评分的数字在生命周期方法中计算星星(高亮，半高亮，不亮星星)，另一个好处是可以多处复用。

1. 创建stars组件

![创建](/image/16.8.png)

2. 将上面的wxml代码放入stars.wxml中，wxss同理


3. 在index.json中导入使用
```
{
  "usingComponents": {
    "searchbar":"/components/searchbar/searchbar",
    "stars":"/components/stars/stars",
  }
}
```
4. index.wxml中使用
```
<stars></stars>
```

#### 将数据变成活的

1. 定义属性
在stars的stars.js文件中定义星星的一些属性
```
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
```
2. 在组件的生命周期实现(attached生命周期就是你的组件一旦被加载就会被执行)

stars.js文件中的代码
```
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
```
3. 修改wxml文件中样式

```
<view class="rate-group">
<image   style="width:{{starsize}}rpx; height:{{starsize}}rpx"   wx:for="{{lights}}"    wx:key="this"   src="/imags/rate_light.png"></image>
<image   style="width:{{starsize}}rpx; height:{{starsize}}rpx"   wx:for="{{halfs}}"     wx:key="this"   src="/imags/rate_half.png"></image>
<image   style="width:{{starsize}}rpx; height:{{starsize}}rpx"    wx:for="{{grays}}"    wx:key="this"    src="/imags/rate_gray.png"></image>
<text   style="font-size:{{fontsize}}rpx;color:{{fontcolor}} ">{{ratetext}}</text>
</view>
```

补充： 生命周期：     
组件本身的生命周期：          
组件的生命周期，指的是组件自身的一些函数，这些函数在特殊的时间点或遇到一些特殊的框架事件时被自动触发。                      
其中，最重要的生命周期是 created/attached/detached ，包含一个组件实例生命流程的最主要时间点。（注意：在2.2.3基础库之前，生命周期函数写在 Component 中就可以，在 2.2.3 后应该写在 lifetimes 中。）            
1. 组件实例刚刚被创建好时， created 生命周期被触发。此时，组件数据 this.data 就是在 Component 构造器中定义的数据 data 。此时还不能调用setData 。通常情况下，这个生命周期只应该用于给组件 this 添加一些自定义属性字段。                
2. 在组件完全初始化完毕、进入页面节点树后， attached 生命周期被触发。此时， this.data 已被初始化为组件的当前值。这个生命周期很有用，绝大多数初始化工作可以在这个时机进行。                    
3. 在组件离开页面节点树后，detached 生命周期被触发。退出一个页面时，如果组件还在页面节点树中，则detached 会被触发。       
   

---
title: 豆瓣&首页布局和数据获取&首页模块重构&网络请求模块重构
index_img: /image/16.PNG
date: 2021-04-21 20:15:58
tags: 
- WX
- 小程序
categories:
- WX

---

---

###  首页布局和数据获取

1. 将电影中假的数据变成真的数据(wx.request请求Api)

首页js文件中获取，在onLoad中请求数据，这个页面一旦加载完毕就去请求

index.js
```
/*
*生命周期函数-监听页面加载
*/
onLoad:function(options){
  // that方便后期使用当前Page对象
   var  that = this;
  //  top20电影
   wx.request({
    //  豆瓣电影接口
     url: 'https://api.rixingyike.com/doubanapiv2/movie/top250?start=0&count=10',
     success:function(res){
      // console.log(res)
       var   movies = res.data.subjects;
      //  console.log(movies);
      <!-- 保存movies数据 -->
       that.setData({
         movies: movies
       });
    
     },
 })
    //  正在热映的电影
    wx.request({
      //  豆瓣电影接口
       url: 'https://api.rixingyike.com/doubanapiv2/movie/in_theaters?start=0&count=10',
       success:function(res){
        // console.log(res)
         var   tvs = res.data.subjects;
         that.setData({
           tvs:tvs
         });
       },
   }),
  //  即将上映的电影
  wx.request({
    //  豆瓣电影接口
     url: 'https://api.rixingyike.com/doubanapiv2/movie/coming_soon?start=0&count7',
     success:function(res){
      // console.log(res)
       var   shows = res.data.subjects;
       that.setData({
       shows:shows
       });
     },
 })
}
```

![数据放置,其他类型同理](/image/16.9.png)

2. 由于豆瓣Api不对外开放，以上Api是我从网上得到进行处理的，部分数据加载不出来。

3. 测试版本微信要勾选不校验合法域名才能网上获取数据

![勾选不校验合法域名](/image/16.10.png)

#### 补充  

>wx:key作用：      
如果列表中项目的位置会动态改变或者有新的项目添加到列表中，并且希望列表中的项目保持自己的特征和状态（如` <input/>` 中的输入内容， `<switch/> `的选中状态），需要使用 wx:key 来指定列表中项目的唯一的标识符。          
wx:key 的值以两种形式提供：                      
1. 字符串或者数字，代表在 for 循环的 array 中 item 的某个 property，该 property 的值需要是列表中唯一的字符串或数字，且不能动态改变。在写的时候，直接写这个 property 的名字就可以了，不需要写 item.property 的形式，并且不需要加中括号。                        
2. 保留关键字 this 代表在 for 循环中的 item 本身，这种表示需要 item 本身是一个唯一的字符串或者数字，如：当数据改变触发渲染层重新渲染的时候，会校正带有 key 的组件，*框架会确保他们被重新排序，而不是重新创建，以确保使组件保持自身的状态，并且提高列表渲染时的效率。


>setData
如果以后想要修改 data 中的值，应该使用 setData 方法。 setData 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）。注意事项：
1. 直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致。      
2. 放到 data 中的值，只能使用可以 JSON 序列化的：字符串，数字，布尔值，对象，数组。否则将不会渲染。          
3. 其中 key 可以以数据路径的形式给出，支持改变数组中的某一项或对象的某个属性，如
array[2].message ， a.b.c.d ，并且不需要在 this.data 中预先定义。    

###  首页模块重构

![首页图片](/image/16.11.png)

#### 分析：首页三个模块中90%以上的代码都是重复的，我们可以把它给重构
把不同的东西提取出来，通过变量的方式表示，将以上一个模块做成一个组件。然后做成三个属性{电影，更多，循环的movies}


![分析](/image/16.12.png)

1. 在components中新建一个indexmodules组件

将index.wxml中的代码剪切到indexmodules.wxml中

```
<view  class="module-group">
  <view   class="module-top">
    <view  class="module-title">{{title}}</view>
    <navigator  url="{{moreurl}}"  class="module-more">更多</navigator> 
   </view>
    <scroll-view class="module-scroll-view"  scroll-x="{{true}}" >
      <navigator   wx:for="{{items}}"  wx:key="{{item-title}}"        class="item-navigator">
        <view class="item-group">
          <view class="thumbnail-group">
            <image class="thumbnail" src='{{item.images.small}}'></image>
          </view>
          <view class="item-title">{{item.title}}</view>
        <stars  rate="{{item.rating.average}}" ></stars>
        </view>
      </navigator>
    </scroll-view>
  </view>
  
```
将index.wxss中的代码剪切到indexmodules.wxss中
```
/* 最大模块 */
.module-group{
  padding: 40rpx;
  background-color: #fff;
}
/* 顶部电影 更多flex布局 */
.module-group .module-top{
  font-size: 36rpx;
  display: flex;
  /* 主轴元素贴两边 */
  justify-content: space-between;
}
/* title字体颜色设置 */
.module-top .moudle-title{
  color:#494949;
}
/* more颜色设置 */
.module-top .module-more{
  color: #41be57;
}

.module-scroll-view{
  margin-top: 40rpx;
  width: 100%;
  height:400rpx;
  /* 设置横向滚动 */
  white-space: nowrap;
}
.module-scroll-view .item-navigator{
  width:200rpx;
  margin-right: 20rpx;
  display: inline-block;
}
/* 最后一个的右边距 对齐 */
.module-scroll-view .item-navigator:last-of-type{
  margin-right: 0;
}
.item-navigator  .item-group{
  width: 100px;
}
.item-group .thumbnail-group{
  width: 100%;
  height: 284rpx;
}
.thumbnail-group .thumbnail{
  width: 100px;
  height: 100%;
}
.item-group .item-title{
  font-size: 28rpx;
  text-align: center;
  margin-top: 20rpx;
  /* 文本过长处理 */
  text-overflow:ellipsis;
  overflow: hidden;
}

```

2. 将要渲染的数据定义成三个属性

indexmodules.js文件中

```
  /**
   * 组件的属性列表
   */
  properties: {
      title:{
        type:String,
        value:""
      },
      moreurl:{
        type:String,
        value:""
      },
      items:{
        type:Array,
        value:[]
      }

  },
```
3. 组件引用

index.json文件中
```
{
  "usingComponents": {
    "searchbar":"/components/searchbar/searchbar",
    "stars":"/components/stars/stars",
    "indexmodule":"/components/indexmodule/indexmodule"
  }
}
```
4. 组件使用

```
<!-- top20电影 -->
<indexmodule  title="电影"  items="{{movies}}" ></indexmodule>
 <!-- 正在热映的电影 -->
 <indexmodule  title="正在热映电影"  items="{{tvs}}" ></indexmodule>
 <!-- 即将上映的电影 -->
 <indexmodule  title="即将上映电影"  items="{{shows}}" ></indexmodule>

```

![组件使用](/image/16.13.png)

5. 问题：此时评分不见了stars是放在indexmodule中使用，所以要在indexmodule.js中引用一下stars组件

```
{
  "component": true,
  "usingComponents": {
    "stars":"/components/stars/stars"
  }
}
```
此时页面效果和之前一样了           
![页面效果](/image/16.11.png)

###  网络请求模块重构
####  对index.js中的网络请求代码进行重构
1. index.js中只有这些网路请求的代码
2. 代码重复较多
3. MVC思想 Model(数据data)  View(html,css)  Controller(控制器,起到指挥的作用，具体怎么去实现交给专门的模块,可以比喻成交警指挥交通并不会去开车)

![代码示例](/image/16.14.png)


#### 处理方法
1. 将网络请求放入一个network.js文件中去完成

将index.wxml中的request请求剪切到network.js中

![network.js](/image/16.15.png)

2. index.js 导入模块  import  {network}  from  "../../utils/network.js"
 
代码处理，存储数据，其他模块进行相同处理
![network.js](/image/16.16.png)

3. 这时候index.js就起到了一个控制器的作用，不会起到网络请求的的作用，真正的网络请求在network.js文件中。我们只负责调用。

4. 考虑到后期我们点击更多列表页使用的ur和首页的url是一样的，所以我们可以把url链接单独抽取出来。

在utils文件中单独创建一个文件用来存储这些链接urls.js

```
const  globalurls={
  movieList: "https://m.douban.com/rexxar/api/v2/subject_collection/movie_showing/items",
  tvList: "https://m.douban.com/rexxar/api/v2/subject_collection/tv_hot/items",
  showList: "https://m.douban.com/rexxar/api/v2/subject_collection/tv_variety_show/items",
}
export {globalurls}   //导出
```

network.js文件中修改代码

```
     url: globalurls.movieList,
     data:{
       count:7
      },
```
#### 重构后首页效果与之前一样

由于我的Api换了，所以数据发生了一些变化，之前代码一些数据获取代码可能之后不同

![首页](/image/16.17.png)

---
title: 豆瓣&itemview重构&列表数据渲染成真实数据
index_img: /image/16.PNG
date: 2021-04-22 20:15:58
tags: 
- WX
- 小程序
categories:
- WX

---

---

###  电影列表页面布局

#### itemview重构

分析：首页和更多页面的布局基本一样，所以我们可以将首页布局代码拿过来直接用         

(我们在代码的时候发现有些东西是重复的，我们可以将代码单独抽取出来，然后再哪个地方需要使用的时候再引用，这样相当于对代码进行了重构，方便后期对代码进行管理)

![首页代码](/image/17.1.png)

1. 首页代码在indexmodul组件中，所以我们去该组价中再进行代码优化


2. 在components中新建一个itemview组件

3. 将indexmodule.wxml中的代码剪切到itemview.wxml中

navigator也可以拿过去，因为后期我们点击一个电影也会跳转到详情页面中
   
![itemview.wxml](/image/17.2.png)

4. 将样式代码页抽取到itemview.wxss中

```
 .item-navigator{
  width:200rpx;
  margin-right: 20rpx;
  display: inline-block;
}

.item-navigator  .item-group{
  width: 100px;
}
.item-group .thumbnail-group{
  width: 100%;
  height: 284rpx;
}
.thumbnail-group .thumbnail{
  width: 100px;
  height: 100%;
}
.item-group .item-title{
  font-size: 28rpx;
  text-align: center;
  margin-top: 20rpx;
  /* 文本过长处理 */
  text-overflow:ellipsis;
  overflow: hidden;
}

```
5. 展示items，应该要传一个items属性过来


![问题](/image/17.3.png)

解决： 在itemsview.js文件中

![属性](/image/17.4.png)



6. 注册组件


![注册组件](/image/17.5.png)

7. 使用组件

![使用组件](/image/17.6.png)

8. 问题

右边距没有了

![问题](/image/17.7.png)

解决：我们把itemview单独放在一个当中使用了，所以item-navigator只有一个则last-of-type就是它本身     
将该代码删除就可以了

![解决](/image/17.8.png)


9. 此时星星组件不见了，将星星组件放到itemview.json文件中使用


![解决](/image/17.9.png)

以上操作方便了我们后期布局

#### 创建列表页

1. 创建列表页面

在app.json中添加该行代码保存就会自动创建页面

![创建页面](/image/17.10.png)

2. 分析：电影，电视剧，综艺三个列表页面都是相同的样式，唯独不一样的是数据，所以我们完全没有必要为这三个弄三个单独的页面。我们完全可以使用同一个页面，后期我们传不同的参数过去，告诉它我现在要获取电影，电视剧，综艺.这样可以达到重用。

3. 列表页入口

应该有一个入口可以来到列表页--更多

在首页添加url

![moreurl](/image/17.11.png)

4. 列表页搜索栏
列表页也应该有搜索栏,将之前的searchbar组件拿过来使用

注册list.json
```
{
  "usingComponents": {
    "searchbar":"/components/searchbar/searchbar"
  }
}
```

使用 list.wxml
```
<searchbar  isnavigator="{{true}}"></searchbar>
```

这时候列表页出现了搜索栏


5. 电影排列--flex布局

```
<view class="container">
  <itemview  wx:for="{{items}}"  wx:key="{{item.title}}"  item="{{item}}"></itemview>
</view>
```
由于.container在app.wxss中存在，这里我们将app.wxss代码删除掉

6. 电影数据获取

在list.js的onLoad函数中调用电影列表数据

* 导入network.js

```
import {network}  from  "../../utils/network.js";
```

* 请求数据
```
onLoad: function (options) {
    var  that= this;
          // 请求的电影数据
      network.getMovieList({
        success:function(items){
          that.setData({
            items: items
          });    
        }}
```

* css样式

```
.container{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 30rpx;
}
```


###  列表数据渲染成真实数据

1. 分析：电影，电视剧，综艺用的都是list页面中的，这时候我们要怎么去区分它呢？

我们可以在首页index中传一个参数过去，当点击更多的时候，我们list页面得到这个参数就可以根据参数发送不同的请求

传递参数

![type](/image/17.12.png)

list.js中接收参数

![接收](/image/17.13.png)

2. 怎么能够获取所有正在热映的电影，电视剧，综艺？

分析：我们在首页中就已经写过网络请求的代码，不过我们写的count=7,我们现在要获取所有的数据，之前的代码也可以重用。

```
  wx.request({
    //  豆瓣电影接口
     url: globalurls.movieList,
     data:{
       count:count
      },
     success:function(res){
      // console.log(res)
       var   movies = res.data.subjects;
        if(params && params.success){
          params.success(movies)
        }
     }
 })
```

解决：将network.js文件进行重构
我们network.js 文件在list文件中也用的到，所以放在全局文件中比较合适，可以放在utils中。网络请求代码不是很多，所以我们这里放在一个文件中是可以的。


3. 在utils中新建一个network.js文件

将原来的network.js文件代码拷贝过来，原来文件可以删除了

此时将所有相关引用路径更改

network.js代码
```
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
```


4. 在list.js中请求网络

修改引入路径
import {network}  from  "../../utils/network.js";

list.js代码
```
     onLoad: function (options) {
        var  that= this;
        var  type = options.type;
        var  title ="";
        // 数据加载前
        wx.showLoading({
          title: '正在加载中...',
        })
        if(type === "movie"){
          // 请求的电影数据
          network.getMovieList({
            success:function(items){
              that.setData({
                items: items
              });
              // 数据加载完成
                wx.hideLoading();
            },
            // 确保获取到所有数据
                  count:1000
          })
         title= "电影"
        }else if(type=== "tv"){
          // 请求电视剧的数据
          network.getTVList({
            success:function(items){
              that.setData({
                items: items
              });
              wx.hideLoading();
            },
            count:1000
          });
          title = "电视剧"
        }else  {
          //请求综艺的数据
          network.getShowList({
            success:function(items){
              that.setData({
                items: items
              });
              wx.hideLoading();
            },
            count:1000
          });
          title="综艺";
        }
        wx.setNavigationBarTitle({
          title:title,
        })
      }
```

问题：发现页面不显示但是也没有报错，说明数据获取了但是没有渲染

问题：将原来的movies修改为items

![问题](/image/17.14.png)

5. 优化

当点击更多之后(电影，电视剧，综艺)三个上方均显示为豆瓣评分，这时候我们需要考虑到用户体验，将上面的数据进行修改。

![优化](/image/17.15.png)

解决：在list.js文件中

微信的函数设置
```
    wx.setNavigationBarTitle({
      title:title,
    })
```

函数上面定义一个title
```
 var  title ="";
```

![根据请求数据改变title](/image/17.16.png)

#### 优化

1. 如果底部剩余两个item就会出现一下情况，因为是flex布局

![左右各一个,中间空](/image/17.17.png)

2. 分析：

* 在主轴上的那布局排列总共有5中
* 1从左到右排列，最下面的可以但是上面的可能排列就不那么好看了，因为它的中间的间距你不好掌握
* 2中间间距相等的方式也不这么好，页面排列也不那么好看

什么时候会产生这个问题，就是底部余2个，余1余活3个都不会产生

解决：这时候我们要迎合flex布局方式，在数据渲染的时候判断数据对3取余是不是等于2

当然我们还要对index页面进行分析，因为index页面也调用了network.js,因为首页是得到了7个数据，对3取余为1，所以对network.js处理是不会对页面有影响的。

代码解决network.js

如果余2就添加一个空的数据
```
       var  itemsCount = items.length;
       var  left = itemsCount%3;
       if(left===2){
         items.push(null);
       }
```

新问题：出现一个未评分

![新问题](/image/17.18.png)

解决：在itemview中判断是否传入值

![item解决](/image/17.19.png)

3. 页面加载优化

数据加载需要时间，如果长时间没有加载出来，用户体验会不好，会损失用户。

处理：调用小程序Api实现，

![三个同时作用](/image/17.20.png)

---
title: 豆瓣&详情页面固定样式完成&详情页短评数据获取与渲染

index_img: /image/16.PNG
date: 2021-04-23 20:15:58
tags: 
- WX
- 小程序
categories:
- WX

---

---

###  详情页面固定样式完成

#### 详情页面header完成

要完成的样式
![要完成的样式](/image/18.png)

1. 创建detail页面

app.json中,<strong>将detail放在最前面方便后面调试</strong>

![保存生成detail页面](/image/18.1.png)


2. 分析布局

![分析](/image/18.2.png)

3. detail.wxml代码编写

```
    <view class="item-header">
      <view class="item-title"> 肖申克的救赎(1994) </view>
      <view class="item-detail">
        <view class="left-detail">
          <view class="item-rate">
            <stars rate="9.7"></stars>
            <text class="comment-persons">203894评价</text>
          </view>
          <view class="item-sub-detail">
            <view class="item-type"> 142分钟 剧情 / 犯罪 </view>
            <view class="item-show"> 1994-10-14(美国) </view>
            <view class="item-actors">
              导演: 弗兰克·德拉邦特/ 主演: 蒂姆·罗宾斯
            </view>
          </view>
        </view>
        <view class="right-detail">
          <image
            src="https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.webp"
          ></image>
        </view>
      </view>
    </view>
```

detail.wxss代码

```
.item-header {
  padding: 60rpx 30rpx;
}

.item-header .item-title {
  font-size: 50rpx;
}

.item-header .item-detail {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
}

.item-detail .left-detail {
  flex: 1;
  margin-right: 20rpx;
}

.left-detail .item-rate {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.item-rate .comment-persons {
  font-size: 28rpx;
  color: #ccc;
  margin-left: 20rpx;
}

.item-detail .right-detail {
  width: 200rpx;
  height: 300rpx;
}

.right-detail image {
  width: 100%;
  height: 100%;
}

.item-sub-detail {
  margin-top: 40rpx;
  font-size: 32rpx;
}

.item-sub-detail view {
  margin-bottom: 10rpx;
}

```

效果图

![效果图片](/image/18.3.png)


#### 标签布局和样式完成

![样式](/image/18.4.png)

detail.wxml代码

```
    <view class="item-tags">
      <view class="item-tags-title">豆瓣成员常用标签</view>
      <view class="item-tags-list">
        <text>黑色幽默</text><text>小人物</text><text>戏剧</text
        ><text>方言</text><text>中国大陆</text><text>人性</text
        ><text>剧情</text>
      </view>
    </view>
```

detail.wxss代码

```
.item-tags-title{
  /* 设置元素的下外边距 */
  margin-bottom: 10rpx;
}
.item-tags{
  padding: 0 30rpx;
}
.item-tags .item-tags-title{
  color: #b3b3b3;
  font-size: 32rpx;
  margin-bottom:20rpx;
}
.item-tags .item-tags-list{
  display:flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.item-tags-list text{
  padding:10rpx 20rpx;
  background: #f5f5f5;
  font-size: 32rpx;
  columns: #353535;
  text-align: center;
  border-radius: 40rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
}
```

#### 详情页布局完成

分析：

![要完成的样式](/image/18.5.png)


detail.wxml

这里的头像图片和文字我们先从豆瓣网获取，方便页面布局显示

```
<view  class="comment-list-group">
<view  class="comment-title">短评(202220297)</view>
<view  class="comment-group">
<view  class="left-comment">
<image  class="avatar" src="https://img3.doubanio.com/icon/u218767230-1.jpg"></image>
</view>
<view class="right-comment">
<view  class="username-rate">
<view  class="username">羚锐</view>
<stars  rate="5" starsize="30" istext="{{false}}" ></stars>
</view>
<view  class="release-time">2018-12-03   12:22:22</view>
<view  class="content">这部纪录片上映也等了很久，就像这段历史被揭开的时间也是等待了太久，
这几个人的人生或许仍然不能被探索清楚，但至少已经开始被发掘，其实这不仅是关于八个中国乘客，也是那一代华人移民故事，方的故事尤为震撼，
一个从冰海里挣扎出来的幸存者，又如此努力在美国讨生活还要帮助亲友，他的故事比电影更加传奇。
</view>
</view>
</view>

 <navigator class="more-comment">查看更多短评</navigator>
```

detail.wxss

```
.comment-list-group{
  padding: 60rpx 30rpx;
}
.comment-list-group  .comment-title{
  font-size: 32rpx;
  color: #b3b3b3;
}
/* 左边固定，右边内容适配 */
.comment-list-group  .comment-group{
  display: flex;
  justify-content: flex-start;
  padding-top: 40rpx;
}
.comment-group .left-comment{
  width: 70rpx;
  margin-right: 20rpx;
}
.left-comment  .avatar{
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
}
.comment-group  .right-comment{
  flex:1;
}
.right-comment   .username-rate{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.username-rate .username{
  font-size: 36rpx;
  margin-right: 20rpx;
}
.release-time{
  color: #b3b3b3;
  font-size: 32rpx;
  margin-top: 10rpx;
}
.content{
  font-size: 32rpx;
  color: #353535;
  margin-top:10rpx;
}
.more-comment{
  text-align: center;
  font-size: 36rpx;
  color: #41be57;
  margin-bottom: 60rpx;
}
```

问题：星星这里出现了评分数字

![要完成的样式](/image/18.6.png)


解决：

在stars.js文件中定义一个属性，是否需要文本

```
  istext:{
    type:Boolean,
    value:true
  }
```

stars.wxml中
![代码添加判断](/image/18.7.png)


detail.wxml代码
```
<stars  rate="5" starsize="30" istext="{{false}}" ></stars>
```

![页面完成](/image/18.8.png)


## 以下是将详情页的数据转换为真实从网上获取的数据

###  详情页入口参数设置

1. 分析：进入详情页面有多种途径，1从首页中电影，电视剧，综艺都可以进入，2从列表页面也可以点击进入

所以我们要对点击进入详情页面进行入口设置，因为(电影，电视剧，综艺)三个的url类型是不同的，所以获取详情页前要传递类型和item的id过去，告诉它我们传递的类型和id

2. 接下来我们来到首页index.wxml中，发现页面是在indexmodul中，而页面是写在itemview中

之前我们只是在itemview中写了一些样式，并没有跳转的链接

itemview.js中定义类型

```
itemurl:{
  type:String,
  value:""
}
```

itemview.wxml url跳转链接

![url](/image/18.9.png)

3. indexmodule设置跳转页面

```

<itemview wx:for="{{items}}"  wx:key="{{item.title}}"  item="{{item}}" 

itemurl="/pages/detail/detail?type={{type}}&id={{item.id}}"
></itemview>  
```

* 可以实现，但是我们还需要传递两个参数 type和id(通过查询字符串的方式?)

indexmodule.js  属性设置

```
      type:{
        type:String,
        value:""
      }
```

以后在使用这个组件的时候要传递一个字符串type进来，index页面中。

![type](/image/18.10.png)

* id 的传递---item中有一个属性id
  
id={{item.id}}

首页中点击可以获取到数据

![console](/image/18.11.png)


4. 列表页面实现获取list

它直接使用的就是itemview,所以我们就只需要传递url

list.js

```
    var  that= this;
    var  type = options.type;
    that.setData({
      type:type
    })
```

![console](/image/18.12.png)


点击type和id都能获取



### 详情页item详情数据获取

详情页面参数已经可以获取了

1. detail.js 
```
         var  type =options.type;
         var  id=options.id;
```

2. 导入详情页面的三个url到url.js中

```
  movieDetail: "https://m.douban.com/rexxar/api/v2/movie/",
  tvDetail: "https://m.douban.com/rexxar/api/v2/tv/",
  showDetail: "https://m.douban.com/rexxar/api/v2/tv/",
```

3. network.js 文件中定义一个新的函数来获取网络请求


![获取网络请求](/image/18.13.png)

最后成功获取通过success函数回调返回item



4. detail.js中导入network

```
import  {network}  from  "../../utils/network"
```

![获取打印数据](/image/18.14.png)

此时点击首页一个数据发现控制台200的状态并打印了数据，发现通过url可以获取到数据


### 详情页面item数据渲染

####  将获取到的item的数据设置到界面上
1. detail.js中保存data数据

```
 var that  =this;

   that.setData({
               item:item
             })
  // console.log(item)  //打印查看数据列表
```

![控制台数据答应](/image/18.15.png)

2. detail.wxml中修改

![修改位置](/image/18.17.png)

3. detail.js中代码

![部分细节处理](/image/18.16.png)

```
    onLoad: function (options) {
            var that  =this;
            var  type =options.type;
            var  id=options.id;

            network.getItemDetail({
              type:type,
              id:id,
              success:function(item){
                var  genres= item.genres;
               //字符串拼接  电影类型
               genres = genres.join("/");
               item.genres = genres;

               var   actors = item.actors;
               var  actorNames = [];
                 //slice函数截取数组的一部分，slice(0,3)左闭右开取(0,1,2)，演员数组太多，取三个返回
               if(actors.length>3){
                 actors = actors.slice(0,3);
               }
            //    for循环压入数组中
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
     }
```

![页面数据可以从网络上请求改变](/image/18.18.png)

#### 标签完成

标签数据获取与数据渲染

![如图](/image/18.19.png)


1. url.js设置

![url设置](/image/18.20.png)

2. network.js函数设置

![network.js](/image/18.21.png)

3. detail.js中触发该函数

tags用来接收调用network.js中函数返回传的参数

![detail.js](/image/18.22.png)

4. 修改detail.wxml代码

wx:for循环中，默认的下标名称的index,默认的值的名称的item

![wx:for](/image/18.23.png)

#### 详情页短评数据获取与渲染

1. url链接获取

url.js代码
```
  // 默认传一个start=0,count =3
  movieComments: function(id,start=0,count=3){
    return 'https://m.douban.com/rexxar/api/v2/movie/' + id + '/interests?count=' + count + '&start=' + start;
  },
  tvComments: function(id,start=0,count=3){
    return 'https://m.douban.com/rexxar/api/v2/tv/' + id + '/interests?count=' + count + '&start=' + start;
  },
  showComments: function(id,start=0,count=3){
    return this.tvComments(id,start,count);
  },

```

2. network.js写一个获取网络请求的接口

```
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
  }
```

3. detail页面调用 detail.js文件种

```
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
```

4. 控制台能够打印200状态，并获取到data

5. 数据渲染到detail.wxml种

变量修改


![wxml代码修改](/image/18.24.png)

6. 页面效果

![真实数据](/image/18.25.png)


---
title: 豆瓣&评论列表页实现

index_img: /image/16.PNG
date: 2021-04-24 20:15:58
tags: 
- WX
- 小程序
categories:
- WX

---

---

## 评论列表页实现

![实现点击该页面跳转后](/image/19.png)

### 完成布局和样式

1. 先创建comment页面app.json中


可以将该页面放在第一位,这样方便后面调试页面在第一页

```
 "pages/comment/comment",
```

ctrl+s保存后生成页面

2. comment.wxml代码

```
<view  class="container">
<view  class="item-group"
bindtap="onItemTapEvent">
<image    class="thumbnail"  src="{{thumbnail}}"></image>
<text class="item-title">{{title}}</text>
<text   class="item-rate">{{rate}}分</text>
</view>

```

3. comment.wxss样式

```
.container{
  padding:20rpx  30rpx;
}

.item-group{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.item-group .thumbnail{
  width: 40rpx;
  height: 50rpx;
  margin-left: 10rpx;
  margin-right: 10rpx;
}

.item-group  .item-title{
  font-size: 32rpx;
  color : #41be57;
  margin-left: 10rpx;
  margin-right: 10rpx;
}

.item-group  .item-rate{
    font-size: 28rpx;
    color: #ccc;
}
```

完成后效果

![样式](/image/19.1.png)

4. 将comment页面降级，实现跳转功能

app.json
```
    "pages/index/index",
    "pages/comment/comment",
```

5. detail.wxml中实现跳转url


url 中接收了从上一页传递到下一页的一些参数?后面的

```
 <navigator class="more-comment" 
 url="/pages/comment/comment?id={{id}}&type={{type}}&thumbnail={{item.cover.image.small.url}}&title={{item.title}}&rate={{item.rating.value}}" >查看更多短评</navigator>

```

此时我们在comment.js中打印一下数据

```
  onLoad: function (options) {
    console.log(options)
  }
```

问题：没有打印id和type

![问题](/image/19.2.png)

解决：detail.js中虽然获取到了type和id，但是没有保存

```
that.setData({
id:id,
type:type
})
```

6. comment.js中保存数据

```
  onLoad: function (options) {
     var  that=this;
     that.setData(options);
  }
```


7. 渲染数据

修改以下数据，从url中获取的参数，渲染到页面，会根据点击实现数据的改变

![修改](/image/19.3.png)

### 点击完成页面跳转

1. 能够点击头像完成上一页的跳转

![能够点击跳转](/image/19.4.png)

分析：能够通过rul或js实现

2. 这里我们通过js实现,绑定一个点击事件

![绑定一个点击事件](/image/19.5.png)

3. comment.js函数实现

这里我们调用的是微信的Api,返回到上一页
```
  onItemTapEvent:function(event){
    wx.navigateBack({})
  },

```

问题，这里返回到的是上一页的最下面，不是很好

解决： 在detail界面中加上一个滚动事件，一旦页面show出来了，就展示在最上面

detail.js
```
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      wx.pageScrollTo({
        scrollTop:0,
      })
  }
```
问题解决。

### 加载评论数据

1. 分析，影评和上面的标题的左右间距都一样，所以可以将它放在.container中

2. wxml代码

```
<!-- 影评 -->
<view  class="comment-title">全部影评({{total}})</view>
<onecomment wx:for="{{comments}}" item="{{item}}" ></onecomment>
```

3. wxss代码

```
.comment-title{
  margin-top: 60rpx;
  font-size: 40rpx;
}
```

### 评论列表页面抽取注册成组件


![分析](/image/19.6.png)

评论的样式和布局之前已经在详情页中已经做了，我们在这里没有必要再写一遍，我们可以将之前评论的样式和布局单独抽取出来，做成一个组件，然后直接使用组件，非常方便。

1. 创建一个onecomment组件

2. 将detail中的comment代码剪切到onecomment中

![代码](/image/19.7.png)

3. 将css代码剪切到onecomment中

```
/* 左边固定，右边内容适配 */
 .comment-group{
  display: flex;
  justify-content: flex-start;
  padding-top: 40rpx;
}
.comment-group .left-comment{
  width: 70rpx;
  margin-right: 20rpx;
}
.left-comment  .avatar{
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
}
.comment-group  .right-comment{
  flex:1;
}
.right-comment   .username-rate{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.username-rate .username{
  font-size: 36rpx;
  margin-right: 20rpx;
}
.release-time{
  color: #b3b3b3;
  font-size: 32rpx;
  margin-top: 10rpx;
}
.content{
  font-size: 32rpx;
  color: #353535;
  margin-top:10rpx;
}
```

4. 再onecomment中设置一个属性，这样我们可以使用使数据显示

onecomment.js
```
  properties: {
        item:{
          type:Object,
          value:{}
        }
  },
```

onecomment.wxml代码

```
<view  class="comment-group" >
<view  class="left-comment">
<image  class="avatar" src="{{item.user.avatar}}"></image>
</view>
 <view class="right-comment">
<view  class="username-rate">
<view  class="username">{{item.user.name}}</view>
<stars  rate="{{item.rating.value*2}}" starsize="30" istext="{{false}}" ></stars>
</view>
<view  class="release-time">{{item.create_time}}</view>
<view  class="content">{{item.comment}}
</view>
</view>
</view>
```

5. detail中使用先注册组件

detail.json
```
{
  "usingComponents": {
    "stars":"/components/stars/stars",
    "onecomment":"/components/onecomment/onecomment"
  }
}
```

detail.wxml中使用

```
<onecomment  wx:for="{{comments}}" item="{{item}}" ></onecomment>
```

其他样式和之前一样，但是出现了问题：星星样式没了

解决：再onecomment中注册stars组件

```
{
  "component": true,
  "usingComponents": {
    "stars":"/components/stars/stars"
  }
}
```

完成。

### 请求评论数据

1. comment.js

请求数据，先导入network.js
```
import  {network}  from  "../../utils/network.js";

  onLoad: function (options) {
     var  that=this;
     that.setData(options);
    network.getItemComments({
      type:options.type,
      id:options.id,
      start:1,
      count:20,
      success:function(data){
        var  total = data.total;
        var  comments = data.interests;
        that.setData({
          total:total,
          comments:comments
        })
      }
    })
  },
```

2. comment中注册组件

comment.json

```
{
  "usingComponents": {
    "onecomment":"/components/onecomment/onecomment"
  }
}
```

3. 使用组件

```
{
  "usingComponents": {
    "onecomment":"/components/onecomment/onecomment"
  }
}
```

完成

### 翻页按钮布局

要完成样式

![样式](/image/19.8.png)


1. comment.wxml代码

```
<view  class="page-btn-group">
<button class="page-btn"bindtap="onPrePageTap"
>上一页</button>
<button  class="page-btn"bindtap="onNextPageTap"
>下一页</button>
</view>
```

2. comment.wxss代码

```
.page-btn-group{
  margin-top:40rpx;
  margin-bottom: 40rpx;
  display:flex;
  /* 水平方向从左到右 */
  justify-content: flex-start;
  /* 垂直反向居中 */
  align-items: center;
}

.page-btn{
  flex:1;
  height: 60rpx;
  color: #898989;
  border-color:#898989;
  line-height:60rpx;
}

```

### 翻页功能实现

优化用户体验，从用户角度出发，给用户更好的体验

1. 点击绑定事件


![绑定](/image/19.10.png)

2. comment.js实现

```
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
```

基本完成


![完成](/image/19.9.png)

---
title: 豆瓣&搜索页面布局&详情评分bug解决

index_img: /image/16.PNG
date: 2021-04-25 20:15:58
tags: 
- WX
- 小程序
categories:
- WX

---

---

### 搜索页面样式布局完成

要完成样式

![页面样式](/image/19.11.png)

1. search.wxml

```
<view  class="item-list-group">
<view  class="item-group">
<image  src="https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2635676317.webp"  class="thumbnail"></image>
<view  class="info-group">
<view  class="title">六人-泰坦尼克上的中国幸存者</view>
<view  class="rate-year">8.5分/2020</view>
</view>
</view>
</view>
```

2. search.wxss

```
.item-list-group{
  padding: 10rpx  20rpx;
}
.item-list-group  .item-group{
  padding:10rpx 0;
  /* 底部分割线 */
  border-bottom:1px  solid #e4e4e4;
  /* 左右分布布局 */
  display: flex;
}
.item-group .thumbnail{
  width: 80rpx;
  height: 100rpx;
  margin-right: 20rpx;
}
.item-group .info-group{
  flex:1;
  display:flex;
  flex-direction: column;
  justify-content: space-between;
}

.info-group .title{
  font-size: 32rpx;
}
.info-group .rate-year{
  font-size: 32rpx;
  color: #7b7b7b;
}
```

样式渲染完成，采用flex布局

###  搜索功能实现

1. 搜索请求实现

分析：1.在输入框中输入输入文字，那么就应该要获取到输入框中的文字了，但是输入框是单独放在
一个searchbar组件中，我们要获取的话没有那么方便   

 2.解决：在组件中监听输入框中input事件，将监听到的input输入框中输入的东西及时反馈，然后组件监听得到后再区触发另外一个事件，这样就可以传到外面了。


 2. 代码实现

bindinput事件是只要你在输入框中新增删除文字它都会去执行事件

![绑定事件](/image/19.13.png)


searchbar.js

方法实现，组件主要复制将信息传递出去，执行在search中，这样职责划分更明确

![绑定事件](/image/19.14.png)


search.wxml绑定查找事件

```
<searchbar  bindsearchinput="onSearchInputEvent"></searchbar>
```

serch.js监听事件

![绑定事件](/image/19.15.png)

此时控制台type类型变为searchinput类型,能够得到用户输入的值


3. 发送网路请求url

url.js

```
  searchUrl: function (q) {
    return "https://m.douban.com/rexxar/api/v2/search?type=movie&q=" + q
  }
```


network.js

```
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

```

search.js

```
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
```
因豆瓣Api限制访问，经常请求不到数据

![能够搜索](/image/19.12.png)


4. 此时能够拿到数据，我们将数据渲染到页面

```
<searchbar  bindsearchinput="onSearchInputEvent"></searchbar>
<view  class="item-list-group">
<view  wx:for="{{subjects}}"
 class="item-group"  wx:key ="{{item.id}}"
 <!-- 绑定了一个点击事件，这样点击item可以跳转到详情页面中 -->
 bindtap="onItemTapEvent"  data-id="{{item.id}}" >
<image  src="{{item.pic.normal}}"  class="thumbnail"></image>
<view  class="info-group">
<view  class="title">{{item.title}}</view>
<view  class="rate-year"> {{item.rating.value}}分{{item.year}}</view>
</view>
</view>
</view>
```

绑定了一个点击事件，这样点击item可以跳转到详情页面中,同时获取id
```
bindtap="onItemTapEvent"  data-id="{{item.id}}"
```

search.js

```
 onItemTapEvent:function(event){
    // console.log(event)
    var id = event.currentTarget.dataset.id;
    // 跳转到某一个页面
    wx.navigateTo({
      url: '/pages/detail/detail?type=movie&id='+id,
    })
  }
```

至此，点击电影也可以跳转到详情页面了


### 历史搜索记录布局

![要完成的样式](/image/19.16.png)

search.wxml

```
<view  class="history-list-group">
<view class="history-title">
<view  class="title">历史记录</view>
<view  class="clear">清除</view>
</view>
<navigator  class="history-group">泰坦尼克号</navigator>
</view>
```

search.wxss
```
.history-list-group{
  padding:10rpx 20rpx;
}
.history-list-group .history-title{
  display: flex;
  justify-content: space-between;
  padding: 20rpx  0;
  background: #f9f9f9;
  font-size: 28rpx;
  color: #9e9e9e;
}
.history-list-group  .history-group{
  font-size: 32rpx;
  padding: 20rpx 0;
  border-bottom:1px  solid  #e4e4e4
}

```

优化：history-group可以将它变为一个navigator组件，因为历史搜索是不需要任何操作的，可以直接从本地读取

#### 历史记录功能实现

由于豆瓣api次数限制控制，搜索有时候请求不到，故这里并未实现

[学习思路](https://study.163.com/course/courseLearn.htm?courseId=1208961810#/learn/video?lessonId=1278472316&courseId=1208961810)


###  详情评分bug解决

所有电影，综艺，电视剧评分均为9.7，因为我们这里写成固定的了

![rate](/image/19.17.png)


代码修改

```
<stars rate="{{item.rating.value}}"></stars>
```

![问题](/image/19.18.png)

评论的评分是能够接收的，同理上面的星星评分也是能设置进来的。

分析：stars.js中代码问题

```
  lifetimes:{
attached:function(){
  this.updateRate();
}
  }
```

问题原因：attached生命周期函数执行时，rate还没有设置进来，因为rate是通过网络请求加载出来的，需要时间加载进来，所以这时候rate为0默认值。

解决

stars.js
```
  properties: {
  rate:{
        type:Number,
        value:0,
        observer: function(newVal, oldVal,changePath) {
          // 属性值变化时执行,newVal就是新设置的数据，old是旧数据
          this.updateRate();
        }
      } 
      },
methods: {
updateRate:function(){
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
},

lifetimes:{
attached:function(){
  this.updateRate();
  }
 }
```

至此，问题解决了
>问题的核心元素是：代码之前执行是放在一个attached中，这个函数是被加载到页面中才会去执行，加载到页面中我们的数据没有从网络中请求到，这时候数据就是默认的0，我们可以用observer函数，一旦监听到改变了评分的值，就可以重新设置一下这个值。

![星星加载成功](/image/19.20.png)



#### [项目Github地址](https://github.com/Pengzhenglong/doubanxiaochengxu)