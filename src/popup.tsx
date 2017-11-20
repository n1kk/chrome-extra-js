import HelloWorld from "./components/Hello";
import * as monaco from "monaco-editor";

console.log("popup runs")

import { h, render } from 'preact';

render((
    <div id="foo">
      <div id='editor'></div>
      <span>Hello, world!</span>
      <HelloWorld name='some dude'></HelloWorld>
    </div>
), document.body);

let editor = ace .edit("editor");
