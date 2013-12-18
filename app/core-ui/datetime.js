define(['app', 'backbone', 'moment', 'core/UIView'], function(app, Backbone, moment, UIView) {

  "use strict";

  var Module = {};

  Module.id = 'datetime';
  Module.dataTypes = ['DATETIME']; // 'DATE', 'TIME'

  Module.variables = [
    {id: 'readonly', ui: 'checkbox'},
    {id: 'include_seconds', ui: 'checkbox'},
    {id: 'contextual_date_in_listview', ui: 'checkbox'},
    {id: 'auto-populate_when_hidden_and_null', ui: 'checkbox', def:'1'}
  ];

  var template =  '<label>{{capitalize name}} <span class="note">{{note}}</span></label> \
                  <style type="text/css"> \
                  input.date { \
                    display: inline; \
                    display: -webkit-inline-flex; \
                    width: 150px; \
                    padding-right: 4px; \
                    margin-right: 5px; \
                  } \
                  input.time { \
                    display: inline; \
                    display: -webkit-inline-flex; \
                    width: 100px; \
                    padding-right: 4px; \
                    margin-right: 5px; \
                  } \
                  input.seconds { \
                    width: 100px !important; \
                  } \
                  a.now { \
                    \
                  } \
                  </style> \
                  <input type="date" class="date" {{#if hasDate}}value="{{valueDate}}"{{/if}}> \
                  <input type="time" class="time{{#if includeSeconds}} seconds{{/if}}" {{#if hasDate}}value="{{valueTime}}"{{/if}}> \
                  <a class="now">Now</a> \
                  <input class="merged" type="hidden" {{#if hasDate}}value="{{valueMerged}}"{{/if}} name="{{name}}" id="{{name}}">';

  //var format = 'ddd, DD MMM YYYY HH:mm:ss';
  var format = 'YYYY-MM-DD HH:mm';

  Module.Input = UIView.extend({

    tagName: 'fieldset',

    template: Handlebars.compile(template),

    events: {
      'blur  input.date':   'updateValue',
      'blur  input.time':   'updateValue',
      'change  input.date': 'updateValue',
      'change  input.time': 'updateValue',
      'click .now':         'makeNow'
    },

    makeNow: function() {
      this.value = moment();
      this.render();
    },

    updateValue: function() {
      var time = this.$('input[type=time]').val();
      var date = this.$('input[type=date]').val();
      var val = date + ' ' + time;

      if (moment(val).isValid()) {
        this.$('#'+this.name).val(moment(val).format(format));
      } else {
        this.$('#'+this.name).val('');
      }
    },

    // The HTML5 date tag accepts RFC3339
    // YYYY-MM-DD
    // ---
    // The HTML5 time tag acceps RFC3339:
    // 17:39:57
    serialize: function() {
      var data = {};
      var date = this.value;

      data.hasDate = this.value.isValid();

      data.valueDate = date.format('YYYY-MM-DD');
      data.valueTime = date.format('HH:mm');
      data.valueMerged = date.format(format);
      data.name = this.name;
      data.note = this.columnSchema.get('comment');

      return data;
    },

    initialize: function(options) {
      this.value = moment(this.model.get(this.name));
    }

  });

  Module.validate = function(value, options) {
    var m = moment(value);

    console.log(value);

    if (m.isValid() || value === '' || value === null || value === undefined) {
      console.log(value === '');
      return;
    }

    console.log(value);

    return "Not a valid date";
  };

  //@todo make contextual date a ui
  Module.list = function(options) {
    return options.value;
  };

  return Module;

});