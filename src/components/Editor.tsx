import {h, render, Component} from 'preact';
import Ace = AceAjax.Ace;

export interface EditorProps {
  code: string
}

export default class Editor extends Component<EditorProps, any> {

  editor:any

  constructor(props) {
    super(props)
  }
  
  componentDidMount() {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/monokai");
    this.editor.getSession().setMode("ace/mode/javascript");
  }
  
  render (props:EditorProps) {
    return <pre id='editor' style="width:600px; height: 400px;">{props.code||""}</pre>
  }
}
