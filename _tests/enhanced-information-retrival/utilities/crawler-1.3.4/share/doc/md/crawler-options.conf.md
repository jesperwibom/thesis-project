# Configuring crawl options
The data crawler collects the raw data that is eventually used to form search results for the IBM Watson Retrieve and Rank service.

The data crawler currently provides connectors to support data collection from the following repositories:

*	Filesystem
*	Databases, via JDBC
*	CMIS (Content Management Interoperability Services)
*	SMB (Server message Block, CIFS (Common Internet Filesystem), or Samba fileshares
*	SharePoint and SharePoint Online
*	Box

A connector configuration template is also provided, which allows you to customize a connector.

## Getting started:
When crawling data repositories, the crawler begins at a user-specified starting seed URL, and begins downloading pages of information. The crawler also locates links in the downloaded pages, and schedules the newly-discovered pages for further crawling.

Configuration information is used to determine which pages need to be crawled, and how to crawl them. This file explains the options that you can configure for each connector.

**Note**: Each connector also has a corresponding seed configuration file; seed configuration options are described separately.

### Configuring the Filesystem Connector
The Filesystem Connector allows you to crawl files local to the data crawler installation. Following are the basic configuration options that are required to use the Filesystem connector. To set these values, open the file `config/connectors/filesystem.conf` and modify the following values specific to your use cases:

*  **protocol** - The name of the connector protocol used for the crawl. Use `sdk-fs` for this connector.
*  **collection** - This attribute is used to unpack temporary files.
*  **logging-config** - Specifies the file used for configuring logging options; it must be formatted as a `log4j` XML string.
*  **classname** - Java class name for the connector. The value to use this connector must be `plugin:filesystem.plugin@filesystem`.

### Configuring the Database Connector
The database connector allows you to crawl a database by executing a custom SQL command and creating one document per row (record) and one content element per column (field). You can specify a column to be used as a unique key, as well as a column containing a timestamp representing the last-modification date of each record. The connector retrieves all records from the specified database, and can also be restricted to specific tables, joins, and so on in the SQL statement.

The Database connector allows you to crawl the following databases:

*  IBM DB2
*  MySQL
*  Oracle
*  PostgreSQL
*  Microsoft SQL Server
*  Sybase
*  Other SQL-compliant databases via a JDBC 3.0-compliant driver

The connector retrieves all records from the specified database and table.

**JDBC Drivers**
The Database connector ships with Oracle JDBC (Java Database Connectivity) driver version 1.5. All third-party JDBC drivers shipped with data crawler are located in the `/lib/java/database` directory of your data crawler installation, where you can add, remove, and modify them as necessary. You can also use the `extra_jars_dir` setting in the `crawler.conf` file to specify another location.

***DB2 JDBC Drivers***
Data crawler does not ship with the JDBC drivers for DB2 due to licensing issues. However, all DB2 installations in which you have installed JDBC support include the JAR files that the data crawler requires, in order to be able to crawl a DB2 installation. To crawl a DB2 instance, you must copy these files into the appropriate directory in your data crawler installation so that the Database connector can use them.

To enable the data crawler to crawl a DB2 installation, locate the `db2jcc.jar` and license (typically, `db2jcc_license_cu.jar`) JAR files in your DB2 installation, and copy those files to the `lib/java` subdirectory of your data crawler installation directory, or you can use the `extra_jars_dir` setting in the `crawler.conf` file to specify another location.

***MySQL JDBC Drivers***
The data crawler does not ship with the JDBC drivers for MySQL because of possible license issues if they were delivered as part of the product. However, downloading the JAR file that contains the MySQL JDBC drivers and integrating that JAR file into your data crawler installation is quite easy to do:

1.	Use a web browser to visit the MySQL download site, and locate the source and binary download link for the archive format that you want to use (typically zip for Microsoft Windows systems or a gzipped tarball for Linux systems). Click that link to initiate the download process. Registration may be required.

2.	Use the appropriate `unzip archive-file-name` or `tar zxf archive-file-name` command to extract the contents of that archive, based on the type and name of the archive file that you download.

3.	Change to the directory that was extracted from the archive file, and copy the JAR file from this directory to the `lib/java` subdirectory of your data crawler installation directory, or you can use the `extra_jars_dir` setting in the `crawler.conf` file to specify another location.

Following are the basic configuration options that are required to use the Database connector. To set these values, open the file `config/connectors/database.conf` and modify the following values specific to your use cases:

*  **protocol** - The name of the connector protocol used for the crawl. The value for this connector is based on the database system to be accessed.
*  **collection** - This attribute is used to unpack temporary files.
*  **classname** - Java class name for the connector. The value to use this connector must be `plugin:database.plugin@database`.
*  **logging-config** - Specifies the file used for configuring logging options; it must be formatted as a `log4j` XML string.

### Configuring the CMIS Connector
The CMIS (Content Management Interoperability Services) connector lets you crawl CMIS-enabled CMS (Content Management System) repositories, such as Alfresco, Documentum or IBM Content Manager, and index the data that they contain.

Following are the basic configuration options that are required to use the CMIS connector. To set these values, open the file `config/connectors/cmis.conf` and modify the following values specific to your use cases:

*  **protocol** - The name of the connector protocol used for the crawl. Use `cmis` for this connector.
*  **collection** - This attribute is used to unpack temporary files.
*  **dns** - Unused option.
*  **classname** - Java class name for the connector. The value to use this connector must be `plugin:cmis-v1.1.plugin@connector`.
*  **logging-config** - Specifies the file used for configuring logging options; it must be formatted as a `log4j` XML string.
*  **endpoint** - The service endpoint URL of a CMIS-compliant repository. For example, the URL structures for SharePoint are:
   *  For AtomPub binding:   
      http://<server>:<port>/_vti_bin/cmis/rest?getRepositories
   *  For WebServices binding:   
      http://<server>:<port>/_vti_bin/cmissoapwsdl.aspx

*  **username** - The user name of the CMIS repository user used to access the content. This user must have access to all the target folders and documents to be crawled and indexed.
*  **password** - The password of the CMIS repository used to access the content. Password must NOT be encrypted; it should be given in plain text.
*  **repositoryid** - The ID of the CMIS repository used to access the content for that specific repository.
*  **bindingtype** - Identifies what type of binding is to be used to connect to a CMIS repository. Value is either `AtomPub` or `WebServices`.
*  **authentication** - Identifies what type of authentication mechanism to use while contacting a CMIS-compatible repository: `Basic HTTP Authentication`, `NTLM`, or `WS-Security(Username token)`.
*  **enable-acl** - Enables retrieving ACLs for crawled data. If you are not concerned about security for the documents in this collection, disabling this option will increase performance by not requesting this information with the document and not retrieving and encoding this information. Value is either `true` or `false`.
*  **user-agent** - A header sent to the server when crawling documents.
*  **method** - The method (`GET` or `POST`) by which parameters will be passed.
*  **url-logging** - The extent to which crawled URLs are logged. Possible values are:

   *  ***full-logging*** - Log all information about the URL.
   *  ***refined-logging*** - Only log the information necessary to browse the crawler log and for the connector to function correctly; this is the default value.
   *  ***minimal-logging*** - Only log the minimum amount of information necessary for the connector to function correctly.

   Setting this option to minimal-logging will reduce the size of the logs and gain a slight performance increase due to the smaller I/O associated with minimizing the amount of data that is being logged.
*  **ssl-version** - Specifies a verion of SSL to use for HTTPS connections. By default the strongest protocol available is used.

### Configuring the SMB/CIFS/Samba Connector
The Samba connector allows you to crawl Server Message Block (SMB) and Common Internet Filesystem (CIFS) fileshares. This type of fileshare is common on Windows networks, and is also provided through the open source project [Samba](https://www.samba.org/).

Following are the basic configuration options that are required to use the Samba connector. To set these values, open the file `config/connectors/samba.conf` and modify the following values specific to your use cases:

*  **protocol** - The name of the connector protocol used for the crawl. The value to use this connector is `smb`.
*  **collection** - This attribute is used to unpack temporary files.
*  **classname** - Java class name for the connector. The value to use this connector must be `plugin:smb.plugin@connector`.
*  **logging-config** - Specifies the file used for configuring logging options; it must be formatted as a `log4j` XML string.
*  **username** - The Samba username to authenticate with. If provided, domain and password must also be provided. If not  provided, the guest account is used.
*  **password** - The Samba password to authenticate with. If the username is provided, this is required. Password must be encrypted using the VCrypt library shipped with the data crawler.
*  **archive** - Enables the Samba connector to crawl and index files that are compressed within archive files. Value is either `true` or `false`; default value is `false`.
*  **max-policies-per-handle** - Specifies the maximum number of Local Security Authority (LSA) policies that can be opened for a single RPC handle. These policies define the access permissions that are required to query or modify a particular system under various conditions. The default value for this option is `255`.
*  **crawl-fs-metadata** - Turning on this option will cause the data crawler to add a VXML document containing the available filesystem metadata about the file (creation date, last modified date, file attributes, etc.)
*  **enable-arc-connector** - Unused option.
*  **disable-indexes** - Newline-separated list of indexes to disable, which may result in a faster crawl, for example:

   *  disable-url-index
   *  disable-error-state-index
   *  disable-crawl-time-index
*  **exact-duplicates-hash-size** - Sets the size of the hash table used for resolving exact duplicates. Be very careful when modifying this number. The value that you select should be prime, and larger sizes can provide faster lookups but will require more memory, while smaller sizes can slow down crawls but will substantially reduce memory usage.
*  **user-agent** - Unused option.
*  **timeout** - Unused option.
*  **n-concurrent-requests** - The number of requests that will be sent in parallel to a single IP address. The default is `1`.
*  **enqueue-persistence** - Unused option.

### Configuring the SharePoint Connector
The SharePoint connector allows you to crawl SharePoint Server and SharePoint Online objects and index the information that they contain. An object such as a document, user profile, site collection, blog, listitem, membership list, directory page, and more, can be indexed with its associated metadata. For list items and documents, indexes can include attachments.

**Note**: The SharePoint connector respects the `noindex` attribute on all SharePoint objects, regardless of their specific type (blogs, documents, user profiles, and more). A single document is returned for each result.

**Important**: The SharePoint account that you use to crawl your SharePoint sites must at least have full read-access privileges.

Following are the basic configuration options that are required to use the SharePoint connector. To set these values, open the file `config/connectors/sharepoint.conf` and modify the following values specific to your use cases:

*  **protocol** - The name of the connector protocol used for the crawl. Use `io-sp` for this connector.
*  **collection** - This attribute is used to unpack temporary files.
*  **classname** - Java class name for the connector. The value to use this connector must be `plugin:io-sharepoint.plugin@connector`.
*  **logging-config** - Specifies the file used for configuring logging options; it must be formatted as a `log4j` XML string.
*  **seed-url-type** - Identifies what type of SharePoint object the provided seed URLs point to: site collections or web applications (also known as virtual servers).

   *  ***Site Collections*** - If the Seed URL Type is set to `Site Collections`, then only the children of the site collection
      referenced by the URL are crawled.
   *  ***Web Applications*** - If the Seed URL Type is set to `Web Applications`, then all of the site collections (and their children) belonging to the web applications referenced by each URL are crawled.
*  **auth-type** - The authentication mechanism to use when contacting the SharePoint server: `BASIC`, `NTLM2`, `KERBEROS`, or `CBA`. The default authentication type is `NTLM2`.
*  **spUser** - User name of the SharePoint user used to access the content. This user must have access to all the target sites and lists to be crawled and indexed, and must be able to retrieve and resolve the associated permissions. It is better to enter it with the domain name, like: `MYDOMAIN\\Administrator`.
*  **spPassword** - Password of the SharePoint user used to access the content. Password must be encrypted using the vcrypt program shipped with the Data Crawler.
*  **cba-sts** - The URL for the Security Token Service (STS) endpoint to attempt to authenticate the crawl user against. For SharePoint on-premise with ADFS, this should be your ADFS endpoint. If the Authentication Type is set to `CBA` (Claims Based Authentication), then this field is required.
*  **cba-realm** - The relaying party trust identifier to use when requesting a security token from the STS. This is sometimes known as the "AppliesTo" value, or the "Realm". For SharePoint Online, this should be the URL to the root of the SharePoint Online instance (for example, `https://mycompany.sharepoint.com`). For ADFS, this is the ID value for the Relying Party Trust between SharePoint and ADFS (for example, `"urn:SHAREPOINT:adfs"`).
*  **everyone-group** - When specified, this group name is used in the ACLs when access should be given to everyone. This field is required when crawling user profiles is enabled. **Note** - Security is not yet respected by the Retrieve and Rank service.
*  **user-profile-master-url** - The base URL that the connector uses to build links to user profiles. This should be configured to point to the display form for user profiles. If the token `%FIRST_SEED%` is encountered, it is replaced with the first seed URL. Required when crawling user profiles is enabled.
*  **urls** - Newline-separated list of HTTP URLs of SharePoint web applications or site collections to crawl.
*  **ehcache-config** - Unused option.
*  **method** - The method (`GET` or `POST`) by which parameters will be passed.
*  **cache-types** - Unused option.
*  **cache-size** - Unused option.
*  **enable-acl** - Enables crawling of SharePoint user profiles; values are `true` or `false`. Default value is `false`.

### Configuring the Box Connector
The Box Connector allows you to crawl your Enterprise Box instance, and index the information it contains. Following are the basic configuration options that are required to use the Box connector. To set these values, open the file `config/connectors/box.conf` and modify the following values specific to your use cases:

*  **protocol** - The name of the connector protocol used for the crawl. Use `box` for this connector.
*  **classname** - Java class name for the connector. The value to use this connector must be `plugin:box.plugin@connector`.
*  **logging-config** - Specifies the file used for configuring logging options; it must be formatted as a `log4j` XML string.
*  **box-crawl-seed-url** - The base URL for Box. The value for this connector is `box://app.box.com/`. You can crawl different types of URLs, for example:

   *  ***To crawl an entire enterprise***: `box://app.box.com/`
   *  ***To crawl a specific Folder***: `box://app.box.com/user/USER_ID/folder/FOLDER_ID/FolderName`
   *  ***To crawl a specific User***: `box://app.box.com/user/USER_ID/`
*  **client-id** - Enter the Client ID provided by Box when you created your Box application.
*  **client-secret** - Enter the Client secret provided by Box when you created your Box application.
*  **path-to-private-key** - This is the location, on your local file system, of the Private Key that is part of the private-public key pair generated for communication with Box.
*  **kid** - Specify the Public Key ID. This is the other half of the private-public key pair generated for communication with Box.
*  **enterprise-id** - The Enterprise in which your application was authorized. The Enterprise ID is listed in the main page of the Box Administrator Console.
*  **enable-acl** - Internal use only. Enables retrieving ACLs for crawled data.
*  **user-agent** - A header sent to the server when crawling documents.
*  **method** - The method (`GET` or `POST`) by which parameters will be passed.
*  **url-logging** - The extent to which crawled URLs are logged. Possible values are:

   *  ***full-logging*** - Log all information about the URL.
   *  ***refined-logging*** - Only log the information necessary to browse the crawler log and for the connector to function correctly; this is the default value.
   *  ***minimal-logging*** - Only log the minimum amount of information necessary for the connector to function correctly.

   Setting this option to minimal-logging will reduce the size of the logs and gain a slight performance increase due to the smaller I/O associated with minimizing the amount of data that is being logged.
*  **ssl-version** - Specifies a verion of SSL to use for HTTPS connections. By default the strongest protocol available is used.

The Box Connector does have some limitations:

* Comments or Tasks on files are not retrieved.
* Notes content body is retrieved as JSON. Additional conversion of Note data may be needed.
* Individual documents cannot be retrieved via TestIt. Only seed URLs, Folder URLs, and User URLs can be retrieved via TestIt.


## SEE ALSO

crawler(1)

vcrypt(1)

crawler.conf(5)

crawler-seed.conf(5)

orchestration_service.conf(5)
