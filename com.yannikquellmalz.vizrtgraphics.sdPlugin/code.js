function clicked() {
  console.log("User clicked save button.");

  // Get the input element by its ID
  let inputElement = document.getElementById('id-input');
  
  // Get the value entered in the input
  sceneId = inputElement.value;
  
  // Log the value to the console
  console.log("Eingegebene ID:", sceneId);
}

//Aktion definieren
var vizAction = {

  type: "com.yannikquellmalz.vizrtgraphics.action",

  onKeyDown: function (context, settings, coordinates, userDesiredState) {
    console.log("Key pressed by user!");

    //this.OpenURL();
    websocket.send("Teststring");
  },

  onKeyUp: function (context, settings, coordinates, userDesiredState) {
  
  },

  onWillAppear: function (context, settings, coordinates, userDesiredState) {
  
  },

  SetSettings: function (context, settings) {
    var json = {
      "event": "setSettings",
      "context": context,
      "payload": settings
    };

    websocket.send(JSON.stringify(json));
  },

  OpenURL: function () {
    var json = {
      "event": "openUrl",
      "payload": {
        "url": "https://www.ba-sachsen.de",
      }
    };

    websocket.send(JSON.stringify(json));
  }
};

//Funktion für Verbindung zum Stream Deck
function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
  pluginUUID = inPluginUUID

  // Open the web socket
  websocket = new WebSocket("ws://+:187");

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