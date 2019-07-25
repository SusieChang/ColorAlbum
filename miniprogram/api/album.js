const app = getApp();
const db = wx.cloud.database();
const { transferArrayToObj } = require( '../utils/transfer' );

function addAlbum ( { title = '默认', description = '', isPrivate = '', coverImage = 'none' } ) {
    return new Promise( ( resolve, reject ) => {
        db.collection( 'album' ).add( { 
            data: {
                title,
                description,
                isPrivate,
                coverImage
            }
        } ).then( res => {
            let { _id } = res;
            app.globalData.albums[_id] = data;
            try {
                wx.setStorageSync( 'album', app.globalData.albums );
            } catch ( error ) {
                console.error( '[setStorageSync] [album] 调用失败', err );
            }
            resolve(res);
        } ).catch(err => {
            console.error('[数据库][add]调用失败', err);
            reject(err);
        })
    } )
}

function deleteAlbum ( id ) {
    return new Promise( ( resolve, reject ) => {
        db.collection( 'album' ).where( { _id: id } ).remove().then( res => {
            app.globalData.albums[id] = null;
            try {
                wx.setStorageSync( 'album', app.globalData.albums );
            } catch ( error ) {
                console.error( '[setStorageSync] [album] 调用失败', err );
            }
            resolve(res);
        } ).catch(err => {
            console.error('[数据库][remove]调用失败', err);
            reject(err);
        })
    } )
}

function editAlbum ( id, data ) {
    return new Promise( ( resolve, reject ) => {
        db.collection( 'album' ).doc( id ).update( { data } ).then( res => {
            app.globalData.albums[id] = {...app.globalData.albums[id], ...data};
            try {
                wx.setStorageSync( 'album', app.globalData.albums );
            } catch ( error ) {
                console.error( '[setStorageSync] [album] 调用失败', err );
            }
            resolve(res);
        } ).catch(err => {
            console.error('[数据库][add]调用失败', err);
            reject(err);
        })
    } )
}

function getAlbumsByUser ( openid ) {
    return new Promise( ( resolve, reject ) => {
        // get data form memory 
        if ( app.globalData.albums ) {

            resolve( app.globalData.albums );

        } else {
            app.globalData.albums = {}
            // get data from local storage               
            wx.getStorage( {
                key: 'album',
                success: res => {
                    console.log(res)
                    app.globalData.albums = res.data;
                    resolve( res.data )
                },
                fail: err => {
                    console.error( '[getAlbum][getStorage]失败', err )
                    db.collection( 'album' )
                        .where( { _openid: openid } )
                        .get().then( ( { data } ) => {
                            let albums = transferArrayToObj('_id', data );
                            app.globalData.albums = albums;
                            try {
                                wx.setStorageSync( 'album', albums );
                            } catch ( e ) {
                                console.error( '[setStorageSync] [album] 调用失败', err )
                            }
                            resolve( albums );
                        } ).catch( err => {
                            console.error( '[数据库] [get] 调用失败', err )
                            reject( err )
                        } )
                }
            } )
        }
    } )
}

module.exports = {
    getAlbumsByUser,
    addAlbum,
    deleteAlbum,
    editAlbum
}