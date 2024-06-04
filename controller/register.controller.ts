import { Request, Response } from 'express';
const db = require('../utils/database');
const stripe = require("stripe")(process.env.STRIPE_SECRET);

export async function registerUser(req: Request, res: Response) {
  const { firstName, lastName, currentRole, organizationName, reasonAttending, eventId, userId, paymentId } = req.body;

  if (!firstName || !lastName || !currentRole || !organizationName || !reasonAttending || !eventId || !userId || !paymentId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const query = `
      INSERT INTO registrations (first_name, last_name, current_role, organization_name, reason_attending, event_id, user_id, payment_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.execute(query, [firstName, lastName, currentRole, organizationName, reasonAttending, eventId, userId, paymentId]);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering user' });
  }
}

export async function CreatePayment(req: Request, res: Response) {
  const { amount, eventId, eventName } = req.body;
  console.log(eventId);
 console.log(eventName) 

  console.log('Received request:', { amount, eventId, eventName });

  const lineItems = [
      {
          price_data: {
              currency: 'usd',
              product_data: {
                  name: eventName,
              },
              unit_amount: amount * 100,
          },
          quantity: 1,
      },
  ];

  console.log('Constructed line items:', lineItems);

  try {
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: 'http://localhost:5173/',
          cancel_url: 'http://localhost:5173/events',
      });

      console.log('Stripe session created:', session);

      res.send({
          id: session.id,
      });
  } catch (e) {
      console.error('Error creating Stripe session:', e);
  }
}