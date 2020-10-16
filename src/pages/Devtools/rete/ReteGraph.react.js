import React from "react";
import Rete from "rete";
import { createEditor } from "./rete";
import { updateEditor } from "./rete";
import "./styles.css";


class ReteGraph extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            refresh:1,
            editor:{}
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }     

    createE(ref){
        if(Object.keys(this.state.editor).length == 0){
            this.state.editor = new Rete.NodeEditor("work-flow@1.0.0", ref);
            createEditor(ref, this.state.editor, this.props.saveGraphData, this.props.editor, this.props.job_id)
        }
        else{
            updateEditor(this.state.editor, this.props.saveGraphData, this.props.editor, this.props.job_id)
        }
    }


    componentWillMount(){
    }

    componentDidMount(){
    }
  
    componentWillReceiveProps(props){
        if(props.refresh != this.state.refresh){
            console.log("refresh")
            this.state.editor.clear()
            //this.setState({refresh[props.job_id]:props.refresh})
            this.state.refresh = props.refresh
            this.forceUpdate()
        }
    }


    render() {
      return (
        <div className="App" >
          <div className="editor">
              <div id="container" className="container" style={{width:'100%'}}>
                <div 
                    ref={ref => ref && this.createE(ref)}
                    style={{width:'100%'}}
                >
                </div>
            </div>
            <div class="dock" id ={"dock_"+this.props.job_id}></div>
          </div>
        </div>
      );
    }
}
export default ReteGraph;
