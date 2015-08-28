/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

((ons) => {
  'use strict';

  const util = ons._util;

  class SplitterAnimator {
    layoutOnOpen() {}
    layoutOnClose() {}
    translate(distance) {}
    open(done) {
      done();
    }
    close(done) {
      done();
    }
    activate(contentElement, sideElement, maskElement) {}
    inactivate() {}
    isActivated() {
      throw new Error();
    }
  }

  class OverlaySplitterAnimator extends SplitterAnimator {
    isActivated() {
      return this._isActivated;
    }

    layoutOnClose() {
      animit(this._side)
        .queue({
          transform: 'translateX(0%)',
          width: this._side._getWidth()
        })
        .play();

      this._mask.style.display = 'none';
    }

    layoutOnOpen() {
      animit(this._side)
        .queue({
          transform: 'translateX(' + (this._side._isLeftSide() ? '' : '-') + '100%)',
          width: this._side._getWidth()
        })
        .play();

      this._mask.style.display = 'block';
    }

    /**
     * @param {Element} contentElement
     * @param {Element} sideElement
     * @param {Element} maskElement
     */
    activate(contentElement, sideElement, maskElement) {
      this._isActivated = true;
      this._content = contentElement;
      this._side = sideElement;
      this._mask = maskElement;

      this._setupLayout();
    }

    inactivate() {
      this._isActivated = false;
      this._clearLayout();
      this._content = this._side = this._mask = null;
    }

    /**
     * @param {Number} distance
     */
    translate(distance) {
      const side = this._side;

      side.style.transition = '';
      side.style.transform = 'translateX(' + (side._isLeftSide() ? '' : '-') + distance + 'px)';
    }

    _clearLayout() {
      const side = this._side;
      const mask = this._mask;

      side.style.zIndex = '';
      side.style.right = '';
      side.style.left = '';
      side.style.transform = side.style.webkitTransform = '';
      side.style.transition = side.style.webkitTransition = '';
      side.style.width = '';
      side.style.display = '';

      mask.style.display = 'none';
    }

    _setupLayout() {
      const side = this._side;

      side.style.zIndex = 3;
      side.style.display = 'block';

      if (side._isLeftSide()) {
        side.style.left = 'auto';
        side.style.right = '100%';
      } else {
        side.style.left = '100%';
        side.style.right = 'auto';
      }
    }

    /**
     * @param {Function} done
     */
    open(done) {
      const tranform = this._side._isLeftSide() ? 'translate3d(100%, 0px, 0px)' : 'translate3d(-100%, 0px, 0px)';

      animit.runAll(
        animit(this._side)
          .queue({
            transform: 'translate3d(0px, 0px, 0px)'
          })
          .queue({
            transform: tranform
          }, {
            duration: 0.3,
            timing: 'cubic-bezier(.1, .7, .1, 1)'
          })
          .queue({
            transition: '',
            transform: ''
          })
          .queue(callback => {
            callback();
            done();
          }),

        animit(this._mask)
          .queue({
            display: 'block',
            opacity: '0',
            delay: 0
          })
          .queue({
            opacity: '1'
          }, {
            duration: 0.3,
            timing: 'linear',
          })
      );
    }

    /**
     * @param {Function} done
     */
    close(done) {

      animit.runAll(
        animit(this._side)
          .queue({
            transform: 'translate3d(0px, 0px, 0px)'
          }, {
            duration: 0.3,
            timing: 'cubic-bezier(.1, .7, .1, 1)'
          })
          .queue(callback => {
            callback();
            this._side.style.webkitTransition = '';
            done();
          }),

        animit(this._mask)
          .queue({
            opacity: '0'
          }, {
            duration: 0.3,
            timing: 'linear',
          })
          .queue({
            display: 'none'
          })
      );
    }
  }

  ons._internal = ons._internal || {};

  ons._internal.SplitterAnimator = SplitterAnimator;
  ons._internal.OverlaySplitterAnimator = OverlaySplitterAnimator;

})(window.ons = window.ons || {});
