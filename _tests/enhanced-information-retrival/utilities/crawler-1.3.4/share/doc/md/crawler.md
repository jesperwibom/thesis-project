crawler(1) - A crawler to move data from point A to point B
====================================================================

## SYNOPSIS

Usage: crawler [ crawl | testit | restart | resume | refresh ] [ options ]

## DESCRIPTION

The Data Crawler is used to crawl various repositories of data, such as content management systems and filesystems,
and then push the resulting documents to a remote service.

## GLOBAL OPTIONS

    --version
        Displays program version
    --help
        Displays this usage text

## COMMANDS

### crawl [ options ]

Runs a crawl with the current configuration.

    -c <value> | --config <value>  # Specifies the configuration file to use. Default is "config/crawler.conf".
    --pii-checking <value>         # Toggles PII checking

### testit [ options ]

Runs a test crawl, which crawls only the seed URL and displays any enqueued URLs. If the seed URL results in
indexable content (e.g., it is a document), then that content is sent to the output adapter and the content
is printed to the screen. If the seed URL retrieval causes URLs to be enqueued, those URLs will be displayed,
and no content will be sent to the output adapter. By default, five enqueued URLs are displayed.

    -c <value> | --config <value>  # Specifies the configuration file to use. Default is "config/crawler.conf".
    -l <n> | --limit <n>           # Limits the number of enqueued URLs that are displayed.
    --pii-checking <value>         # Toggles PII checking

### restart [ options ]

Runs a Restart crawl; starts a new crawl with the current configuration.

    -c <value> | --config <value>  # Specifies the configuration file to use.
    --pii-checking <value>         # Toggles PII checking

### resume [ options ]

Resumes a crawl from where it stopped.

    -c <value> | --config <value>  # Specifies the configuration file to use.
    --pii-checking <value>         # Toggles PII checking

### refresh [ options ]

Refreshes a previous crawl.

    -c <value> | --config <value>  # Specifies the configuration file to use.
    --pii-checking <value>         # Toggles PII checking

## EXAMPLES

Run a crawl using the configuration file at `config/crawler.conf`:

    crawler crawl

Run a test using the configuration file at `config/crawler.conf`:

    crawler testit

Run a crawl using the configuration file at `/home/watson/office-share.conf`:

    crawler crawl --config /home/watson/office-share.conf

Display usage, including version:

    crawler --help

## CONFIGURATION

`crawler` requires a configuration file for its options. Examples of configuration files are provided in the `share` directory
within `crawler`'s installation directory. Copy these examples and modify them. *Do not modify the examples in place.*

Without specifying the `--config | -c` option, `crawler` will look for its configuration in the `config` directory of the
directory in which `crawler` is started. That is, `crawler` will look for `config/crawler.conf`.

## DIAGNOSTICS

Use these features to diagnose problems.

### Debugging

Activates debugging mode. In the `crawler.conf` file, set:

    debugging.full_node_debugging = true

### Logging

Enables logging. In the `log4j_custom.properties` file, set:

    log4j.rootLogger=INFO, Console, Log

This is the default logging level for file output.  For the console log, the default is:

    log4j.appender.Console.Threshold=WARN

Logging levels may be set to the following values:

    OFF - The highest possible rank, this is intended to turn off logging.
    FATAL - Desginates very severe error events that will presumably lead the application to abort.
    ERROR - Designates error events that may still allow the application to continue running.
    WARN - Designates potentially harmful situations.
    INFO - Designates informational messages highlighting the progress of the application at a coarse-grained level.
    DEBUG - Designates fine-grained informational events that are most useful to debug an application.
    TRACE - Designates finer-grained informational events than DEBUG.
    ALL - The lowest possible rank, this is intended to turn on all logging.

## THROTTLING

Defines sizing limitations, to help manage throughput. In the `crawler.conf` file, set:

`shutdown_timeout` Specifies the timeout value, in minutes, before shutting down the application; the default value is 10.

    shutdown_timeout = <n>

`output_limit` is the highest number of indexable items that the portable crawler will send simultaneously
to the output adapter, awaiting a return; the default value is 10. This may be further limited by cores available to do work.

    output_limit = <n>

`input_limit` Limits the number of URLs that can be requested from the connector at one time; the default value is 3.

    input_limit = <n>

`output_timeout` is the amount of time, in seconds, before the portable crawler gives up on a request
to the output adapter, and then removes the item from the limit queue, to allow more processing. The default value is 150.

    output_timeout = <n>

Consideration should be given to the constraints imposed by the output adapter as those constraints may relate to the
limits defined here. The `output_limit` defined above only relates to how many indexable objects can be sent to the
output adapter at once. Once an indexable object is sent to the output adapter, it is "on the clock," as defined by
the `output_timeout` variable. It is possible that the output adapter itself has a throttle preventing it from being
able to process as many inputs as it receives. For instance, the orchestration output adapter may have a connection
pool, configurable for HTTP connections to the service. If it defaults to 8, for example, and if you set the
`output_limit` to a number greater than what is configured for that connection pool, then you will have processes, on
the clock, waiting for a turn to execute. You may then experience timeouts.

`num_threads` The number of parallel threads that can be run at one time. This value can be either an integer, 
which specifies the number of parallel threads directly, or it can be a string, with the format `"xNUM"`, specifying 
the multiplication factor of the number of available processors. The default value is "x1.5", or 1.5 times the number of available processors (as taken with `Runtime.availableProcessors`).

    num_threads = <n>

The formula for calculating parallelism in the Data Crawler pool is: `min(maxThreads, max(minThreads, numThreads))`.

## ENVIRONMENT VARIABLE `CRAWLER_OPTS` 

Following are properties that can be passed to `crawler` via the `CRAWLER_OPTS` environment variable, listed with default values.

Pass them like so:

    CRAWLER_OPTS="-Dproperty=value -Dproperty=value" crawler

These should only be changed for debugging, and only under the direction of IBM Support.

### cfa.java_bin

`cfa.java_bin` can change the `java` command used to start the Connector Framework Input Adapter. By default, `crawler` uses
the same `java` binary that is used to launch `crawler` itself.

This can also be changed by setting the `java.home` property, which will then be used to calculate the path to the `java` executable.

### cfa.lib_dir

`cfa.lib_dir` changes the path to the Connector Framework's `lib` directory. This should rarely need to be changed. By default,
`crawler` uses the `lib` directory inside the calculated path to the Connector Framework, generally simply `connectorFramework`.

### cfa.framework_jars_dir

`cfa.framework_jars_dir` changes the path to the Connector Framework's jars directory, which is, by default, in `connectorFramework/<version>/lib/java`.

### cfa.plugins_dir

`cfa.plugins_dir` specifies the path to the Connector Framework's plugins directory, where the actual Connectors are stored.
By default, this is built from the `framework_jars_dir` and will be `connectorFramework/<version>/lib/java/plugins`.

## KNOWN LIMITATIONS

Details known limitations in the current release of the Data Crawler

* The Data Crawler may hang when running the Filesystem connector with an invalid or missing URL.
* Configure the `urls_to_filter` value in the `config/crawler.conf` file such that all the whitelist URLs or RegExes are included in a single RegEx expression.
* The path to the configuration file passed in the `--config | -c` option must be a qualified path. That is, it must be in the relative formats `config/crawler.conf` or `./crawler.conf`, or absolute path `/path/to/config/crawler.conf`. Specifying just `crawler.conf` is  possible if and only if files referenced using `include` in the `crawler.conf` file are in-lined instead of using `include`. For example, `discovery/discovery_service.conf` is `include`'d in order to make configuration easier to read. Its content must be copied into `crawler.conf` within the `output_adapter.discovery_service` key in order to use an unqualified path in the config option.

## CHANGE LOG

See the `changelog.txt` file in your installation directory for a list of changes in this release.

## AUTHOR

IBM Watson - https://www.ibm.com/smarterplanet/us/en/ibmwatson/

Made by yinz in Pittsburgh.

## SEE ALSO

vcrypt(1)

crawler.conf(5)

crawler-options.conf(5)

crawler-seed.conf(5)

orchestration_service.conf(5)
