vcl 4.1;
import std;
import directors;

backend backend_01{
    .host = "localhost";
    .port = "3000";
    .probe = {
        .url = "/";
        .interval = 30s;
        .timeout = 10s;
        .window = 5;
        .threshold = 3;
    }
}

backend backend_02{
    .host = "localhost";
    .port = "3001";
    .probe = {
        .url = "/";
        .interval = 30s;
        .timeout = 10s;
        .window = 5;
        .threshold = 3;
    }
}

sub vcl_init{
    new vdir = directors.round_robin();
    vdir.add_backend(backend_01);
    vdir.add_backend(backend_02);
}
