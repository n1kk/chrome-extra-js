import HelloWorld from "./components/Hello";

console.log("popup runs")

import { h, render } from 'preact';

render((
    <div id="foo">
        <span>Hello, world!</span>
        <HelloWorld name='some dude'></HelloWorld>
    </div>
), document.body);