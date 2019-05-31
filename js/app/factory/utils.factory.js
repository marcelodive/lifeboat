angular.module('lifeboat')
.factory('utilsFactory', function($mdToast) {

  function JSON_to_URLEncoded (element,key,list) {
    var list = list || [];
    if(typeof(element)=='object'){
      for (var idx in element)
      JSON_to_URLEncoded(element[idx],key?key+'['+idx+']':idx,list);
    } else {
      list.push(key+'='+encodeURIComponent(element));
    }
    return list.join('&');
  }

  function showToaster (message) {
    const toast = $mdToast.simple()
      .textContent(message)
      .hideDelay(3000);

    $mdToast.show(toast);
  }

  function sanitizeDateForDB (date = null) {
    return ((typeof date === 'object') && (date !== null)) 
      ? date.toISOString().substring(0,10) 
      : date;
  }
  
  return {
    JSON_to_URLEncoded: JSON_to_URLEncoded,
    showToaster: showToaster,
    sanitizeDateForDB: sanitizeDateForDB
  };
});