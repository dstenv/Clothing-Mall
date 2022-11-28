
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/index","pages/404/404","pages/list/list","pages/shopbag/shopbag","pages/my/my","pages/search/search","pages/searchRes/searchRes","pages/detail/detail","pages/brankDetail/brankDetail","pages/myConfig/myConfig","pages/myAddress/myAddress","pages/addAddress/addAddress","pages/baiduMap/baiduMap"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"uni-app","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8"},"tabBar":{"color":"#636263","selectedColor":"#636263","borderStyle":"black","backgroundColor":"#ffffff","spacing":"8px","list":[{"pagePath":"pages/index/index","iconPath":"static/tabbar/home.png","selectedIconPath":"static/tabbar/home-active.png","text":"首页"},{"pagePath":"pages/list/list","iconPath":"static/tabbar/select.png","selectedIconPath":"static/tabbar/select-active.png","text":"分类"},{"pagePath":"pages/shopbag/shopbag","iconPath":"static/tabbar/shopbag.png","selectedIconPath":"static/tabbar/shopbag-active.png","text":"购物车"},{"pagePath":"pages/my/my","iconPath":"static/tabbar/my.png","selectedIconPath":"static/tabbar/my-active.png","text":"我的"}]},"nvueCompiler":"uni-app","nvueStyleCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"projectOne","compilerVersion":"3.6.4","entryPagePath":"pages/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"百年奥莱","navigationBarBackgroundColor":"#ffffff","navigationStyle":"custom","scrollIndicator":"none","titleNView":{"buttons":[{"float":"left","fontSrc":"./static/iconfont.ttf","text":"","fontSize":"20px"},{"float":"right","fontSrc":"./static/iconfont.ttf","text":"","fontSize":"20px"}]}}},{"path":"/pages/404/404","meta":{},"window":{"navigationBarTitleText":"未找到页面","enablePullDownRefresh":false}},{"path":"/pages/list/list","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"navigationBarBackgroundColor":"#ffffff","scrollIndicator":"none","titleNView":{"searchInput":{"placeholder":"请输入搜索关键字","disabled":true,"borderRadius":"15px","align":"left","autoFocus":false,"backgroundColor":"#F7F7F7","placeholderColor":"#B3B3B3"}}}},{"path":"/pages/shopbag/shopbag","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"scrollIndicator":"none","titleNView":false}},{"path":"/pages/my/my","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"titleNView":false,"scrollIndicator":"none"}},{"path":"/pages/search/search","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"navigationBarBackgroundColor":"#ffffff","scrollIndicator":"none","titleNView":{"searchInput":{"placeholder":"请输入搜索关键词","disabled":false,"borderRadius":"15px","align":"left","autoFocus":true,"backgroundColor":"#F7F7F7","placeholderColor":"#B3B3B3"},"buttons":[{"float":"right","color":"#636263","text":"搜索","fontSize":"16px","width":"60px"}]}}},{"path":"/pages/searchRes/searchRes","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"navigationBarBackgroundColor":"#ffffff","scrollIndicator":"none","titleNView":{"searchInput":{"placeholder":"","disabled":true,"borderRadius":"15px","align":"left","autoFocus":false,"backgroundColor":"#F7F7F7","placeholderColor":"#B3B3B3"},"buttons":[{"float":"right","color":"#636263","text":"筛选","fontSize":"16px","width":"60px"}]}}},{"path":"/pages/detail/detail","meta":{},"window":{"navigationBarTitleText":"商品详情","enablePullDownRefresh":false,"titleNView":{"type":"transparent","buttons":[{"type":"menu","float":"right"},{"type":"share","float":"right"}]}}},{"path":"/pages/brankDetail/brankDetail","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false,"scrollIndicator":"none","titleNView":{"type":"transparent","buttons":[{"type":"menu","float":"right"}]}}},{"path":"/pages/myConfig/myConfig","meta":{},"window":{"navigationBarTitleText":"设置","enablePullDownRefresh":false}},{"path":"/pages/myAddress/myAddress","meta":{},"window":{"navigationBarTitleText":"地址管理","enablePullDownRefresh":false}},{"path":"/pages/addAddress/addAddress","meta":{},"window":{"navigationBarTitleText":"新增地址","enablePullDownRefresh":false}},{"path":"/pages/baiduMap/baiduMap","meta":{},"window":{"navigationBarTitleText":"选择地址","enablePullDownRefresh":false}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
