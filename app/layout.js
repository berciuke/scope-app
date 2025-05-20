import "./globals.css";
import Navigation from "./components/Navigation";
import CryptoPriceBar from "./components/CryptoPriceBar";
import { AuthProvider } from "./context/AuthContext";
import { FriendProvider } from "./context/FriendContext";
import { PostsProvider } from "./context/PostsContext";
import { MessagesProvider } from "./context/MessagesContext";
import { ReportsProvider } from "./context/ReportsContext";
import { EventsProvider } from "./context/EventsContext";
import { GroupsProvider } from "./context/GroupsContext";
import { NotificationsProvider } from "./context/NotificationsContext"; 

export const metadata = {
  title: "Scope App",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=close"
        />
        <style>
          {`
            .material-symbols-outlined {
              font-variation-settings:
                'FILL' 0,
                'wght' 400,
                'GRAD' 0,
                'opsz' 24;
              cursor: pointer;
              color: red;
            }
          `}
        </style>
      </head>
      <body>
        <AuthProvider>
          <NotificationsProvider> 
             <FriendProvider>
               <PostsProvider>
                 <MessagesProvider>
                   <ReportsProvider>
                     <EventsProvider>
                       <GroupsProvider>
                          <Navigation />
                           {children}
                           <CryptoPriceBar />
                        </GroupsProvider>
                     </EventsProvider>
                  </ReportsProvider>
                </MessagesProvider>
              </PostsProvider>
            </FriendProvider>
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
