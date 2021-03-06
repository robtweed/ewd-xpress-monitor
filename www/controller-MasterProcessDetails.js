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

  31 October 2016

*/

module.exports = function (controller, component) {

  component.onNewProps = function(newProps) {
    //console.log('MasterProcessDetails newProps: ' + JSON.stringify(newProps));
  };

  component.stopMasterProcess = function() {
    controller.send({type: 'stopMasterProcess'});
  };

  component.pid = '';
  component.started = '';
  component.upTime = '';
  component.master = {
    memory: {
      rss: 'Not available',
      heapTotal: 'Not available',
      heapUsed: 'Not available'
    }
  };

  controller.on('startTimers', function() {
    if (!controller.timers.masterProcess) {
      controller.timers.masterProcess = setInterval(function() {
        controller.send({type: 'getMasterProcessDetails'});
      },30000);
    }
  });

  controller.on('getMasterProcessDetails', function(messageObj) {
    component.pid = messageObj.message.pid;
    component.started = messageObj.message.startTime;
    component.upTime = messageObj.message.upTime;
    component.master.memory = messageObj.message.memory;

    controller.emit('startTimers');

    if (!controller.timers.masterProcess) {
      controller.timers.masterProcess = setInterval(function() {
        controller.send({type: 'getMasterProcessDetails'});
      },30000);
    }

    component.setState({
      status: 'dataAvailable'
    });
  });

  controller.send({type: 'getMasterProcessDetails'});

  return controller;
};
