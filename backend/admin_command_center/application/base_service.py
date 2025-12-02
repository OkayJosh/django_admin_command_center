from dataclasses import dataclass
from typing import Any, Dict, Optional

@dataclass
class ServiceResult:
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None

class BaseService:
    def ok(self, data: Any = None, **meta) -> ServiceResult:
        return ServiceResult(success=True, data=data, meta=meta or None)

    def fail(self, error: str, **meta) -> ServiceResult:
        return ServiceResult(success=False, error=error, meta=meta or None)
