app.service('ApiConfigInfo', ApiConfigInfo);

ApiConfigInfo.$inject = [];

function ApiConfigInfo() {
  this.Overseer = {
    url: 'http://localhost:8081/api/',
  };

  this.Kanbanik = {
    url: 'http://localhost:8080/kanbanik',
    commandStr: '/api?command={"commandName":',
  };
}
