# Configuring crawl seeds

Seeds are the starting points of a crawl, and are used by the data crawler to retrieve data from the resource that is identified by that seed. Typically, seeds configure URLs to access protocol-based resources such as fileshares, SMB shares, databases, and other data repositories that are accessible by various web protocols. Moreover, different seed URLs have different capabilities.

Seeds can also be repository-specific, to enable crawling of specific third-party applications such as customer relationship management (CRM) systems, product life cycle (PLC) systems, content management systems (CMS), cloud-based applications, and web database applications.

The data crawler currently provides crawl seeds that support file connectors for the following repository types:

*	Filesystem
*	Databases, via JDBC
*	CMIS (Content Management Interoperability Services)
*	SMB (Server Message Block), CIFS (Common Internet Filesystem), or Samba fileshares
*	SharePoint and SharePoint Online
*	Box

A crawl seed configuration template is also provided, which allows you to customize a crawl seed for a custom connector.

## Getting started:

When crawling data repositories, the crawler begins at a user-specified seed URL, and begins downloading pages of information. The crawler also locates links in the downloaded pages, and schedules the newly-discovered pages for further crawling.

Configuration information is used to determine which pages need to be crawled, and how to crawl them. This file explains the options that you can configure for each connector's crawl seed file.

**Note**: Each crawl seed configuration file works with a corresponding file connector configuration file; file connector options are described separately.

### Configuring the Filesystem Crawl Seed

The following values can be configured for the Filesystem crawl seed file. To set these values, open the file `config/seeds/filesystem-seed.conf` and specify the following values specific to your use cases:

*  **url** - Newline-separated list of files and folders to crawl. UNIX users can use a path such as `/usr/local/`.
The URLs must start with `sdk-fs://`. So to crawl, for example, `/home/watson/mydocs`, the value of this URL would be `sdk-fs:///home/watson/mydocs` - the third `/` is necessary!
**Note**: The Filesystem connector uses a custom protocol, `sdk-fs://`, to create a valid URL. Do not prepend `file://` to the listed paths; the URLs must start with `sdk-fs://`.
*  **hops** - Internal use only.
*  **default-allow** - Internal use only.

### Configuring the Database Crawl Seed

The following values can be configured for the Database crawl seed file. To set these values, open the file `config/seeds/database-seed.conf` and specify the following values specific to your use cases:

*  **url** - The URL of the table or view to retrieve. Defines your custom SQL database seed URL. The structure is:

   	`database-system://host:port/database?[per=num]&[sql=SQL]`

   Testing a seed URL will show all of the enqueued URLs. For example, testing the following URL for a database containing 200 records:

   	`sqlserver://test.mycompany.com:1433/WWII_Navy/?per=100&sql=select%20*%20from%20vessel&`

   shows the following enqueued URLs:

   	`sqlserver://test.mycompany.com:1433/WWII_Navy/?key-val=0&`

   	`sqlserver://test.mycompany.com:1433/WWII_Navy/?key-val=100&`

   	`sqlserver://test.mycompany.com:1433/WWII_Navy/?key-val=200&`

   While testing the following URL will show the data retrieved from row 43:

   	`sqlserver://test.mycompany.com:1433/WWII_Navy/?per=1&key-val=43`
*  **hops** - Internal use only.
*  **default-allow** - Internal use only.
*  **user-password** - Credentials for the database system. The username and password need to be separated by a `:`, and the password must be encrypted with the vcrypt program that ships with the Data Crawler. For example `username:[[vcrypt/3]]passwordstring`.
*  **max-data-size** - Maximum size of the data for a document. This is the largest block of memory that will be loaded at one time. Only increase this limit if you have sufficient memory on your computer.
*  **filter-exact-duplicates** - Internal use only.
*  **jdbc-class** (Extender option) - When specified, this string will override the JDBC class used by the connector when `(other)` is chosen as the database system.
*  **connection-string** (Extender option) - When specified, this string will override the automatically generated JDBC connection string. This allows you to provide more detailed configuration about the database connection, such as load-balancing or SSL connections. For example: `jdbc:netezza://127.0.0.1:5480/databasename`.
*  **save-frequency-for-resume** (Extender option) - Specifies the name of a column or associated label, in order to be able to resume a crawl or do a partial refresh. The seed saves the name of this column at regular intervals as it proceeds with the crawl, and saves it again once the last row of your database has been crawled. When resuming the crawl or refreshing it, the crawl begins with the row that is identified in the saved value for this field.

### Configuring the CMIS Crawl Seed

The following values can be configured for the CMIS crawl seed file. To set these values, open the file `config/seeds/cmis-seed.conf` and modify the following values specific to your use cases:

*  **url** - The URL of a folder from the CMIS repository to be used as a starting point of the crawl, for example:

   *  `cmis://alfresco.test.com:8080/alfresco/cmisatom?folderToProcess=workspace://SpacesStore/guid`
   To crawl from the root folder, you need to give the URL as:

   *  `cmis://alfresco.test.com:8080/alfresco/cmisatom?folderToProcess=`
*  **at** - Unused option.
*  **default-allow** - Internal use only.

### Configuring the Samba Crawl Seed

The following values can be configured for the Samba crawl seed file. To set these values, open the file `config/seeds/samba-seed.conf` and modify the following values specific to your use cases:

*  **url** - A newline-separated list of shares to crawl, for example:

   *  `smb://share.test.com/office`
   *  `smb://share.test.com/cash/money/change`
   *  `smb://share.test.com/C$/Program Files`

*  **hops** - Internal use only.
*  **default-allow** - Internal use only.

### Configuring the SharePoint Crawl Seed

The following additional values can be configured for the SharePoint crawl seed file. To set these values, open the file `config/seeds/sharepoint-seed.conf` and modify the following values specific to your use cases:

*  **url** - A newline-separated list of SharePoint web applications or site collections to crawl, for example:

   *  `io-sp://a.com`
   *  `io-sp://b.com:83/site`
   *  `io-sp://c.com/site2`

   The sub-sites of these sites will also be crawled (unless they are excluded by other crawling rules).
*  **filter-url** - A newline-separated list of SharePoint web applications or site collections to crawl, for example:

   *  `http://a.com`
   *  `http://b.com:83/site`
   *  `http://c.com/site2`

*  **hops** - Internal use only.
*  **n-concurrent-requests** - Internal use only.
*  **delay** - Internal use only.
*  **default-allow** - Internal use only.
*  **seed-protocol** - Sets the seed protocol for children of the site collection. Necessary when the site collection's protocol is SSL, HTTP, or HTTPS. This value must be set the same as the site collection's protocol.

### Configuring the Box Seed

The following values can be configured for the Box crawl seed file. To set these values, open the file `config/seeds/box-seed.conf` and specify the following values specific to your use cases:

*  **url** - The URL to be used as the starting point of the crawl. The default value is `box://app.box.com/`.
*  **default-allow** - Internal use only.

## SEE ALSO

crawler(1)

vcrypt(1)

crawler.conf(5)

crawler-options.conf(5)

orchestration_service.conf(5)
