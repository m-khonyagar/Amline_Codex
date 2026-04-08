# flake8: noqa E501

import requests


def test_new_gateway_confirm_handler(token: int):
    soap_body = f"""<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:con="https://pec.Shaparak.ir/NewIPGServices/Confirm/ConfirmService">
   <soapenv:Header/>
   <soapenv:Body>
      <con:ConfirmPayment>
         <con:requestData>
            <con:LoginAccount>MQPa0y862tnFT18V5k2X</con:LoginAccount>
            <con:Token>{str(token)}</con:Token>
         </con:requestData>
      </con:ConfirmPayment>
   </soapenv:Body>
</soapenv:Envelope>"""

    url = "https://pec.shaparak.ir/NewIPGServices/Confirm/ConfirmService.asmx"
    headers = {
        "Content-Type": "text/xml; charset=utf-8",
        "soap-action": "https://pec.Shaparak.ir/NewIPGServices/Confirm/ConfirmService/ConfirmPayment",
    }

    response = requests.post(url, data=soap_body, headers=headers)

    return {"Status Code": response.status_code, "Response Text": response.text}

    """
    curl --location --request POST 'https://pec.shaparak.ir/NewIPGServices/Confirm/ConfirmService.asmx' \
--header 'Content-Type: text/xml' \
--header 'soap-action: https://pec.Shaparak.ir/NewIPGServices/Confirm/ConfirmService/ConfirmPayment' \
--data-raw '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:con="https://pec.Shaparak.ir/NewIPGServices/Confirm/ConfirmService">
   <soapenv:Header/>
   <soapenv:Body>
      <con:ConfirmPayment>
         <con:requestData>
            <con:LoginAccount>*****</con:LoginAccount>
            <con:Token>2096981***45125</con:Token>
         </con:requestData>
      </con:ConfirmPayment>
   </soapenv:Body>
</soapenv:Envelope>'
    """  # noqa
