/**
 * rem.js
 * 为了实现pc端自适应
 */
let deviceWidth
setHtmlFontSize()

if (window.addEventListener) {
  window.addEventListener('resize', function () {
    setHtmlFontSize()
  }, false)
}
function setHtmlFontSize () {
  // 1366是设计稿的宽度，当大于1366时采用1366宽度，比例也是除以13.66
  if (document.documentElement.clientWidth > 1366) {
    deviceWidth = document.documentElement.clientWidth > 1920 ? 1920 : document.documentElement.clientWidth
  } else {
    deviceWidth = 1366
  }
  document.getElementsByTagName('html')[0].style.cssText = 'font-size:' + deviceWidth / 19.20 + 'px !important'
}
