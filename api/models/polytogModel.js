module.exports = Entry;

function Entry(data) {
    this.id = data.id;
    this.wid = data.wid;
    this.pid = data.pid;
    //this.billable = data.billable;
    this.billable = true;
    this.start = data.start;
    this.stop = data.stop;
    this.duration = data.duration;
    this.description = data.description;
   // this.duronly = data.duronly;
    this.duronly = false;
    this.created_with = data.created_with;
}