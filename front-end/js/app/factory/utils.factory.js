angular.module('lifeboat')
.factory('utilsFactory', function() {

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
  
  return {
    JSON_to_URLEncoded: JSON_to_URLEncoded
  };
});