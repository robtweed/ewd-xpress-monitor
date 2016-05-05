/*

 ------------------------------------------------------------------------------------
 | ewd-xpress-monitor: React.js-based Monitor/Management Application for ewd-xpress |
 |                                                                                  |
 | Copyright (c) 2016 M/Gateway Developments Ltd,                                   |
 | Reigate, Surrey UK.                                                              |
 | All rights reserved.                                                             |
 |                                                                                  |
 | http://www.mgateway.com                                                          |
 | Email: rtweed@mgateway.com                                                       |
 |                                                                                  |
 |                                                                                  |
 | Licensed under the Apache License, Version 2.0 (the "License");                  |
 | you may not use this file except in compliance with the License.                 |
 | You may obtain a copy of the License at                                          |
 |                                                                                  |
 |     http://www.apache.org/licenses/LICENSE-2.0                                   |
 |                                                                                  |
 | Unless required by applicable law or agreed to in writing, software              |
 | distributed under the License is distributed on an "AS IS" BASIS,                |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.         |
 | See the License for the specific language governing permissions and              |
 |  limitations under the License.                                                  |
 ------------------------------------------------------------------------------------

  27 April 2016

*/

"use strict"

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var {
  Button,
  Glyphicon,
  OverlayTrigger,
  Tooltip
} = ReactBootstrap;

var WorkerProcessDetails = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-WorkerProcessDetails')(this.props.controller, this);
    var id = 'worker' + this.props.pid + 'ShutdownBtn';
    this.tooltip = (
      <Tooltip 
        id = {id}
      >
        Shutdown this Worker Process
      </Tooltip>
    );
  },

  componentWillReceiveProps: function(newProps) {
    this.onNewProps(newProps);
  },

  render: function() {

    //console.log('Rendering WorkerProcessDetails Row!');
    //var componentPath = this.controller.updateComponentPath(this);

    return (
      <tr>
        <td>{this.props.pid}</td>
        <td>{this.props.noOfRequests}</td>
        <td>{this.props.available}</td>
        <td className = "pushRight">
          <OverlayTrigger 
            placement="top" 
            overlay={this.tooltip}
          >
            <Button 
              bsStyle="danger"
              onClick = {this.stopWorker}
            >
              <Glyphicon 
                glyph="remove"
              />
            </Button>
          </OverlayTrigger>
        </td>
      </tr>
    );
  }
});

module.exports = WorkerProcessDetails;

