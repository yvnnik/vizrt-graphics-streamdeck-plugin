var websocket = null;
var pluginUUID = null;
let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

let raw = JSON.stringify({
  "Scene": "D7A66277-DEDF-574A-BDCEC5E58489AB68"
});

let requestOptions = {
  method: 'PUT',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

//Aktion definieren
var vizAction = {

  type: "com.yannikquellmalz.vizrtgraphics.action",

  onKeyDown: function (context, settings, coordinates, userDesiredState) {
    console.log("Key pressed by user!");

    fetch("http://127.0.0.1:61000/api/v1/renderer/layer/1", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  },
};

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
  pluginUUID = inPluginUUID

  // Open the web socket
  websocket = new WebSocket("ws://localhost:" + inPort);

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

    if (event == "keyDown") {
      var jsonPayload = jsonObj['payload'];
      var settings = jsonPayload['settings'];
      var coordinates = jsonPayload['coordinates'];
      var userDesiredState = jsonPayload['userDesiredState'];
      vizAction.onKeyDown(context, settings, coordinates, userDesiredState);
    }
    else if (event == "keyUp") {
      var jsonPayload = jsonObj['payload'];
      var settings = jsonPayload['settings'];
      var coordinates = jsonPayload['coordinates'];
      var userDesiredState = jsonPayload['userDesiredState'];
      vizAction.onKeyUp(context, settings, coordinates, userDesiredState);
    }
    else if (event == "willAppear") {
      var jsonPayload = jsonObj['payload'];
      var settings = jsonPayload['settings'];
      var coordinates = jsonPayload['coordinates'];
      vizAction.onWillAppear(context, settings, coordinates);
    }
  };

  websocket.onclose = function () {
    // Websocket is closed
  };
};

connectElgatoStreamDeckSocket();