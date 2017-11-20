import {h, render, Component} from 'preact';

export default class HelloWorld extends Component {
    render (props) {
        return <p>Hello {props.name}!</p>
    }
}
