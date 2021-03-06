/*
* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
* Licensed under the Amazon Software License (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*   http://aws.amazon.com/asl/
*
* or in the "license" file accompanying this file. This file is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied.
* See the License for the specific language governing permissions and limitations
* under the License.
*/

import Service from '@ember/service';
import { defer } from 'rsvp';
import { set } from '@ember/object';
import { inject } from '@ember/service';
import Ember from 'ember';
const { Logger } = Ember;
/**
 * The authentication service handles
 * storing the authentication session
 * and user pools token.
 */
export default Service.extend({
  cognito: inject(),
	/**
	 * set by the initializer if a previous
	 * session is present, otherwise set on login
	 **/
  authenticated: undefined,
  /** JWT Token */
  token: undefined,
  accessToken: undefined,
  service: undefined,
  getProfile: function () {
    let then = defer();
    if (typeof this.get('cognito').get('user') !== 'undefined') {
      this.get('cognito').getUserAttributes()
        .then(function (data) {
          Logger.debug('cognito profile data: ', data);
          var profile = {
            'attributes': data,
            'service': 'cognito'
          };
          then.resolve(profile);
        }, function (err) {
          then.reject(err);
        });
    }
    return then.promise;
  },
  logout: function () {
    let cognito = this.get('cognito'),
      then = defer(),
      auth = this;
    cognito.clearIdentity()
      .then(function () {
        set(auth, 'authenticated', false);
        then.resolve();
      }, function (error) {
        Logger.error(error);
        then.reject(error);
      });
    return then.promise;
  }
});
