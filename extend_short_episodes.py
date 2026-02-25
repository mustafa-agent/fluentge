#!/usr/bin/env python3
"""Regenerate the 4 short podcast episodes (27-30) with longer scripts to hit 5-6 minutes."""
import asyncio
import edge_tts
import os

OUTPUT_DIR = "/Users/aiagent/.openclaw/workspace/english-app/website/public/podcast"

EPISODES = [
    {
        "filename": "episode27-at-the-dentist.mp3",
        "voice": "en-US-GuyNeural",
        "script": """
Welcome to FluentGe Podcast, Episode 27: At the Dentist.

Today, we will learn useful English phrases for visiting the dentist. This is important vocabulary because everyone needs to go to the dentist sometimes. Let's begin!

Part One: Making an Appointment.

When you call the dentist, you might say:
Hello, I'd like to make an appointment, please.
I have a toothache and need to see a dentist.
Do you have any available times this week?
Is the doctor available on Monday morning?

The receptionist might ask you:
Have you been to our clinic before?
What is the reason for your visit?
Can I have your name and phone number?
Would Tuesday at three o'clock work for you?

Let's practice. Repeat after me:
I'd like to make an appointment, please.
I have a toothache.
Do you have any available times?

Good job! Now let's continue.

Part Two: Arriving at the Clinic.

When you arrive at the dentist's office, you will talk to the receptionist.

You can say:
Hi, I have an appointment at two o'clock. My name is...
I'm here for my dental checkup.
This is my first visit to this clinic.
Here is my insurance card.

The receptionist might say:
Please fill out this form.
Have a seat in the waiting room.
The doctor will see you in about ten minutes.
Please bring your ID next time.

Listen and repeat:
I have an appointment at two o'clock.
This is my first visit.
Here is my insurance card.

Excellent! Let's move to the next part.

Part Three: In the Dentist's Chair.

This is when the dentist examines your teeth. Here are phrases you will hear and use.

The dentist might say:
Please open your mouth wide.
Can you bite down for me?
Does it hurt when I press here?
I need to take an X-ray.
You have a small cavity.
Your teeth look healthy overall.
I recommend you floss more often.
You need a filling in this tooth.

You might say to the dentist:
I have pain in my back tooth.
This tooth has been hurting for three days.
I'm very nervous about dental procedures.
Will it hurt? Can I have anesthesia?
I haven't been to the dentist in two years.
My gums bleed when I brush my teeth.

Let's practice these important phrases:
I have pain in my back tooth.
Will it hurt?
My gums bleed when I brush my teeth.

Great! You're doing well.

Part Four: Common Dental Procedures.

Let me teach you the names of common dental procedures:

A cleaning. This is when the dentist cleans your teeth professionally. You should get a cleaning every six months.

A filling. This is when the dentist fixes a cavity, a small hole in your tooth.

A root canal. This is a more serious procedure for a badly damaged tooth.

An extraction. This means removing a tooth completely.

Braces. These are metal devices that straighten your teeth over time.

Whitening. This makes your teeth whiter and brighter.

A crown. This is a cap that covers a damaged tooth.

Repeat these words:
Cleaning. Filling. Root canal. Extraction. Braces. Whitening. Crown.

Part Five: After the Procedure.

After the dentist finishes, they will give you instructions.

The dentist might say:
Don't eat anything for two hours.
Take this medicine if you feel pain.
Rinse your mouth with warm salt water.
Come back in six months for a checkup.
Avoid hot and cold drinks today.
The numbness will go away in about an hour.
Call us if the pain gets worse.

You might ask:
How often should I brush my teeth?
Should I use mouthwash?
When should I come back?
Is it normal for it to hurt a little?
Can I eat normally tomorrow?

Practice:
Don't eat anything for two hours.
When should I come back?
Is it normal for it to hurt a little?

Part Six: Dialogue Practice.

Now let's listen to a full conversation at the dentist.

Patient: Good morning. I have an appointment at ten o'clock.
Receptionist: Good morning! What's your name?
Patient: My name is Niko. Niko Beridze.
Receptionist: Ah yes, I see your appointment. Please have a seat. The doctor will be with you shortly.

A few minutes later.

Dentist: Hello Niko! Come in, please. Have a seat in the chair. What brings you in today?
Patient: I have a pain in my tooth. Here, on the left side.
Dentist: I see. Let me take a look. Please open your mouth wide. Does it hurt when I tap here?
Patient: Yes! That one hurts a lot.
Dentist: It looks like you have a cavity. We need to put in a filling. But don't worry, it's a simple procedure.
Patient: Will it hurt?
Dentist: I'll give you local anesthesia, so you won't feel any pain. It will take about twenty minutes.
Patient: Okay, thank you, doctor.
Dentist: All done! The filling is complete. Don't eat for two hours, and avoid very hot drinks today.
Patient: Thank you very much. When should I come back?
Dentist: Come back in six months for your regular checkup. And remember to floss every day!
Patient: I will. Goodbye!

Wonderful! You've learned many useful phrases for visiting the dentist. Remember to practice these words and don't be afraid to speak English at the dentist's office!

This was FluentGe Podcast, Episode 27. See you in the next episode!
"""
    },
    {
        "filename": "episode28-public-transport.mp3",
        "voice": "en-US-GuyNeural",
        "script": """
Welcome to FluentGe Podcast, Episode 28: Public Transport.

Today we will learn English phrases for using buses, trains, and the metro. Public transport is something we use every day, so these phrases are very practical. Let's get started!

Part One: At the Bus Stop.

When you're waiting for a bus, you might need to ask for information.

You can ask:
Excuse me, does this bus go to the city center?
Which bus goes to the train station?
How often does the number five bus come?
What time is the last bus?
Is there a bus stop near here?

You might hear:
The bus comes every fifteen minutes.
You need to take bus number twelve.
The next bus arrives at three thirty.
This bus doesn't stop there. You need to transfer.

Let's practice:
Excuse me, does this bus go to the city center?
How often does the bus come?
What time is the last bus?

Good! Let's continue.

Part Two: Buying Tickets.

At the ticket counter or machine, you need these phrases:

One ticket to the center, please.
How much is a single ticket?
I'd like a return ticket.
Do you have a day pass?
Can I pay with card?
Where can I buy a bus card?
How much is a monthly pass?
I need to top up my card.

The ticket seller might say:
That's two lari.
Cash or card?
The day pass is five lari.
You can buy tickets on the bus as well.
This ticket is valid for ninety minutes.

Practice:
One ticket, please.
How much is a single ticket?
I'd like a day pass.

Part Three: On the Bus.

When you get on the bus, you might say or hear:

Is this seat taken?
Excuse me, I need to get off at the next stop.
Can you tell me when we reach the university?
How many stops until the hospital?
Excuse me, could you move over a little?
Is this the right bus for the airport?

The driver might say:
Please move to the back of the bus.
Next stop: Freedom Square.
Please tap your card when you get on.
We're running a few minutes late.
Last stop, everyone off please.

Practice:
Is this seat taken?
Can you tell me when we reach the university?
Excuse me, I need to get off at the next stop.

Part Four: Taking the Metro.

Metro vocabulary is slightly different. Let me teach you important words:

Platform. This is where you wait for the train.
Line. The metro route. For example, line one or the red line.
Transfer. Changing from one line to another.
Entrance and exit. Where you go in and come out.
Escalator. The moving stairs.
Direction. Which way the train is going.

Useful phrases for the metro:
Which line goes to the station?
Where do I transfer to the blue line?
Is this the train to Didube?
How many stops is it?
Which exit should I take for the museum?
Excuse me, where is the nearest metro station?

Practice:
Where do I transfer?
How many stops is it?
Which exit should I take?

Part Five: At the Train Station.

For longer trips, you might take a train. Here are useful phrases:

I'd like a ticket to Batumi, please.
What time does the next train leave?
Which platform does the train depart from?
Is there a direct train, or do I need to change?
How long is the journey?
I'd like a window seat, please.
Is there a dining car on this train?
Can I reserve a seat?

At the station, you might hear:
The train to Batumi departs at eight fifteen from platform three.
Boarding begins in ten minutes.
Please keep your ticket for inspection.
The train will arrive in approximately four hours.
This train stops at Gori, Khashuri, and Kutaisi.

Practice:
What time does the next train leave?
Which platform?
How long is the journey?

Part Six: Problems and Delays.

Sometimes things don't go smoothly. Here's what to say:

I missed my bus. When is the next one?
The train is delayed. How long do we have to wait?
I'm lost. Can you help me find my way?
I left my bag on the bus. What should I do?
My ticket isn't working at the gate.
Excuse me, I think I'm on the wrong bus.

Helpful responses you might hear:
The next bus is in twenty minutes.
There's a delay of about thirty minutes due to technical problems.
You can call the lost and found office.
Try using the other gate.
You need bus number seven, not seventeen.

Practice:
I missed my bus.
The train is delayed.
I think I'm on the wrong bus.

Part Seven: Dialogue Practice.

Let's listen to a conversation:

Passenger: Excuse me, I need to get to the train station. Which bus should I take?
Local person: You can take bus number thirty-seven. The stop is just around the corner.
Passenger: Thank you! How often does it come?
Local person: Every ten minutes or so.
Passenger: Great. And how many stops is it?
Local person: About seven stops. It takes around twenty minutes.
Passenger: Perfect, thank you very much!

On the bus:
Passenger: Excuse me, does this bus stop at the train station?
Driver: Yes, it does. I'll announce the stop.
Passenger: Thank you. Can I pay with cash?
Driver: Yes, it's one lari.
Passenger: Here you go. Thank you!

Later:
Driver: Next stop: train station!
Passenger: That's my stop. Thank you! Goodbye!

Excellent work! You now know many useful phrases for public transport. Practice them every time you ride the bus or metro!

This was FluentGe Podcast, Episode 28. See you next time!
"""
    },
    {
        "filename": "episode29-ordering-online.mp3",
        "voice": "en-US-GuyNeural",
        "script": """
Welcome to FluentGe Podcast, Episode 29: Ordering Online.

Today we will learn English vocabulary and phrases for online shopping. In today's world, almost everyone shops online, so these words are very useful. Let's begin!

Part One: Browsing a Website.

When you visit an online store, you will see many words. Let me teach you the important ones.

Homepage. This is the main page of the website.
Search bar. This is where you type what you're looking for.
Categories. These are groups of products, like electronics, clothing, or books.
Filters. These help you narrow your search, by price, size, color, or brand.
Product listing. This shows multiple products on one page.
Sort by. This lets you arrange products by price, popularity, or rating.
Reviews. These are opinions from other customers who bought the product.
Rating. Usually shown as stars, from one to five.
Wishlist. A list where you save products you might want to buy later.

Let's practice these words:
Search bar. Categories. Filters. Reviews. Rating. Wishlist.

Good! Now let's continue.

Part Two: The Product Page.

When you click on a product, you see the product page. Here are important words:

Product description. This tells you about the item.
Price. How much it costs.
Discount. A reduction in price, like twenty percent off.
Original price and sale price.
Size. For clothing, you choose small, medium, large, and so on.
Color options. You can pick the color you want.
In stock. The item is available to buy.
Out of stock. The item is not available right now.
Add to cart. Click this button to put the item in your shopping cart.
Quantity. How many you want to buy.
Shipping cost. How much it costs to deliver the product to you.
Delivery time. How many days until you receive it.
Free shipping. No delivery charge.

Practice:
Add to cart. In stock. Free shipping. Delivery time.

Part Three: The Checkout Process.

When you're ready to buy, you go to checkout. Let me explain each step:

Step one: View your cart. Check all the items you want to buy.
You will see each item, its price, quantity, and the total.

Step two: Enter your shipping address.
Full name. Street address. City. Postal code. Country. Phone number.

Step three: Choose shipping method.
Standard shipping. Usually five to ten days.
Express shipping. Usually two to three days. More expensive.
Free shipping. Available for orders over a certain amount.

Step four: Choose payment method.
Credit card or debit card. You enter card number, expiration date, and security code.
PayPal. An online payment service.
Bank transfer. You send money from your bank.
Cash on delivery. You pay when the package arrives.

Step five: Review your order.
Check everything is correct before you click the final button.

Step six: Place your order!
You click "Place Order" or "Buy Now."

After ordering, you get a confirmation email with an order number.

Practice the checkout phrases:
Enter your shipping address.
Choose your payment method.
Place your order.

Part Four: After You Order.

Once you've placed your order, there are more useful phrases:

Order confirmation. An email saying your order was received.
Tracking number. A code that lets you follow your package.
Shipped. The item has left the warehouse.
In transit. The package is on its way to you.
Out for delivery. The package will arrive today.
Delivered. The package has arrived!
Estimated delivery date. When they expect you'll receive it.

If there's a problem:
I'd like to return this item.
Can I get a refund?
The product is damaged.
I received the wrong item.
The package hasn't arrived yet.
I'd like to exchange this for a different size.
How do I file a complaint?
I want to cancel my order.

Practice:
I'd like to return this item.
Can I get a refund?
The package hasn't arrived yet.

Part Five: Useful Shopping Phrases.

Here are more phrases you'll see when shopping online:

Best seller. A very popular product.
Limited edition. Only a few available.
New arrival. A product that was just added.
Coupon code. A special code for a discount.
Buy one, get one free. A common promotion.
Customer support. The team that helps with problems.
Frequently asked questions, or FAQ. Common questions and answers.
Return policy. The rules for returning products.
Money-back guarantee. A promise to give your money back if you're not happy.

Practice:
Coupon code. Return policy. Customer support. Best seller.

Part Six: Writing a Review.

After you receive your product, it's nice to leave a review. Here's how:

If you're happy:
Excellent product! Exactly what I expected.
Fast delivery, great quality.
I'm very satisfied with my purchase.
I would recommend this to everyone.
Five stars! Will buy again.

If you're not happy:
The quality is not as good as I expected.
The product doesn't match the description.
Delivery took longer than promised.
I'm disappointed with this purchase.
I would not recommend this product.

Part Seven: Dialogue Practice.

Let's practice a conversation about online shopping:

Ana: Hey Giorgi, have you ever bought anything from Amazon?
Giorgi: Yes, I ordered a laptop case last month. It was easy!
Ana: Really? I want to buy some books. Can you help me?
Giorgi: Sure! First, go to the website and type the book name in the search bar.
Ana: Okay, I found it! It says fifteen dollars. Is that a good price?
Giorgi: Check the reviews first. If it has four stars or more, it's usually good.
Ana: It has four point five stars and two hundred reviews. Looks good!
Giorgi: Great! Click "Add to Cart." Then go to checkout.
Ana: What about shipping?
Giorgi: If your order is over twenty-five dollars, shipping is free. Otherwise it's about five dollars.
Ana: I'll add one more book to get free shipping. Smart, right?
Giorgi: Very smart! Then just enter your address and pay.
Ana: Done! It says delivery in seven to ten days. Thank you, Giorgi!
Giorgi: You're welcome! Happy shopping!

Wonderful! You now know all the important vocabulary for online shopping. Try shopping on an English website to practice!

This was FluentGe Podcast, Episode 29. See you in the next episode!
"""
    },
    {
        "filename": "episode30-embassy.mp3",
        "voice": "en-US-GuyNeural",
        "script": """
Welcome to FluentGe Podcast, Episode 30: At the Embassy.

Today we will learn English phrases you need when visiting an embassy or consulate. This is very practical if you plan to travel abroad and need a visa. Let's begin!

Part One: Types of Visas.

Before we go to the embassy, let's learn about different types of visas:

Tourist visa. For traveling and sightseeing. Usually valid for three to six months.
Student visa. For studying at a university or school abroad.
Work visa. For people who have a job offer in another country.
Business visa. For business meetings and conferences.
Transit visa. For passing through a country on your way somewhere else.
Immigrant visa. For people who want to live permanently in another country.
Medical visa. For people traveling for medical treatment.

Practice these:
Tourist visa. Student visa. Work visa. Business visa. Transit visa.

Good! Let's continue.

Part Two: Documents You Need.

When applying for a visa, you usually need these documents. Let me explain each one:

Passport. Your main travel document. It must be valid for at least six months.
Application form. A form you fill out with your personal information.
Photos. Passport-sized photographs, usually two.
Bank statement. A document from your bank showing you have enough money.
Travel insurance. Insurance that covers you during your trip.
Hotel reservation. Proof of where you will stay.
Flight itinerary. Your planned flight tickets or booking.
Invitation letter. A letter from someone in that country inviting you.
Employment letter. A letter from your employer.
Purpose of visit. Why you want to go to that country.

Practice:
Bank statement. Travel insurance. Flight itinerary. Invitation letter.

Part Three: Making an Appointment.

Most embassies require an appointment. Here are useful phrases:

I'd like to schedule a visa appointment.
When is the earliest available appointment?
I need to apply for a tourist visa to the United States.
How long does the visa process take?
What documents do I need to bring?
Can I reschedule my appointment?
Is there a visa fee? How much is it?
Do I need to fill out the application online first?

You might hear:
The next available appointment is March fifteenth.
The visa processing time is seven to fourteen business days.
The visa fee is one hundred and sixty dollars.
Please complete the online application before your appointment.
Bring all original documents and one copy of each.

Practice:
I'd like to schedule a visa appointment.
What documents do I need to bring?
How long does the visa process take?

Part Four: At the Embassy - Security.

When you arrive at the embassy, security is the first thing you encounter:

Guard: Good morning. Do you have an appointment?
You: Yes, I have an appointment at ten o'clock for a visa interview.
Guard: May I see your appointment confirmation and passport?
You: Here they are.
Guard: Thank you. Please leave your phone and electronic devices in this locker. No phones are allowed inside.
You: Okay. What about my bag?
Guard: Your bag will go through the X-ray machine. Then you go through the metal detector.
You: I understand. Thank you.

Important words:
Appointment confirmation. Security check. Metal detector. X-ray machine. Locker.

Part Five: The Visa Interview.

This is the most important part. The consular officer will ask you questions. Let me teach you common questions and good answers:

Question: What is the purpose of your trip?
Answer: I'm traveling for tourism. I want to visit New York and Washington.
Or: I'm going to study English at a language school.
Or: I have a business meeting with my company's partner.

Question: How long do you plan to stay?
Answer: I plan to stay for two weeks.
Or: My course is three months long.

Question: Where will you be staying?
Answer: I'll be staying at a hotel in the city center. Here is my reservation.
Or: I'll stay with my friend. Here is the invitation letter.

Question: How will you fund your trip?
Answer: I have personal savings. Here is my bank statement.
Or: My company is paying for the trip.

Question: Do you have ties to your home country?
Answer: Yes, I have a job here. I work as an engineer.
Or: I own property here and my family lives here.
Or: I'm a university student and I need to return for my exams.

Question: Have you traveled abroad before?
Answer: Yes, I've been to Turkey, Germany, and Spain.
Or: No, this will be my first trip abroad.

Practice:
I'm traveling for tourism.
I plan to stay for two weeks.
My company is paying for the trip.

Part Six: Problems and Solutions.

Sometimes things don't go as planned:

My visa was denied. What can I do?
Can I reapply for a visa?
What was the reason for the denial?
I forgot to bring one of my documents. Can I bring it later?
My passport expires soon. Do I need to renew it first?
I need to expedite my visa. Is that possible?
There's a mistake on my visa. How do I correct it?

Helpful responses:
You can reapply after thirty days.
The denial reason is stated in this letter.
You can submit the missing document within five business days.
Yes, you should renew your passport before applying.
Expedited processing costs an additional fee.

Practice:
My visa was denied.
Can I reapply?
I need to expedite my visa.

Part Seven: Full Dialogue at the Embassy.

Let's listen to a complete embassy visit:

At the entrance:
Guard: Good morning. Your appointment confirmation, please.
Nino: Good morning. Here it is, and here is my passport.
Guard: Thank you. Please leave your phone here and go through security.

At the window:
Officer: Good morning. How can I help you?
Nino: I'm here for my visa interview. I applied for a tourist visa.
Officer: May I see your passport and application form?
Nino: Of course. Here are all my documents.
Officer: What is the purpose of your visit to the United States?
Nino: I want to visit my cousin in California. She invited me for her wedding.
Officer: How long will you stay?
Nino: Ten days. I have a return flight booked.
Officer: How will you pay for your trip?
Nino: My cousin is paying for the hotel, and I have savings for other expenses. Here is my bank statement.
Officer: Do you work in Georgia?
Nino: Yes, I'm a teacher at a school in Tbilisi. Here is my employment letter.
Officer: Have you traveled to the US before?
Nino: No, this will be my first time.
Officer: Your application looks good. Your visa has been approved. You'll receive your passport with the visa in about one week.
Nino: Thank you so much!
Officer: You're welcome. Have a nice trip!

Congratulations! You now know all the important phrases for visiting an embassy and applying for a visa. Remember, the key is to be honest, prepared, and confident.

This was FluentGe Podcast, Episode 30. Thank you for listening, and good luck with your visa applications! See you in the next episode!
"""
    }
]

async def generate_episode(ep):
    filepath = os.path.join(OUTPUT_DIR, ep["filename"])
    print(f"Generating {ep['filename']}...")
    communicate = edge_tts.Communicate(ep["script"].strip(), ep["voice"], rate="-10%")
    await communicate.save(filepath)
    # Check duration
    import subprocess
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", filepath],
        capture_output=True, text=True
    )
    dur = float(result.stdout.strip())
    print(f"  ✅ {ep['filename']}: {dur:.0f}s ({dur/60:.1f} min)")

async def main():
    for ep in EPISODES:
        await generate_episode(ep)
    print("\nAll done! Copy files to dist folders if needed.")

if __name__ == "__main__":
    asyncio.run(main())
