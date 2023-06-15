let websocket = null;
let pluginUUID = null;

var vizAction = {
  type: "com.yannikquellmalz.vizrtgraphics.action",
  scene: '',

  onKeyDown: function () {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      "Scene": this.scene
    });

    let requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://127.0.0.1:61000/api/v1/renderer/layer/1", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  },

  onSendToPlugin: function (payload) {
    this.scene = payload['scene'];
  }
};

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
  pluginUUID = inPluginUUID

  // Open the web socket
  websocket = new WebSocket("ws://127.0.0.1:" + inPort);

  function registerPlugin(inPluginUUID) {
    var json = {
      "event": inRegisterEvent,
      "uuid": inPluginUUID
    };
    websocket.send(JSON.stringify(json));
  };
  websocket.onopen = function () {
    // WebSocket is connected, send message
    registerPlugin(pluginUUID);
  };

  websocket.onmessage = function (evt) {
    // Received message from Stream Deck
    var jsonObj = JSON.parse(evt.data);
    var event = jsonObj['event'];
    var action = jsonObj['action'];
    var context = jsonObj['context'];

    switch (event) {
      case "keyDown":
        vizAction.onKeyDown(jsonPayload);
        break;
      case "sendToPlugin":
        var jsonPayload = jsonObj['payload'];
        vizAction.onSendToPlugin(jsonPayload);
      default:
        break;
    }
  };

  websocket.onclose = function () {
    // Websocket is closed
  };
};