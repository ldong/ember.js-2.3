import { runInDebug } from 'ember-metal/debug';
import assign from 'ember-metal/assign';
import EmberError from 'ember-metal/error';
import { _addBeforeObserver } from 'ember-metal/observer';

import hasElement from 'ember-views/views/states/has_element';
/**
@module ember
@submodule ember-views
*/

var inDOM = Object.create(hasElement);

assign(inDOM, {
  enter(view) {
    // Register the view for event handling. This hash is used by
    // Ember.EventDispatcher to dispatch incoming events.
    if (view.tagName !== '') {
      view._register();
    }

    runInDebug(function() {
      _addBeforeObserver(view, 'elementId', function() {
        throw new EmberError('Changing a view\'s elementId after creation is not allowed');
      });
    });
  },

  exit(view) {
    view._unregister();
  }
});

export default inDOM;
