import React, { useEffect, useState } from 'react';

import { createYandexPay } from '../../services/apiService';

const YandexPay = (props) => {
  const {
    amount,
    currency,
    paymentMethod,
    description,
    setPaymentUrl,
  } = props;
  const [redirect, setRedirect] = useState(false);
  const [confirmationUrl, setConfirmationUrl] = useState(null);

  const paymentStatus = localStorage.getItem('paymentStatus')
  ? JSON.parse(localStorage.getItem('paymentStatus'))
  : false;

  // const [paymentStatus, setPaymentStatus] = useState(paymentStatusL);
 console.log({paymentStatus: paymentStatus})

  useEffect(() => {
    if (redirect) {
      setTimeout(() => {
        window.location.href = confirmationUrl;
        setRedirect(false);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirect]);

  //   {
  //   "amount": "200", "currency":"RUB", "paymentMethod":"bank_card","description": "Заказ №72"
  // }

  const handleGetConfirmationUrl = async () => {
    const userData = {
      amount,
      currency: currency ? currency : 'RUB',
      paymentMethod: paymentMethod ? paymentMethod : 'bank_card',
      description: description ? description : 'Hotel reservation',
    };
    try {
      const data = await createYandexPay(userData);
      console.log({ userData: data });
      if (data) {
        setConfirmationUrl(data?.confirmation?.confirmation_url);
        setPaymentUrl(data?.confirmation?.confirmation_url)
        setRedirect(true);
      }
    } catch (e) {
      alert('Login failed');
    }
  };

  const sendFund = (
    <div className="flex justify-center items-center rounded-lg p-4">
      <div className="flex flex-col gap-[24px] rounded-lg border border-indigo-300 p-2 mt-8">
        <div className="text-xl font-bold text-gray-900 p-2">Reservation</div>

        <div className="flex flex-col justify-center p-2 rounded-lg bg-gray-100 w-[400px]">
          {amount ? (
            <div className="text-gray-900 rounded-lg bg-gray-100 p-2">
              Payment: {amount} {currency}
            </div>
          ) : (
            <div className="text-gray-900 rounded-lg bg-gray-100 p-2">
              Payment:
            </div>
          )}

          {/* Payment form fields */}
          <div className="flex justify-center items-center gap-4">
            <label htmlFor="amount">Decsription</label>
            <div className="w-[280px]">{description}</div>
          </div>

          <div
            className="flex flex-row justify-center items-center mt-4"
            onClick={handleGetConfirmationUrl}
          >
            <div className="cursor-pointer flex flex-row justify-center items-center bg-indigo-700 hover:opacity-90 text-white h-[49px] shrink-0 rounded w-full">
              Pay
            </div>
          </div>
        </div>

        <div className="flex flex-row w-full" />
      </div>
    </div>
  );

  return <>{sendFund}</>;
};

export default YandexPay;

// curl https://api.yookassa.ru/v3/payments \
//   -X POST \
//   -u <Shop ID>:<Secret Key> \
//   -H 'Idempotence-Key: <Idempotence Key>' \
//   -H 'Content-Type: application/json' \
//   -d '{
//         "amount": {
//           "value": "100.00",
//           "currency": "RUB"
//         },
//         "capture": true,
//         "confirmation": {
//           "type": "redirect",
//           "return_url": "https://www.example.com/return_url"
//         },
//         "description": "Order No. 1"
//       }'
