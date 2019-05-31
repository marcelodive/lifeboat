angular.module('lifeboat')
.factory('boatFactory', function($http, API, utilsFactory) {
  return {
    getBoats: () => {
      return $http.get(API.url + 'boats');
    },

    getMembers: (boatId, selectedDate) => {
      return $http.get(API.url + `boat/${boatId}/members/${selectedDate}`);
    },

    setPresenceForMember: (memberId, boatId, selectedDate, isPresent) => {
      const presenceObject = {memberId, boatId, selectedDate, isPresent};
      const encodedPresence = utilsFactory.JSON_to_URLEncoded(presenceObject);

      return $http({
        url: API.url + `member/presence`,                                                
        method: 'POST',
        data: encodedPresence,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      });
    },

    registryMember: (member) => {
      const encodedMember = utilsFactory.JSON_to_URLEncoded({member});

      return $http({
        url: API.url + `member/registry`,
        method: 'POST',
        data: encodedMember,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      });
    },

    disconnectMember: (memberId, justification = '') => {
      const encodedMemberId = utilsFactory.JSON_to_URLEncoded({memberId, justification});

      return $http({
        url: API.url + `member/disconnect`,
        method: 'POST',
        data: encodedMemberId,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      });
    },

    getMinistration: (boatId, selectedDate) => {
      return $http.get(API.url + `boat/${boatId}/ministration/${selectedDate}`);
    },

    saveMinistration: (ministration, boatId, selectedDate) => {
      const ministrationObject = {ministration, boatId, selectedDate};
      const encodedMinistration = utilsFactory.JSON_to_URLEncoded(ministrationObject);

      return $http({
        url: API.url + `boat/ministration`,
        method: 'POST',
        data: encodedMinistration,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      });
    },

    saveReunionPhoto: (photoBase64, boatId, selectedDate) => {
      const dataToSend = {photoBase64, boatId, selectedDate};
      const encodedData = utilsFactory.JSON_to_URLEncoded(dataToSend);

      return $http({
        url: API.url + `boat/reunion-photo`,
        method: 'POST',
        data: encodedData,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      });
    },

    getReunionPhoto: (boatId, selectedDate) => {
      return $http.get(API.url + `boat/${boatId}/reunion-photo/${selectedDate}`);
    }
  };
});