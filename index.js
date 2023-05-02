const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', async (req, res) => {
  try {
    const orderId = req.body.queryResult.parameters.orderId;
    const apiUrl = 'https://orderstatusapi-dot-organization-project-311520.uc.r.appspot.com/api/getOrderStatus';
    const requestBody = { orderId };
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    const shipmentDate = data.shipmentDate;
    const date = new Date(shipmentDate);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const responseText = `Your order ${orderId} will be shipped on ${dayOfWeek}, ${dayOfMonth} ${month} ${year}.`;
    const webhookResponse = {
      fulfillmentText: responseText,
    };
    res.status(200).json(webhookResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000!');
});
