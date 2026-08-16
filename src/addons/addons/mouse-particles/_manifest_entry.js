const manifest = {
  "name": "Mouse Particles",
  "description": "Adds spinning, fading ghost particles that trail behind your mouse.",
  "credits": [], 
  "info": [],   
  "tags": [
    "theme",
    "fun"
  ],
  "enabledByDefault": false,
  "userscripts": [
    {
      "url": "userscript.js"
    }
  ],
  "userstyles": [
    {
      "url": "userstyle.css"
    }
  ],
  "settings": [
    {
      "dynamic": true,
      "name": "Particle Image",
      "id": "particle_image",
      "type": "select",
      "potential_values": [
        {"id": "random", "name": "Random"},
        {"id": "green_flag", "name": "Green Flag"},
        {"id": "stop_sign", "name": "Stop Sign"},
        {"id": "pause", "name": "Pause"}
      ],
      "default": "random"
    }
  ]
};
export default manifest;