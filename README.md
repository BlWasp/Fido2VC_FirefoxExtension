# Fido2VC_FirefoxExtension

	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK


Description
===========

It is a Firefox extension that allow you to use Verifiable Credentials with Fido2.
Verifiable Credentials (VCs) are developed by the W3C and you can find all the informations about it on this page :
	The Verifiable Credentials : https://www.w3.org/TR/vc-data-model/


Application installation
========================

You have to move the `fido2VC_app.json` into the `/usr/lib/mozilla/native-messaging-hosts` folder (create it if it doesn't exist).
For more informations about it, please consulte the MDN page about Native Messaging.
	Native Messaging : https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/Native_messaging


How it works
============

This extension needs specific servers to work. A live version of this servers will be set online in few days.
The link to the web site will be add here just after.

When you arrive on the web site, you are able to register and authenticate you with the FIDO2 protocol.
After this, the extension will permit you to exploit the Verifiable Credentials developed by the W3C.

First, you have to ask for the Policy of the Service Provider (Verifier). And then, go to the Identity Provider (Issuer) to ask for the Verifiable Credentials. When you have all your VC, you are able to come back on the Verifier web site and the send your VCs in a Verifiable Presentation. At this moment, the Python Application will sign the hash of the VP and send the signature to the extension.