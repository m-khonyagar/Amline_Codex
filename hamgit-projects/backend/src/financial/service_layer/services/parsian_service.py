# noqa
import logging
import xml.etree.ElementTree as ET
from random import randint

import requests

from core.exceptions import ProcessingException
from core.settings import PARSIAN_CALL_BACK_URL, PARSIAN_ENDPOINT, PARSIAN_TOKEN
from financial.domain.entities.transaction import Transaction

logger = logging.getLogger(__name__)


class ParsianService:
    SOAP_NAMESPACE = "http://www.w3.org/2003/05/soap-envelope"
    NAMESPACES = {"soap": SOAP_NAMESPACE, "ns": PARSIAN_ENDPOINT}

    def get_purchase_url(self, transaction: Transaction) -> str:
        response = None
        try:
            soap_body = self._build_soap_request(str((transaction.amount) * 10), transaction.invoice_id)
            response = self._send_soap_request(soap_body)
            purchase_url = self._extract_token_and_build_url(response, transaction)
            return purchase_url

        except Exception as e:
            logger.error(f"Error generating Parsian bank URL: {str(e)}")
            logger.info(
                f"Status Code: {str(response.status_code)}, Response Text: {response.text}" if response else None
            )
            raise ProcessingException("Parsian bank URL generation failed") from e

    def _build_soap_request(self, amount: str, order_id: int) -> str:
        return f"""\
        <soap:Envelope xmlns:soap="{self.SOAP_NAMESPACE}" xmlns:sal="{PARSIAN_ENDPOINT}">
            <soap:Header/>
            <soap:Body>
                <sal:SalePaymentRequest>
                    <sal:requestData>
                        <sal:LoginAccount>{PARSIAN_TOKEN}</sal:LoginAccount>
                        <sal:Amount>{amount}</sal:Amount>
                        <sal:OrderId>{randint(9, 9999999)}</sal:OrderId>
                        <sal:CallBackUrl>{PARSIAN_CALL_BACK_URL}</sal:CallBackUrl>
                    </sal:requestData>
                </sal:SalePaymentRequest>
            </soap:Body>
        </soap:Envelope>
        """

    def _send_soap_request(self, soap_body: str) -> requests.Response:
        url = f"{PARSIAN_ENDPOINT}.asmx"
        headers = {
            "Content-Type": "text/xml",
            "soap-action": f"{PARSIAN_ENDPOINT}/SaleServiceSoap/SalePaymentRequestRequest",
        }

        response = requests.post(url, data=soap_body, headers=headers)
        response.raise_for_status()
        return response

    def _extract_token_and_build_url(self, response: requests.Response, transaction: Transaction) -> str:
        root = ET.fromstring(response.text)
        token_element = root.find(".//ns:Token", self.NAMESPACES)

        if token_element is not None and token_element.text != "0":
            transaction.authority_code = str(token_element.text)
            return f"https://pec.shaparak.ir/NewIPG/?token={token_element.text}"
        return ""

    def verify(self, transaction: Transaction):
        verify = False
        base_url = "https://pec.Shaparak.ir/NewIPGServices"
        soap = "http://schemas.xmlsoap.org/soap/envelope/"
        headers = {
            "Content-Type": "text/xml; charset=utf-8",
            "soap-action": f"{base_url}/Confirm/ConfirmService/ConfirmPayment",
        }
        soapy_body = f"""<soapenv:Envelope xmlns:soapenv="{soap}" xmlns:con="{base_url}/Confirm/ConfirmService">
        <soapenv:Header/>
        <soapenv:Body>
            <con:ConfirmPayment>
                <con:requestData>
                    <con:LoginAccount>{PARSIAN_TOKEN}</con:LoginAccount>
                    <con:Token>{str(transaction.authority_code)}</con:Token>
                </con:requestData>
            </con:ConfirmPayment>
        </soapenv:Body>
        </soapenv:Envelope>
        """
        response = requests.post(f"{base_url}/Confirm/ConfirmService.asmx", data=soapy_body, headers=headers)

        if response.status_code == 200:
            response_xml = response.content
            root = ET.fromstring(response_xml)

            ns = {
                "soap": "http://schemas.xmlsoap.org/soap/envelope/",
                "con": "https://pec.Shaparak.ir/NewIPGServices/Confirm/ConfirmService",
            }

            status = root.find(".//con:Status", ns)
            rrn = root.find(".//con:RRN", ns)
            token = root.find(".//con:Token", ns)

            if (
                status is not None
                and status.text == "0"
                and rrn is not None
                and int(rrn.text or 0) > 0
                and token is not None
                and token.text == str(transaction.authority_code)
            ):
                verify = True
                transaction.reference_id = rrn.text

            details = {
                "status": status.text if status is not None else None,
                "RRN": rrn.text if rrn is not None else None,
                "Token": token.text if token is not None else None,
            }
        else:
            details = {"Error": response.text}

        return {"verify": verify, "details": details}
