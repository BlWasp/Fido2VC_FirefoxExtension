#!/usr/bin/python

	# Copyright: Copyright (c) 2019 University of Toulouse, France and
	# University of Kent, UK

	# 							Apache License
 #                           Version 2.0, January 2004
 #                        http://www.apache.org/licenses/

from __future__ import print_function, absolute_import, unicode_literals

from fido2.hid import CtapHidDevice
from fido2.client import Fido2Client
from fido2.attestation import Attestation
from fido2 import cbor
from getpass import getpass
from fido2.utils import sha256, hmac_sha256, websafe_decode 

import os, sys, json, struct


# Locate a device
dev = next(CtapHidDevice.list_devices(), None)
if not dev:
    print('No FIDO device found')
    sys.exit(1)

# Set up a FIDO 2 client using the origin https://example.com
client = Fido2Client(dev, 'https://example.com')


def makeSignature(challenge,cred_id,rp_id):
	allow_list = [{
    	'type': 'public-key',
    	'id': websafe_decode(cred_id)
	}]
	sys.stderr.write('\nTouch your authenticator device now...\n')
	# sys.stderr.write(challenge+"\n")
	# sys.stderr.write(cred_id+"\n")
	# sys.stderr.write(rp_id+"\n")

	try:
	    assertions, client_data = client.get_assertion(
	    	rp_id, challenge, allow_list)
	except ValueError:
	    assertions, client_data = client.get_assertion(
	    	rp_id, challenge, allow_list)

	sys.stderr.write('Credential authenticated!')

	assertion = assertions[0]  # Only one cred in allowList, only one response.
	# print('ASSERTIONS : ', assertions)

	# print()
	# print('CLIENT DATA:', client_data)
	# print()
	# print('ASSERTION DATA:', assertion)
	# print()

	return str(cbor.decode_from(assertion.signature))



def getMessage():
	rawLength = sys.stdin.read(4)
	if len(rawLength) == 0:
		sys.exit(0)
	messageLength = struct.unpack('@I', rawLength)[0]
	message = sys.stdin.read(messageLength)
	return json.loads(message)

def encodeMessage(messageContent):
	encodedContent = json.dumps(messageContent)
	encodedLength = struct.pack('@I', len(encodedContent))
	return {'length': encodedLength, 'content': encodedContent}

# Send an encoded message to stdout.
def sendMessage(encodedMessage):
	sys.stdout.write(encodedMessage['length'])
	sys.stdout.write(encodedMessage['content'])
	sys.stdout.flush()

while True:
	receivedMessage = getMessage()
	data = makeSignature(receivedMessage['hash'],receivedMessage['cred'],receivedMessage['rp'])
	if (data):
		sendMessage(encodeMessage(data))

# allow_list = [{
#     'type': 'public-key',
#     'id': websafe_decode("p3EsyqBXaKtnF8U5POfUJX2Ft_zBZgjRqo_iGtGE7eotexM1aspjO7_gYkENGDhTLyRu9yY4iliNBH3Cou_Iyg")
# }]

# # Authenticate the credential
# print('\nTouch your authenticator device now...\n')

# try:
#     assertions, client_data = client.get_assertion(
#         "example.com", "13714a56d58e6e477f42211e2ecd012924f083e8921f82e6ddbeee441fe7b195", allow_list)
# except ValueError:
#     assertions, client_data = client.get_assertion(
#         "example.com", "13714a56d58e6e477f42211e2ecd012924f083e8921f82e6ddbeee441fe7b195", allow_list)

# print('Credential authenticated!')

# assertion = assertions[0]  # Only one cred in allowList, only one response.
# print('ASSERTIONS : ', assertions)

# print()
# print('CLIENT DATA:', client_data)
# print()
# print('ASSERTION DATA:', assertion)
# print()

# print(cbor.decode_from(assertion.signature))