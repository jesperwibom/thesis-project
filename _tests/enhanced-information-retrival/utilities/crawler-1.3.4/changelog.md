# Data Crawler Changelog

This document details changes made to the Data Crawler since the initial public release at version 1.0.0.
Items listed here are public-facing and do not include non-public changes such as build system and internal
documentation changes.

## 1.3.3 - 2017-03-20

Changed
-------

* Increased the maximum HTTP client connections from 10 to 100 for
  Discovery Service. This enables customers on large plans to use
  one running Data Crawler process to saturate their available
  conversion pipeline.

## 1.3.2 - 2017-03-03

Added
-----
* Additional logs added to expose the number of documents that were
  submitted, completed and/or failed. 

Fixed
-----
* Resolved an integrity constraint issue in the internal storage
  database

## 1.3.1 - 2017-02-22

Changed
-------

* Updated translations for French and Spanish. 
* Log message levels modified to reduce verbose output. 

Fixed
-----

* Resolved a race condition breaking the crawl when doing some resume/refresh
  operations.

## 1.3.0 - 2017-02-01

Added
-----

* Resume, refresh, and restart. Crawler now records its progress and can resume
  a stopped or crashed crawl from where it left off. It can also re-crawl all
  URLs that it retrieved during a previous crawl, fully refreshing the data.
  Lastly, it can restart a crawl as if it had not previously run. For more
  information, read the updated documentation for crawler.conf.
* The Discovery Service Output Adapter now records a mapping of Crawler URIs to
  WDS document IDs during the crawl. There is no user interface to this data,
  though: one may come in a future release.

Changed
-------

* Updated translations for all supported interface languages
* Updated the Discovery Service API version
* Tweaked the performance of the check_document_status system 

Fixed
-----

* Resolved an issue where Crawler would sometimes not exit non-zero on failure.
* Removed a dependency that unnecessarily inflated the package size
* Cleaned up some HTML from manpage output

## 1.2.5 - 2017-01-13

Added
-----

* A new Discovery Service Output Adapter option `check_document_status` instructs
  the output adapter to continuously poll WDS for each uploaded document's status.
  The polling will complete when the document is successfully converted or fails
  to convert entirely. This feature enables the user to ensure that all documents
  not only upload, but also convert. Conversion errors will be output in the log
  at WARN level.
* When Crawler exits abnormally because of an exception during crawling, it will
  exit with code 128.
* The Orchestration Service Output Adapter now uses the retry logic to ensure
  documents are uploaded to Orchestration.

Changed
-------

* Error messages when the configuration is missing a key are now clearer.
* When Crawler exits abnormally, the Java version check message now clearly
  directs the user to inspect log output since the Java version check message
  is not the actual error.
* Clarifies known limitation around `--config` option requiring a qualified relative
  path and suggests action if the user wants to use an unqualified relative path.

Fixed
-----

* The Box connector configuration is now sane out of the box. Previously, the user
  would have to add a few extra seed options in order to get it to work.

## 1.2.4 - 2016-12-15

Changed
-------

* Directed default Discovery Service URL to now GA production.

Fixed
-----

* Updated Box connector with fix for potential authentication issue causing
  exceptionally slow crawling for crawls exceeding two hours duration.

## 1.2.3 - 2016-12-15

Changed
-------

* Crawler now waits 30 seconds for the Connector Framework Input Adapter's
  subprocess to start, instead of merely 5 seconds. This addresses false early
  exits on slower machines.

Removed
-------

* The Arabic translation had significant readability problems. It will be
  restored when those problems are addressed.

## 1.2.2 - 2016-12-12

Added
-----

* Connector for Box online storage! Read crawler-options.conf documentation
  for options and limitations.

Changed
-------

* Default retry settings are now 10 attempts with a two second delay and
  base 2 backoff. This means at least 1,022 seconds, or about 17 minutes, of
  retrying a single document.
* Default concurrent upload setting was reduced to 2 in order to alleviate
  Discovery Service pressure at GA. There is a hard limit of 10, though.
* Default output limit used to time out long-running document uploads was
  increased to accommodate the new retry settings.
* Plus and minus signs in debug mode heartbeat log are now up and down arrows.

Fixed
-----

* Several translations were fixed.

## 1.2.1 - 2016-12-01

## Added

* The Discovery Service Output Adapter no longer retries permanent failures,
  such as authentication or authorization failures, or major service outages.
* Much of the application has been translated. Translations are ongoing and
  will improve with time!

## Changed

* Application startup time is slightly faster because of an optimization.
* Clarified that Data Crawler is "enabling software" according to Bluemix TOS.

## Fixed

* The Discovery Service Output Adapter will now honor user setting for the
  retry base exponent.

## 1.2.0 - 2016-11-10

## Added

* A README.md now exists in the ZIP archive detailing the system requirements
  and directory structure of the installation directory.

## Changed

* The default installation location on Linux is now `/opt/ibm/crawler`. This is
  necessary in order to conform to IBM standards.
* Updates default API version configuration in Discovery Service configuration
  to match the Discovery Service Experimental release version.
* The default output adapter is now the Discovery Service Output Adapter.

## 1.1.7 - 2016-11-07

### Changed

* Updates metadata format for documents sent to Discovery Service

### Fixed

* Removes trailing slash from default Discovery Service Output Adapter base_url

## 1.1.6 - 2016-11-04

### Added

* Adds JSON to the white-list for crawling.

### Changed

* Changes config values to sensible defaults.
* Improves certain log messages for clarifying errors.

### Fixed

* Fixes an issue with the DSOA where the connection was not closed. That was leading to a condition where the crawler was seemingly hanging.

## 1.1.5 - 2016-11-01

### Added

* Adds Discovery Service Output Adapter

### Changed

* Updates Documentation for the crawler configuration

## 1.1.4 - 2016-09-30

### Changed

* Changes default logging to INFO and the Console logging to WARN
* Updates documentation to clarify some tasks and fixes some minor documentation errors.
* Crawler now uses a configurable fixed thread pool.

### Fixed

* Fixes some non-fatal exception handling to present error messages rather than stack traces.
* Fixes a bug where the Indexable URI was presented to the OSDA endpoint instead of the Indexable ID.
* Fixes OSDA to explicitly ask for JSON responses, improving error messages

## 1.1.2 - 2016-08-26

### Fixed

* 1.1.1 had a malformed version number and 1.1.2 fixed that.
* Logging of the response on errored Orchestration submissions was
  restored.

## 1.1.1 - 2016-08-26

### Fixed

* 1.1.0 introduced a bug where documents were not properly marked as
  complete because of the switch to hashes from URLs for tracking output
  adapter completion.

## 1.1.0 - 2016-08-17

### Added

* Attempts to send documents to Orchestration are now retried on failure.
* When DEBUG log output is enabled, a heartbeat is now printed to the log.
  This heartbeat log line at DEBUG level shows the current state of the
  crawl graph as a sort of a progress meter.

### Changed

* Crawler now uses a hash of a document's URL as the unique identifier
  when submitting documents to Orchestration. This mitigates a potential
  encoding problem down the line.

### Fixed

* It is now much harder to trigger an out of memory condition when crawling
  a large number of large documents.
* Fixed a problem that caused a massive slowdown when documents were uploaded
  quickly.

## 1.0.1 - 2016-07-14

### Fixed

* WexOutputAdapter can send the contents of large files

## Convention

This changelog follows the [Keep A Changelog](http://keepachangelog.com/) convention.

> * **Added** for new features.
> * **Changed** for changes in existing functionality.
> * **Deprecated** for once-stable features removed in upcoming releases.
> * **Removed** for deprecated features removed in this release.
> * **Fixed** for any bug fixes.
> * **Security** to invite users to upgrade in case of vulnerabilities.
