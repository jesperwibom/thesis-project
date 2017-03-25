vcrypt(1) - A tool to encrypt and decrypt small amounts of data
===============================================================

## SYNOPSIS

Usage: vcrypt --decrypt|-d  --encrypt|-e  --genkey|-g [ OPTIONS ]

## DESCRIPTION

`vcrypt` is used primarily to encrypt passwords for use by the Connector Framework.

### A special note on key length

By default, a Java Virtual Machine implementation must support 128-bit/16-byte AES keys. If the system has the
Java Cryptographic Extensions installed, it may be able to use 256-bit/32-byte AES keys. An error will show if
a 32-byte key is provided but unsupported by the JVM used to launch `vcrypt`.

## COMMANDS

### --encrypt | -e OPTIONS INPUT
Encrypt data provided in a file or in standard input.

### --decrypt | -d OPTIONS INPUT
Decrypt data provided in a file or in standard input.

### --genkey | -g
Generates an encryption key suitable for use with `vcrypt` to standard output.

## OPTIONS

### --keyfile|-k PATH/TO/ID_VCRYPT
Specify the path to the file containing an appropriate Base64-encoded key, most likely generated using the
`--genkey|-g` command.

## INPUT

### Encrypt mode

    $FILE_CONTAINING_CLEARTEXT | -- $CLEARTEXT

### Decrypt mode

    $FILE_CONTAINING_CRYPTED_TEXT | -- $CRYPTED_TEXT

## EXAMPLES

Generate a key and put it into file `id_vcrypt`:

    vcrypt --genkey > id_vcrypt

Encrypt a password from standard input to standard output, written here via output 
redirection to `my_secret_data.txt`:

    ./vcrypt --encrypt --keyfile id_vcrypt -- "my secret password" > my_secret_data.txt

You can also pipe the output to `xclip`, `pbcopy`, or similar to put the output on your
operating system clipboard.

Decrypt a password from a file:

    vcrypt --decrypt --keyfile id_vcrypt my_secret_data.txt

## PROPERTIES AND ENVIRONMENT VARIABLES

### `VCRYPT_OPTS` environment variable
This environment variable can be used to pass options to the `java` command used to start `vcrypt`.

### `vcrypt.key` property
Pass this as a `-D` property in `VCRYPT_OPTS` with a 16- or 32-byte string to use a key at the command line,
instead of passing the `--keyfile | -k keyfile` option.

Example usage:

    VCRYPT_OPTIONS="-Dvcrypt.key='1234qwerasdfzxcv'" vcrypt --encrypt file_to_encrypt

### `VIV_VCRYPT_KEY` environment variable
`vcrypt` allows usage of this environment variable to set the key. It must be 16 or 32 bytes.

## SEE ALSO

crawler(1)

crawler.conf(5)

crawler-options.conf(5)

crawler-seed.conf(5)

orchestration_service.conf(5)
