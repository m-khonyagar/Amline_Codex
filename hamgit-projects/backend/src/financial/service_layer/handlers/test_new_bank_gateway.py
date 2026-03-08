import xml.etree.ElementTree as ET

import requests

from core.settings import PARSIAN_CALL_BACK_URL


def test_new_gateway(order_id: int):
    soap_body = f"""\
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
        xmlns:sal="https://pec.Shaparak.ir/NewIPGServices/Sale/SaleService">
    <soap:Header/>
    <soap:Body>
        <sal:SalePaymentRequest>
            <sal:requestData>
                <sal:LoginAccount>MQPa0y862tnFT18V5k2X</sal:LoginAccount>
                <sal:Amount>20000</sal:Amount>
                <sal:OrderId>{order_id}</sal:OrderId>
                <sal:CallBackUrl>{PARSIAN_CALL_BACK_URL}</sal:CallBackUrl>
            </sal:requestData>
        </sal:SalePaymentRequest>
    </soap:Body>
    </soap:Envelope>
    """

    purchase_link = ""
    url = "https://pec.shaparak.ir/NewIPGServices/Sale/SaleService.asmx"
    headers = {
        "Content-Type": "text/xml",
        "soap-action": "https://pec.Shaparak.ir/NewIPGServices/Sale/SaleService/SaleServiceSoap/SalePaymentRequestRequest",  # noqa
    }

    response = requests.post(url, data=soap_body, headers=headers)
    root = ET.fromstring(response.text)

    namespaces = {
        "soap": "http://www.w3.org/2003/05/soap-envelope",
        "ns": "https://pec.Shaparak.ir/NewIPGServices/Sale/SaleService",
    }
    token = root.find(".//ns:Token", namespaces)
    if token and token.text != "0":  # type: ignore
        purchase_link = f"https://pec.shaparak.ir/NewIPG/?token={token.text}"  # type: ignore

    return {"Status Code": response.status_code, "Response Text": response.text, "url": purchase_link}
