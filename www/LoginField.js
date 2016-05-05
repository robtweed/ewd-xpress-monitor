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
  Input
} = ReactBootstrap;

var LoginField = React.createClass({

  getInitialState: function() {
    return {value:''}
  },

  componentWillMount: function() {
    this.controller = require('./controller-LoginField')(this.props.controller, this);
  },

  componentDidMount: function() {
    this.focusOnAccessCode();
  },

  render: function() {

    console.log('LoginField rendering');

    this.controller.updateComponentPath(this);

    return (
      <Input
        type='password'
        value={this.state.value}
        placeholder={this.props.placeholder}
        bsStyle={this.validationState()}
        hasFeedback
        ref={this.props.fieldname}
        groupClassName='password-input'
        label={this.props.label}
        onChange={this.handleChange}
      />
    )
  }
});

module.exports = LoginField;
