import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'JuniorFlyweight': require('../assets/fonts/Knockout-HTF26-JuniorFlyweight.otf'),
          'JuniorBantamwt': require('../assets/fonts/Knockout-HTF27-JuniorBantamwt.otf'),
          'JuniorFeatherwt': require('../assets/fonts/Knockout-HTF28-JuniorFeatherwt.otf'),
          'JuniorLiteweight': require('../assets/fonts/Knockout-HTF29-JuniorLiteweight.otf'),
          'JuniorWelterwt.otf': require('../assets/fonts/Knockout-HTF30-JuniorWelterwt.otf'),
          'JuniorMiddlewt': require('../assets/fonts/Knockout-HTF31-JuniorMiddlewt.otf'),
          'JuniorCruiserwt': require('../assets/fonts/Knockout-HTF32-JuniorCruiserwt.otf'),
          'JuniorHeviwt': require('../assets/fonts/Knockout-HTF33-JuniorHeviwt.otf'),
          'JuniorSumo': require('../assets/fonts/Knockout-HTF34-JuniorSumo.otf'),
          'Flyweight': require('../assets/fonts/Knockout-HTF46-Flyweight.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF47-Bantamweight.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF48-Featherweight.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF49-Liteweight.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF50-Welterweight.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF51-Middleweight.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF52-Cruiserweight.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF53-Heviweight.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF54-Sumo.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF66-FullFlyweight.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF67-FullBantamwt.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF68-FullFeatherwt.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF69-FullLiteweight.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF70-FullWelterwt.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF71-FullMiddlewt.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF72-FullCruiserwt.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF73-FullHeviweight.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF74-FullSumo.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF90-UltmtWelterwt.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF91-UltmtMiddlewt.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF92-UltmtCruiserwt.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF93-UltmtHeviwt.otf'),
          // 'knockout-junior-flyweight': require('../assets/fonts/Knockout-HTF94-UltmtSumo.otf'),
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
