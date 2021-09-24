import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Header } from './components/Header';
import { getSubNodes, swapParentNode, getTreeRelation } from './services/TreeAPIService';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parentNodeId: '',
            nodeId: '',
            allNodes: [],
            treeNodes: [],
            swapResponse: true,
        };
    }

    swapParent = () => {
        swapParentNode(this.state.nodeId)
            .then(response => {
                this.setState({swapResponse: response})
            });
    };

    getRelation = () => {
        getTreeRelation()
            .then(allNodes => {
                this.setState({allNodes: allNodes});
            });
    };

    fetchAllNodes = () => {
        getSubNodes(this.state.parentNodeId)
            .then(subNodes => {
                this.setState({treeNodes: subNodes});
            });
    };

    listNodeTables = () => {
        const keys = [];
        for (let i in this.state.allNodes) {
            keys.push(i);
        }

        return (
                <div className='col-md-4' style={{paddingTop: '15px'}}>
                    <table>
                        <thead style={{border: '1px solid'}}>
                        <tr>
                            <th style={{border: '1px solid'}}>Parent Node </th>
                            <th style={{border: '1px solid'}}>Children </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            keys.map((row, idx) => (
                                <tr key={idx}>
                                    <td style={{border: '1px solid'}}>{row}</td>
                                    <td style={{border: '1px solid'}}>{new String(this.state.allNodes[row])}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
        );
    };

    listDescendants = () => {
        return (
                <div className='col-md-4' style={{paddingTop: '15px'}}>
                    <table>
                        <thead style={{border: '1px solid'}}>
                        <tr>
                            <th style={{border: '1px solid'}}>Node </th>
                            <th style={{border: '1px solid'}}>Descendants</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            <tr>
                                <td style={{border: '1px solid'}}>{this.state.parentNodeId}</td>
                                <td style={{border: '1px solid'}}>{new String(this.state.treeNodes)}</td>
                            </tr>
                        }
                        </tbody>
                    </table>
                </div>
        );
    };

    render() {
            return (
                <div className='App'>
                    <Header />
                    {
                        this.state.swapResponse === false ? (
                            <div className='alert alert-danger alert-dismissible fade show' role='alert'>
                                Cannot perform Operation: Parent does not exist
                                <button type='button' onClick={() => this.setState({swapResponse: true})} className='close' data-dismiss='alert' aria-label='Close'>
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </div>): ''
                    }
                    <div className='container mrgnbtm'>
                        <div className='row'>
                            <div className='col-md-4'>
                                <div style={{backgroundColor: '#C6ECB1'}} className='display-board'>
                                    <h4 style={{color: '#287F06'}}>Get Original Tree</h4>
                                    <div className='btn'>
                                        <button type='button' style={{marginLeft:'-10px'}} onClick={() => this.getRelation()} className='btn btn-warning'>Get Tree Relation</button>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div style={{backgroundColor: '#ADE5FF'}} className='display-board'>
                                    <h4 style={{color: '#0065A3'}}>List of Sub-Nodes</h4>
                                    <input
                                        className='form-control'
                                        type='text'
                                        placeholder='Enter Node-ID'
                                        value={this.state.parentNodeId}
                                        onChange={(event) => {
                                            this.setState({
                                                parentNodeId: event.target.value
                                            });
                                        }}
                                    />
                                    <div className='btn'>
                                        <button type='button' style={{marginLeft:'-10px'}} onClick={() => this.fetchAllNodes()} className='btn btn-warning'>Get all SubNodes</button>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div style={{backgroundColor: '#DAB0DD'}} className='display-board'>
                                    <h4 style={{color: '#5A0061'}}>Swap Parent Node</h4>
                                    <input
                                        className='form-control'
                                        type='text'
                                        placeholder='Enter Node-ID to be swapped'
                                        value={this.state.nodeId}
                                        onChange={(event) => {
                                            this.setState({
                                                nodeId: event.target.value
                                            });
                                        }}
                                    />
                                    <div className='btn'>
                                        <button type='button' style={{marginLeft:'-10px'}} onClick={() => this.swapParent()} className='btn btn-warning'>Swap Parent</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            {this.listNodeTables()}
                            {this.listDescendants()}
                        </div>
                    </div>
                </div>
            );
    }
}
export default App;
