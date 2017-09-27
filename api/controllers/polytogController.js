'use strict'

var entryModel = require('../models/polytogModel');

var togglClient = require('toggl-api');
var _ = require('underscore');
var moment = require('moment');

var toggl = new togglClient({
      apiToken: '#toggltoken#'
});

exports.list_all_entries = function (req, res, next) {
    var start = moment(moment(), moment.ISO_8601).add(-3, 'd');
    var stop = moment(moment(), moment.ISO_8601).add(3, 'd');
    toggl.getTimeEntries(start.format("YYYY-MM-DDTHH:mm:ssZ"), stop.format("YYYY-MM-DDTHH:mm:ssZ"), function (err, timeEntries) {
        if (err) {
            res.send(err);
        }
        else {
            var processedEntries = _.map(_.filter(timeEntries, function (item) { return item.stop !== undefined; }), function (timeEntry) {
                var item = timeEntry;
                item.start = moment(timeEntry.start, moment.ISO_8601);
                item.stop = moment(timeEntry.stop, moment.ISO_8601);
                item.at = moment(timeEntry.at, moment.ISO_8601);
                return item;
            });

            res.json(_.sortBy(processedEntries, function (item) { return item.start; }).reverse());
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

exports.quick_create = function (req, res, next) {
    var data = req.body;
    // var entry = new entryModel(req.body);


    toggl.getTimeEntryData(data.id, function (err, timeEntry) {
        if (err)
            res.send(err);
        createDuplicateEntry(timeEntry, data.from, data.to);
        res.json(true);
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

function createDuplicateEntry(entryData, from, to) {

    var errors = [];
    // var fromDate = moment(from, moment.ISO_8601);
    //var toDate = moment(to, moment.ISO_8601);

    var copyDays = [];

    copyDays = enumerateDaysBetweenDates(from, to);

    for (var index = 0; index < copyDays.length; index++) {

        var start = moment(entryData.start, moment.ISO_8601);
        var stop = moment(entryData.stop, moment.ISO_8601);

        //start.add(index, "d");
        // stop.add(index, "d");
        // start.set({ 'year': copyDays[index].get('year'), 'month': copyDays[index].get('month'), 'date': copyDays[index].get('date') });

        //var copyYear = copyDays[index].get('year');
       // var copyMonth = copyDays[index].get('month');
        //var copyDay = copyDays[index].get('date');

        var copyStart = moment(copyDays[index], moment.ISO_8601);
       // var copyStop = moment(copyDays[index], moment.ISO_8601);

        var copyYear = copyStart.get('year');
        var copyMonth = copyStart.get('month');
        var copyDay = copyStart.get('date');

        // copyStart.set('hour', start.get('hour'));
        // copyStart.set('minute', start.get('minute'));
        // copyStart.set('second', start.get('second'));
        // copyStart.set('millisecond', start.get('millisecond'));

        // copyStop.set('hour', start.get('hour'));
        // copyStop.set('minute', start.get('minute'));
        // copyStop.set('second', start.get('second'));
        // copyStop.set('millisecond', start.get('millisecond'));

       // copyStart.set({ 'hour': copyYear, 'month': copyMonth, 'date': copyDay });
       // copyStart.set({ 'year': copyYear, 'month': copyMonth, 'date': copyDay });
        // start.set('year', copyYear);
        //  start.set('month', copyMonth);
        //   start.set('date', copyDay);

        start.set({ 'year': copyYear, 'month': copyMonth, 'date': copyDay });
        stop.set({ 'year': copyYear, 'month': copyMonth, 'date': copyDay });

        var dayItem = JSON.parse(JSON.stringify(entryData));
        dayItem.start = start.format("YYYY-MM-DDTHH:mm:ssZ");
        dayItem.stop = stop.format("YYYY-MM-DDTHH:mm:ssZ");
        var entry = new entryModel(dayItem);

        toggl.createTimeEntry(entry, function (err, timeEntry) {
            if (err)
                errors.push(err);
        });

    }

}

function enumerateDaysBetweenDates(startDate, endDate) {
    var dates = [];

    var currDate = moment.unix(startDate, moment.ISO_8601).startOf('day');
    var lastDate = moment.unix(endDate, moment.ISO_8601).startOf('day');

    if (currDate.isSame(lastDate, 'day')) {
        dates.push(currDate.clone());
        return dates;
    }

    // dates.push(currDate.clone());

    while (currDate.diff(lastDate) <= 0) {
        dates.push(currDate.clone().toDate());
        currDate.add(1, 'days');
    }


    // if (currDate.diff(lastDate) < 0) {
    //     dates.push(lastDate.clone());
    // }


    return dates;
}

