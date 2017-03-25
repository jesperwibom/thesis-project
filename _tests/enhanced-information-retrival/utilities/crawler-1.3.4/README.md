# IBM Watson Data Crawler README

## System Requirements

### Software

* Java Runtime Environment version 8 is required. [IBM Java](https://www.ibm.com/developerworks/java/jdk/) is preferred.
* Data Crawler is supported on Linux and has been tested on RHEL 7 and Ubuntu 16.04.
* Apple macOS is not currently supported, even though `bin/crawler` works. Data Crawler expects UNIX tool familiarity.
* Microsoft Windows is not currently supported, even though some connectors may work using `bin/crawler.bat`.

### Hardware

* Minimum 2 GB RAM
* Solid state disk or RAID0 configuration for crawler temp directory _strongly_ recommended

## Directory layout

This document outlines the directory structure of the files that Data Crawler installs on your system.

### `bin`

* Script files for running the crawler.

### `share`

* User configuration and documentation files, includes:

#### `share/doc`

* Provides both HTML and Markdown-formatted documentation files.

#### `share/example/config`

* HOCON-format configuration file _examples_ that let you tell the crawler which data to use for its crawl, where to send your collection of crawled data once the crawl has been completed, and other crawl management options.
* Copy this directory into a workspace directory per crawl - don't modify the examples as they were unpacked!

#### `share/man`

* In-product manual page crawler documentation, viewable using `man`.

### `connectorFramework`

* The files in this directory are what allow you to talk to your data, whether internal data within the enterprise, or external data on the web or in the cloud.

### `doc`

* Contains files with copyright and licensing information.

### `lib`

* Library files used by the crawler.

## Enabling Software

Data Crawler is "enabling software", as defined in the [IBM Bluemix Terms of Use](https://console.ng.bluemix.net/docs/navigation/notices.html#terms), including the [SaaS terms for users under the CSA](http://ibm.biz/BluemixSD) and [SaaS terms for users under the IPAA](http://ibm.biz/BluemixTOU).
