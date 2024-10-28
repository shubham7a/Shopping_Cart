
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

require('dotenv').config();

app.use(express.json());

app.use(cors({
  origin: "*",
}));

const WHATSAPP_TOKEN = process.env.Token;
const PHONE_NUMBER_ID = process.env.Phone_ID;

app.post("/send-message", async (req, res) => {
    const { cart} = req.body;

    console.log(cart);
    
    const title = cart[0].title;
    const price = cart[0].price;
    const image = cart[0].image;
    const rating = cart[0].rating.rate;

    const payload = {
        
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: "91"+process.env.Recipient_Number,
            type: "template",
            template: {
              name: "shop_template",
              language: {
                code: "en_US"
              },
              components: [
                {
                  type: "header",
                  parameters: [
                    {
                      type: "image",
                      image: {
                        link: image
                      }
                    }
                  ]
                },
                {
                  type: "body",
                  parameters: [
                    {
                      type: "text",
                      text: title
                    },
                    {
                      type: "text",
                      text: price
                    },
                    {
                      type: "text",
                      text: rating
                    }
                  ]
                }
              ]
            }
    };

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(200).json(response.data);
        console.log("Message sent successfully:", response.data);
    } catch (error) {
        console.error("Error sending message:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});


//Webhook implementation

// app.get('/webhook', function(req, res) {
//   if (
//     req.query['hub.mode'] == 'subscribe' &&
//     req.query['hub.verify_token'] == '12345'
//   ) {
//     res.send(req.query['hub.challenge']);
//   } else {
//     res.sendStatus(400);
//   }
// });


// app.post("/webhook", function (request, response) {
//   console.log('Incoming Webhook Payload:', JSON.stringify(request.body, null, 2));
//   try {
//     const entry = request.body?.entry?.[0];
//     if (!entry) throw new Error('Entry is missing in the webhook request');

//     const changes = entry?.changes?.[0];
//     if (!changes) throw new Error('Changes array is missing in the webhook request');

//     // Check if the event contains messages
//     if (changes?.value?.messages) {
//       const contact = changes?.value?.contacts?.[0];
//       if (!contact) throw new Error('Contact information is missing in the webhook request');

//       const message = changes?.value?.messages?.[0];
//       if (!message) throw new Error('Message information is missing in the webhook request');

//       const waId = contact?.wa_id;
//       const contactName = contact?.profile?.name;
//       const messageBody = message?.text?.body||message?.image?.id || message?.reaction?.emoji;
//       const messageType = message?.type;
//       const phoneNumberId = changes?.value?.metadata?.phone_number_id;
        


//       console.log("===========================");
//       console.log('Phone Number From:', waId);
//       console.log('Contact Name:', contactName);
//       console.log('Message Body:', messageBody);
//       console.log('Message Type:', messageType);
//       console.log('Phone Number ID:', phoneNumberId);

  

      
//       const payload = {
//         messaging_product: "whatsapp",
//         recipient_type: "individual",
//         to: waId,
//         type: "text",
//         text: {
//           preview_url: false,
//           body: ` Hello ${contactName}`
//         }
        
//       };

//       const headers = {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       };

      
//       axios.post(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, payload, { headers })
//         .then(response => {
//           console.log('Message sent successfully:', response?.data);
//         })
//         .catch(error => {
//           console.error('Error sending message:', error?.response?.data || error.message);
//         });

//       response.sendStatus(200);
//     } else if (changes?.value?.statuses) {
      
//       const status = changes?.value?.statuses?.[0];
//       if (!status) throw new Error('Status information is missing in the webhook request');

//       const messageStatus = status?.status;
//       const recipientId = status?.recipient_id;
//       const conversationId = status?.conversation?.id;

//       console.log("===========================");
//       console.log('Message Status:', messageStatus);
//       console.log('Recipient ID:', recipientId);
//       console.log('Conversation ID:', conversationId);

//       response.sendStatus(200);  
//     } else {
//       throw new Error('Unknown event type in the webhook request');
//     }

//   } catch (error) {
//     console.error('Error processing webhook:', error.message);
//     response.sendStatus(500);  
//   }
// });