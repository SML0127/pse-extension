import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Checkbox from 'rc-checkbox';

export class OpenNodeNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            query:"",
            indices:"",
            stateSelf:false
        }
        this.updateState()
        this.checkBox = this.checkBox.bind(this);
    }
    
    checkBox(){
      this.setState({stateSelf: !this.state.stateSelf})
    }


    updateState(){
        if(Object.keys(this.props.node.data).length >= 1){
            this.state.query = this.props.node.data['query']
            this.state.stateSelf = this.props.node.data['stateSelf']
        }
    }


  render() {
    const { node, bindSocket} = this.props;
    const { outputs, inputs, selected } = this.state;

    return (
      <div className={`node ${selected}`}>
        <div 
            onDoubleClick={() => {
                this.setState({modalShow: true})
                }
            }
        >
        <div className="title">
          {node.name}
        </div>

        {/* Outputs */}
        {outputs.map(output => (
                <div className="output" key={output.key}>
                <Socket
                    type="output"
                    socket={output.socket}
                    io={output}
                    innerRef={bindSocket}
                />
                </div>
        ))}
        {/* Inputs */}
        {inputs.map(input => (
            <div class="inline"className="input" key={input.key}>
                <Socket
                  type="input"
                  socket={input.socket}
                  io={input}
                  innerRef={bindSocket}
                />
            </div>
        ))}
        <Modal
            {...this.props}
            show={this.state.modalShow}
            backdrop="static"
            dialogClassName="modal-80w"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={ () => {
                this.setState({modalShow:false})
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Open Node
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class = 'row' style={{width:'100%'}}>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Tooltip>
                      XPath of list to iterate over 
                    </Tooltip>
                  }
                >
                  <label style={{width:'17%', marginTop:'5px', paddingLeft:'2%'}}>
                  XPath
                  </label>
                </OverlayTrigger>
                <Form.Textarea
                    row={2}
                    style={{width:'80%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.query}
                />
              </div>
              <div class = 'row' style = {{width:'100%', marginLeft:'1%', marginTop:'1%'}}>
                Add current url if there is no match in XPath
                <div
                  onClick = {()=> this.checkBox()}
                  style={{marginLeft:'1%'}}
                >
                  <Checkbox
                    checked={this.state.stateSelf}
                  />
                </div>

              </div>
              <div id="edit-selector" style={{float:"right", width:'100%'}}>
		            	 <Button color="secondary" action='select-selector' type="button"  style={{marginLeft:'90%', width:'10%'}}>
                    Get XPath
                  </Button>
		          </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                    onClick={(obj) => {
                            
                            var input_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1]['value']
                            this.setState({query: input_query, modalShow:false})
                            this.props.node.data['query'] = input_query
                            this.props.node.data['self'] = this.state.stateSelf
                        }
                    }
                >
                Save
                </Button>
                <Button color="secondary" 
                    onClick={(obj) => {
                            this.setState({modalShow:false})
                        }
                    }
                >
                Close
                </Button>
            </Modal.Footer>
        </Modal>
        </div>
        </div>
    );
  }
}

