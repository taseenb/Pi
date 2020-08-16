define([
  // Main scripts
  'Pi',
  'backbone',
  'jquery',
  // Templates
  'text!tpl/Project/TabSelector.html'
], function (Pi, Backbone, $, TabSelectorHtml) {
  'use strict'

  var TabsSelectorView = Backbone.View.extend({
    tagName: 'li',
    className: 'tab_selector',
    /**
     * Init.
     */
    initialize: function () {
      this.$el = this.model.ideView.$el.find('.tab_selector')
      this.render() // render immediatly to activate data binding
    },
    /**
     * Render tabs selector.
     */
    render: function () {
      this.$el.append(
        _.template(TabSelectorHtml, {
          id: this.model.getId(),
          tabs: this.model.get('tabs').toArrayWithId(),
          openProjectAction: Pi.action.openProject
        })
      )
      this.$menu = this.$el.find('.dropdown-menu')
    },
    /**
     * Add an item to the list of tabs.
     * @param {model} tab The tab to add.
     */
    add: function (tab) {
      var tabUniqueId = tab.getTabUniqueId(),
        name = tab.get('name')
      var href = $('#tab' + tabUniqueId)
        .find('a')
        .attr('href')
      this.$el
        .find('ul.dropdown-menu')
        .append(
          '<li role="presentation" id="ts' +
            tabUniqueId +
            '"><a href="' +
            href +
            '">' +
            name +
            '</a></li>'
        )
    },
    /**
     * Remove an itam from the list of tabs.
     * @param {model} tab The tab to remove.
     */
    remove: function (tab) {
      this.$el.find('#ts' + tab.getTabUniqueId()).remove()
    },
    /**
     * Rename the item in the list according to the name of the tab.
     * @param {model} tab The tab to reference.
     */
    rename: function (tab) {
      $('#ts' + tab.getTabUniqueId() + ' a').text(tab.get('name'))
    }
  })

  return TabsSelectorView
})
