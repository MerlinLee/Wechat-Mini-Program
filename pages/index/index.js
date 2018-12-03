//index.js

Page({
  data: {
    hideHeader: true,
    refreshTime: '', // 刷新的时间 
    lastestNews: '',
    newsList: [],
    // 定义当前页面的初始值0
    currentPage: 0,
    categories: ['商务', '娱乐', '健康', '科学', '体育', '科技'],
    // 定义选中标题的初始值0
    selectedCategory: "0",
  },
  // 定义点击标题的事件处理函数，将选中标题的id赋值给selectedCategory
  bindtap: function(e) {
    console.log(e)
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
    let page = this.data.currentPage
    let url = ''
    switch (parseInt(page)) {
      case 0:
        //getBusinessNews()
        url = 'https://newsapi.org/v2/top-headlines?country=cn&category=business&apiKey=877f47a04bb3499d978b8875bc1ddc91'
        break;
      case 1:
        //getEntertainmentNews()
        url = 'https://newsapi.org/v2/top-headlines?country=cn&category=entertainment&apiKey=877f47a04bb3499d978b8875bc1ddc91'
        break;
      case 2:
        //getHealthNews()
        url = 'https://newsapi.org/v2/top-headlines?country=cn&category=health&apiKey=877f47a04bb3499d978b8875bc1ddc91'
        break;
      case 3:
        //getScienceNews()
        url = 'https://newsapi.org/v2/top-headlines?country=cn&category=science&apiKey=877f47a04bb3499d978b8875bc1ddc91'
        break;
      case 4:
        //getSportsNews()
        url = 'https://newsapi.org/v2/top-headlines?country=cn&category=sports&apiKey=877f47a04bb3499d978b8875bc1ddc91'
        break;
      case 5:
        //getTechnologyNews()
        url = 'https://newsapi.org/v2/top-headlines?country=cn&category=technology&apiKey=877f47a04bb3499d978b8875bc1ddc91'
        break;
    }
    //获取相应的内容
    wx.request({
      url: url,
      success: res => {
        //console.log(res)
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
    this.getBusinessNews()
  },
  getBusinessNews() {
    wx.request({
      url: 'https://newsapi.org/v2/top-headlines?country=cn&category=business&apiKey=877f47a04bb3499d978b8875bc1ddc91',
      success: res => {
        console.log(res)
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
      id: 0,
      author: result.articles[0].author,
      title: result.articles[0].title,
      picture: result.articles[0].urlToImage,
      publisher: result.articles[0].source.name,
      time: result.articles[0].publishedAt,
      url: result.articles[0].url,
      description: result.articles[0].description
    }
    //若文章没有图片则引用本地图片
    if (lastestNews.picture == null)
      lastestNews.picture = "../../images/news.jpeg"
    //设置其他新闻内容列表
    let newsList = []
    for (let i = 1; i < result.articles.length; i++) {
      newsList.push({
        id: i,
        author: result.articles[i].author,
        title: result.articles[i].title,
        picture: result.articles[i].urlToImage,
        publisher: result.articles[i].source.name,
        time: result.articles[i].publishedAt,
        url: result.articles[i].url,
        description: result.articles[i].description
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
      url: '/pages/detail/detail?newsList=' + str,
    })
  },
  //获取最新的新闻内容并跳转
  readLatest: function(e) {
    let str = JSON.stringify(this.data.lastestNews);
    wx.navigateTo({
      url: '/pages/detail/detail?newsList=' + str,
    })
  }
})