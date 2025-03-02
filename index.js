/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Register from './src/Screens/Resigter'
import Login from './src/Screens/Login'
import Home from './src/Screens/ViewHome'
import WriteThanks from './src/Screens/WriteThanks'
import ViewHome from './src/Screens/ViewHome';
import ForderThanks from './src/Screens/ForderThanks';

AppRegistry.registerComponent(appName, () => App);
