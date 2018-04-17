/**
@module ember
@submodule ember-runtime
*/
import run from 'ember-metal/run_loop';
import { deprecate } from 'ember-metal/debug';
import { Mixin } from 'ember-metal/mixin';


/**
  ContainerProxyMixin is used to provide public access to specific
  container functionality.

  @class ContainerProxyMixin
  @private
*/
export default Mixin.create({
  /**
   The container stores state.

   @private
   @property {Ember.Container} __container__
   */
  __container__: null,

  /**
   Returns an object that can be used to provide an owner to a
   manually created instance.

   Example:

   ```
   let owner = Ember.getOwner(this);

   User.create(
     owner.ownerInjection(),
     { username: 'rwjblue' }
   )
   ```

   @public
   @method ownerInjection
   @return {Object}
  */
  ownerInjection: containerAlias('ownerInjection'),

  /**
   Given a fullName return a corresponding instance.

   The default behaviour is for lookup to return a singleton instance.
   The singleton is scoped to the container, allowing multiple containers
   to all have their own locally scoped singletons.

   ```javascript
   var registry = new Registry();
   var container = registry.container();

   registry.register('api:twitter', Twitter);

   var twitter = container.lookup('api:twitter');

   twitter instanceof Twitter; // => true

   // by default the container will return singletons
   var twitter2 = container.lookup('api:twitter');
   twitter2 instanceof Twitter; // => true

   twitter === twitter2; //=> true
   ```

   If singletons are not wanted an optional flag can be provided at lookup.

   ```javascript
   var registry = new Registry();
   var container = registry.container();

   registry.register('api:twitter', Twitter);

   var twitter = container.lookup('api:twitter', { singleton: false });
   var twitter2 = container.lookup('api:twitter', { singleton: false });

   twitter === twitter2; //=> false
   ```

   @public
   @method lookup
   @param {String} fullName
   @param {Object} options
   @return {any}
   */
  lookup: containerAlias('lookup'),

  /**
   Given a fullName return the corresponding factory.

   @private
   @method _lookupFactory
   @param {String} fullName
   @return {any}
   */
  _lookupFactory: containerAlias('lookupFactory'),

  /**
   @private
   */
  willDestroy() {
    this._super(...arguments);

    if (this.__container__) {
      run(this.__container__, 'destroy');
    }
  }
});

function containerAlias(name) {
  return function () {
    return this.__container__[name](...arguments);
  };
}

export function buildFakeContainerWithDeprecations(container) {
  let fakeContainer = {};
  let propertyMappings = {
    lookup: 'lookup',
    lookupFactory: '_lookupFactory'
  };

  for (let containerProperty in propertyMappings) {
    fakeContainer[containerProperty] = buildFakeContainerFunction(container, containerProperty, propertyMappings[containerProperty]);
  }

  return fakeContainer;
}

function buildFakeContainerFunction(container, containerProperty, ownerProperty) {
  return function() {
    deprecate(
      `Using the injected \`container\` is deprecated. Please use the \`getOwner\` helper to access the owner of this object and then call \`${ownerProperty}\` instead.`,
      false,
      {
        id: 'ember-application.injected-container',
        until: '3.0.0',
        url: 'http://emberjs.com/deprecations/v2.x#toc_injected-container-access'
      }
    );
    return container[containerProperty](...arguments);
  };
}
