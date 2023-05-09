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
    /*
    var jsonObj = JSON.parse(evt.data);
    var event = jsonObj['event'];
    var action = jsonObj['action'];
    var context = jsonObj['context'];
    var jsonPayload = jsonObj['payload'] || {};

    if (event == "keyDown") {
      var settings = jsonPayload['settings'];
      var coordinates = jsonPayload['coordinates'];
      var userDesiredState = jsonPayload['userDesiredState'];
      myAction.onKeyDown(context, settings, coordinates, userDesiredState);
    }
    else if (event == "keyUp") {
      var settings = jsonPayload['settings'];
      var coordinates = jsonPayload['coordinates'];
      var userDesiredState = jsonPayload['userDesiredState'];
      myAction.onKeyUp(context, settings, coordinates, userDesiredState);
    }
    else if (event == "willAppear") {
      var settings = jsonPayload['settings'];
      var coordinates = jsonPayload['coordinates'];
      myAction.onWillAppear(context, settings, coordinates);
    }
    else if (event == "sendToPlugin") {

      if (jsonPayload.hasOwnProperty('background-image')) {

        const imageName = jsonPayload['background-image'];

        loadImageAsDataUri(`${imageName}.png`, function (imgUrl) {
          var json = {
            "event": "setImage",
            "context": context,
            "payload": {
              image: imgUrl || "",
              target: DestinationEnum.HARDWARE_AND_SOFTWARE
            }
          };
          websocket.send(JSON.stringify(json));
        })

      }
    }*/
  }; 

  websocket.onclose = function () {
    // Websocket is closed
  };
};