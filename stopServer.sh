echo 'Stopping nodeJS server';
nodePid=$(pgrep node);
kill "$nodePid"

