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

  22 August 2016

*/

module.exports = {

  servicesAllowed: {
    'ewd-react-tools': true
  },

  handlers: {
    login: function(messageObj, session, send, finished) {
      if (messageObj.params.password === this.userDefined.config.managementPassword) {
        session.timeout = 20 * 60;
        session.authenticated = true;
        finished({ok: true});    
      }
      else {
        finished({error: 'Invalid login attempt'});
      }
      return;
    },
    getServerName: function(messageObj, session, send, finished) {
      var serverName = '';
      if (this.userDefined.config && this.userDefined.config.serverName) serverName = this.userDefined.config.serverName;
      finished({serverName: serverName});
    },
    getBuildDetails: function(messageObj, session, send, finished) {
      if (session.authenticated) {
        var buildDetails = {
          nodejsBuild: process.version,
          dbInterface: this.db.version(),
          qoper8Build: this.build,
          docStoreBuild: this.documentStore.build,
          xpressBuild: this.xpress.build
        };
        if (this.userDefined.config && this.userDefined.config.qxBuild) buildDetails.qxBuild = this.userDefined.config.qxBuild;
        finished(buildDetails);
      }
      else {
        finished({error: 'Unauthenticated'});
      }
    },
    getMasterProcessDetails: function(messageObj, session, send, finished) {
      if (session.authenticated) {
        //var details = {};
        //if (this.userDefined.config && this.userDefined.config.masterProcessPid) details.pid = this.userDefined.config.masterProcessPid;
        //finished(details);
        finished({ok: true});
      }
      else {
        finished({error: 'Unauthenticated'});
      }
    },
    stopMasterProcess: function(messageObj, session, send, finished) {
      if (session.authenticated) {
        send({displayButton: true});
        finished({closeSocket: true});
      }
      else {
        finished({error: 'Unauthenticated'});
      }
    },

    getWorkerDetails: function(messageObj, session, send, finished) {
      if (session.authenticated) {
        finished({ok: true});
      }
      else {
        finished({error: 'Unauthenticated'});
      }
    },

    stopWorkerProcess: function(messageObj, session, send, finished) {
      finished({pid: messageObj.params.pid});
    },

    setPoolSize: function(messageObj, session, send, finished) {
      finished({poolSize: messageObj.params.poolSize});
    },

    getPoolSize: function(messageObj, session, send, finished) {
      finished({ok: true});
    },

    example: function(messageObj, session, send, finished) {
      finished({ok: 'example executed!'});
    }
  },



  workerResponseHandlers: {
    // allow interception by master process to augment / process the request after authentication in worker

    getMasterProcessDetails: function(message) {
      var stats = this.getStats();
      return {
        pid: process.pid,
        startTime: new Date(this.startTime).toLocaleString(),
        upTime: stats.uptime,
        memory: stats.memory
      }
    },

    getWorkerDetails: function(message, send) {
      // use special handler function for getting stats for master and workers
      var that = this;
      this.handleStats(function(messageObj) {
        var resultObj = {
          type: 'getWorkerDetails',
          results: messageObj.worker
        };
        send(resultObj);
      });
      return;
    },

    stopMasterProcess: function(message) {

      if (message.displayButton) return message ;

      // delay slightly to allow response to be sent to browser
      var that = this;
      setTimeout(function() {
        that.stop();
      }, 2000);
      //return {disconnect: true, error: 'EWD AppRunner has been shut down'};
      return {ok: true};
    },

    stopWorkerProcess: function(message) {
      this.stopWorker(message.pid);
      return {pid: message.pid};
    },

    getPoolSize: function(message) {
      return {poolSize: this.worker.poolSize};
    },

    setPoolSize: function(message) {
      this.setWorkerPoolSize(message.poolSize);
      return {ok: true};
    }

  }

};
