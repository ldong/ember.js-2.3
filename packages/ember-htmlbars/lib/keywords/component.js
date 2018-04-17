/**
  @module ember
  @submodule ember-templates
  @public
*/
import { keyword } from 'htmlbars-runtime/hooks';
import closureComponent from 'ember-htmlbars/keywords/closure-component';
import isEnabled from 'ember-metal/features';

/**
  The `{{component}}` helper lets you add instances of `Ember.Component` to a
  template. See [Ember.Component](/api/classes/Ember.Component.html) for
  additional information on how a `Component` functions.
  `{{component}}`'s primary use is for cases where you want to dynamically
  change which type of component is rendered as the state of your application
  changes. The provided block will be applied as the template for the component.
  Given an empty `<body>` the following template:

  ```handlebars
  {{! application.hbs }}
  {{component infographicComponentName}}
  ```

  And the following application code:

  ```javascript
  export default Ember.Controller.extend({
    infographicComponentName: computed('isMarketOpen', {
      get() {
        if (this.get('isMarketOpen')) {
          return 'live-updating-chart';
        } else {
          return 'market-close-summary';
        }
      }
    })
  });
  ```

  The `live-updating-chart` component will be appended when `isMarketOpen` is
  `true`, and the `market-close-summary` component will be appended when
  `isMarketOpen` is `false`. If the value changes while the app is running,
  the component will be automatically swapped out accordingly.
  Note: You should not use this helper when you are consistently rendering the same
  component. In that case, use standard component syntax, for example:

  ```handlebars
  {{! application.hbs }}
  {{live-updating-chart}}
  ```

  ## Nested Usage

  The `component` helper can be used to package a component path with initial attrs.
  The included attrs can then be merged during the final invocation.

  For example, given a `person-form` component with the following template:

  ```handlebars
  {{yield (hash
      nameInput=(component "input" value=model.name placeholder="First Name"))}}
  ```

  The following snippet:

  ```
  {{#person-form as |form|}}
    {{component form.nameInput placeholder="Username"}}
  {{/person-form}}
  ```

  would output an input whose value is already bound to `model.name` and `placeholder`
  is "Username".

  @method component
  @since 1.11.0
  @for Ember.Templates.helpers
  @public
*/
export default function(morph, env, scope, params, hash, template, inverse, visitor) {
  if (isEnabled('ember-contextual-components')) {
    if (morph) {
      keyword('@element_component', morph, env, scope, params, hash, template, inverse, visitor);
      return true;
    }
    return closureComponent(env, params, hash);
  } else {
    keyword('@element_component', morph, env, scope, params, hash, template, inverse, visitor);
    return true;
  }
}
