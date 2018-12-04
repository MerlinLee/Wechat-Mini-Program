//index.js
var url_main = 'https://test-miniprogram.com'
//国内，国际，财经，娱乐，军事，体育 和 其他
Page({
  data: {
    hideHeader: true,
    refreshTime: '', // 刷新的时间 
    lastestNews: '',
    newsList: [],
    // 定义当前页面的初始值0
    currentPage: 0,
    categories: ['国内', '国际', '财经', '娱乐', '军事', '体育','其他'],
    // 定义选中标题的初始值0
    selectedCategory: "0",
  },
  // 定义点击标题的事件处理函数，将选中标题的id赋值给selectedCategory
  bindtap: function(e) {
    //console.log(e)
    this.setData({
      selectedCategory: e.currentTarget.id,
      currentPage: e.currentTarget.id
    });
    this.ReloadData()
  },
  //定义滑块改变的事件处理函数，将current赋值给selectedCategory
  bindChange: function(e) {
    console.log(e)
    this.setData({
      selectedCategory: e.detail.current,
      currentPage: e.detail.current
    })
    this.ReloadData()
  },
  ReloadData() {
    let selectedCategory = this.data.selectedCategory
    let url = ''
    let url_data = url_main +'/api/news/list?type='
    switch (parseInt(selectedCategory)) {
      case 0:
        //获取国内新闻
        url = url_data+'gn'
        break;
      case 1:
        //获取国际新闻
        url = url_data +'gj'
        break;
      case 2:
        //获取财经新闻
        url = url_data +'cj'
        break;
      case 3:
        //获取娱乐新闻
        url = url_data +'yl'
        break;
      case 4:
        //获取军事新闻
        url = url_data +'js'
        break;
      case 5:
        //获取体育新闻
        url = url_data +'ty'
        break;
      case 6:
        //获取其他新闻
        url = url_data+'other'
        break;
    }
    //获取相应的内容
    wx.request({
      url: url,
      success: res => {
        console.log(res)
        this.setNews(res.data)
        this.setData({
          hideHeader: true
        })
      }
    })
  },
  onReady: function() {
    // 页面渲染完成
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          swiperHeight: (res.windowHeight - 37)
        });
      }
    })
  },
  // 下拉刷新
  refresh: function(e) {
    var that = this;
    setTimeout(function() {
      //console.log('下拉刷新');
      var date = new Date();
      that.setData({
        refreshTime: date.toLocaleTimeString(),
        hideHeader: false
      })
      that.ReloadData()
    }, 300);
  },
  onLoad: function() {
    var date = new Date();
    this.setData({
      refreshTime: date.toLocaleTimeString()
    })
    this.getNationalNews()
  },
  getNationalNews() {
    wx.request({
      url : url_main + '/api/news/list?type=gn',
      success: res => {
        // console.log(res.data)
        this.setNews(res.data)
        this.setData({
          hideHeader: true
        })
      }
    })
  },
  setNews(result) {
    //设置最新的新闻
    let lastestNews = ''
    lastestNews = {
      id: result.result[0].id,
      title: result.result[0].title,
      picture: result.result[0].firstImage,
      time: result.result[0].date
    }
    //若文章没有图片则引用本地图片
    if (lastestNews.picture == null)
      lastestNews.picture = "../../images/news.jpeg"
    //设置其他新闻内容列表
    let newsList = []
    console.log(result.result.length)
    for (let i = 1; i < result.result.length; i++) {
      newsList.push({
        id: result.result[i].id,
        title: result.result[i].title,
        picture: result.result[i].firstImage,
        time: result.result[i].date
      })
      //若文章没有图片则引用本地图片
      if (newsList[i - 1].picture == null)
        newsList[i - 1].picture = "../../images/news.jpeg"
    }
    this.setData({
      lastestNews: lastestNews,
      newsList: newsList
    })
  },
  //获取列表中对应的新闻内容并跳转
  readDetail: function(e) {
    // console.log(this.data.newsList[parseInt(e.currentTarget.dataset.id) - 1].url)
    //把对象转成json格式
    let str = JSON.stringify(this.data.newsList[parseInt(e.currentTarget.dataset.id) - 1]);
    wx.navigateTo({
      //url: '/pages/detail/detail?newsList=' + str,
    })
  },
  //获取最新的新闻内容并跳转
  readLatest: function(e) {
    let str = JSON.stringify(this.data.lastestNews);
    wx.navigateTo({
      //url: '/pages/detail/detail?newsList=' + str,
    })
  }
})