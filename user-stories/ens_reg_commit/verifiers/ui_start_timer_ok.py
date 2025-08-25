# examples/ens_reg_commit/verifiers/ui_start_timer_ok.py

from PIL import Image
import json
from pathlib import Path

def verify(results_dir):
    manifest_path = Path(results_dir) / "manifest.json"
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
    from loguru import logger
    try:
        import interpreter.ai.local_refexp as refexp_module
    except ImportError as e:
        logger.debug("Module contents after failed import: {contents}", contents=dir())
        logger.error("Failed to import local_refexp module: {error}", error=str(e))
        raise
    logger.debug("Module contents: {contents}", contents=dir(refexp_module))
    logger.debug("LocalRefExp available in module: {avail}", avail='LocalRefExp' in dir(refexp_module))
    logger.debug("Attempting to access LocalRefExp.singleton...")
    screenshot_path = Path(results_dir) / manifest["final_screenshot"]
    with Image.open(screenshot_path) as image:
        refexp_model = refexp_module.LocalRefExp().singleton
        _, center_point = refexp_model.process_refexp(
            image=image, refexp="click 'Transaction Successful'"
        )
        logger.debug(f"RefExp located at: {center_point}")
    # Check if valid coordinates found (e.g., x,y > 0)
    return_value = center_point.get('x', 0) > 0 and center_point.get('y', 0) > 0
    logger.debug("Verification result: {result}", result=return_value)
    return return_value