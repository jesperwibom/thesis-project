# Configuring the Data Crawler

`crawler` requires a configuration file for its options. Examples of configuration are provided in the `share` directory
within `crawler`'s installation directory. Copy these examples and modify them. *Do not modify the examples in place.*

The file `crawler.conf` contains information that tells the crawler which files to use for its crawl (input adapter),
where to send the collection of crawled files once the crawl has been completed (output adapter), and other crawl management options.

**Note**: All file paths are relative to the `config` directory, except where noted.

The options that may be set in this file are:

## Input adapter
*  **class** - Internal use only; defines the Data Crawler input adapter class. Default value is: `com.ibm.watson.crawler.connectorframeworkinputadapter.Crawl`.
*  **config** - Internal use only; defines the Connector Framework configuration. The default configuration key within this block to pass to the chosen input adapter is: `connector_framework`. **Note** - The Connector framework is what allows you to talk to your data. It could be internal data within the enterprise, or it could be external data on the web or in the cloud. The connectors allow access to a number of different data sources, while connecting is actually controlled by the crawling process.
  -  **IMPORTANT** - Data retrieved by the Connector Framework Input Adapter is cached locally. It is not stored encrypted. By default, the data is cached to a temporary directory that should be cleared on reboot, and should be readable only by the user who executed the crawler command. There is a chance that this directory could outlive the crawler if the connector framework was to go away before it could clean up after itself. Carefully consider the location for your cached data - you may put it on an encrypted filesystem, but be aware of the performance implications of doing so. Only you can decide the appropriate balance between speed and security for your crawls.
*  **crawl_config_file** - The configuration file to use for the crawl. Default value is: `connectors/filesystem.conf`.
*  **crawl_seed_file** - The crawl seed file to use for the crawl. Default value is: `seeds/filesystem-seed.conf`.
*  **id_vcrypt_file** - Keyfile used for data encryption by the crawler; the default key included with the crawler is `id_vcrypt`.
Use the vcrypt script in the `bin` folder if you need to generate a new id_vcrypt_file
*  **crawler_temp_dir** - The Crawler temporary folder for connector logs. Default value, `tmp`, is provided. If it doesn't already exist, the `tmp` folder will be created in the current working directory.
*  **extra_jars_dir** - Internal use only; adds extra JARs to the Connector Framework classpath.
This value must be `oakland` when using the SharePoint connector, and `database` when using the database connector. You can leave it empty (i.e., empty string "") when using other connectors.
  **Note**: Relative to the connector framework `lib/java` directory.
*  **urls_to_filter** - New-line separated whitelist of URLs to crawl, in regular expression form. The Data Crawler only crawls URLs which match one of the regular expressions provided. The domain list contains the most common top-level domains; add to it if necessary. The file extension-type list contains the file extensions that the Orchestration Service supports, as of this release of the Data Crawler. Ensure that your seed URL domain is allowed by the filter. For example, if the seed URL looks like `http://testdomain.test.in`, add "`in`" to the domain filter. Ensure that your seed URL will not be excluded by a filter, or the Crawler may hang.
*  **max_text_size** - The maximum size, in bytes, that a document can be before it is written to disk by the Connector Framework. Adjusting this higher will decrease the amount of documents written to disk, but it will increase the memory requirement.
*  **extra_vm_params** - Allows you to add extra Java parameters to the command used to launch the Connector Framework.
*  **bootstrap_logging** - Writes connector framework startup log; useful for advanced debugging only. Values are `true` or `false`. Log file will be written to `crawler_temp_dir`.

## Storage adapter

Allows for storage of the internal state of the crawler to a database. This setting is necessary for the crawl `restart` and `resume` options to work correctly.

```javascript
storage_adapter {
 config = "storage_in_db"
  storage_in_db {
    include "storage/database_storage.conf"
  } 
}
```
The file referenced, `storage/database_storage.conf`, by default uses a H2 database. You can use any database with a JDBC driver, instead of the provided defaults. Refer to the documentation for your JDBC driver to find specific information about some of these settings. The default options can be changed directly by opening the `config/storage/database_storage.conf` file, and modifying the following values specific to your use case:

*  **class** - This class points to the database adapter class to use. Default value is `com.ibm.watson.crawler.storageadapters.DatabasePersistAdapter`
*  **driver** - The class for the JDBC driver. Default value is `org.h2.Driver` to use H2
*  **url** - Refer to the JDBC options for your driver. This is the URL prefix for the JDBC connection string. Default is `jdbc:h2:file:`
*  **database_location** - The location where you want your database. This only applies to file-based databases like sqlite and H2. Default value is `./storage/database`
*  **database_name** - Name of the database. Default value is `ActivityDB`
*  **table_name** - Name of table to use. Default value is `Ledger`
*  **username** - Username to connect to database
*  **password** - Password to connect to database

The default configuration is sufficient for most activity.

## Output adapter

There are a couple of _output adapters_ from which to choose. Set the output adapter by setting `output_adapter.class`
in `crawler.conf`. Options are:

*  **class** - Defines the Data Crawler output adapter class. Default value is `com.ibm.watson.crawler.discoveryserviceoutputadapter.DiscoveryServiceOutputAdapter`
*  **config** - Defines which configuration key to pass to the output adapter. The string must correspond to a key within this configuration object. In the following code example:
```javascript
  orchestration_service {
    include "orchestration_service.conf"
  },
  test {
    output_directory = "/tmp/crawler-test-output"
  }
}
```
the configuration key is `orchestration_service`. The default value is `discovery_service`

You must select an output adapter by specifying its `class` parameter and `config` key.

* **Orchestration Service output adapter**: Uploads crawled documents to Watson Developer Cloud's Orchestration Service. Select this adapter by setting the `class` parameter and `config` key as follows: 
```javascript
  class = "com.ibm.watson.crawler.orchestrationserviceoutputadapter.oneatatime.OrchestrationServiceOutputAdapter"
  config = "orchestration_service"
  orchestration_service {
    include "orchestration/orchestration_service.conf"
  }
```
* **Discovery Service output adapter**: Uploads crawled documents to Watson Developer Cloud's Discovery Service. Select this adapter by setting the `class` parameter and `config` key as follows:
```javascript
  class = "com.ibm.watson.crawler.discoveryserviceoutputadapter.DiscoveryServiceOutputAdapter"
  config = "discovery_service"
  discovery_service {
    include "discovery/discovery_service.conf"
  }
```
* **Watson Test output adapter**: Writes a representation of the crawled files to disk in a specified location. Select this adapter by setting the `class` parameter and `config` key as follows:

**Note** - An additional parameter, `output_directory`, selects the directory to which the representation of the crawled data should be written.
```javascript
  class = "com.ibm.watson.crawler.testoutputadapter.TestOutputAdapter"
  config = "test"
  output_directory = "/tmp/crawler-test-output"
```
* **retry** - Specifies the options for retry in case of failed attempts to push to the output adapter.
  * max_attempts - Maximum number of retry attempts. Default value is `10`
  * delay - Minimum amount of delay between attempts, in seconds. Default value is `2`
  * exponent_base - Factor that determines the growth of the delay time over each failed attempt. Default value is `2`

 The formula is:
```d(nth_retry) = delay * (exponent_base ^ nth_retry)```

 For example, the settings with a delay of 1 second and an exponent base of 2, will cause the second retry -
 the third attempt - to delay 2 seconds instead of 1, and the next to delay 4 seconds.
 ```
 d(0) = 1 * (2 ^ 0) = 1 second
 d(1) = 1 * (2 ^ 1) = 2 seconds
 d(2) = 1 * (2 ^ 2) = 4 seconds
```
 So, with the default settings, a submission will be attempted up to 10 times, waiting up to approximately 1,022 seconds (a little over 17 minutes). This time is approximate because there is additional time added in order to avoid having multiple resubmissions execute simultaneously. This "fuzzed" time is up to 10%, so the last retry in the previous example could delay up to 4.4 seconds. The wait time does not include the time spent connecting to the service, uploading data, or waiting for a response.

 *Warning:* decreasing the wait time by lowering any of these defaults may result in documents not being successfully
 uploaded via the configured output adapter. Evidence of this when using Watson Developer Cloud services will be
 RetryFailure messages in the log citing "429 Too Many Requests" rate limiting.
 
## Debugging options
*  **full_node_debugging** - Activates debugging mode; possible values are `true` or `false`. **Warning**: This will put the full data of every document crawled into the logs.
*  **heartbeat_wait_time** - Time interval, in milliseconds, between reporting document ingestion statistics (debugging mode only). Default value is 1000 milliseconds.

## Logging options
*  **configuration_file** - The configuration file to use for logging. In the sample `crawler.conf` file, this option is defined in `logging.log4j` and its default value is `log4j_custom.properties`.
This option must be similarly defined whether using a `.properties` or `.conf` file.

## Additional crawl management options
*  **shutdown_timeout** - Specifies the timeout value, in minutes, before shutting down the application. Default value is `10`.
*  **output_limit** - The highest number of indexable items that the Crawler will try to send simultaneously to the output adapter. This can be further limited by the number of cores available to do the work. It says that at any given point there will be no more than "x" indexable items sent to the output adapter waiting to return. Default value is `10`.
*  **input_limit** - Limits the number of URLs that can be requested from the connector at one time. Default value is `3`.
*  **output_timeout** - The amount of time, in seconds, before the Data Crawler gives up on a request to the output adapter, and then removes the item from the output adapter queue, to allow more processing. Default value is `1200`. **Note** - Consideration should be given to the constraints imposed by the output adapter, as those constraints may relate to the limits defined here. The `output_limit` defined above only relates to how many indexable objects can be sent to the output adapter at once. Once an indexable object is sent to the output adapter, it is "on the clock," as defined by the `output_timeout` variable. It is possible that the output adapter itself has a throttle preventing it from being able to process as many inputs as it receives. For instance, the orchestration output adapter may have a connection pool, configurable for HTTP connections to the service. If it defaults to 8, for example, and if you set the `output_limit` to a number greater than 8, then you will have processes, on the clock, waiting for a turn to execute. You may then experience timeouts.
*  **num_threads** - The number of parallel threads that can be run at one time. This value can be either an integer, which specifies the number of parallel threads directly, or it can be a string, with the format "xNUM", specifying the multiplication factor of the number of available processors, for example, "x1.5". The default value is `"30"`.

## SEE ALSO

crawler(1)

vcrypt(1)

crawler-options.conf(5)

crawler-seed.conf(5)

orchestration_service.conf(5)
