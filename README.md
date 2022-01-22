# dating-app-backend
This mobile app, created with React Navtive in a traditional MERN stack, is the beginnings of a modern, non-monetarily predatory dating app. The app itself allows users to create their profile, set what they are looking for, and receive other users profiles based on the criteria they set. ‘Liking’ someone will allow that user to see who liked them and gives them the opportunity to match with them, eventually allowing the two users to chat together.

# Why no deployable? 
Through a lot of testing on my part and those of my peers, currently React Natives localStorage solution 'asyncStorage' (and the community offshoot) has conflicts with other dependecies. So while I'm able to run the application through Expo in the browser using localStorage, the app will crash on mobile / a deployed version due to the conflicts with 'asyncStorage'. Currently I'm thinking the best solution is to remove expo which would allow me to use Realms(by mogodb) in an alternative for asyncStorage but I'm alos considering learning Dart and trying the Flutter platform for development. So for now I'm holding off on this project and working on truely fleshing out The Family Table, till I figure out which derection I want to take this one.  

# Future Imporvements
- Rewrite in Flutter or without Expo to allow for proper localStorage
- Once rewritten add deployable
- Allow users to add images and store them on the backend
- LGTBQ friendly settings
- Touch Controls for profile cards
- Chat for matches
