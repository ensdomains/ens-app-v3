# examples/ens_reg_commit/verifiers/tx_success.py
from loguru import logger
import json
from pathlib import Path

def verify(results_dir):
    manifest_path = Path(results_dir) / "manifest.json"
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
    tx_snapshot_path = Path(results_dir) / manifest["tx_snapshot"]
    with open(tx_snapshot_path, 'r') as f:
        tx_log = json.load(f)
    logger.info("[Verifier: tx_success] Starting verification of transaction success.")
    if not tx_log:
        logger.error("[Verifier: tx_success] Verification failed. No transactions in log.")
        return False
    passed = True
    for tx in tx_log:
        if tx.get('writeTxException') is not None:
            logger.error(f"[Verifier: tx_success] Transaction failed: {tx['writeTxException']}")
            passed = False
        if not tx.get('writeTxResult'):
            logger.error(f"[Verifier: tx_success] No transaction result found in: {tx}")
            passed = False
    if passed:
        logger.info(f"[Verifier: tx_success] Verification passed. Transaction log: {tx_log}")
    else:
        logger.error(f"[Verifier: tx_success] Verification failed. Transaction log: {tx_log}")
    return passed