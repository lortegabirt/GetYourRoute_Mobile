export const environment = {
  production: true,
  backend: {
    baseUrl: 'http://10.2.149.78.labs.birt.eus/',
    endpoints: {
      login: 'api/v0/authentication/login/',
      signup: 'api/v0/authentication/signup/',
      itineraries: 'api/v0/itinerarys/',
      users: 'api/v0/users/',
      geolocations: 'api/v0/geolocations/',
      pointsOfInterest: 'api/v0/points-of-interest/'
    }
  }
};
