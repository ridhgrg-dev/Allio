# Allio

Allio is a mobile-first Expo app for iOS and Android. The MVP keeps the universal hub vision focused: delivery tracking, Wikipedia search, movie/TV search, and basic email composition.

## Run Locally

```bash
npm install
npm start
```

Open the QR code with Expo Go on iOS or Android.

## Structure

- `components/`: reusable UI building blocks.
- `screens/`: feature screens for each MVP workflow.
- `services/`: API and mock-data boundaries.
- `navigation/`: React Navigation stack setup.

## MVP Integration Notes

- Delivery tracking is mocked behind `services/deliveryService.js` for future AfterShip or EasyPost integration.
- Wikipedia search uses the public Wikipedia REST search endpoint.
- Movie/TV search is mocked behind `services/movieService.js` for future TMDB or OMDb integration.
- Email sending is mocked behind `services/emailService.js`; no Gmail API or background sync is included.
