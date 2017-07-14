'use strict'

var entryModel = require('../models/polytogModel');

var togglClient = require('toggl-api');
var _ = require('underscore');
var moment = require('moment');

var toggl = new togglClient({
    apiToken: '#toggltoken#'
});

exports.list_all_entries = function (req, res, next) {
    toggl.getTimeEntries(function (err, timeEntries) {
        if (err) {
            res.send(err);
        }
        else{
          var processedEntries = _.map(timeEntries, function(timeEntry){
              var item = timeEntry;
              item.start = moment(timeEntry.start, moment.ISO_8601);
               item.stop = moment(timeEntry.stop, moment.ISO_8601);
                item.at = moment(timeEntry.at, moment.ISO_8601);
               return item;
          });

        res.json(_.sortBy(processedEntries, function(item) { return item.start }).reverse());
        }
        
    });
};

exports.get_current_entry = function (req, res, next) {
    toggl.getCurrentTimeEntry(function (err, timeEntry) {
        if (err)
            res.send(err);
        res.json(timeEntry);
    });
};

exports.create_a_entry = function (req, res, next) {
    var entry = new entryModel(req.body);

    toggl.createTimeEntry(entry, function (err, timeEntry) {
        if (err)
            res.send(err);
        res.json(req.body);
    });
};

exports.get_workspace = function (req, res, next) {
    toggl.getWorkspaceData(req.body.wid, function (err, workspace) {
        if (err)
            res.send(err);
        res.json(workspace);
    });
};

exports.get_all_workspaces = function (req, res, next) {
    toggl.getWorkspaces(function (err, workspaces) {
        if (err)
            res.send(err);
        res.json(workspaces);
    });
};