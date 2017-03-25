# Configuring the Discovery service
The Discovery service tells the crawler how to manage crawled files when using the IBM Watson Discovery service. Default options can be changed directly by opening the `config/discovery/discovery_service.conf` file, and modifying the following values specific to your use case:

*  **http_timeout** - The timeout, in seconds, for the document read/index operation; the default is `125`.
*  **concurrent_upload_connection_limit** - The number of simultaneous connections allowed for uploading documents; the default is `2`. When using the Orchestration Service Output Adapter, this number should be greater than, or equal to, the `output_limit` set when configuring crawl options.
*  **base_url** - The URL that your crawled documents will be sent to. For the current release of the Discovery service, the value is `https://gateway.watsonplatform.net/discovery/api`.
*  **environment_id** - The location of your crawled document collection at the `base-url`.
*  **collection_id** - Name of the document collection that you set up in the Discovery service.
*  **configuration_id** - The filename of the configuration file that the Discovery service uses.
*  **check_for_completion** - Checks if the document was successfully processed at the endpoint. This reduces the perceived performance of the crawler, but will produce reliable notification of a successful document upload and conversion. Value is either `true` or `false`.  
**IMPORTANT** - When enabling this parameter, it is wise to increase the `concurrent_upload_connection_limit` to greater than, or equal to, the `output_limit` set when configuring crawl options, in order to fully utilize the resources available to you.

Supply your Discovery service credentials:
*  **username** - Username to authenticate with the location of your crawled document collection.
*  **password** - Password to authenticate with the location of your crawled document collection.

The Discovery Service Output Adapter can send statistics in order for IBM to better understand and serve its users. The following options can be set for the `send_stats` variable:
*  **jvm** - Java Virtual Machine (JVM) statistics sent include the Java vendor and version, as reported by the JVM used to execute the data crawler. Value is either `true` or `false`.
*  **os** - Operating system (OS) statistics sent include OS name, version, and architecture, as reported by the JVM used to execute the data crawler. Value is either `true` or `false`.

*  **api_version** - Internal use only. Date of the last API version change.

# Configuring URL tracking storage
The `config/discovery` folder also contains a configuration file that may be used for internal mapping of crawler URLS and document IDs. Default options can be changed directly by opening the `config/discovery/uri_tracking_storage.conf` file, and modifying the following values specific to your use case:

*  **driver** - JDBC H2 driver class of your database. Default value is `org.h2.Driver`
*  **url** - This is the URL prefix for the JDBC connection string. Format is `jdbc:h2:[file:]`. **NOTE** The prefix `file:` is optional. If no, or only a relative path for `database_location` is used, then the current working directory is used as a starting point. Default is `jdbc:h2:file:`
*  **database_location** - The location on the disk where the database is stored, for example, `./storage/database` or `~/storage/database`. Default value is `./storage/database`
*  **database_name** - Name of the database. Default value is `ActivityDB`
*  **table_name** - Name of table to use. Default value is `UriTracker`
*  **username** - Username to connect to database
*  **password** - Password to connect to database

## SEE ALSO

crawler(1)

vcrypt(1)

crawler.conf(5)

crawler-options.conf(5)

crawler-seed.conf(5)
