import HelloWorld from "./components/Hello";

console.log("popup runs")

import { h, render } from 'preact';
import Editor from "./components/Editor";

render((
  <div id="foo">
    <span>Hello, world!</span>
    <HelloWorld name='some dude'/>
    <Editor code='console.log("Hello World!")'/>
  </div>
), document.body);



