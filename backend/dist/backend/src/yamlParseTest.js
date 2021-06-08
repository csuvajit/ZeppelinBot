"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cjs_1 = __importDefault(require("yawn-yaml/cjs"));
const js_yaml_1 = require("js-yaml");
const src = `
prefix: '!'

plugins:
  myplugin:
    config:
    
      can_do_thing: true
      
      # Lol
      can_do_other_thing: false
`;
const json = js_yaml_1.load(src);
const yaml = new cjs_1.default(src);
json.plugins.myplugin.config.can_do_thing = false;
yaml.json = json;
console.log(yaml.yaml);
