let websocket = null;
let pluginUUID = null;

function openWebsite() {
  if (websocket && (websocket.readyState === 1)) {
      const json = {
          'event': 'openUrl',
          'payload': {
              'url': 'https://www.ba-dresden.de'
          }
      };
      websocket.send(JSON.stringify(json));
  }
};

let sceneId;

function clicked() {
  console.log("User clicked save button.");

  // Get the input element by its ID
  let inputElement = document.getElementById('property-inspector/propertyinspector.html/id-input');
  
  // Get the value entered in the input
  sceneId = inputElement.value;
  
  // Log the value to the console
  console.log("Eingegebene ID:", sceneId);
}

let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

let raw = JSON.stringify({
  "Scene": sceneId
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