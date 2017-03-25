# Configuring the orchestration service
The orchestration service tells the crawler how to manage crawled files. Default options can be changed directly by opening the `config/orchestration/orchestration-service.conf` file, and modifying the following values specific to your use case:

*  **http_timeout** - The timeout, in seconds, for the document read/index operation; the default is `585`.
*  **concurrent_upload_connection_limit** - The number of simultaneous connections allowed for uploading documents; the default is `10`. Generally, this number should be greater than, or equal to, the `output_limit` set when configuring crawl options.
*  **base_url** - The URL that your crawled documents will be sent to.
*  **endpoint** - The location of your crawled document collection at the `base-url`.
*  **username** - Username to authenticate to the `endpoint` location.
*  **password** - Password to authenticate to the `endpoint` location. **Important** - Do **NOT** use the vcrypt program shipped with the Data Crawler to encrypt this password.
*  **config_file** - The configuration file that the orchestration service uses.

The Orchestration Service Output Adapter can send statistics in order for IBM to better understand and serve its users. The following options can be set for the `send_stats` variable:
*  **jvm** - Java Virtual Machine (JVM) statistics sent include the Java vendor and version, as reported by the JVM used to execute the data crawler. Value is either `true` or `false`.
*  **os** - Operating system (OS) statistics sent include OS name, version, and architecture, as reported by the JVM used to execute the data crawler. Value is either `true` or `false`.

## SEE ALSO

crawler(1)

vcrypt(1)

crawler.conf(5)

crawler-options.conf(5)

crawler-seed.conf(5)
