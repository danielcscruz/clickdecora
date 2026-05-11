import re

import pytest

from app.services.protocol import generate_protocol


def test_protocol_format():
    protocol = generate_protocol()
    assert re.match(r"^CD-\d{4}-[A-Z0-9]{4}$", protocol), f"Invalid format: {protocol}"


def test_protocol_uniqueness():
    protocols = {generate_protocol() for _ in range(1000)}
    # At 1000 draws from a ~36^4 = 1.7M space, collision probability is negligible
    assert len(protocols) > 990


def test_protocol_year():
    from datetime import datetime, timezone
    protocol = generate_protocol()
    year = datetime.now(timezone.utc).year
    assert protocol.startswith(f"CD-{year}-")
