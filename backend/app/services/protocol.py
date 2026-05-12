import random
import string
from datetime import datetime, timezone


def generate_protocol() -> str:
    """Generate a masked protocol like CD-2024-A3X9."""
    year = datetime.now(timezone.utc).year
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"CD-{year}-{suffix}"
