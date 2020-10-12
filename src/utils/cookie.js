export function get (cookieName) {
  var theCookie = ' ' + document.cookie
  var ind = theCookie.indexOf(' ' + cookieName + '=')
  if (ind === -1) {
    ind = theCookie.indexOf(';' + cookieName + '=')
  }
  if (ind === -1 || cookieName === '') {
    return ''
  }
  var ind1 = theCookie.indexOf(';', ind + 1)
  if (ind1 === -1) {
    ind1 = theCookie.length
  }
  return theCookie.substring(ind + cookieName.length + 2, ind1)
}
export function set (cookieName, cookieValue, nDays, domain) {
  let value = cookieName + '=' + escape(cookieValue)
  if (nDays !== null) {
      var today = new Date()
      var expire = new Date()
      if (nDays === null || nDays === 0) {
          nDays = 1
      }
      expire.setTime(today.getTime() + 3600000 * 24 * nDays)
      value += ';expires=' + expire.toGMTString()
  }
  value += ';path=/'
  if (domain) {
      value = value + ';domain=' + domain
  }
  document.cookie = value
}
