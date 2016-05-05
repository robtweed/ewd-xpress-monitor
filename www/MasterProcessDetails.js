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
  Panel,
  Table,
  Button,
  Glyphicon,
  OverlayTrigger,
  Tooltip
} = ReactBootstrap;

var MasterProcessDetails = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-MasterProcessDetails')(this.props.controller, this);
    this.title = (
      <h2>Master Process Details</h2>
    );
    this.tooltip = (
      <Tooltip 
        id = "masterProcessShutdownBtn"
      >
        Shutdown ewd-appRunner
      </Tooltip>
    );

  },

  componentWillReceiveProps: function(newProps) {
    this.onNewProps(newProps);
  },

  render: function() {

    console.log('Rendering MasterProcessDetails!');

    var componentPath = this.controller.updateComponentPath(this);

    return (
      <Panel 
        header = {this.title}
      >
        <Table 
          responsive  
          className = "overviewTable"
        >
          <tbody>
            <tr>
              <td>{this.pid}</td>
              <td className="pushRight">
                <OverlayTrigger 
                  placement="top" 
                  overlay={this.tooltip}
                >
                  <Button 
                    bsStyle="danger"
                    onClick = {this.stopMasterProcess}
                  >
                    <Glyphicon 
                      glyph="remove"
                    />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
            <tr>
              <td>Started</td>
              <td className="pushRight">{this.started}</td>
            </tr>
            <tr>
              <td>Uptime</td>
              <td className="pushRight">{this.upTime}</td>
            </tr>
          </tbody>
        </Table>
      </Panel>
    );
  }
});

module.exports = MasterProcessDetails;

