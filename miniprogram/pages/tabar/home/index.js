// miniprogram/pages/tabar/home/index.js
const app = getApp()
const { transferObjToArray } = require( '../../../utils/transfer' )
const genColor = require( '../../../utils/genColor' )
const imageApi = require('../../../api/image')

Page( {

  /**
   * 页面的初始数据
   */
  data: {
    albums: [],
    animationClass: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ( options ) {
    let albums = transferObjToArray( app.globalData.albums );
    let fileList = []
    albums = albums.map( ( album, index ) => {
      fileList.push(album.coverImage)
      return { ...album, color: genColor( index ) };
    } )
    this.setData( {
      albums
    } )
    imageApi.getImageByFileID(fileList).then(res => {
      albums = albums.map((album, index) => {
        album.coverImage = res[index]
        return album;
      })
      this.setData({
        albums
      })
    }).catch(err => {
      console.log('相册封面获取失败', err);
    })
  },

  toCreate: function () {
    this.setData( {
      animationClass: 'chevron-leave-active'
    }, () => {
      setTimeout( () => {
        wx.navigateTo( {
          url: '../../photo/create/index',
        } );
      }, 800 );
    } )
  },

  toAlbum: function() {
    this.setData( {
      animationClass: 'chevron-leave-active'
    }, () => {
      setTimeout( () => {
        wx.navigateTo( {
          url: '../../album/show/index',
        } );
      }, 800 );
    } )
  },

  onShow () {
    this.setData( {
      animationClass: ''
    } )
  }

} )