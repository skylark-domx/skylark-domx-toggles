/**
 * skylark-domx-toggles - The skylark toggle plugin library for dom api extension
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx/skylark-domx-toggles/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-query","skylark-domx-plugins","./toggles"],function(e,t,i,s,n,l){"use strict";var a=n.Plugin.inherit({klassName:"Collapsable",pluginName:"domx.toggles.collapsable",options:{toggle:!0},_construct:function(e,t){this.overrided(e,t),this.$element=this.$(),this.transitioning=null,this.options.toggle&&this.toggle()},dimension:function(){return this.$element.hasClass("width")?"width":"height"},show:function(){if(!this.transitioning&&!this.$element.hasClass("in")){var s=i.create("show.collapse");if(this.$element.trigger(s),!s.isDefaultPrevented()){var n=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[n](0).attr("aria-expanded",!0),this.transitioning=1;var l=function(){this.$element.removeClass("collapsing").addClass("collapse in")[n](""),this.transitioning=0,this.$element.trigger("shown.collapse")};if(!t.support.transition)return l.call(this);var o=e.camelCase(["scroll",n].join("-"));this.$element.one("transitionEnd",e.proxy(l,this)).emulateTransitionEnd(a.TRANSITION_DURATION)[n](this.$element[0][o])}}},hide:function(){if(!this.transitioning&&this.$element.hasClass("in")){var s=i.create("hide.collapse");if(this.$element.trigger(s),!s.isDefaultPrevented()){var n=this.dimension();this.$element[n](this.$element[n]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.transitioning=1;var l=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.collapse")};if(!t.support.transition)return l.call(this);this.$element[n](0).one("transitionEnd",e.proxy(l,this)).emulateTransitionEnd(a.TRANSITION_DURATION)}}},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}});return a.TRANSITION_DURATION=350,n.register(a),l.Collapsable=a});
//# sourceMappingURL=sourcemaps/Collapsable.js.map
