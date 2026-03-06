// ─── Mock data (temporary, for testing artifact generation) ───────────────────

// const MOCK_REPLY = `Based on the analysis of hundreds of AI-generated call summaries from the forensic database, the most common reasons for customer and rider calls are:

// ### 1. Order Cancellations & Modifications (Most Frequent)
// - **Long Wait/Distance:** Customers frequently request cancellations when assigned riders (especially on bicycles) are too far away or estimate a long delivery time (often 1–1.5 hours).
// - **Unavailable Items:** Merchants or riders call to report that specific food items (e.g., Pork Curry, Chicken Spicy Burger) are out of stock, leading to partial or full cancellations.
// - **Incorrect Location:** Requests to cancel because the customer accidentally provided the wrong delivery address or the rider found the pickup point too far from their actual location.
// - **Closed Restaurants:** Riders reporting that a restaurant is physically closed despite the app showing it as active.

// ### 2. Technical & Account Issues
// - **ID/Account Suspension:** Riders frequently call to inquire why their accounts are blocked. Common reasons include "offline trip" violations, unprofessional behavior, or high outstanding "due" balances.
// - **Onboarding & Verification:** New riders following up on pending document verification (Bluebook, insurance, citizenship) or missing "agreement papers."
// - **App Glitches:** Calls regarding missing "Quest" (incentive) bonuses, inability to receive ride requests despite being online, and issues with the "CityPay" KYC verification.

// ### 3. Payment & Fare Disputes
// - **Overcharging:** Customers reporting that riders demanded more than the app-calculated fare or didn't apply promo codes correctly.
// - **Payment Failures:** Riders reporting that customers were unable to pay via mobile banking or eSewa due to technical failures.
// - **Deduction Clarification:** Riders questioning why their "due" balance increased, often explained by agents as penalties for "Quest Fraud."

// ### 4. Logistics & Safety
// - **Unreachable Customers:** Riders waiting at pickup/delivery locations for extended periods (5–30 mins) because the customer is not answering their phone.
// - **Accidents & Emergencies:** Riders reporting road accidents or vehicle breakdowns and seeking guidance on insurance claims.
// - **Item Issues:** Customers calling to add items or complaining about wrong/poor-quality food.

// ### 5. Proactive Verification
// - **High-Value Orders:** Agents proactively calling customers to verify large/high-value food orders (e.g., orders worth 5,000 to 19,000 NPR) to ensure validity before preparation.

// Source: asr_transcriptions.sqlite (Table: transcription_details > summary column)`;

export const MOCK_REPLY = `Based on an analysis of AI-generated summaries specifically filtering for keywords related to frustration (e.g., "frustrated," "dissatisfied," "complained," "overcharged"), the most frequent customer and rider frustrations are:

### 1. Technical & App Issues (2,674 mentions)
This is the leading source of frustration. It includes:
*   **Account Suspensions/Blocks:** Riders frustrated by IDs being blocked due to "due" payments or performance metrics.
*   **OTP/Login Failures:** Difficulty receiving verification codes (especially on NTC networks).
*   **Payment Synchronization:** Payments made via "CityPay" not reflecting instantly in the Pathao account, leading to account restrictions.

### 2. Delays (2,613 mentions)
Close behind technical issues are frustrations related to time:
*   **Food Preparation:** Customers waiting over an hour for food orders (notably from KFC and biryani outlets).
*   **Rider Assignment:** Long wait times for a rider to be assigned during peak hours.
*   **Unreachable Riders:** Frustration when a rider accepts an order but stays stationary or takes a long route.

### 3. Cancellations & Item Unavailability (1,908 mentions)
*   **Late Notifications:** Customers being notified 30+ minutes after ordering that the restaurant is closed or an item is out of stock.
*   **Forced Cancellations:** Customers being asked by riders to cancel the order because the distance is too far for a bicycle.

### 4. Communication Gaps (848 mentions)
*   **Unresponsive Support:** Frustration over dead air on calls or repeated "hello" with no resolution.
*   **Unreachable Parties:** Significant irritation when either a rider or customer refuses to answer calls after a booking is confirmed.

### 5. Rider Behavior & Overcharging (366 mentions)
While lower in volume, these cases involve the highest intensity of frustration:
*   **Offline Trips:** Customers being overcharged on trips where the rider didn't use the meter or app.
*   **Harassment/Misbehavior:** Reports of riders using offensive language or making threats after a dispute.



`;
