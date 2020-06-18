/**
 * skylark-domx-toggles - The skylark toggle plugin library for dom api extension
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx/skylark-domx-toggles/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-domx-toggles/toggles',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.attach("domx.toggles",{});
});
define('toggles',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.attach("domx.toggles",{});
});
define('CheckBox',[
  "skylark-langx/langx",
  "skylark-domx/browser",
  "skylark-domx/eventer",
  "skylark-domx/noder",
  "skylark-domx/geom",
  "skylark-domx/query",
  "skylark-domx-plugins",  
  "./toggles"
],function(langx,browser,eventer,noder,geom,$,fuelux){

  var Checkbox = plugins.Plugin.inherit({
    klassName: "Checkbox",

    pluginName : "lark.radio",

    options : {
      ignoreVisibilityCheck: false
    },

    _construct : function(elm,options) {
      this.overrided(elm,options);
      var $element = this.$();

      if (elm.tagName.toLowerCase() !== 'label') {
        throw new Error('Checkbox must be initialized on the `label` that wraps the `input` element. See https://github.com/ExactTarget/fuelux/blob/master/reference/markup/checkbox.html for example of proper markup. Call `.checkbox()` on the `<label>` not the `<input>`');
        return;
      }

      // cache elements
      this.$label = $element;
      this.$chk = this.$label.find('input[type="checkbox"]');
      this.$container = $element.parent('.checkbox'); // the container div

      if (!this.options.ignoreVisibilityCheck && this.$chk.css('visibility').match(/hidden|collapse/)) {
        throw new Error('For accessibility reasons, in order for tab and space to function on checkbox, checkbox `<input />`\'s `visibility` must not be set to `hidden` or `collapse`. See https://github.com/ExactTarget/fuelux/pull/1996 for more details.');
      }

      // determine if a toggle container is specified
      var containerSelector = this.$chk.attr('data-toggle');
      this.$toggleContainer = $(containerSelector);

      // handle internal events
      this.$chk.on('change', langx.proxy(this.itemchecked, this));

      // set default state
      this.setInitialState();
    },

    setInitialState: function setInitialState () {
      var $chk = this.$chk;

      // get current state of input
      var checked = $chk.prop('checked');
      var disabled = $chk.prop('disabled');

      // sync label class with input state
      this.setCheckedState($chk, checked);
      this.setDisabledState($chk, disabled);
    },

    setCheckedState: function setCheckedState (element, checked) {
      var $chk = element;
      var $lbl = this.$label;
      var $containerToggle = this.$toggleContainer;

      if (checked) {
        $chk.prop('checked', true);
        $lbl.addClass('checked');
        $containerToggle.removeClass('hide hidden');
        $lbl.trigger('checked.fu.checkbox');
      } else {
        $chk.prop('checked', false);
        $lbl.removeClass('checked');
        $containerToggle.addClass('hidden');
        $lbl.trigger('unchecked.fu.checkbox');
      }

      $lbl.trigger('changed.fu.checkbox', checked);
    },

    setDisabledState: function (element, disabled) {
      var $chk = $(element);
      var $lbl = this.$label;

      if (disabled) {
        $chk.prop('disabled', true);
        $lbl.addClass('disabled');
        $lbl.trigger('disabled.fu.checkbox');
      } else {
        $chk.prop('disabled', false);
        $lbl.removeClass('disabled');
        $lbl.trigger('enabled.fu.checkbox');
      }

      return $chk;
    },

    itemchecked: function (evt) {
      var $chk = $(evt.target);
      var checked = $chk.prop('checked');

      this.setCheckedState($chk, checked);
    },

    toggle: function () {
      var checked = this.isChecked();

      if (checked) {
        this.uncheck();
      } else {
        this.check();
      }
    },

    check: function () {
      this.setCheckedState(this.$chk, true);
    },

    uncheck: function () {
      this.setCheckedState(this.$chk, false);
    },

    isChecked: function () {
      var checked = this.$chk.prop('checked');
      return checked;
    },

    enable: function () {
      this.setDisabledState(this.$chk, false);
    },

    disable: function () {
      this.setDisabledState(this.$chk, true);
    },

    destroy: function () {
      this.$label.remove();
      return this.$label[0].outerHTML;
    }
  });


  Checkbox.prototype.getValue = Checkbox.prototype.isChecked;

  plugins.register(Checkbox);

  return toggles.Checkbox = Checkbox;
});

define('Radio',[
  "skylark-langx/langx",
  "skylark-domx/browser",
  "skylark-domx/eventer",
  "skylark-domx/noder",
  "skylark-domx/geom",
  "skylark-domx/query",
  "skylark-domx-plugins",  
  "./toggles"
],function(langx,browser,eventer,noder,geom,$,fuelux){


  var Radio = plugins.Plugin.inherit({
    klassName: "Radio",

    pluginName : "domx.radio",

    options : {
      ignoreVisibilityCheck: false
    },

    _construct : function(elm,options) {
      this.overrided(elm,options);
      if (elm.tagName.toLowerCase() !== 'label') {
        throw new Error('Radio must be initialized on the `label` that wraps the `input` element. See https://github.com/ExactTarget/fuelux/blob/master/reference/markup/radio.html for example of proper markup. Call `.radio()` on the `<label>` not the `<input>`');
      }

      // cache elements
      this.$label = this.$();
      this.$radio = this.$label.find('input[type="radio"]');
      this.groupName = this.$radio.attr('name'); // don't cache group itself since items can be added programmatically

      if (!this.options.ignoreVisibilityCheck && this.$radio.css('visibility').match(/hidden|collapse/)) {
        throw new Error('For accessibility reasons, in order for tab and space to function on radio, `visibility` must not be set to `hidden` or `collapse`. See https://github.com/ExactTarget/fuelux/pull/1996 for more details.');
      }

      // determine if a toggle container is specified
      var containerSelector = this.$radio.attr('data-toggle');
      this.$toggleContainer = $(containerSelector);

      // handle internal events
      this.$radio.on('change', langx.proxy(this.itemchecked, this));

      // set default state
      this.setInitialState();
    },

    setInitialState: function setInitialState () {
      var $radio = this.$radio;

      // get current state of input
      var checked = $radio.prop('checked');
      var disabled = $radio.prop('disabled');

      // sync label class with input state
      this.setCheckedState($radio, checked);
      this.setDisabledState($radio, disabled);
    },

    resetGroup: function resetGroup () {
      var $radios = $('input[name="' + this.groupName + '"]');
      $radios.each(function resetRadio (index, item) {
        var $radio = $(item);
        var $lbl = $radio.parent();
        var containerSelector = $radio.attr('data-toggle');
        var $containerToggle = $(containerSelector);


        $lbl.removeClass('checked');
        $containerToggle.addClass('hidden');
      });
    },

    setCheckedState: function setCheckedState (element, checked) {
      var $radio = element;
      var $lbl = $radio.parent();
      var containerSelector = $radio.attr('data-toggle');
      var $containerToggle = $(containerSelector);

      if (checked) {
        // reset all items in group
        this.resetGroup();

        $radio.prop('checked', true);
        $lbl.addClass('checked');
        $containerToggle.removeClass('hide hidden');
        $lbl.trigger('checked.fu.radio');
      } else {
        $radio.prop('checked', false);
        $lbl.removeClass('checked');
        $containerToggle.addClass('hidden');
        $lbl.trigger('unchecked.fu.radio');
      }

      $lbl.trigger('changed.fu.radio', checked);
    },

    setDisabledState: function setDisabledState (element, disabled) {
      var $radio = $(element);
      var $lbl = this.$label;

      if (disabled) {
        $radio.prop('disabled', true);
        $lbl.addClass('disabled');
        $lbl.trigger('disabled.fu.radio');
      } else {
        $radio.prop('disabled', false);
        $lbl.removeClass('disabled');
        $lbl.trigger('enabled.fu.radio');
      }

      return $radio;
    },

    itemchecked: function itemchecked (evt) {
      var $radio = $(evt.target);
      this.setCheckedState($radio, true);
    },

    check: function check () {
      this.setCheckedState(this.$radio, true);
    },

    uncheck: function uncheck () {
      this.setCheckedState(this.$radio, false);
    },

    isChecked: function isChecked () {
      var checked = this.$radio.prop('checked');
      return checked;
    },

    enable: function enable () {
      this.setDisabledState(this.$radio, false);
    },

    disable: function disable () {
      this.setDisabledState(this.$radio, true);
    },

    destroy: function destroy () {
      this.$label.remove();
      return this.$label[0].outerHTML;
    }

  });


  Radio.prototype.getValue = Radio.prototype.isChecked;

  plugins.register(Radio);

  return toggles.Radio = Radio;
});

define('skylark-domx-toggles/main',[
	"./toggles",
	"CheckBox",
	"Radio"
],function(toggles){
	return toggles;
});
define('skylark-domx-toggles', ['skylark-domx-toggles/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-toggles.js.map