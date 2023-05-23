var websocket = null;
var pluginUUID = null;
var vizSocket;

//Funktion für Verbindung zu Viz
function vizConnection() {

  vizSocket = new WebSocket("ws://127.0.0.1:6100");

  vizSocket.onopen = function () {
    // WebSocket is connected, send message
    console.log('WebSocket-Connection erfolgreich.');

    const message = '#2763*TRANSFORMATION*POSITION*X GET';
    socket.send(message);
  };

  vizSocket.onmessage = function (event) {
    const receivedMessage = event.data;
    console.log('Neue Nachricht erhalten: ', receivedMessage);
    // Verarbeite die eingehenden Nachrichten von Vizrt hier.
  };

  vizSocket.onclose = function () {
    // Websocket is closed
    console.log("Websocket geschlossen.");
  };
};

//Aktion definieren
var vizAction = {

  type: "com.yannikquellmalz.vizrtgraphics.action",

  onKeyDown: function (context, settings, coordinates, userDesiredState) {
    console.log("Key pressed by user!");

    this.OpenURL();
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