# csv-explorer
web based csv explorer using Nodejs

This project depends on MongoDB. [Steps to install MongoDB](https://docs.mongodb.com/manual/installation/).

On Mac and Linux run `npm start` to start up the server.

This will check if there's a local mongodb instance running, using `preg mongod`.
If it is not running, it will attempt to start it up with the `--dbpath data` option, 
which will store the put mongodb's data into the repos data folder.

When done, you can run `npm stop` to shut down mongodb again.


### other notes
There's currently no concept of multiple uploaded CSVs.
There's just one active CSV that every user can overwrite.
