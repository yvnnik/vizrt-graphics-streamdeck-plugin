var websocket = null;
var pluginUUID = null;

function performHandshake(socket) {
  const connectionUrl = 'ws://127.0.0.1:6100';

  // WebSocket-Verbindung herstellen
  socket = new WebSocket(connectionUrl, 'vizrt-protocol');

  // Handshake-Header setzen
  socket.onopen = function() {
    const handshakeHeaders = [
      'GET / HTTP/1.1',
      'Upgrade: websocket',
      'Connection: Upgrade',
      'Sec-WebSocket-Protocol: vizrt-protocol',
      'Sec-WebSocket-Version: 13',
    ];

    socket.send(handshakeHeaders.join('\r\n'));
    console.log('WebSocket-Handshake erfolgreich.');
    
    // Nachricht an Vizrt senden
    const message = '#12646*TRANSFORMATION*POSITION COMMAND_INFO';
    socket.send(message);
  };

  socket.onmessage = function(event) {
    const receivedMessage = event.data;
    console.log('Neue Nachricht erhalten:', receivedMessage);
    // Verarbeite die eingehenden Nachrichten von Vizrt hier.
  };

  socket.onerror = function(error) {
    console.error('WebSocket-Fehler:', error);
    // Behandle den Fehler entsprechend.
  };

  socket.onclose = function(event) {
    console.log('WebSocket-Verbindung zu Vizrt geschlossen:', event);
    // Führe hier Aufräumarbeiten durch, wenn die Verbindung geschlossen wird.
  };
}

// Handshake-Funktion aufrufen
let socket;
performHandshake(socket);

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