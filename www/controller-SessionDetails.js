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

  7 November 2016

*/

module.exports = function (controller, component) {

  component.data = {};
  component.token = '';
  component.sessionId = '';

  component.title = 'Session Data';

  component.onNewProps = function(newProps) {
    //console.log('controller-SessionDetails newProps: ' + JSON.stringify(newProps));
    component.data = newProps.data.data || {};
    if (newProps.data.id && newProps.data.id !== '') {
      component.title = 'Session ' + newProps.data.id;
    }
    else {
      // previously-displayed session no longer exists
      component.title = 'Session Data';
      component.data = {};
    }
    if (newProps.data.token) component.token = newProps.data.token;
  };

  component.expanded = true;

  var expandText = ' -->';	
  component.expand = false;
  component.isExpanded = function(keypath, value) {
    return component.expand;
  };


  function index(obj,is, value) {
    if (typeof is == 'string') {
      return index(obj,is.split('.'), value);
    }
    else if (is.length==1 && value!==undefined) {
      return obj[is[0]] = value;
    }
    else if (is.length==0) {
      return obj;
    }
    else {
      return index(obj[is[0]],is.slice(1), value);
    }
  }

  component.nodeClicked = function(obj) {
    if (obj.value === expandText) {
      var message = {
        type: 'getSessionSubscripts',
        params: {
          path: obj.path,
          expandText: expandText,
          token: component.token
        }
      };
      controller.send(message, function(responseObj) {
        if (responseObj.message.error) {
          // session no longer exists, so refresh the entire session display
          //console.log('session no longer exists so refresh session display');
          controller.emit('refreshSessionDisplay');
        }
        else {
          index(component.data, obj.path, responseObj.message.data);
          component.expand = true;
          component.setState({status: 'updated'});
        }
      });
    }
  };

  return controller;
};
