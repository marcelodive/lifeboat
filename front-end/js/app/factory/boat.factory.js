angular.module('lifeboat')
.factory('boatFactory', function($http, API) {
  return {
    getBoats: () => {
      return $http.get(API.url + 'boats');
    },

    getMembers: (boatId,selectedDate) => {
      return $http.get(API.url + `boat/${boatId}/members/${selectedDate}`);
    },

    setPresenceForMember: (memberId, boatId, selectedDate, isPresent) => {
      return $http.get(API.url + `member/presence/${memberId}/${boatId}/${selectedDate}/${isPresent}`);
    }
  };
});