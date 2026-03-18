# Team Member Photos Setup

The Team page has been updated to display team member photos. To complete the setup:

## What needs to be done:

Copy the team member photos from the `team member photos` folder to the `public/team` folder with these exact names:

```
team member photos/prathviraj chavan.jpg       →  public/team/prathviraj-chavan.jpg
team member photos/pooja choudhary.png         →  public/team/pooja-choudhary.png
team member photos/shubi upadhyay.jpeg         →  public/team/shubhi-upadhyay.jpeg
team member photos/saniya devarsi.jpeg         →  public/team/saniya-devarshi.jpeg
```

## Steps:

1. Create the `public/team` directory if it doesn't exist
2. Copy each photo from the `team member photos` folder to `public/team` using the new filenames shown above

## Alternative: Using Node.js

Run the provided copy script:
```bash
node copy-photos.js
```

## Features Added:

✅ Team member photos displayed in circular avatars on the Team page
✅ Email contact buttons (mailto: links) for each member
✅ LinkedIn profile links for each member
✅ Contact information:
  - Prathviraj Chavan: mr.prathvirajchavan@gmail.com | https://www.linkedin.com/in/prathvirajchavan/
  - Pooja Choudhary: poojachoudhary1178@gmail.com | https://www.linkedin.com/in/pooja-choudhary1178/
  - Shubhi Upadhyay: shubhiupadhyay1516@gmail.com | https://www.linkedin.com/in/shubhii1516/
  - Saniya Devarshi: saniyadevarshi004@gmail.com | https://www.linkedin.com/in/saniya-devarshi0404/

## Note:

The Team page TypeScript is configured correctly and has no compilation errors. Once the photos are in the `public/team` folder, they will automatically display when you run the development server.
