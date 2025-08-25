# Register a new ENS domain

This use story walks through an initial domain name search "storychecktest" and successful registration on a mobile device.

## Prerequisites

1. Chain
   - Id 1
   - RPC https://lb.drpc.org/ogrpc?network=ethereum&dkey=AnmpasF2C0JBqeAEzxVO8aTteiMlrW4R75hpDonbV6cR
   - Block 23086523   
2. Browser
   - Pixel 7

## User Steps

1. Browse to https://app.ens.domains/
1. Click Accept
1. Click on search box
1. Type storychecktest
1. Press Enter
1. Click Connect
1. Click Browser Wallet
1. Scroll down
1. Select Ethereum payment method
1. Click Next
1. Click Skip Profile
1. Scroll down
1. Click Begin
1. Click "Open Wallet"
1. Wait 5 seconds

## Expected Results

- Verify commitment transaction succeeded [verifier](verifiers/tx_success.py)
- Verify commitment timestamp set [verifier](verifiers/commitment_timestamp.py)
- App should display 'Transaction Successful' [verifier](verifiers/ui_start_timer_ok.py)
