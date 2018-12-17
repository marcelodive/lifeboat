angular.module('lifeboat')
.factory('boatFactory', function($http, API, utilsFactory) {
  return {
    getBoats: () => {
      return $http.get(API.url + 'boats');
    },

    getMembers: (boatId,selectedDate) => {
      return $http.get(API.url + `boat/${boatId}/members/${selectedDate}`);
    },

    setPresenceForMember: (memberId, boatId, selectedDate, isPresent) => {
      // return $http.get(API.url + `member/presence/${memberId}/${boatId}/${selectedDate}/${isPresent}`);
      // return $http.post(API.url + `member/presence`, {hi: 'hello'});
      const presenceObject = {memberId, boatId, selectedDate, isPresent};

      const encodedPresence = utilsFactory.JSON_to_URLEncoded(presenceObject);

      return $http({
        url: API.url + `member/presence`,                                                
        method: 'POST',
        data: encodedPresence,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      });
    }
  };
});