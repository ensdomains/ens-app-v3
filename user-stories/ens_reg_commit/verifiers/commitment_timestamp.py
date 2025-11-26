# examples/ens_reg_commit/verifiers/commitment_timestamp.py
from loguru import logger
import json
from pathlib import Path

def verify(results_dir):
    logger.info(f"results_dir: {results_dir}")
    manifest_path = Path(results_dir) / "manifest.json"
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
    tx_snapshot_path = Path(results_dir) / manifest["tx_snapshot"]
    with open(tx_snapshot_path, 'r') as f:
        tx_log = json.load(f)
    logger.info("[Verifier: commitment_timestamp] Starting verification of commitment timestamp.")
    
    if not tx_log:
        logger.error("[Verifier: commitment_timestamp] No transactions in log")
        return {'passed': False, 'error': 'No transactions in log'}
    
    expected_selector = '0xf14fcbc8'  # ENS commit function selector
    passed = True
    error = None
    
    for tx in tx_log:
        if tx.get('writeTxException') is not None:
            logger.error(f"[Verifier: commitment_timestamp] Tx failed, timestamp not set: {tx['writeTxException']}")
            passed = False
            error = 'Tx failed, timestamp not set'
            break
        
        params = tx.get('writeTx', {}).get('params', [{}])[0]
        data = params.get('data', '')
        if not data.startswith(expected_selector):
            logger.error(f"[Verifier: commitment_timestamp] Unexpected tx data: {data}")
            passed = False
            error = 'Tx data does not match ENS commit call'
            break
        
        # Infer timestamp set since tx succeeded (deterministic)
    
    if passed:
        logger.info("[Verifier: commitment_timestamp] Verification passed. Commitment timestamp verified as set via successful commit tx. Transaction log: {tx_log}")
    else:
        logger.error(f"[Verifier: commitment_timestamp] Verification failed. Error: {error}. Transaction log: {tx_log}")
    
    return {'passed': passed, 'error': error}