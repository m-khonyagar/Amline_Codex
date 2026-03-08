import httpx


class APIException(Exception):
    pass


class HTTPException(Exception):
    pass


class AsyncKavenegarAPI(object):
    def __init__(self, apikey):
        self.version = "v1"
        self.host = "api.kavenegar.com"
        self.apikey = apikey
        self.headers = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "charset": "utf-8",
        }

    def __repr__(self):
        return "kavenegar.KavenegarAPI({!r})".format(self.apikey)

    def __str__(self):
        return "kavenegar.KavenegarAPI({!s})".format(self.apikey)

    async def _request(self, action, method, params={}):
        url = "https://" + self.host + "/" + self.version + "/" + self.apikey + "/" + action + "/" + method + ".json"
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, headers=self.headers, data=params)
                response.raise_for_status()
                data = response.json()
                if data["return"]["status"] == 200:
                    return data["entries"]
                else:
                    raise APIException(
                        ("APIException[%s] %s" % (data["return"]["status"], data["return"]["message"])).encode("utf-8")
                    )
            except httpx.HTTPError as e:
                raise HTTPException(str(e))

    async def sms_send(self, params=None):
        return await self._request("sms", "send", params)

    async def sms_sendarray(self, params=None):
        return await self._request("sms", "sendarray", params)

    async def sms_status(self, params=None):
        return await self._request("sms", "status", params)

    async def sms_statuslocalmessageid(self, params=None):
        return await self._request("sms", "statuslocalmessageid", params)

    async def sms_select(self, params=None):
        return await self._request("sms", "select", params)

    async def sms_selectoutbox(self, params=None):
        return await self._request("sms", "selectoutbox", params)

    async def sms_latestoutbox(self, params=None):
        return await self._request("sms", "latestoutbox", params)

    async def sms_countoutbox(self, params=None):
        return await self._request("sms", "countoutbox", params)

    async def sms_cancel(self, params=None):
        return await self._request("sms", "cancel", params)

    async def sms_receive(self, params=None):
        return await self._request("sms", "receive", params)

    async def sms_countinbox(self, params=None):
        return await self._request("sms", "countinbox", params)

    async def sms_countpostalcode(self, params=None):
        return await self._request("sms", "countpostalcode", params)

    async def sms_sendbypostalcode(self, params=None):
        return await self._request("sms", "sendbypostalcode", params)

    async def verify_lookup(self, params=None):
        return await self._request("verify", "lookup", params)

    async def call_maketts(self, params=None):
        return await self._request("call", "maketts", params)

    async def call_status(self, params=None):
        return await self._request("call", "status", params)

    async def account_info(self):
        return await self._request("account", "info")

    async def account_config(self, params=None):
        return await self._request("account", "config", params)
