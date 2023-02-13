// TODO: make this file a ts file by configuring webpack, use eject or react-script-rewired or fork the repo
/* eslint-disable */
chrome.contextMenus.create({
  id: 'password_generator',
  title: 'Password Generator',
  contexts: ['action'],
  type: 'normal'
}, () => {
  console.log('Password Generator Added to Context Menu')
})

/*
Opening the chrome Extension from contextMenu
chrome.contextMenus.onClicked.addListener((info) => {
  // info: OnCLickData type
  if (info.menuItemId === 'password_generator') {
    console.log('chrome.action.openPopup() is not suppoted yet see https://github.com/GoogleChrome/developer.chrome.com/issues/3934')
    // console.log(chrome.action)
    // console.log(info)
  }
})
*/

