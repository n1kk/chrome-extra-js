import {h, render, Component} from 'preact';

export default class Editor extends Component {
  
  constructor(props) {
    super(props)
  }
  
  componentDidMount() {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/monokai");
    this.editor.getSession().setMode("ace/mode/javascript");
  }
  
  render (props) {
    return <pre id='editor' style="width:600px; height: 400px;">{props.code||""}</pre>
  }
}
